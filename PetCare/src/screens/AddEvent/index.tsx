import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, Field, Button, Chip, ChipRow, Loading, Empty } from '@/ui/components';
import { colors, tipoCor } from '@/ui/theme';
import { useDados } from '@/services/useDados';
import { api, endpointIndisponivel } from '@/services/api';
import { agendarLembrete, cancelarLembrete } from '@/services/notifications';
import { TIPOS_EVENTO, TIPO_LABEL, dataBRparaISO, isoParaDataBR, mascaraData, mascaraMoeda, moedaParaNumero, normalizarTipo, parseLocal, chaveDia } from '@/utils/format';

// UC11: Adicionar Evento • UC14: Registrar Gasto • UC15: lembrete (notificação) do evento
export function AddEvent() {
  const router = useRouter();
  const { petId, eventId, foco } = useLocalSearchParams<{ petId?: string; eventId?: string; foco?: string }>();
  const editando = !!eventId;
  const { pets, eventos, loading } = useDados();
  const iniciado = useRef(false);

  const [pet, setPet] = useState<number | null>(petId ? Number(petId) : null);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<string>(foco === 'gasto' ? 'CONSULTA' : 'VACINA');
  const [data, setData] = useState(isoParaDataBR(chaveDia(new Date())));
  const [custo, setCusto] = useState('');
  const [proxima, setProxima] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [obs, setObs] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (loading || iniciado.current) return;
    iniciado.current = true;
    if (editando) {
      const e = eventos.find((x) => String(x.id) === String(eventId));
      if (!e) return;
      setPet(e.pet_id);
      setNome(e.nome);
      setTipo(normalizarTipo(e.tipo));
      setData(isoParaDataBR(e.data));
      setCusto(e.custo ? mascaraMoeda(Number(e.custo).toFixed(2)) : '');
      setProxima(isoParaDataBR(e.proxima_dose));
      setLembrar(!!e.notificacao_ativa);
      setObs(e.descricao || '');
    } else if (!pet && pets.length > 0) {
      setPet(pets[0].id);
    }
  }, [loading, editando, eventId, eventos, pets, pet]);

  async function salvar() {
    if (!pet) return Alert.alert('Atenção', 'Cadastre um pet antes de registrar eventos.');
    if (!nome.trim()) return Alert.alert('Atenção', 'Informe o nome do evento.');
    const dataISO = dataBRparaISO(data);
    if (!dataISO) return Alert.alert('Atenção', 'Data inválida. Use dd/mm/aaaa.');
    let proxISO: string | null = null;
    if (proxima) {
      proxISO = dataBRparaISO(proxima);
      if (!proxISO) return Alert.alert('Atenção', 'Data da próxima dose inválida.');
      if (proxISO < dataISO) return Alert.alert('Atenção', 'A próxima dose deve ser depois da data do evento.');
    }
    if (lembrar && !proxISO) return Alert.alert('Atenção', 'Para ativar o lembrete, informe a data da próxima dose/retorno.');

    const corpo = {
      tipo,
      nome: nome.trim(),
      data: `${dataISO}T00:00:00`,
      descricao: obs.trim() || null,
      custo: moedaParaNumero(custo),
      proxima_dose: proxISO ? `${proxISO}T00:00:00` : null,
      notificacao_ativa: lembrar,
    };

    setSalvando(true);
    try {
      const resp = editando ? await api.put(`/api/eventos/${eventId}`, corpo) : await api.post(`/api/pets/${pet}/eventos`, corpo);
      const evId: number = resp?.id ?? Number(eventId);
      const petNome = pets.find((p) => p.id === pet)?.nome;

      let aviso = '';
      if (lembrar && proxISO && evId) {
        const quando = parseLocal(proxISO)!;
        const disparo = await agendarLembrete({ id: evId, titulo: corpo.nome, petNome, quando });
        aviso = disparo ? `\n🔔 Lembrete agendado para ${disparo.toLocaleDateString('pt-BR')}.` : '\n⚠️ Não foi possível agendar o lembrete (permissão negada ou notificações desativadas).';
        // registra a Notificacao no servidor (se o endpoint existir) — sem bloquear o fluxo
        if (disparo) api.post('/api/notificacoes', { mensagem: `${corpo.nome}${petNome ? ' - ' + petNome : ''}`, data_agendada: disparo.toISOString(), evento_id: evId }).catch(() => {});
      } else if (evId) {
        await cancelarLembrete(evId);
      }

      Alert.alert('Pronto! ✅', (editando ? 'Evento atualizado.' : 'Evento registrado!') + aviso, [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e: any) {
      Alert.alert('Erro ao salvar evento', endpointIndisponivel(e) ? 'O servidor ainda não tem este endpoint (edição de evento).' : e.message);
    } finally {
      setSalvando(false);
    }
  }

  const titulo = editando ? 'Editar evento' : foco === 'gasto' ? 'Registrar gasto' : 'Novo evento';

  if (loading) {
    return (
      <Screen title={titulo} back>
        <Loading />
      </Screen>
    );
  }

  if (pets.length === 0) {
    return (
      <Screen title={titulo} back>
        <Empty emoji="🐾" title="Cadastre um pet primeiro" text="Os eventos ficam vinculados a um pet." action={<Button label="Cadastrar pet" onPress={() => router.replace('/pet-form')} />} />
      </Screen>
    );
  }

  return (
    <Screen title={titulo} back>
      <Text style={s.label}>Pet *</Text>
      <View style={{ marginBottom: 14 }}>
        <ChipRow>
          {pets.map((p) => (
            <Chip key={p.id} label={`🐾 ${p.nome}`} active={pet === p.id} onPress={() => !editando && setPet(p.id)} />
          ))}
        </ChipRow>
      </View>

      <Field label="Nome do evento *" value={nome} onChangeText={setNome} placeholder="Ex.: Vacina antirrábica" />

      <Text style={s.label}>Tipo</Text>
      <View style={{ marginBottom: 14 }}>
        <ChipRow>
          {TIPOS_EVENTO.map((t) => (
            <Chip key={t} label={`${tipoCor[t].emoji} ${TIPO_LABEL[t]}`} active={tipo === t} onPress={() => setTipo(t)} />
          ))}
        </ChipRow>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Field label="Data" value={data} onChangeText={(t) => setData(mascaraData(t))} placeholder="dd/mm/aaaa" keyboardType="numeric" maxLength={10} />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Gasto (R$)" value={custo} onChangeText={(t) => setCusto(mascaraMoeda(t))} placeholder="0,00" keyboardType="numeric" />
        </View>
      </View>

      <Field label="Próxima dose / retorno" value={proxima} onChangeText={(t) => setProxima(mascaraData(t))} placeholder="dd/mm/aaaa (opcional)" keyboardType="numeric" maxLength={10} />

      <View style={s.switchRow}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={s.switchTitle}>🔔 Lembrar-me</Text>
          <Text style={s.switchSub}>Envia uma notificação antes da próxima dose</Text>
        </View>
        <Switch value={lembrar} onValueChange={setLembrar} trackColor={{ true: colors.primaryBorder, false: colors.border }} thumbColor={lembrar ? colors.primary : '#f4f4f5'} />
      </View>

      <Field label="Observações" value={obs} onChangeText={setObs} placeholder="Instruções do veterinário, lote da vacina..." multiline />

      <Button label={editando ? 'Salvar alterações' : 'Salvar evento'} onPress={salvar} loading={salvando} />
    </Screen>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: colors.textSoft, marginBottom: 6 },
  switchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 14 },
  switchTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  switchSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
});

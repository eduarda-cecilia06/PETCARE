import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Card, Button, Chip, ChipRow, Empty, Loading, ErrorBox, Badge } from '@/ui/components';
import { colors, tipoCor } from '@/ui/theme';
import { useDados } from '@/services/useDados';
import { api, endpointIndisponivel } from '@/services/api';
import { cancelarLembrete } from '@/services/notifications';
import type { Evento } from '@/services/types';
import { TIPOS_EVENTO, TIPO_LABEL, formatarReal, isoParaDataBR, normalizarTipo } from '@/utils/format';


export function EventList() {
  const router = useRouter();
  const { pets, eventos, loading, erro, recarregar } = useDados();
  const [tipo, setTipo] = useState<string>('TODOS');
  const [petId, setPetId] = useState<number | null>(null);
  const [busca, setBusca] = useState('');

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return eventos
      .filter((e) => (tipo === 'TODOS' ? true : normalizarTipo(e.tipo) === tipo))
      .filter((e) => (petId ? e.pet_id === petId : true))
      .filter((e) => (q ? `${e.nome} ${e.petNome} ${e.descricao || ''}`.toLowerCase().includes(q) : true))
      .sort((a, b) => (a.data < b.data ? 1 : -1));
  }, [eventos, tipo, petId, busca]);

  const total = filtrados.reduce((a, e) => a + Number(e.custo || 0), 0);

  function excluir(e: Evento) {
    Alert.alert('Excluir evento', `Excluir "${e.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.del(`/api/eventos/${e.id}`);
            await cancelarLembrete(e.id);
            recarregar();
          } catch (err: any) {
            Alert.alert('Erro ao excluir', endpointIndisponivel(err) ? 'O servidor ainda não tem o endpoint DELETE /api/eventos/{id}.' : err.message);
          }
        },
      },
    ]);
  }

  return (
    <Screen nav="events" title="Histórico" subtitle={loading ? '' : `${filtrados.length} evento(s) • ${formatarReal(total)}`} right={<Button label="+ Evento" small onPress={() => router.push('/add-event')} />}>
      {erro ? <ErrorBox message={erro} onRetry={recarregar} /> : null}

      <TextInput value={busca} onChangeText={setBusca} placeholder="🔎  Buscar por nome, pet ou observação" placeholderTextColor={colors.muted} style={s.search} />

      <View style={{ marginBottom: 8 }}>
        <ChipRow>
          <Chip label="Todos" active={tipo === 'TODOS'} onPress={() => setTipo('TODOS')} />
          {TIPOS_EVENTO.map((t) => (
            <Chip key={t} label={`${tipoCor[t].emoji} ${TIPO_LABEL[t]}`} active={tipo === t} onPress={() => setTipo(t)} />
          ))}
        </ChipRow>
      </View>

      {pets.length > 1 ? (
        <View style={{ marginBottom: 14 }}>
          <ChipRow>
            <Chip label="Todos os pets" active={petId === null} onPress={() => setPetId(null)} />
            {pets.map((p) => (
              <Chip key={p.id} label={`🐾 ${p.nome}`} active={petId === p.id} onPress={() => setPetId(p.id)} />
            ))}
          </ChipRow>
        </View>
      ) : null}

      {loading ? (
        <Loading text="Carregando histórico..." />
      ) : filtrados.length === 0 && !erro ? (
        <Empty emoji="📋" title="Nenhum evento encontrado" text={eventos.length ? 'Tente mudar os filtros.' : 'Toque em "+ Evento" para registrar vacinas, consultas, exames e medicamentos.'} />
      ) : (
        filtrados.map((e) => {
          const t = normalizarTipo(e.tipo);
          const cor = tipoCor[t] || tipoCor.CONSULTA;
          return (
            <Card key={e.id} style={{ padding: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[s.icon, { backgroundColor: cor.bg }]}>
                  <Text style={{ fontSize: 20 }}>{cor.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.title}>{e.nome}</Text>
                  <Text style={s.sub}>🐾 {e.petNome || 'Pet'} • {isoParaDataBR(e.data)}</Text>
                </View>
                <Badge label={TIPO_LABEL[t] || e.tipo} bg={cor.bg} fg={cor.fg} />
              </View>

              {e.descricao ? <Text style={s.desc}>{e.descricao}</Text> : null}
              <View style={s.meta}>
                {Number(e.custo) > 0 ? <Text style={s.metaTxt}>💰 {formatarReal(e.custo)}</Text> : null}
                {e.proxima_dose ? <Text style={s.metaTxt}>⏭ Próxima: {isoParaDataBR(e.proxima_dose)}</Text> : null}
                {e.notificacao_ativa ? <Text style={s.metaTxt}>🔔 Lembrete</Text> : null}
              </View>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <Button label="Editar" small variant="soft" style={{ flex: 1 }} onPress={() => router.push({ pathname: '/add-event', params: { eventId: String(e.id) } } as any)} />
                <Button label="Excluir" small variant="outline" style={{ flex: 1, borderColor: colors.dangerBorder }} onPress={() => excluir(e)} />
              </View>
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  search: { height: 46, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, marginBottom: 12, color: colors.text, fontSize: 14 },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  sub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  desc: { fontSize: 13, color: colors.textSoft, marginTop: 10, lineHeight: 18 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  metaTxt: { fontSize: 12, color: colors.textSoft, fontWeight: '600' },
});

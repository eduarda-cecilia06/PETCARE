import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen, Card, Button, Chip, ChipRow, SectionTitle, Empty, Loading } from '@/ui/components';
import { colors } from '@/ui/theme';
import { useDados } from '@/services/useDados';
import { ConfigNotificacao, agendarLembrete, cancelarTodos, lerConfig, lerLidas, marcarLida, notificacaoTeste, pedirPermissao, salvarConfig } from '@/services/notifications';
import { isoParaDataBR, parseLocal } from '@/utils/format';

const OPCOES = [
  { d: 0, l: 'No dia' },
  { d: 1, l: '1 dia antes' },
  { d: 2, l: '2 dias antes' },
  { d: 7, l: '1 semana antes' },
];

// UC15: Configurar Notificações
export function Notifications() {
  const { eventos, loading } = useDados();
  const [cfg, setCfg] = useState<ConfigNotificacao>({ ativas: true, antecedenciaDias: 1 });
  const [lidas, setLidas] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      lerConfig().then(setCfg);
      lerLidas().then(setLidas);
    }, [])
  );

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const lembretes = eventos
    .filter((e) => e.notificacao_ativa && e.proxima_dose && (parseLocal(e.proxima_dose) as Date) >= hoje)
    .sort((a, b) => (a.proxima_dose! < b.proxima_dose! ? -1 : 1));

  async function reagendar(nova: ConfigNotificacao) {
    setBusy(true);
    await cancelarTodos();
    if (nova.ativas) {
      for (const e of lembretes) {
        await agendarLembrete({ id: e.id, titulo: e.nome, petNome: e.petNome, quando: parseLocal(e.proxima_dose)! });
      }
    }
    setBusy(false);
  }

  async function alternar(v: boolean) {
    if (v && !(await pedirPermissao())) {
      Alert.alert('Permissão necessária', 'Ative as notificações do PetCare nas configurações do aparelho.');
      return;
    }
    const nova = { ...cfg, ativas: v };
    setCfg(nova);
    await salvarConfig(nova);
    await reagendar(nova);
  }

  async function mudarAntecedencia(d: number) {
    const nova = { ...cfg, antecedenciaDias: d };
    setCfg(nova);
    await salvarConfig(nova);
    await reagendar(nova);
  }

  async function testar() {
    const ok = await notificacaoTeste();
    Alert.alert(ok ? 'Enviado' : 'Sem permissão', ok ? 'Você deve receber a notificação em instantes.' : 'Permita as notificações do PetCare nas configurações do aparelho.');
  }

  async function ler(id: string) {
    await marcarLida(id);
    setLidas((l) => [...l, id]);
  }

  return (
    <Screen title="Notificações" back>
      <Card>
        <View style={s.row}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={s.title}>🔔 Lembretes de cuidados</Text>
            <Text style={s.sub}>Receba avisos de vacinas, doses e consultas.</Text>
          </View>
          <Switch value={cfg.ativas} onValueChange={alternar} disabled={busy} trackColor={{ true: colors.primaryBorder, false: colors.border }} thumbColor={cfg.ativas ? colors.primary : '#f4f4f5'} />
        </View>
      </Card>

      {cfg.ativas ? (
        <>
          <SectionTitle>Avisar com antecedência</SectionTitle>
          <View style={{ marginBottom: 14 }}>
            <ChipRow>
              {OPCOES.map((o) => (
                <Chip key={o.d} label={o.l} active={cfg.antecedenciaDias === o.d} onPress={() => mudarAntecedencia(o.d)} />
              ))}
            </ChipRow>
          </View>
          <Text style={s.hint}>Os avisos chegam às 9h do dia escolhido.</Text>
          <Button label="Enviar notificação de teste" variant="outline" onPress={testar} style={{ marginTop: 12 }} />
        </>
      ) : null}

      <SectionTitle>Próximos lembretes</SectionTitle>
      {loading ? (
        <Loading />
      ) : lembretes.length === 0 ? (
        <Empty emoji="🔕" title="Nenhum lembrete agendado" text='Ao criar um evento com "próxima dose" e "Lembrar-me" ativado, o lembrete aparece aqui.' />
      ) : (
        lembretes.map((e) => {
          const id = `ev-${e.id}`;
          const lida = lidas.includes(id);
          return (
            <Card key={id} style={[{ flexDirection: 'row', alignItems: 'center', padding: 12 }, lida && { opacity: 0.6 }]}>
              <View style={{ flex: 1 }}>
                <Text style={s.title}>{e.nome}</Text>
                <Text style={s.sub}>🐾 {e.petNome} • {isoParaDataBR(e.proxima_dose)}</Text>
              </View>
              {lida ? <Text style={s.sub}>Lida ✓</Text> : <Button label="Marcar lida" small variant="soft" onPress={() => ler(id)} />}
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 14, fontWeight: '700', color: colors.text },
  sub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  hint: { fontSize: 12, color: colors.muted },
});

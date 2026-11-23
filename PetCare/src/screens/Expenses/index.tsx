import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Card, Button, SectionTitle, Empty, Loading, ErrorBox } from '@/ui/components';
import { colors, tipoCor } from '@/ui/theme';
import { useDados } from '@/services/useDados';
import { TIPO_LABEL, formatarReal, isoParaDataBR, normalizarTipo, parseLocal } from '@/utils/format';

// UC14: Registrar Gasto (resumo de gastos; o registro é feito no evento)
export function Expenses() {
  const router = useRouter();
  const { eventos, loading, erro, recarregar } = useDados();

  const dados = useMemo(() => {
    const hoje = new Date();
    let total = 0;
    let mes = 0;
    const porTipo: Record<string, number> = {};
    const porPet: Record<string, number> = {};
    const comGasto = eventos.filter((e) => Number(e.custo) > 0);
    comGasto.forEach((e) => {
      const c = Number(e.custo);
      total += c;
      const d = parseLocal(e.data);
      if (d && d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear()) mes += c;
      const t = normalizarTipo(e.tipo);
      porTipo[t] = (porTipo[t] || 0) + c;
      const p = e.petNome || 'Pet';
      porPet[p] = (porPet[p] || 0) + c;
    });
    const tipos = Object.entries(porTipo).sort((a, b) => b[1] - a[1]);
    const pets = Object.entries(porPet).sort((a, b) => b[1] - a[1]);
    const ultimos = [...comGasto].sort((a, b) => (a.data < b.data ? 1 : -1)).slice(0, 8);
    return { total, mes, tipos, pets, ultimos, max: tipos[0]?.[1] || 1 };
  }, [eventos]);

  return (
    <Screen title="Gastos" back right={<Button label="+ Gasto" small onPress={() => router.push({ pathname: '/add-event', params: { foco: 'gasto' } } as any)} />}>
      {erro ? <ErrorBox message={erro} onRetry={recarregar} /> : null}
      {loading ? (
        <Loading />
      ) : dados.ultimos.length === 0 ? (
        <Empty emoji="💰" title="Nenhum gasto registrado" text='Ao criar um evento, informe o campo "Gasto" para acompanhar as despesas com seus pets.' action={<Button label="Registrar gasto" onPress={() => router.push({ pathname: '/add-event', params: { foco: 'gasto' } } as any)} />} />
      ) : (
        <>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Card style={[s.big, { backgroundColor: colors.primary, borderColor: colors.primaryDark }]}>
              <Text style={[s.bigL, { color: '#bbf7d0' }]}>Este mês</Text>
              <Text style={[s.bigV, { color: '#fff' }]}>{formatarReal(dados.mes)}</Text>
            </Card>
            <Card style={s.big}>
              <Text style={s.bigL}>Total geral</Text>
              <Text style={s.bigV}>{formatarReal(dados.total)}</Text>
            </Card>
          </View>

          <SectionTitle>Por tipo de evento</SectionTitle>
          <Card>
            {dados.tipos.map(([t, v]) => {
              const cor = tipoCor[t] || tipoCor.CONSULTA;
              return (
                <View key={t} style={{ marginBottom: 12 }}>
                  <View style={s.barHead}>
                    <Text style={s.barLabel}>{cor.emoji} {TIPO_LABEL[t] || t}</Text>
                    <Text style={s.barValue}>{formatarReal(v)}</Text>
                  </View>
                  <View style={s.barBg}>
                    <View style={[s.barFill, { width: `${Math.max(6, (v / dados.max) * 100)}%`, backgroundColor: cor.fg }]} />
                  </View>
                </View>
              );
            })}
          </Card>

          {dados.pets.length > 1 ? (
            <>
              <SectionTitle>Por pet</SectionTitle>
              <Card>
                {dados.pets.map(([p, v]) => (
                  <View key={p} style={s.petRow}>
                    <Text style={s.barLabel}>🐾 {p}</Text>
                    <Text style={s.barValue}>{formatarReal(v)}</Text>
                  </View>
                ))}
              </Card>
            </>
          ) : null}

          <SectionTitle>Últimos gastos</SectionTitle>
          {dados.ultimos.map((e) => (
            <Card key={e.id} style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }} onPress={() => router.push({ pathname: '/add-event', params: { eventId: String(e.id) } } as any)}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: colors.text }}>{e.nome}</Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>{e.petNome} • {isoParaDataBR(e.data)}</Text>
              </View>
              <Text style={{ fontWeight: '800', color: colors.primaryDark }}>{formatarReal(e.custo)}</Text>
            </Card>
          ))}
        </>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  big: { flex: 1, marginBottom: 6 },
  bigL: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  bigV: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 4 },
  barHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barLabel: { fontSize: 13, fontWeight: '600', color: colors.textSoft },
  barValue: { fontSize: 13, fontWeight: '800', color: colors.text },
  barBg: { height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  petRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
});

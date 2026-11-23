import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Card, Empty, Loading, ErrorBox, Badge, Button } from '@/ui/components';
import { colors, tipoCor } from '@/ui/theme';
import { useDados } from '@/services/useDados';
import { TIPO_LABEL, chaveDia, formatarReal, normalizarTipo, parseLocal } from '@/utils/format';

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DIAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

type Item = { id: string; titulo: string; pet: string; tipo: string; lembrete: boolean; custo?: number | string | null; eventoId: number };

// UC17: Visualizar Calendário
export function Calendar() {
  const router = useRouter();
  const { eventos, loading, erro, recarregar } = useDados();
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [sel, setSel] = useState<string>(chaveDia(hoje));

  // Mapa "aaaa-mm-dd" -> itens do dia (eventos + próximas doses)
  const porDia = useMemo(() => {
    const m: Record<string, Item[]> = {};
    eventos.forEach((e) => {
      const t = normalizarTipo(e.tipo);
      const d = parseLocal(e.data);
      if (d) (m[chaveDia(d)] ||= []).push({ id: `e${e.id}`, titulo: e.nome, pet: e.petNome || '', tipo: t, lembrete: false, custo: e.custo, eventoId: e.id });
      const p = parseLocal(e.proxima_dose);
      if (p) (m[chaveDia(p)] ||= []).push({ id: `p${e.id}`, titulo: `Próxima dose: ${e.nome}`, pet: e.petNome || '', tipo: t, lembrete: true, eventoId: e.id });
    });
    return m;
  }, [eventos]);

  const celulas = useMemo(() => {
    const primeiro = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const arr: (number | null)[] = Array(primeiro).fill(null);
    for (let d = 1; d <= diasNoMes; d++) arr.push(d);
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [ano, mes]);

  function mudarMes(delta: number) {
    const d = new Date(ano, mes + delta, 1);
    setAno(d.getFullYear());
    setMes(d.getMonth());
  }

  const chaveHoje = chaveDia(hoje);
  const itensSel = porDia[sel] || [];
  const [sa, sm, sd] = sel.split('-');

  return (
    <Screen nav="calendar" title="Calendário" subtitle="Eventos e próximas doses">
      {erro ? <ErrorBox message={erro} onRetry={recarregar} /> : null}

      <Card>
        <View style={s.monthRow}>
          <Pressable onPress={() => mudarMes(-1)} style={s.arrow}><Text style={s.arrowTxt}>‹</Text></Pressable>
          <Text style={s.month}>{MESES[mes]} {ano}</Text>
          <Pressable onPress={() => mudarMes(1)} style={s.arrow}><Text style={s.arrowTxt}>›</Text></Pressable>
        </View>

        <View style={s.weekRow}>
          {DIAS.map((d, i) => (
            <Text key={i} style={s.weekTxt}>{d}</Text>
          ))}
        </View>

        {loading ? (
          <Loading />
        ) : (
          <View style={s.grid}>
            {celulas.map((d, i) => {
              if (d === null) return <View key={i} style={s.cell} />;
              const chave = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const itens = porDia[chave] || [];
              const ehSel = chave === sel;
              const ehHoje = chave === chaveHoje;
              return (
                <Pressable key={i} style={s.cell} onPress={() => setSel(chave)}>
                  <View style={[s.day, ehHoje && s.dayToday, ehSel && s.daySel]}>
                    <Text style={[s.dayTxt, ehHoje && { color: colors.primaryDark, fontWeight: '800' }, ehSel && { color: '#fff', fontWeight: '800' }]}>{d}</Text>
                  </View>
                  <View style={s.dots}>
                    {itens.slice(0, 3).map((it) => (
                      <View key={it.id} style={[s.dot, { backgroundColor: (tipoCor[it.tipo] || tipoCor.CONSULTA).fg }]} />
                    ))}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </Card>

      <View style={s.selRow}>
        <Text style={s.selTitle}>{`${sd}/${sm}/${sa}`}{sel === chaveHoje ? '  •  Hoje' : ''}</Text>
        <Button label="+ Evento" small variant="soft" onPress={() => router.push('/add-event')} />
      </View>

      {itensSel.length === 0 ? (
        <Empty emoji="🗓️" title="Nada neste dia" text="Toque em outro dia ou adicione um evento." />
      ) : (
        itensSel.map((it) => {
          const cor = tipoCor[it.tipo] || tipoCor.CONSULTA;
          return (
            <Card key={it.id} style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }} onPress={() => router.push({ pathname: '/add-event', params: { eventId: String(it.eventoId) } } as any)}>
              <View style={[s.evIcon, { backgroundColor: cor.bg }]}>
                <Text style={{ fontSize: 18 }}>{it.lembrete ? '⏭' : cor.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: colors.text }} numberOfLines={1}>{it.titulo}</Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>🐾 {it.pet}{Number(it.custo) > 0 ? `  •  ${formatarReal(it.custo)}` : ''}</Text>
              </View>
              <Badge label={it.lembrete ? 'Lembrete' : TIPO_LABEL[it.tipo] || it.tipo} bg={cor.bg} fg={cor.fg} />
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  month: { fontSize: 17, fontWeight: '800', color: colors.text },
  arrow: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  arrowTxt: { fontSize: 24, lineHeight: 26, color: colors.primaryDark, fontWeight: '700' },
  weekRow: { flexDirection: 'row', marginBottom: 6 },
  weekTxt: { flex: 1, textAlign: 'center', fontSize: 12, color: colors.muted, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.2857%', height: 50, alignItems: 'center', paddingTop: 2 },
  day: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dayToday: { backgroundColor: colors.primarySoft },
  daySel: { backgroundColor: colors.primary },
  dayTxt: { fontSize: 14, color: colors.text },
  dots: { flexDirection: 'row', gap: 2, marginTop: 2, height: 6 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  selRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  selTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  evIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
});

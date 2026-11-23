import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Card, Stat, SectionTitle, Empty, Loading, ErrorBox, Badge, PetAvatar } from '@/ui/components';
import { colors, tipoCor } from '@/ui/theme';
import { useDados } from '@/services/useDados';
import { session } from '@/services/session';
import { api } from '@/services/api';
import { TIPO_LABEL, formatarReal, isoParaDataBR, normalizarTipo, parseLocal } from '@/utils/format';


export function Dashboard() {
  const router = useRouter();
  const { pets, eventos, loading, erro, recarregar } = useDados();
  const [nome, setNome] = useState(session.getUsuario()?.nome || '');

  useEffect(() => {
    if (nome) return;
    api
      .get('/api/usuarios/me')
      .then((u) => {
        session.setUsuario(u);
        setNome(u.nome);
      })
      .catch(() => {});
  }, [nome]);

  const { totalGasto, gastoMes, proximos } = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    let total = 0;
    let mes = 0;
    const futuros: { id: string; titulo: string; pet: string; data: Date; tipo: string; lembrete: boolean }[] = [];

    eventos.forEach((e) => {
      const c = Number(e.custo || 0);
      total += c;
      const d = parseLocal(e.data);
      if (d && d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear()) mes += c;
      if (d && d >= hoje) futuros.push({ id: `e${e.id}`, titulo: e.nome, pet: e.petNome || '', data: d, tipo: normalizarTipo(e.tipo), lembrete: false });
      const pd = parseLocal(e.proxima_dose);
      if (pd && pd >= hoje) futuros.push({ id: `p${e.id}`, titulo: `Próxima dose: ${e.nome}`, pet: e.petNome || '', data: pd, tipo: normalizarTipo(e.tipo), lembrete: true });
    });
    futuros.sort((a, b) => a.data.getTime() - b.data.getTime());
    return { totalGasto: total, gastoMes: mes, proximos: futuros.slice(0, 4) };
  }, [eventos]);

  const primeiroNome = nome ? nome.split(' ')[0] : 'Tutor(a)';

  return (
    <Screen nav="home" title="PetCare" right={<Pressable onPress={() => router.push('/notifications')}><Text style={{ fontSize: 22 }}>🔔</Text></Pressable>}>
      <Text style={s.hello}>Olá, {primeiroNome}! 👋</Text>
      <Text style={s.helloSub}>Veja como estão os cuidados com seus pets.</Text>

      {erro ? <ErrorBox message={erro} onRetry={recarregar} /> : null}

      <View style={s.statsRow}>
        <Stat value={loading ? '–' : pets.length} label="Pets" onPress={() => router.replace('/pets')} />
        <View style={{ width: 12 }} />
        <Stat value={loading ? '–' : eventos.length} label="Eventos" onPress={() => router.replace('/events')} />
      </View>

      <Card style={s.moneyCard} onPress={() => router.push('/expenses')}>
        <Text style={s.moneyLabel}>Gastos do mês</Text>
        <Text style={s.moneyValue}>{formatarReal(gastoMes)}</Text>
        <Text style={s.moneySub}>Total acumulado: {formatarReal(totalGasto)}  ›</Text>
      </Card>

      <SectionTitle>Ações rápidas</SectionTitle>
      <View style={s.grid}>
        {[
          { e: '➕', t: 'Cadastrar pet', p: '/pet-form' },
          { e: '💉', t: 'Novo evento', p: '/add-event' },
          { e: '📅', t: 'Calendário', p: '/calendar' },
          { e: '💰', t: 'Gastos', p: '/expenses' },
          { e: '📄', t: 'Relatório PDF', p: '/reports' },
          { e: '🔔', t: 'Notificações', p: '/notifications' },
        ].map((a) => (
          <Pressable key={a.t} style={s.gridItem} onPress={() => router.push(a.p as any)}>
            <Text style={{ fontSize: 26 }}>{a.e}</Text>
            <Text style={s.gridTxt}>{a.t}</Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle action={<Pressable onPress={() => router.push('/calendar')}><Text style={s.more}>Ver agenda</Text></Pressable>}>Próximos compromissos</SectionTitle>
      {loading ? (
        <Loading />
      ) : proximos.length === 0 ? (
        <Empty emoji="🗓️" title="Nada agendado" text="Registre vacinas e consultas com a próxima data para ver os lembretes aqui." />
      ) : (
        proximos.map((p) => {
          const cor = tipoCor[p.tipo] || tipoCor.CONSULTA;
          return (
            <Card key={p.id} style={s.nextCard}>
              <View style={[s.nextIcon, { backgroundColor: cor.bg }]}>
                <Text style={{ fontSize: 20 }}>{cor.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.nextTitle} numberOfLines={1}>{p.titulo}</Text>
                <Text style={s.nextSub}>{p.pet} • {isoParaDataBR(`${p.data.getFullYear()}-${String(p.data.getMonth() + 1).padStart(2, '0')}-${String(p.data.getDate()).padStart(2, '0')}`)}</Text>
              </View>
              <Badge label={p.lembrete ? 'Lembrete' : TIPO_LABEL[p.tipo] || p.tipo} bg={cor.bg} fg={cor.fg} />
            </Card>
          );
        })
      )}

      {!loading && pets.length === 0 ? (
        <Card onPress={() => router.push('/pet-form')} style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center' }}>
          <PetAvatar pet={{ especie: 'OUTRO' }} size={44} />
          <Text style={{ flex: 1, marginLeft: 12, color: colors.textSoft, fontSize: 13 }}>Você ainda não tem pets. Toque aqui para cadastrar o primeiro!</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const s = StyleSheet.create({
  hello: { fontSize: 24, fontWeight: '800', color: colors.text },
  helloSub: { fontSize: 13, color: colors.textSoft, marginTop: 2, marginBottom: 16 },
  statsRow: { flexDirection: 'row', marginBottom: 2 },
  moneyCard: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  moneyLabel: { color: '#bbf7d0', fontSize: 12, fontWeight: '600' },
  moneyValue: { color: '#fff', fontSize: 30, fontWeight: '800', marginVertical: 4 },
  moneySub: { color: '#dcfce7', fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '31.5%', backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  gridTxt: { fontSize: 12, fontWeight: '600', color: colors.textSoft, marginTop: 6, textAlign: 'center' },
  more: { fontSize: 13, color: colors.primary, fontWeight: '700' },
  nextCard: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 10 },
  nextIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  nextTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  nextSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
});

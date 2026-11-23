import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen, Card, Field, Button, Chip, ChipRow, Empty, Loading, SectionTitle } from '@/ui/components';
import { colors } from '@/ui/theme';
import { useDados } from '@/services/useDados';
import { session } from '@/services/session';
import { api } from '@/services/api';
import { compartilharPdf, filtrarPeriodo, gerarPdf } from '@/services/reports';
import { chaveDia, dataBRparaISO, formatarReal, mascaraData, parseLocal } from '@/utils/format';

type Periodo = 'TUDO' | '30' | '90' | 'ANO' | 'CUSTOM';

// UC18: Gerar Relatório PDF • UC19: Compartilhar Relatório (com o veterinário)
export function Reports() {
  const { petId } = useLocalSearchParams<{ petId?: string }>();
  const { pets, eventos, loading } = useDados();
  const [pet, setPet] = useState<number | null>(petId ? Number(petId) : null);
  const [periodo, setPeriodo] = useState<Periodo>('TUDO');
  const [ini, setIni] = useState('');
  const [fim, setFim] = useState('');
  const [gerando, setGerando] = useState(false);
  const [arquivo, setArquivo] = useState<string | null>(null);

  useEffect(() => {
    if (!pet && pets.length > 0) setPet(pets[0].id);
  }, [pets, pet]);

  const intervalo = useMemo(() => {
    const hoje = new Date();
    if (periodo === 'TUDO') return { inicio: null, fim: null };
    if (periodo === '30' || periodo === '90') {
      const i = new Date();
      i.setDate(i.getDate() - Number(periodo));
      return { inicio: i, fim: hoje };
    }
    if (periodo === 'ANO') return { inicio: new Date(hoje.getFullYear(), 0, 1), fim: hoje };
    const a = dataBRparaISO(ini);
    const b = dataBRparaISO(fim);
    return { inicio: a ? parseLocal(a) : null, fim: b ? parseLocal(b) : null };
  }, [periodo, ini, fim]);

  const petSel = pets.find((p) => p.id === pet) || null;
  const evPet = useMemo(() => eventos.filter((e) => e.pet_id === pet), [eventos, pet]);
  const noPeriodo = useMemo(() => filtrarPeriodo(evPet, intervalo.inicio, intervalo.fim), [evPet, intervalo]);
  const totalPeriodo = noPeriodo.reduce((a, e) => a + Number(e.custo || 0), 0);

  async function gerar(compartilhar: boolean) {
    if (!petSel) return;
    if (periodo === 'CUSTOM' && ((ini && !dataBRparaISO(ini)) || (fim && !dataBRparaISO(fim)))) return Alert.alert('Atenção', 'Datas do período inválidas. Use dd/mm/aaaa.');

    setGerando(true);
    try {
      let uri = arquivo;
      if (!uri || !compartilhar) {
        uri = await gerarPdf({ pet: petSel, eventos: evPet, inicio: intervalo.inicio, fim: intervalo.fim, tutor: session.getUsuario()?.nome });
        setArquivo(uri);
        // registra o Relatorio no servidor (se o endpoint existir) — sem bloquear o fluxo
        api
          .post('/api/relatorios', {
            titulo: `Relatório de ${petSel.nome}`,
            pet_id: petSel.id,
            periodo_inicio: intervalo.inicio ? chaveDia(intervalo.inicio) : null,
            periodo_fim: intervalo.fim ? chaveDia(intervalo.fim) : null,
          })
          .catch(() => {});
      }
      await compartilharPdf(uri);
    } catch (e: any) {
      Alert.alert('Erro ao gerar relatório', e.message || 'Tente novamente.');
    } finally {
      setGerando(false);
    }
  }

  return (
    <Screen title="Relatório PDF" back>
      {loading ? (
        <Loading />
      ) : pets.length === 0 ? (
        <Empty emoji="📄" title="Nenhum pet cadastrado" text="Cadastre um pet e registre eventos para gerar relatórios." />
      ) : (
        <>
          <Text style={{ fontSize: 13, color: colors.textSoft, lineHeight: 19, marginBottom: 14 }}>
            Gere um PDF com o histórico de saúde do pet e envie ao veterinário por WhatsApp, e-mail ou outro app.
          </Text>

          <SectionTitle>Pet</SectionTitle>
          <View style={{ marginBottom: 12 }}>
            <ChipRow>
              {pets.map((p) => (
                <Chip key={p.id} label={`🐾 ${p.nome}`} active={pet === p.id} onPress={() => { setPet(p.id); setArquivo(null); }} />
              ))}
            </ChipRow>
          </View>

          <SectionTitle>Período</SectionTitle>
          <View style={{ marginBottom: 12 }}>
            <ChipRow>
              {([['TUDO', 'Tudo'], ['30', '30 dias'], ['90', '90 dias'], ['ANO', 'Este ano'], ['CUSTOM', 'Personalizado']] as [Periodo, string][]).map(([k, l]) => (
                <Chip key={k} label={l} active={periodo === k} onPress={() => { setPeriodo(k); setArquivo(null); }} />
              ))}
            </ChipRow>
          </View>

          {periodo === 'CUSTOM' ? (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Field label="De" value={ini} onChangeText={(t) => { setIni(mascaraData(t)); setArquivo(null); }} placeholder="dd/mm/aaaa" keyboardType="numeric" maxLength={10} />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Até" value={fim} onChangeText={(t) => { setFim(mascaraData(t)); setArquivo(null); }} placeholder="dd/mm/aaaa" keyboardType="numeric" maxLength={10} />
              </View>
            </View>
          ) : null}

          <Card style={{ backgroundColor: colors.primarySoft, borderColor: colors.primaryBorder }}>
            <Text style={{ fontWeight: '800', color: colors.primaryDark, fontSize: 15 }}>{petSel?.nome}</Text>
            <Text style={{ color: colors.textSoft, marginTop: 4, fontSize: 13 }}>
              {noPeriodo.length} evento(s) no período • {formatarReal(totalPeriodo)}
            </Text>
          </Card>

          <Button label={arquivo ? '📄 Gerar novamente' : '📄 Gerar PDF'} onPress={() => gerar(false)} loading={gerando} disabled={noPeriodo.length === 0} />
          {noPeriodo.length === 0 ? <Text style={{ fontSize: 12, color: colors.muted, marginTop: 8, textAlign: 'center' }}>Nenhum evento no período selecionado.</Text> : null}
          {arquivo ? <Button label="📤 Compartilhar com o veterinário" variant="outline" onPress={() => gerar(true)} loading={gerando} style={{ marginTop: 10 }} /> : null}
        </>
      )}
    </Screen>
  );
}

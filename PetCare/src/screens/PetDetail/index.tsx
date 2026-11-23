import React, { useCallback, useState } from 'react';
import { Alert, Image, Modal, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, Card, Button, SectionTitle, Empty, Loading, PetAvatar, Badge } from '@/ui/components';
import { colors, tipoCor } from '@/ui/theme';
import { api, endpointIndisponivel } from '@/services/api';
import { escolherFoto } from '@/services/photos';
import { cancelarLembrete } from '@/services/notifications';
import type { Evento, FotoPet, Pet } from '@/services/types';
import { ESPECIE_LABEL, TIPO_LABEL, calcularIdade, formatarReal, isoParaDataBR, normalizarEspecie, normalizarTipo } from '@/utils/format';

// Perfil do pet: UC7 editar • UC8 excluir • UC9 tirar foto • UC10 galeria de fotos
export function PetDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const thumb = Math.floor((width - 36 - 16) / 3);

  const [pet, setPet] = useState<Pet | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [fotos, setFotos] = useState<FotoPet[]>([]);
  const [galeriaOk, setGaleriaOk] = useState(true);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [aberta, setAberta] = useState<FotoPet | null>(null);
  const [legenda, setLegenda] = useState('');

  const carregar = useCallback(async () => {
    try {
      const lista: Pet[] = await api.get('/api/pets');
      const p = lista.find((x) => String(x.id) === String(id)) || null;
      setPet(p);
      if (p) {
        setEventos((await api.get(`/api/pets/${p.id}/eventos`).catch(() => [])) || []);
        try {
          setFotos((await api.get(`/api/pets/${p.id}/fotos`)) || []);
          setGaleriaOk(true);
        } catch (e) {
          setFotos([]);
          setGaleriaOk(!endpointIndisponivel(e));
        }
      }
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function adicionarFoto() {
    const uri = await escolherFoto(false);
    if (!uri || !pet) return;
    setEnviando(true);
    try {
      await api.post(`/api/pets/${pet.id}/fotos`, { url_imagem: uri });
      await carregar();
    } catch (e: any) {
      Alert.alert('Erro ao enviar foto', endpointIndisponivel(e) ? 'O servidor ainda não tem o endpoint de fotos (/api/pets/{id}/fotos).' : e.message);
    } finally {
      setEnviando(false);
    }
  }

  async function salvarLegenda() {
    if (!aberta) return;
    try {
      await api.patch(`/api/fotos/${aberta.id}`, { descricao: legenda.trim() || null });
      setAberta(null);
      carregar();
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    }
  }

  function removerFoto() {
    if (!aberta) return;
    const f = aberta;
    Alert.alert('Remover foto', 'Deseja remover esta foto da galeria?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.del(`/api/fotos/${f.id}`);
            setAberta(null);
            carregar();
          } catch (e: any) {
            Alert.alert('Erro', e.message);
          }
        },
      },
    ]);
  }

  function excluirPet() {
    if (!pet) return;
    Alert.alert('Excluir pet', `Excluir ${pet.nome}? Todos os eventos e fotos dele também serão apagados.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await Promise.all(eventos.map((e) => cancelarLembrete(e.id)));
            await api.del(`/api/pets/${pet.id}`);
            router.replace('/pets');
          } catch (e: any) {
            Alert.alert('Erro ao excluir', endpointIndisponivel(e) ? 'O servidor ainda não tem o endpoint DELETE /api/pets/{id}.' : e.message);
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <Screen title="Perfil do pet" back>
        <Loading />
      </Screen>
    );
  }
  if (!pet) {
    return (
      <Screen title="Perfil do pet" back>
        <Empty emoji="🔍" title="Pet não encontrado" action={<Button label="Voltar" onPress={() => router.replace('/pets')} />} />
      </Screen>
    );
  }

  const esp = normalizarEspecie(pet.especie);
  const total = eventos.reduce((a, e) => a + Number(e.custo || 0), 0);
  const recentes = [...eventos].sort((a, b) => (a.data < b.data ? 1 : -1)).slice(0, 3);

  return (
    <Screen title={pet.nome} back>
      <Card style={{ alignItems: 'center' }}>
        <PetAvatar pet={{ ...pet, especie: esp }} size={96} />
        <Text style={s.name}>{pet.nome}</Text>
        <Text style={s.sub}>
          {ESPECIE_LABEL[esp]}
          {pet.raca ? ` • ${pet.raca}` : ''}
          {pet.genero ? ` • ${pet.genero}` : ''}
        </Text>
        <View style={s.infoRow}>
          <View style={s.info}>
            <Text style={s.infoV}>{calcularIdade(pet.data_nascimento) || '—'}</Text>
            <Text style={s.infoL}>Idade</Text>
          </View>
          <View style={s.info}>
            <Text style={s.infoV}>{pet.peso ? `${pet.peso} kg` : '—'}</Text>
            <Text style={s.infoL}>Peso</Text>
          </View>
          <View style={s.info}>
            <Text style={s.infoV}>{formatarReal(total)}</Text>
            <Text style={s.infoL}>Gastos</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14, alignSelf: 'stretch' }}>
          <Button label="✏️ Editar" variant="soft" small style={{ flex: 1 }} onPress={() => router.push({ pathname: '/pet-form', params: { petId: String(pet.id) } } as any)} />
          <Button label="🗑 Excluir" variant="outline" small style={{ flex: 1, borderColor: colors.dangerBorder }} onPress={excluirPet} />
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 6 }}>
        <Button label="💉 Novo evento" style={{ flex: 1 }} small onPress={() => router.push({ pathname: '/add-event', params: { petId: String(pet.id) } } as any)} />
        <Button label="📄 Relatório" variant="outline" style={{ flex: 1 }} small onPress={() => router.push({ pathname: '/reports', params: { petId: String(pet.id) } } as any)} />
      </View>

      <SectionTitle action={<Button label={enviando ? 'Enviando...' : '📷 Adicionar foto'} small variant="soft" disabled={enviando} onPress={adicionarFoto} />}>Galeria de fotos</SectionTitle>
      {!galeriaOk ? (
        <Empty emoji="🖼️" title="Galeria indisponível" text="O servidor ainda não possui os endpoints de fotos. Peça ao time do back-end para publicar /api/pets/{id}/fotos." />
      ) : fotos.length === 0 ? (
        <Empty emoji="📷" title="Sem fotos ainda" text="Tire uma foto ou escolha da galeria para criar o álbum do seu pet." />
      ) : (
        <View style={s.grid}>
          {fotos.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => {
                setAberta(f);
                setLegenda(f.descricao || '');
              }}
            >
              <Image source={{ uri: f.url_imagem }} style={{ width: thumb, height: thumb, borderRadius: 12, marginRight: 8, marginBottom: 8, backgroundColor: colors.border }} />
            </Pressable>
          ))}
        </View>
      )}

      <SectionTitle action={<Pressable onPress={() => router.replace('/events')}><Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>Ver tudo</Text></Pressable>}>Últimos eventos</SectionTitle>
      {recentes.length === 0 ? (
        <Empty emoji="📋" title="Nenhum evento registrado" />
      ) : (
        recentes.map((e) => {
          const t = normalizarTipo(e.tipo);
          const cor = tipoCor[t] || tipoCor.CONSULTA;
          return (
            <Card key={e.id} style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
              <View style={[s.evIcon, { backgroundColor: cor.bg }]}>
                <Text style={{ fontSize: 18 }}>{cor.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: colors.text }}>{e.nome}</Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>{isoParaDataBR(e.data)}</Text>
              </View>
              <Badge label={TIPO_LABEL[t] || e.tipo} bg={cor.bg} fg={cor.fg} />
            </Card>
          );
        })
      )}

      <Modal visible={!!aberta} transparent animationType="fade" onRequestClose={() => setAberta(null)}>
        <View style={s.modalBg}>
          <View style={s.modalCard}>
            {aberta ? <Image source={{ uri: aberta.url_imagem }} style={s.modalImg} resizeMode="contain" /> : null}
            <TextInput value={legenda} onChangeText={setLegenda} placeholder="Adicionar legenda..." placeholderTextColor={colors.muted} style={s.legenda} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button label="Salvar legenda" small style={{ flex: 1.3 }} onPress={salvarLegenda} />
              <Button label="Remover" small variant="outline" style={{ flex: 1, borderColor: colors.dangerBorder }} onPress={removerFoto} />
              <Button label="Fechar" small variant="ghost" style={{ flex: 0.8 }} onPress={() => setAberta(null)} />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const s = StyleSheet.create({
  name: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 10 },
  sub: { fontSize: 13, color: colors.textSoft, marginTop: 2 },
  infoRow: { flexDirection: 'row', marginTop: 16, alignSelf: 'stretch' },
  info: { flex: 1, alignItems: 'center' },
  infoV: { fontSize: 14, fontWeight: '800', color: colors.primaryDark, textAlign: 'center' },
  infoL: { fontSize: 11, color: colors.muted, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  evIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  modalBg: { flex: 1, backgroundColor: 'rgba(15,23,42,0.85)', justifyContent: 'center', padding: 18 },
  modalCard: { backgroundColor: '#fff', borderRadius: 20, padding: 14 },
  modalImg: { width: '100%', height: 340, borderRadius: 12, backgroundColor: '#000', marginBottom: 12 },
  legenda: { height: 44, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.inputBg, paddingHorizontal: 12, marginBottom: 12, color: colors.text },
});

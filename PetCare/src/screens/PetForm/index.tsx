import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, Field, Button, Chip, ChipRow, Loading, PetAvatar } from '@/ui/components';
import { colors } from '@/ui/theme';
import { api } from '@/services/api';
import { escolherFoto } from '@/services/photos';
import type { Pet } from '@/services/types';
import { ESPECIES_PET, ESPECIE_LABEL, ESPECIE_EMOJI, calcularIdade, dataBRparaISO, isoParaDataBR, mascaraData, normalizarEspecie } from '@/utils/format';


export function PetForm() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId?: string }>();
  const editando = !!petId;

  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState<string>('CACHORRO');
  const [raca, setRaca] = useState('');
  const [genero, setGenero] = useState('Macho');
  const [nasc, setNasc] = useState('');
  const [peso, setPeso] = useState('');
  const [foto, setFoto] = useState<string | null>(null);

  useEffect(() => {
    if (!editando) return;
    api
      .get('/api/pets')
      .then((lista: Pet[]) => {
        const p = lista.find((x) => String(x.id) === String(petId));
        if (!p) {
          Alert.alert('Erro', 'Pet não encontrado.');
          router.back();
          return;
        }
        setNome(p.nome);
        setEspecie(normalizarEspecie(p.especie));
        setRaca(p.raca || '');
        setGenero(p.genero || 'Macho');
        setNasc(isoParaDataBR(p.data_nascimento));
        setPeso(p.peso != null ? String(p.peso).replace('.', ',') : '');
        setFoto(p.foto || null);
      })
      .catch((e) => Alert.alert('Erro', e.message))
      .finally(() => setCarregando(false));
  }, [editando, petId, router]);

  async function tirarFoto() {
    const uri = await escolherFoto(true);
    if (uri) setFoto(uri);
  }

  async function salvar() {
    if (!nome.trim()) return Alert.alert('Atenção', 'Informe o nome do pet.');
    let nascISO: string | null = null;
    if (nasc) {
      nascISO = dataBRparaISO(nasc);
      if (!nascISO) return Alert.alert('Atenção', 'Data de nascimento inválida. Use dd/mm/aaaa.');
      if (new Date(nascISO) > new Date()) return Alert.alert('Atenção', 'A data de nascimento não pode ser no futuro.');
    }
    const pesoNum = peso ? parseFloat(peso.replace(',', '.')) : null;
    if (peso && (pesoNum === null || isNaN(pesoNum))) return Alert.alert('Atenção', 'Peso inválido.');

    const corpo = {
      nome: nome.trim(),
      especie,
      raca: raca.trim() || null,
      data_nascimento: nascISO,
      genero,
      peso: pesoNum,
      foto,
    };

    setSalvando(true);
    try {
      if (editando) await api.put(`/api/pets/${petId}`, corpo);
      else await api.post('/api/pets', corpo);
      Alert.alert('Pronto! 🐾', editando ? 'Dados do pet atualizados.' : 'Pet cadastrado com sucesso!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e: any) {
      Alert.alert('Erro ao salvar pet', e.message);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <Screen title="Editar pet" back>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen title={editando ? 'Editar pet' : 'Novo pet'} back>
      <View style={s.photoBox}>
        <Pressable onPress={tirarFoto}>
          <PetAvatar pet={{ nome, especie, foto }} size={104} />
          <View style={s.camBadge}>
            <Text style={{ fontSize: 16 }}>📷</Text>
          </View>
        </Pressable>
        <Pressable onPress={tirarFoto}>
          <Text style={s.photoLink}>{foto ? 'Trocar foto' : 'Tirar ou escolher foto'}</Text>
        </Pressable>
      </View>

      <Field label="Nome do pet *" value={nome} onChangeText={setNome} placeholder="Ex.: Thor" />

      <Text style={s.label}>Espécie *</Text>
      <View style={{ marginBottom: 14 }}>
        <ChipRow>
          {ESPECIES_PET.map((e) => (
            <Chip key={e} label={`${ESPECIE_EMOJI[e]} ${ESPECIE_LABEL[e]}`} active={especie === e} onPress={() => setEspecie(e)} />
          ))}
        </ChipRow>
      </View>

      <Field label="Raça" value={raca} onChangeText={setRaca} placeholder="Ex.: Labrador (opcional)" />

      <Text style={s.label}>Gênero</Text>
      <View style={s.row}>
        {['Macho', 'Fêmea'].map((g) => (
          <Chip key={g} label={g === 'Macho' ? '♂ Macho' : '♀ Fêmea'} active={genero === g} onPress={() => setGenero(g)} />
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
        <View style={{ flex: 1.3 }}>
          <Field label="Nascimento" value={nasc} onChangeText={(t) => setNasc(mascaraData(t))} placeholder="dd/mm/aaaa" keyboardType="numeric" maxLength={10} hint={nasc.length === 10 && dataBRparaISO(nasc) ? calcularIdade(dataBRparaISO(nasc)) : undefined} />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Peso (kg)" value={peso} onChangeText={setPeso} placeholder="Ex.: 12,5" keyboardType="decimal-pad" />
        </View>
      </View>

      <Button label={editando ? 'Salvar alterações' : 'Cadastrar pet'} onPress={salvar} loading={salvando} style={{ marginTop: 6 }} />
    </Screen>
  );
}

const s = StyleSheet.create({
  photoBox: { alignItems: 'center', marginBottom: 20 },
  camBadge: { position: 'absolute', right: -2, bottom: -2, width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  photoLink: { marginTop: 10, color: colors.primary, fontWeight: '700', fontSize: 13 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSoft, marginBottom: 6 },
  row: { flexDirection: 'row' },
});

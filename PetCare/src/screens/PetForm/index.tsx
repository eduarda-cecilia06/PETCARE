import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export function PetForm({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('Cão');
  const [raca, setRaca] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [idade, setIdade] = useState('');
  const [genero, setGenero] = useState('Macho');
  const [peso, setPeso] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  const especies = ['Cão', 'Gato', 'Ave', 'Coelho', 'Outro'];

  function formatarData(texto: string) {
    const apenasNumeros = texto.replace(/\D/g, '');
    if (apenasNumeros.length <= 2) {
      return apenasNumeros;
    }
    if (apenasNumeros.length <= 4) {
      return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`;
    }
    return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4, 8)}`;
  }

  function handleDataChange(texto: string) {
    const dataFormatada = formatarData(texto);
    setDataNasc(dataFormatada);

    if (dataFormatada.length === 10) {
      const partes = dataFormatada.split('/');
      const anoNasc = parseInt(partes[2], 10);
      const anoAtual = new Date().getFullYear();
      const calculoIdade = anoAtual - anoNasc;

      if (calculoIdade >= 0 && calculoIdade < 50) {
        setIdade(String(calculoIdade));
      }
    }
  }

  async function handleTirarFoto() {
    Alert.alert(
      'Foto do Pet',
      'Escolha como deseja adicionar a foto:',
      [
        {
          text: 'Tirar com a Câmara',
          onPress: async () => {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissionResult.granted) {
              Alert.alert('Permissão negada', 'Precisamos de permissão para aceder à câmara.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
              setFotoUri(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Escolher da Galeria',
          onPress: async () => {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
              Alert.alert('Permissão negada', 'Precisamos de permissão para aceder à galeria.');
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
              setFotoUri(result.assets[0].uri);
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  }

  function handleSalvar() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o nome do pet.');
      return;
    }
    Alert.alert('Sucesso', 'Pet salvo com sucesso!', [
      { text: 'OK', onPress: () => navigation?.goBack() },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Companheiro</Text>
        <TouchableOpacity onPress={handleSalvar} style={styles.saveHeaderButton}>
          <Text style={styles.saveHeaderButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.photoContainer}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleTirarFoto} style={styles.photoCircle}>
            {fotoUri ? (
              <Image source={{ uri: fotoUri }} style={styles.photoPreview} />
            ) : (
              <Text style={styles.photoCircleText}>Foto</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTirarFoto}>
            <Text style={styles.photoLabelText}>Tirar ou escolher foto da galeria</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Pet *</Text>
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Escreva o nome do seu pet"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Espécie *</Text>
            <TextInput
              value={especie}
              onChangeText={setEspecie}
              placeholder="Ex: Cão, Gato, Passarinho, Furão..."
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Raça</Text>
            <TextInput
              value={raca}
              onChangeText={setRaca}
              placeholder="Ex: SRD ou Poodle"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gênero</Text>
            <View style={styles.rowButtons}>
              <TouchableOpacity
                onPress={() => setGenero('Macho')}
                style={[styles.genderButton, genero === 'Macho' && styles.genderButtonActive]}
              >
                <Text style={[styles.genderButtonText, genero === 'Macho' && styles.genderButtonTextActive]}>
                  Macho
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGenero('Fêmea')}
                style={[styles.genderButton, genero === 'Fêmea' && styles.genderButtonActive]}
              >
                <Text style={[styles.genderButtonText, genero === 'Fêmea' && styles.genderButtonTextActive]}>
                  Fêmea
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Nascimento</Text>
              <TextInput
                value={dataNasc}
                onChangeText={handleDataChange}
                placeholder="dd/mm/aaaa"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                maxLength={10}
                style={styles.input}
              />
            </View>

            <View style={[styles.inputGroup, { width: 90, marginRight: 8 }]}>
              <Text style={styles.label}>Idade</Text>
              <TextInput
                value={idade}
                onChangeText={setIdade}
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                maxLength={2}
                style={styles.input}
              />
            </View>

            <View style={[styles.inputGroup, { width: 100 }]}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput
                value={peso}
                onChangeText={setPeso}
                placeholder="Ex: 12.5"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSalvar}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Salvar Pet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerNav: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backButton: { paddingVertical: 6 },
  backButtonText: { color: '#64748b', fontSize: 14, fontFamily: 'monospace' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace' },
  saveHeaderButton: { paddingVertical: 6 },
  saveHeaderButtonText: { color: '#16a34a', fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace' },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 20 },
  photoContainer: { alignItems: 'center', marginBottom: 20 },
  photoCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#86efac', borderStyle: 'dashed', marginBottom: 8, overflow: 'hidden' },
  photoPreview: { width: '100%', height: '100%' },
  photoCircleText: { fontSize: 14, fontWeight: 'bold', color: '#16a34a', fontFamily: 'monospace' },
  photoLabelText: { fontSize: 12, color: '#16a34a', fontWeight: 'bold', fontFamily: 'monospace' },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, color: '#334155', marginBottom: 6, fontWeight: '600', fontFamily: 'monospace' },
  input: { width: '100%', backgroundColor: '#f8fafc', height: 46, borderRadius: 12, paddingHorizontal: 14, fontSize: 13, color: '#0f172a', borderWidth: 1, borderColor: '#e2e8f0', fontFamily: 'monospace' },
  speciesScroll: { flexDirection: 'row' },
  speciesChip: { backgroundColor: '#f1f5f9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  speciesChipActive: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  speciesChipText: { fontSize: 12, color: '#64748b', fontFamily: 'monospace' },
  speciesChipTextActive: { color: '#16a34a', fontWeight: 'bold' },
  rowButtons: { flexDirection: 'row', gap: 10 },
  genderButton: { flex: 1, backgroundColor: '#f1f5f9', height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  genderButtonActive: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  genderButtonText: { fontSize: 12, color: '#64748b', fontFamily: 'monospace' },
  genderButtonTextActive: { color: '#16a34a', fontWeight: 'bold' },
  rowInputs: { flexDirection: 'row' },
  primaryButton: { backgroundColor: '#16a34a', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace' },
});
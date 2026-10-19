import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiFetch } from '../../services/api';

export function AddEvent({ route, navigation }: any) {
  const token = route?.params?.token;
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Vacina');
  const [data, setData] = useState('');
  const [custo, setCusto] = useState('');
  const [obs, setObs] = useState('');

  const tiposEvento = ['Vacina', 'Consulta', 'Vermífugo', 'Medicamento', 'Exame', 'Cirurgia'];

  useEffect(() => {
    carregarPetsDoTutor();
  }, []);

  function carregarPetsDoTutor() {
    apiFetch('/api/pets', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((dataPets) => {
        if (Array.isArray(dataPets) && dataPets.length > 0) {
          setPets(dataPets);
          setSelectedPetId(dataPets[0].id);
        }
      })
      .catch(() => {
        // aqui ele meio que silencia erro de carregamento prévio
      });
  }

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

  function converterDataParaISO(dataBR: string) {
    const partes = dataBR.split('/');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}T00:00:00`;
    }
    return new Date().toISOString();
  }

  function handleSalvarEvento() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o nome do evento.');
      return;
    }

    if (!selectedPetId) {
      Alert.alert('Atenção', 'Você precisa ter pelo menos um pet cadastrado para adicionar um evento.');
      return;
    }

    apiFetch(`/api/pets/${selectedPetId}/eventos`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tipo: tipo,
        nome: nome,
        data: data ? converterDataParaISO(data) : new Date().toISOString(),
        descricao: obs || null,
        custo: custo ? parseFloat(custo.replace(/\./g, '').replace(',', '.')) : null,
      }),
    })
      .then(() => {
        Alert.alert('Sucesso', 'Evento cadastrado com sucesso!', [
          { text: 'OK', onPress: () => navigation?.goBack() },
        ]);
      })
      .catch((error) => {
        Alert.alert('Erro ao Salvar Evento', error.message);
      });
  }

    function formatarMoeda(texto: string) {
    let valor = texto.replace(/\D/g, ''); // Remove tudo que não é número
    if (!valor) return '';
    
    // deixa em decimal e fixa as duas casinhas
    valor = (Number(valor) / 100).toFixed(2) + '';
    // troca o ponto de decimal por uma vírgula
    valor = valor.replace('.', ',');
    // adiciona o pontinho de milhar, mil, tal
    valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return valor;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Evento</Text>
        <TouchableOpacity onPress={handleSalvarEvento} style={styles.saveHeaderButton}>
          <Text style={styles.saveHeaderButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {pets.length > 1 && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Selecionar Pet *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typesScroll}>
                {pets.map((pet) => (
                  <TouchableOpacity
                    key={pet.id}
                    onPress={() => setSelectedPetId(pet.id)}
                    style={[styles.typeChip, selectedPetId === pet.id && styles.typeChipActive]}
                  >
                    <Text style={[styles.typeChipText, selectedPetId === pet.id && styles.typeChipTextActive]}>
                      🐾 {pet.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Evento *</Text>
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Insira aqui o evento"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Evento</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typesScroll}>
              {tiposEvento.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setTipo(item)}
                  style={[styles.typeChip, tipo === item && styles.typeChipActive]}
                >
                  <Text style={[styles.typeChipText, tipo === item && styles.typeChipTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Data</Text>
              <TextInput
                value={data}
                onChangeText={(texto) => setData(formatarData(texto))}
                placeholder="dd/mm/aaaa"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                maxLength={10}
                style={styles.input}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Custo / Valor (R$)</Text>
              <TextInput
                value={custo}
                onChangeText={(texto) => setCusto(formatarMoeda(texto))}
                placeholder="Ex: 150,00"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição / Observações</Text>
            <TextInput
              value={obs}
              onChangeText={setObs}
              placeholder="Adicione observações ou instruções clínicas"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textArea]}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSalvarEvento}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Criar Evento</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation?.navigate('Dashboard', { token })} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('PetList', { token })} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>Pets</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('EventList', { token })} style={styles.bottomTab}>
          <View style={[styles.tabIconCircle, styles.tabIconActive]} />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('TutorProfile', { token })} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerNav: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    paddingVertical: 6,
  },
  backButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  saveHeaderButton: {
    paddingVertical: 6,
  },
  saveHeaderButtonText: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 6,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  input: {
    width: '100%',
    backgroundColor: '#f8fafc',
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontFamily: 'monospace',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  typesScroll: {
    flexDirection: 'row',
  },
  typeChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  typeChipActive: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  typeChipText: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  typeChipTextActive: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: '#16a34a',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  bottomBar: {
    width: '100%',
    height: 70,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  bottomTab: {
    alignItems: 'center',
  },
  tabIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#cbd5e1',
    marginBottom: 4,
  },
  tabIconActive: {
    backgroundColor: '#22c55e',
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#64748b',
  },
  tabLabelActive: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
});

export default AddEvent;
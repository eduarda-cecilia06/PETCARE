import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function AddEvent({ navigation }: any) {
  const [tipo, setTipo] = useState('Escolha a opção');
  const [data, setData] = useState('');
  const [obs, setObs] = useState('');
  const opcoes = ['Vacina', 'Consulta', 'Vermífugo', 'Medicamento', 'Exame'];

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

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <View style={styles.avatar} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Adicionar novo evento:</Text>

        <Text style={styles.fieldLabel}>Tipo:</Text>
        <View style={styles.typeCard}>
          <Text style={styles.selectedTypeText}>{tipo}</Text>
          
          <View style={styles.typeList}>
            {opcoes.map((opcao) => (
              <TouchableOpacity 
                key={opcao} 
                onPress={() => setTipo(opcao)}
                style={styles.touchableOption}
              >

                <Text style={[
                  styles.typeItem, 
                  tipo === opcao && styles.typeItemActive
                ]}>
                  {opcao}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.fieldLabel}>Data:</Text>
        <TextInput
            value={data}
            onChangeText={(texto) => setData(formatarData(texto))}
            keyboardType="numeric"
            maxLength={10}
            placeholder="dd/mm/aaaa"
            placeholderTextColor="#737373"
            style={styles.pillInput}
        />

        <Text style={styles.fieldLabel}>Observações:</Text>
        <TextInput
          value={obs}
          onChangeText={setObs}
          placeholder="Adicione observações"
          placeholderTextColor="#737373"
          style={styles.pillInput}
        />

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation?.goBack()}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Criar evento</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Rodapé Fixo */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation?.navigate('EventList')} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('Dashboard')} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>Pets</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', justifyContent: 'space-between' },
  header: { width: '100%', height: 70, backgroundColor: '#d4d4d4', paddingHorizontal: 24, justifyContent: 'center', alignItems: 'flex-end' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#737373' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  title: { fontSize: 20, fontFamily: 'monospace', color: '#000000', marginBottom: 20 },
  fieldLabel: { fontFamily: 'monospace', fontSize: 14, color: '#171717', marginBottom: 8 },
  
  typeCard: { width: '100%', backgroundColor: '#d4d4d4', borderRadius: 20, padding: 12, marginBottom: 16 },
  selectedTypeText: { fontFamily: 'monospace', fontSize: 14, fontWeight: 'bold', color: '#000000', marginBottom: 8, paddingHorizontal: 4 },
  typeList: { backgroundColor: '#8c8c8c', borderRadius: 8, padding: 12, gap: 8 },
  touchableOption: { paddingVertical: 2 },
  typeItem: { color: '#d4d4d4', fontFamily: 'monospace', fontSize: 13 },
  typeItemActive: { color: '#ffffff', fontWeight: 'bold' }, 
  
  pillInput: { width: '100%', backgroundColor: '#d4d4d4', height: 42, borderRadius: 21, paddingHorizontal: 16, fontFamily: 'monospace', fontSize: 13, color: '#000000', marginBottom: 16 },
  buttonWrapper: { alignItems: 'center', marginTop: 16, marginBottom: 24 },
  submitButton: { backgroundColor: '#15803d', paddingHorizontal: 26, paddingVertical: 10, borderRadius: 20 },
  submitButtonText: { color: '#ffffff', fontFamily: 'monospace', fontSize: 13, fontWeight: 'bold' },
  bottomBar: { width: '100%', height: 75, backgroundColor: '#d4d4d4', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  bottomTab: { alignItems: 'center' },
  tabIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#737373', marginBottom: 4 },
  tabLabel: { fontSize: 11, fontFamily: 'monospace', color: '#171717' },
});
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function PetForm({ navigation }: any) {
  const [nome, setNome] = useState('Pipoca');
  const [especie, setEspecie] = useState('xxx');
  const [raca, setRaca] = useState('xxx');
  const [dataNasc, setDataNasc] = useState('dd/mm/aaaa');
  const [idade, setIdade] = useState('00');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Seus pets</Text>

        <View style={styles.card}>
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.photoBox}>
              <Text style={styles.photoText}>mudar foto</Text>
            </TouchableOpacity>

            <View style={styles.nameInputWrapper}>
              <TextInput
                value={nome}
                onChangeText={setNome}
                style={styles.pillInput}
              />
            </View>
          </View>

          <View style={styles.fieldsContainer}>
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Espécie:</Text>
              <TextInput
                value={especie}
                onChangeText={setEspecie}
                style={styles.shortPillInput}
              />
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>Raça:</Text>
              <TextInput
                value={raca}
                onChangeText={setRaca}
                style={styles.shortPillInput}
              />
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>Data de nascimento:</Text>
              <TextInput
                value={dataNasc}
                onChangeText={setDataNasc}
                style={styles.datePillInput}
              />
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>Idade:</Text>
              <TextInput
                value={idade}
                onChangeText={setIdade}
                keyboardType="numeric"
                style={styles.shortPillInput}
              />
            </View>
          </View>

          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation?.goBack()}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>salvar pet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation?.navigate('EventList')} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('Dashboard')} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>pets</Text>
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
  title: { fontSize: 22, fontFamily: 'monospace', textAlign: 'center', color: '#000000', marginBottom: 20 },
  card: { width: '100%', backgroundColor: '#d4d4d4', borderRadius: 8, padding: 18, marginBottom: 20 },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  photoBox: { width: 75, height: 75, backgroundColor: '#737373', borderRadius: 4, justifyContent: 'flex-end', padding: 4, marginRight: 16 },
  photoText: { fontSize: 9, fontFamily: 'monospace', color: '#e5e5e5' },
  nameInputWrapper: { flex: 1 },
  pillInput: { backgroundColor: '#a3a3a3', height: 36, borderRadius: 18, paddingHorizontal: 14, fontFamily: 'monospace', fontSize: 13, color: '#000000' },
  fieldsContainer: { gap: 12 },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontFamily: 'monospace', fontSize: 13, color: '#171717' },
  shortPillInput: { width: 90, backgroundColor: '#a3a3a3', height: 32, borderRadius: 16, textAlign: 'center', fontFamily: 'monospace', fontSize: 12, color: '#000000' },
  datePillInput: { width: 110, backgroundColor: '#a3a3a3', height: 32, borderRadius: 16, textAlign: 'center', fontFamily: 'monospace', fontSize: 12, color: '#000000' },
  buttonWrapper: { alignItems: 'center', marginTop: 24 },
  saveButton: { backgroundColor: '#15803d', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  saveButtonText: { color: '#ffffff', fontFamily: 'monospace', fontSize: 13, fontWeight: 'bold' },
  bottomBar: { width: '100%', height: 75, backgroundColor: '#d4d4d4', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  bottomTab: { alignItems: 'center' },
  tabIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#737373', marginBottom: 4 },
  tabLabel: { fontSize: 11, fontFamily: 'monospace', color: '#171717' },
});
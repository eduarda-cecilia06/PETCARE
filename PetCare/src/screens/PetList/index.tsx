import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function PetList({ navigation }: any) {
  const pets = [
    { id: '1', nome: 'Pipoca', especie: 'Cachorro' },
    { id: '2', nome: 'Kadule', especie: 'Gato' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Seus pets</Text>

        {pets.map((pet) => (
          <TouchableOpacity
            key={pet.id}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('PetForm')}
            style={styles.petCard}
          >
            <View style={styles.petThumb} />
            <View>
              <Text style={styles.petName}>{pet.nome}</Text>
              <Text style={styles.petSpecies}>espécie: {pet.especie}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('PetForm')}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Adicionar pet</Text>
          </TouchableOpacity>
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
  petCard: { width: '100%', backgroundColor: '#d4d4d4', borderRadius: 8, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  petThumb: { width: 60, height: 60, backgroundColor: '#737373', borderRadius: 4, marginRight: 16 },
  petName: { fontSize: 17, fontFamily: 'monospace', fontWeight: 'bold', color: '#000000' },
  petSpecies: { fontSize: 13, fontFamily: 'monospace', color: '#404040', marginTop: 4 },
  buttonWrapper: { alignItems: 'center', marginTop: 16, marginBottom: 24 },
  addButton: { backgroundColor: '#15803d', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  addButtonText: { color: '#ffffff', fontFamily: 'monospace', fontSize: 13, fontWeight: 'bold' },
  bottomBar: { width: '100%', height: 75, backgroundColor: '#d4d4d4', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  bottomTab: { alignItems: 'center' },
  tabIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#737373', marginBottom: 4 },
  tabLabel: { fontSize: 11, fontFamily: 'monospace', color: '#171717' },
});
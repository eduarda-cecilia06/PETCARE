import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Dashboard({ navigation }: any) {
  const pets = [
    {id: '1', nome: 'Pipoca', especie: 'Cachorro' },
    { id: '2', nome: 'Kadule', especie: 'Gato' },
  ];

  const eventos = [
    { id: '1', pet: 'Pipoca', descricao: 'Tomar vermífugo', data: '20/06' },
    { id: '2', pet: 'Kadule', descricao: 'Comprimido de verme', data: '03/09' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <View style={styles.avatar} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Seus pets</Text>

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

        <View style={styles.moreButtonWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('PetList')}
            style={styles.moreButton}
          >
            <Text style={styles.moreButtonText}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionSubtitle}>Próximos eventos:</Text>

        {eventos.map((evento) => (
          <View key={evento.id} style={styles.eventRow}>
            <Text style={styles.eventPet}>{evento.pet}</Text>
            <Text style={styles.eventDesc}>{evento.descricao}</Text>
            <Text style={styles.eventDate}>{evento.data}</Text>
          </View>
        ))}

        <View style={styles.addEventWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('AddEvent')}
            style={styles.addEventButton}
          >
            <Text style={styles.addEventButtonText}>Adicionar evento</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation?.navigate('EventList')}
          style={styles.bottomTab}
        >
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation?.navigate('PetList')}
          style={styles.bottomTab}
        >
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>pets</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
  },
  header: {
    width: '100%',
    height: 70,
    backgroundColor: '#d4d4d4',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#737373',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'monospace',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 16,
  },
  petCard: {
    width: '100%',
    backgroundColor: '#d4d4d4',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petThumb: {
    width: 60,
    height: 60,
    backgroundColor: '#737373',
    borderRadius: 4,
    marginRight: 16,
  },
  petName: {
    fontSize: 17,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#000000',
  },
  petSpecies: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#404040',
    marginTop: 4,
  },
  moreButtonWrapper: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  moreButton: {
    backgroundColor: '#15803d',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  moreButtonText: {
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 19,
    fontFamily: 'monospace',
    color: '#000000',
    marginBottom: 14,
  },
  eventRow: {
    width: '100%',
    backgroundColor: '#d4d4d4',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  eventPet: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#000000',
    width: '25%',
  },
  eventDesc: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#171717',
    flex: 1,
    textAlign: 'center',
  },
  eventDate: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#404040',
    width: '25%',
    textAlign: 'right',
  },
  addEventWrapper: {
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 24,
  },
  addEventButton: {
    backgroundColor: '#15803d',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addEventButtonText: {
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomBar: {
    width: '100%',
    height: 75,
    backgroundColor: '#d4d4d4',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomTab: {
    alignItems: 'center',
  },
  tabIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#737373',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#171717',
  },
});
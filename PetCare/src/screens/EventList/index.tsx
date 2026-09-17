import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function EventList({ navigation }: any) {
  const eventos = [
    { id: '1', pet: 'Pipoca', acao: 'tomar vermífugo', data: '20/06' },
    { id: '2', pet: 'Kadule', acao: 'comprimido de verme', data: '03/09' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Histórico de eventos:</Text>

        {eventos.map((item) => (
          <View key={item.id} style={styles.eventRow}>
            <Text style={styles.petName}>{item.pet}</Text>
            <Text style={styles.eventAction}>{item.acao}</Text>
            <Text style={styles.eventDate}>{item.data}</Text>
          </View>
        ))}

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('AddEvent')}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Adicionar evento</Text>
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
  title: {
    fontSize: 20,
    fontFamily: 'monospace',
    color: '#000000',
    marginBottom: 20,
  },
  eventRow: {
    width: '100%',
    backgroundColor: '#d4d4d4',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  petName: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#000000',
    width: '28%',
  },
  eventAction: {
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
  buttonWrapper: {
    alignItems: 'flex-start',
    marginTop: 12,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#15803d',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
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
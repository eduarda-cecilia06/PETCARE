import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegisterTutor } from '../screens/RegisterTutor';
import { Dashboard } from '../screens/Dashboard';
import { PetForm } from '../screens/PetForm';
import { PetList } from '../screens/PetList';
import { AddEvent } from '../screens/AddEvent';
import { EventList } from '../screens/EventList';

export default function AppTester() {
  const [currentScreen, setCurrentScreen] = useState('RegisterTutor');

  const fakeNavigation = {
    navigate: (screenName: string) => setCurrentScreen(screenName),
    goBack: () => setCurrentScreen('Dashboard'),
  };

  const screens = [
    { key: 'RegisterTutor', label: '1. Tutor' },
    { key: 'Dashboard', label: '2. Dashboard' },
    { key: 'PetForm', label: '3. Cadastrar Pet' },
    { key: 'PetList', label: '4. Ver Pets' },
    { key: 'EventList', label: '5. Histórico' },
    { key: 'AddEvent', label: '6. Novo Evento' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.menuBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.menuContent}>
          {screens.map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => setCurrentScreen(item.key)}
              style={[
                styles.menuButton,
                currentScreen === item.key && styles.menuButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.menuText,
                  currentScreen === item.key && styles.menuTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.screenContainer}>
        {currentScreen === 'RegisterTutor' && <RegisterTutor navigation={fakeNavigation} />}
        {currentScreen === 'Dashboard' && <Dashboard navigation={fakeNavigation} />}
        {currentScreen === 'PetForm' && <PetForm navigation={fakeNavigation} />}
        {currentScreen === 'PetList' && <PetList navigation={fakeNavigation} />}
        {currentScreen === 'EventList' && <EventList navigation={fakeNavigation} />}
        {currentScreen === 'AddEvent' && <AddEvent navigation={fakeNavigation} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  menuBar: {
    backgroundColor: '#1f2937',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  menuContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  menuButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  menuButtonActive: {
    backgroundColor: '#15803d',
  },
  menuText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  menuTextActive: {
    color: '#ffffff',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
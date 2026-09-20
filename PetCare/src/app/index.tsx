import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

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

  return (
    <View style={styles.container}>
      {currentScreen === 'RegisterTutor' && <RegisterTutor navigation={fakeNavigation} />}
      {currentScreen === 'Dashboard' && <Dashboard navigation={fakeNavigation} />}
      {currentScreen === 'PetForm' && <PetForm navigation={fakeNavigation} />}
      {currentScreen === 'PetList' && <PetList navigation={fakeNavigation} />}
      {currentScreen === 'EventList' && <EventList navigation={fakeNavigation} />}
      {currentScreen === 'AddEvent' && <AddEvent navigation={fakeNavigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
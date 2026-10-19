import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { Login } from '../screens/Login';
import { RegisterTutor } from '../screens/RegisterTutor';
import { TutorProfile } from '../screens/TutorProfile';
import { Dashboard } from '../screens/Dashboard';
import { PetForm } from '../screens/PetForm';
import { PetList } from '../screens/PetList';
import { AddEvent } from '../screens/AddEvent';
import { EventList } from '../screens/EventList';

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [params, setParams] = useState<any>({});

  const fakeNavigation = {
    navigate: (screenName: string, newParams?: any) => {
      setParams((prev: any) => ({ ...prev, ...newParams }));
      setCurrentScreen(screenName);
    },
    goBack: () => setCurrentScreen('Dashboard'),
  };

  const route = { params };

  return (
    <View style={styles.container}>
      {currentScreen === 'Login' && <Login navigation={fakeNavigation} />}
      {currentScreen === 'RegisterTutor' && <RegisterTutor navigation={fakeNavigation} />}
      {currentScreen === 'TutorProfile' && <TutorProfile navigation={fakeNavigation} route={route} />}
      {currentScreen === 'Dashboard' && <Dashboard navigation={fakeNavigation} route={route} />}
      {currentScreen === 'PetForm' && <PetForm navigation={fakeNavigation} route={route} />}
      {currentScreen === 'PetList' && <PetList navigation={fakeNavigation} route={route} />}
      {currentScreen === 'EventList' && <EventList navigation={fakeNavigation} route={route} />}
      {currentScreen === 'AddEvent' && <AddEvent navigation={fakeNavigation} route={route} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
import '@/global.css';

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { session } from '@/services/session';
import { colors } from '@/ui/theme';

export default function RootLayout() {
  // Token expirado/inválido (401) em qualquer tela ela volta para o login
  useEffect(() => {
    let avisando = false;
    session.setUnauthorizedHandler(() => {
      if (avisando) return;
      avisando = true;
      session.clear();
      router.replace('/');
      Alert.alert('Sessão expirada', 'Faça login novamente para continuar.', [{ text: 'OK', onPress: () => (avisando = false) }]);
    });
    return () => session.setUnauthorizedHandler(null);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'fade' }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

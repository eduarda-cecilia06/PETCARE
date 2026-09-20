import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function RegisterTutor({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Cadastre-se</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome completo:</Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder=""
            style={styles.pillInput}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder=""
            style={styles.pillInput}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha:</Text>
          <TextInput
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder=""
            style={styles.pillInput}
          />
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation?.navigate('Dashboard')}
          style={styles.mainButton}
        >
          <Text style={styles.buttonText}>Criar conta</Text>
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
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  formContainer: {
    width: '100%',
    marginTop: 30,
  },
  title: {
    fontSize: 26,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontFamily: 'monospace',
    fontSize: 15,
    color: '#262626',
    marginBottom: 8,
  },
  pillInput: {
    width: '100%',
    backgroundColor: '#d4d4d4',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 15,
    fontFamily: 'monospace',
    color: '#171717',
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainButton: {
    backgroundColor: '#15803d',
    width: '85%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});
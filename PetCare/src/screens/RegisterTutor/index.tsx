import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function RegisterTutor({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white justify-center px-8">
      <Text className="text-3xl font-bold text-center mb-10 text-neutral-900 font-mono">
        Cadastre-se
      </Text>

      <View className="space-y-4">
        <View>
          <Text className="text-base font-mono mb-2 text-neutral-800">
            Nome completo:
          </Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
            placeholderTextColor="#9ca3af"
            className="w-full bg-neutral-300 h-12 rounded-full px-5 text-neutral-900"
          />
        </View>

        <View>
          <Text className="text-base font-mono mb-2 text-neutral-800">
            Email:
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
            placeholderTextColor="#9ca3af"
            className="w-full bg-neutral-300 h-12 rounded-full px-5 text-neutral-900"
          />
        </View>

        <View>
          <Text className="text-base font-mono mb-2 text-neutral-800">
            Senha:
          </Text>
          <TextInput
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder="Digite sua senha"
            placeholderTextColor="#9ca3af"
            className="w-full bg-neutral-300 h-12 rounded-full px-5 text-neutral-900"
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation?.navigate('Dashboard')}
        className="bg-green-700 h-12 rounded-full justify-center items-center mt-12 shadow-sm active:bg-green-800"
      >
        <Text className="text-white text-base font-mono font-bold">
          Criar conta
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
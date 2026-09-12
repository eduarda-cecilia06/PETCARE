import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function PetForm({ navigation }: any) {
  const [nome, setNome] = useState('Pipoca');
  const [especie, setEspecie] = useState('xxx');
  const [raca, setRaca] = useState('xxx');
  const [dataNascimento, setDataNascimento] = useState('dd/mm/aaaa');
  const [idade, setIdade] = useState('00');

  return (
    <SafeAreaView className="flex-1 bg-white justify-between">
      <View className="w-full bg-neutral-300 h-20 px-6 flex-row justify-end items-center">
        <View className="w-12 h-12 rounded-full bg-neutral-500" />
      </View>

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-mono text-center text-neutral-900 mb-6">
          Seus pets
        </Text>

        <View className="w-full bg-neutral-300 rounded-lg p-6 mb-6">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity className="w-24 h-24 bg-neutral-500 rounded-sm justify-end p-1 mr-4">
              <Text className="text-[10px] font-mono text-neutral-200">
                mudar foto
              </Text>
            </TouchableOpacity>

            <View className="flex-1">
              <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Nome"
                className="bg-neutral-400 h-9 rounded-full px-4 text-neutral-900 font-mono text-sm"
              />
            </View>
          </View>

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-mono text-neutral-800">
                Espécie:
              </Text>
              <TextInput
                value={especie}
                onChangeText={setEspecie}
                className="w-32 bg-neutral-400 h-8 rounded-full px-4 text-neutral-900 font-mono text-xs text-center"
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-base font-mono text-neutral-800">
                Raça:
              </Text>
              <TextInput
                value={raca}
                onChangeText={setRaca}
                className="w-32 bg-neutral-400 h-8 rounded-full px-4 text-neutral-900 font-mono text-xs text-center"
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-mono text-neutral-800">
                Data de nascimento:
              </Text>
              <TextInput
                value={dataNascimento}
                onChangeText={setDataNascimento}
                className="w-32 bg-neutral-400 h-8 rounded-full px-4 text-neutral-900 font-mono text-xs text-center"
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-base font-mono text-neutral-800">
                Idade:
              </Text>
              <TextInput
                value={idade}
                onChangeText={setIdade}
                keyboardType="numeric"
                className="w-32 bg-neutral-400 h-8 rounded-full px-4 text-neutral-900 font-mono text-xs text-center"
              />
            </View>
          </View>

          <View className="items-center mt-6">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation?.goBack()}
              className="bg-green-700 px-6 py-2 rounded-full"
            >
              <Text className="text-white font-mono text-sm font-bold">
                salvar pet
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View className="w-full h-20 bg-neutral-300 flex-row justify-around items-center">
        <TouchableOpacity
          onPress={() => navigation?.navigate('EventList')}
          className="items-center"
        >
          <View className="w-10 h-10 rounded-full bg-neutral-500 mb-1" />
          <Text className="text-xs font-mono text-neutral-800">histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation?.navigate('Dashboard')}
          className="items-center"
        >
          <View className="w-10 h-10 rounded-full bg-neutral-500 mb-1" />
          <Text className="text-xs font-mono text-neutral-800">pets</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
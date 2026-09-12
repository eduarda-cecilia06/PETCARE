import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Dashboard({ navigation }: any) {
  const pets = [
    { id: '1', nome: 'Pipoca', especie: 'xxx' },
    { id: '2', nome: 'Kadule', especie: 'xxx' },
  ];

  const eventos = [
    { id: '1', pet: 'Pipoca', descricao: 'tomar vermífugo', data: '20/06' },
    { id: '2', pet: 'Kadule', descricao: 'comprimido de verme', data: '03/09' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="w-full bg-neutral-300 h-20 px-6 flex-row justify-end items-center">
        <View className="w-12 h-12 rounded-full bg-neutral-500" />
      </View>

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        {/* Seção: Seus Pets */}
        <Text className="text-2xl font-mono text-center text-neutral-900 mb-4">
          Seus pets
        </Text>

        {pets.map((pet) => (
          <TouchableOpacity
            key={pet.id}
            onPress={() => navigation?.navigate('PetForm')}
            className="w-full bg-neutral-300 rounded-lg p-4 flex-row items-center mb-3"
          >
            <View className="w-16 h-16 bg-neutral-500 rounded-sm mr-4" />
            <View>
              <Text className="text-lg font-mono font-bold text-neutral-900">
                {pet.nome}
              </Text>
              <Text className="text-sm font-mono text-neutral-700">
                espécie: {pet.especie}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View className="items-end mb-6">
          <TouchableOpacity
            onPress={() => navigation?.navigate('PetForm')}
            className="bg-green-700 px-4 py-1.5 rounded-md"
          >
            <Text className="text-white font-mono text-xs font-bold">
              ver mais
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-2xl font-mono text-neutral-900 mb-4">
          Próximos eventos:
        </Text>

        {eventos.map((evento) => (
          <View
            key={evento.id}
            className="w-full bg-neutral-300 rounded-lg p-3 flex-row items-center justify-between mb-3"
          >
            <Text className="text-base font-mono font-bold text-neutral-900 w-1/4">
              {evento.pet}
            </Text>
            <Text className="text-xs font-mono text-neutral-800 flex-1 text-center px-1">
              {evento.descricao}
            </Text>
            <Text className="text-xs font-mono text-neutral-700 w-1/4 text-right">
              {evento.data}
            </Text>
          </View>
        ))}

        <View className="items-start mt-2 mb-6">
          <TouchableOpacity
            onPress={() => navigation?.navigate('AddEvent')}
            className="bg-green-700 px-5 py-2 rounded-full"
          >
            <Text className="text-white font-mono text-xs font-bold">
              Adicionar evento
            </Text>
          </TouchableOpacity>
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
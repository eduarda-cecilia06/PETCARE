import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function EventList({ navigation }: any) {
  const [filtro, setFiltro] = useState('Todos');

  const eventos = [
    { id: '1', pet: 'Pipoca', tipo: 'tomar vermífugo', data: '20/06' },
    { id: '2', pet: 'Kadule', tipo: 'comprimido de verme', data: '03/09' },
    { id: '3', pet: 'Pipoca', tipo: 'vacina raiva', data: '15/10' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white justify-between">
      {/* Topo Cinza com Avatar */}
      <View className="w-full bg-neutral-300 h-20 px-6 flex-row justify-end items-center">
        <View className="w-12 h-12 rounded-full bg-neutral-500" />
      </View>

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-mono text-center text-neutral-900 mb-6 font-bold">
          Histórico de eventos:
        </Text>

        {eventos.map((item) => (
          <View
            key={item.id}
            className="w-full bg-neutral-300 rounded-md p-4 flex-row items-center justify-between mb-3"
          >
            <Text className="text-base font-mono font-bold text-neutral-900 w-1/4">
              {item.pet}
            </Text>
            <Text className="text-xs font-mono text-neutral-800 flex-1 text-center px-1">
              {item.tipo}
            </Text>
            <Text className="text-xs font-mono text-neutral-700 w-1/4 text-right">
              {item.data}
            </Text>
          </View>
        ))}

        <View className="items-center mt-6 mb-6">
          <TouchableOpacity
            onPress={() => navigation?.navigate('AddEvent')}
            className="bg-green-700 px-6 py-2.5 rounded-full"
          >
            <Text className="text-white font-mono text-xs font-bold">
              Adicionar evento
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className="w-full h-20 bg-neutral-300 flex-row justify-around items-center">
        <TouchableOpacity onPress={() => navigation?.navigate('EventList')} className="items-center">
          <View className="w-10 h-10 rounded-full bg-neutral-500 mb-1" />
          <Text className="text-xs font-mono text-neutral-800">histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('Dashboard')} className="items-center">
          <View className="w-10 h-10 rounded-full bg-neutral-500 mb-1" />
          <Text className="text-xs font-mono text-neutral-800">pets</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
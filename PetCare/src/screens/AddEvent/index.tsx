import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function AddEvent({ navigation }: any) {
  const [tipo, setTipo] = useState('Vacina');
  const [data, setData] = useState('');
  const [obs, setObs] = useState('');

  const tiposDisponiveis = ['Vacina', 'Consulta', 'Vermífugo', 'Medicamento', 'Exame'];

  return (
    <SafeAreaView className="flex-1 bg-white justify-between">
      {/* Topo Cinza */}
      <View className="w-full bg-neutral-300 h-20 px-6 flex-row justify-end items-center">
        <View className="w-12 h-12 rounded-full bg-neutral-500" />
      </View>

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-xl font-mono text-neutral-900 mb-6 font-bold">
          Adicionar novo evento:
        </Text>

        <Text className="text-base font-mono text-neutral-900 mb-2">Tipo:</Text>
        <View className="w-full bg-neutral-300 rounded-2xl p-4 mb-4">
          <Text className="font-mono text-neutral-900 font-bold mb-3">{tipo}</Text>
          <View className="bg-neutral-500 rounded-lg p-3 gap-1">
            {tiposDisponiveis.map((opcao) => (
              <TouchableOpacity key={opcao} onPress={() => setTipo(opcao)}>
                <Text className={`font-mono text-sm ${tipo === opcao ? 'text-white font-bold' : 'text-neutral-300'}`}>
                  {opcao}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text className="text-base font-mono text-neutral-900 mb-2">Data:</Text>
        <TextInput
          value={data}
          onChangeText={setData}
          placeholder="dd/mm/aaaa"
          placeholderTextColor="#666"
          className="w-full bg-neutral-300 h-12 rounded-full px-5 text-neutral-900 font-mono mb-4"
        />

        <Text className="text-base font-mono text-neutral-900 mb-2">Observações:</Text>
        <TextInput
          value={obs}
          onChangeText={setObs}
          placeholder="Adicione observações"
          placeholderTextColor="#666"
          multiline
          numberOfLines={3}
          className="w-full bg-neutral-300 h-20 rounded-2xl p-4 text-neutral-900 font-mono mb-6"
        />

        <View className="items-center mb-6">
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            className="bg-green-700 px-8 py-3 rounded-full"
          >
            <Text className="text-white font-mono text-sm font-bold">
              Criar evento
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
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Card, Button, Empty, Loading, ErrorBox, PetAvatar, Badge } from '@/ui/components';
import { colors } from '@/ui/theme';
import { useDados } from '@/services/useDados';
import { ESPECIE_LABEL, calcularIdade, normalizarEspecie } from '@/utils/format';

// Lista de pets (entrada para UC6 cadastrar, UC7 editar, UC8 excluir e UC10 galeria)
export function PetList() {
  const router = useRouter();
  const { pets, eventos, loading, erro, recarregar } = useDados();

  return (
    <Screen nav="pets" title="Meus Pets" subtitle={loading ? '' : `${pets.length} cadastrado(s)`} right={<Button label="+ Novo" small onPress={() => router.push('/pet-form')} />}>
      {erro ? <ErrorBox message={erro} onRetry={recarregar} /> : null}
      {loading ? (
        <Loading text="Carregando pets..." />
      ) : pets.length === 0 && !erro ? (
        <Empty emoji="🐶" title="Nenhum pet cadastrado" text="Cadastre seu primeiro companheiro para começar a registrar vacinas, consultas e gastos." action={<Button label="Cadastrar pet" onPress={() => router.push('/pet-form')} />} />
      ) : (
        pets.map((pet) => {
          const esp = normalizarEspecie(pet.especie);
          const qtd = eventos.filter((e) => e.pet_id === pet.id).length;
          const idade = calcularIdade(pet.data_nascimento);
          return (
            <Card key={pet.id} style={s.card} onPress={() => router.push({ pathname: '/pet-detail', params: { id: String(pet.id) } } as any)}>
              <PetAvatar pet={{ ...pet, especie: esp }} size={64} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={s.name}>{pet.nome}</Text>
                <Text style={s.sub}>{ESPECIE_LABEL[esp] || pet.especie}{pet.raca ? ` • ${pet.raca}` : ''}</Text>
                <Text style={s.sub}>{idade ? `${idade}` : 'Idade não informada'}{pet.peso ? ` • ${pet.peso} kg` : ''}</Text>
                <View style={{ marginTop: 6 }}>
                  <Badge label={`${qtd} evento${qtd === 1 ? '' : 's'}`} />
                </View>
              </View>
              <Text style={s.chev}>›</Text>
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '800', color: colors.text },
  sub: { fontSize: 12, color: colors.textSoft, marginTop: 2 },
  chev: { fontSize: 28, color: colors.muted, marginLeft: 6 },
});

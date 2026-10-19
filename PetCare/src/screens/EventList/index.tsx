import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiFetch } from '../../services/api';

export function EventList({ route, navigation }: any) {
  const token = route?.params?.token;
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');

  const filtros = ['Todos', 'Vacina', 'Consulta', 'Medicamento', 'Exame'];

  useEffect(() => {
    carregarEventos();
  }, []);

  async function carregarEventos() {
    setLoading(true);
    try {
      // aqui ele vai  buscar os pet cadastrados do usuário 
      const pets = await apiFetch('/api/pets', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!Array.isArray(pets)) {
        setEventos([]);
        return;
      }

      // pra cada pet, busca seus eventos e adiciona o nome do pet no objeto
      let todosEventos: any[] = [];
      for (const pet of pets) {
        try {
          const eventosPet = await apiFetch(`/api/pets/${pet.id}/eventos`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (Array.isArray(eventosPet)) {
            const formatados = eventosPet.map((ev: any) => ({
              ...ev,
              petName: pet.nome,
            }));
            todosEventos = [...todosEventos, ...formatados];
          }
        } catch (err) {
          // err é interressante, ele ignora de eventos de pet que falharam, mas funciona os outros
        }
      }
      
      const hoje = new Date().setHours(0,0,0,0);
      
      todosEventos.sort((a, b) => {
        const dataA = new Date(a.data).getTime();
        const dataB = new Date(b.data).getTime();
        return Math.abs(dataA - hoje) - Math.abs(dataB - hoje);
      });
      
      setEventos(todosEventos);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível carregar os eventos.');
    } finally {
      setLoading(false);
    }
  }

  // aqui ele filtra os eventos com base no chip ativo
  const eventosFiltrados = eventos.filter((item) => {
    if (filtroAtivo === 'Todos') return true;
    return item.tipo?.toLowerCase() === filtroAtivo.toLowerCase();
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={() => navigation?.navigate('Dashboard', { token })} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de Cuidados</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topActionRow}>
          <View>
            <Text style={styles.title}>Registros de Eventos</Text>
            <Text style={styles.subtitle}>{eventosFiltrados.length} evento(s) encontrado(s)</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('AddEvent', { token })}
            style={styles.addButtonHeader}
          >
            <Text style={styles.addButtonHeaderText}>+ Evento</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {filtros.map((filtro) => (
            <TouchableOpacity
              key={filtro}
              onPress={() => setFiltroAtivo(filtro)}
              style={[styles.filterChip, filtroAtivo === filtro && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, filtroAtivo === filtro && styles.filterChipTextActive]}>
                {filtro}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 40 }} />
        ) : eventosFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhum evento registrado</Text>
            <Text style={styles.emptySubtitle}>
              Toque no botão "+ Evento" para adicionar consultas, vacinas, exames e medicamentos.
            </Text>
          </View>
        ) : (
          eventosFiltrados.map((item) => (
            <View key={item.id} style={styles.eventCard}>
              <View style={styles.eventInfo}>
                <View style={styles.eventHeaderRow}>
                  <Text style={styles.petName}>{item.petName || 'Pet'}</Text>
                  <Text style={styles.eventDate}>
                    {item.data ? new Date(item.data).toLocaleDateString('pt-BR') : ''}
                  </Text>
                </View>
                <Text style={styles.eventTitle}>{item.nome || ''}</Text>
                {Boolean(item.custo) && (
                  <Text style={styles.eventCost}>Valor: R$ {Number(item.custo).toFixed(2)}</Text>
                )}
              </View>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{item.tipo || 'Geral'}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation?.navigate('Dashboard', { token })} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('PetList', { token })} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>Pets</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('EventList', { token })} style={styles.bottomTab}>
          <View style={[styles.tabIconCircle, styles.tabIconActive]} />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('TutorProfile', { token })} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerNav: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    paddingVertical: 6,
  },
  backButtonText: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  topActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  addButtonHeader: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  addButtonHeaderText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  filterScroll: {
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  filterChipText: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  eventInfo: {
    flex: 1,
    marginRight: 12,
  },
  eventHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  petName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#16a34a',
    fontFamily: 'monospace',
  },
  eventDate: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  eventCost: {
    fontSize: 12,
    color: '#334155',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  typeBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  bottomBar: {
    width: '100%',
    height: 70,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  bottomTab: {
    alignItems: 'center',
  },
  tabIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#cbd5e1',
    marginBottom: 4,
  },
  tabIconActive: {
    backgroundColor: '#22c55e',
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#64748b',
  },
  tabLabelActive: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
});

export default EventList;
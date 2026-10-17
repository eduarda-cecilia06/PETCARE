import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function EventList({ navigation }: any) {
  const [eventos, setEventos] = useState<any[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');

  const filtros = ['Todos', 'Vacina', 'Consulta', 'Medicamento', 'Exame'];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={() => navigation?.navigate('Dashboard')} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de Cuidados</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topActionRow}>
          <View>
            <Text style={styles.title}>Registros e Eventos</Text>
            <Text style={styles.subtitle}>{eventos.length} lançamentos registrados</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('AddEvent')}
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

        {eventos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhum evento registrado</Text>
            <Text style={styles.emptySubtitle}>
              Toque no botão "+ Evento" para adicionar consultas, vacinas, exames e medicamentos.
            </Text>
          </View>
        ) : (
          eventos.map((item) => (
            <View key={item.id} style={styles.eventCard}>
              <View style={styles.eventInfo}>
                <View style={styles.eventHeaderRow}>
                  <Text style={styles.petName}>{item.petName || 'Pet'}</Text>
                  <Text style={styles.eventDate}>{item.data || ''}</Text>
                </View>
                <Text style={styles.eventTitle}>{item.nome || ''}</Text>
                {Boolean(item.custo) && (
                  <Text style={styles.eventCost}>Valor: R$ {item.custo}</Text>
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
        <TouchableOpacity onPress={() => navigation?.navigate('Dashboard')} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('PetList')} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>Pets</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('EventList')} style={styles.bottomTab}>
          <View style={[styles.tabIconCircle, styles.tabIconActive]} />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('TutorProfile')} style={styles.bottomTab}>
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
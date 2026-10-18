import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiFetch } from '../../services/api';

export function Dashboard({ route, navigation }: any) {
  const token = route?.params?.token;
  const [totalPets, setTotalPets] = useState(0);
  const [totalEventos, setTotalEventos] = useState(0);
  const [totalGastos, setTotalGastos] = useState('0.00');

  useEffect(() => {
    carregarDadosPainel();
  }, []);

  function carregarDadosPainel() {
    // vai buscar os pets do usuário logado
    apiFetch('/api/pets', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (pets) => {
        setTotalPets(pets.length || 0);

        // isso aqui é opcional, se quiser puxar eventos de cada pet para somar custos e total
        let eventosTotais = 0;
        let gastosTotais = 0;

        for (const pet of pets) {
          try {
            const eventos = await apiFetch(`/api/pets/${pet.id}/eventos`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (Array.isArray(eventos)) {
              eventosTotais += eventos.length;
              eventos.forEach((ev: any) => {
                if (ev.custo) {
                  gastosTotais += parseFloat(ev.custo);
                }
              });
            }
          } catch (e) {
            // Ignora falhas pontuais de eventos por pet
          }
        }

        setTotalEventos(eventosTotais);
        setTotalGastos(gastosTotais.toFixed(2));
      })
      .catch((error) => {
        Alert.alert('Aviso', 'Não foi possível sincronizar os dados do painel.');
      });
  }

  function handleGerarRelatorio() {
    Alert.alert('Relatório PDF', 'Relatório de saúde e despesas gerado com sucesso!');
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerNav}>
        <View>
          <Text style={styles.welcomeText}>Olá, Tutor(a)</Text>
          <Text style={styles.headerTitle}>Painel Principal</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation?.navigate('TutorProfile', { token })}
          style={styles.profileButton}
        >
          <Text style={styles.profileButtonText}>Perfil</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.metricsRow}>
          <TouchableOpacity 
            style={styles.metricCard}
            onPress={() => navigation?.navigate('PetList', { token })}
          >
            <Text style={styles.metricNumber}>{totalPets}</Text>
            <Text style={styles.metricLabel}>Pets Cadastrados</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.metricCard}
            onPress={() => navigation?.navigate('EventList', { token })}
          >
            <Text style={styles.metricNumber}>{totalEventos}</Text>
            <Text style={styles.metricLabel}>Eventos / Cuidados</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.financialCard}>
          <Text style={styles.financialTitle}>Despesas Totais (Mês)</Text>
          <Text style={styles.financialValue}>R$ {totalGastos}</Text>
          <TouchableOpacity onPress={handleGerarRelatorio} style={styles.pdfButton}>
            <Text style={styles.pdfButtonText}>📄 Exportar Relatório em PDF</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation?.navigate('PetForm', { token })}
          >
            <Text style={styles.actionCardTitle}>+ Cadastrar Pet</Text>
            <Text style={styles.actionCardDesc}>Adicione um novo companheiro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation?.navigate('AddEvent', { token })}
          >
            <Text style={styles.actionCardTitle}>+ Novo Evento</Text>
            <Text style={styles.actionCardDesc}>Registe vacinas, consultas ou gastos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomTab}>
          <View style={[styles.tabIconCircle, styles.tabIconActive]} />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('PetList', { token })} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>Pets</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('EventList', { token })} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>Histórico</Text>
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
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerNav: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  welcomeText: { fontSize: 12, color: '#64748b', fontFamily: 'monospace' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace' },
  profileButton: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  profileButtonText: { fontSize: 12, fontWeight: 'bold', color: '#334155', fontFamily: 'monospace' },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 20 },
  metricsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  metricCard: { flex: 1, backgroundColor: '#ffffff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  metricNumber: { fontSize: 24, fontWeight: 'bold', color: '#16a34a', fontFamily: 'monospace', marginBottom: 4 },
  metricLabel: { fontSize: 11, color: '#64748b', fontFamily: 'monospace', textAlign: 'center' },
  financialCard: { backgroundColor: '#ffffff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 24 },
  financialTitle: { fontSize: 12, color: '#64748b', fontFamily: 'monospace', marginBottom: 4 },
  financialValue: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace', marginBottom: 16 },
  pdfButton: { backgroundColor: '#f0fdf4', paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#86efac' },
  pdfButtonText: { fontSize: 12, fontWeight: 'bold', color: '#16a34a', fontFamily: 'monospace' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace', marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', gap: 12 },
  actionCard: { flex: 1, backgroundColor: '#ffffff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  actionCardTitle: { fontSize: 14, fontWeight: 'bold', color: '#16a34a', fontFamily: 'monospace', marginBottom: 4 },
  actionCardDesc: { fontSize: 11, color: '#64748b', fontFamily: 'monospace' },
  bottomBar: { width: '100%', height: 70, backgroundColor: '#ffffff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  bottomTab: { alignItems: 'center' },
  tabIconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#cbd5e1', marginBottom: 4 },
  tabIconActive: { backgroundColor: '#22c55e' },
  tabLabel: { fontSize: 11, fontFamily: 'monospace', color: '#64748b' },
  tabLabelActive: { color: '#16a34a', fontWeight: 'bold' },
});

export default Dashboard;
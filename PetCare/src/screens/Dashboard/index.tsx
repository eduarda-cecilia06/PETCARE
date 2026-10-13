import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Dashboard({ navigation }: any) {
  const [pets, setPets] = useState([
    { id: '1', nome: 'Pipoca', especie: 'Cachorro', raca: 'Golden Retriever', status: 'Saudável' },
    { id: '2', nome: 'Luna', especie: 'Gato', raca: 'Siamês', status: 'Vacina em breve' },
  ]);

  const [eventos, setEventos] = useState([
    { id: '1', pet: 'Pipoca', descricao: 'Vacina V10 Anual', data: 'Amanhã às 14:00', tipo: 'Urgente' },
    { id: '2', pet: 'Luna', descricao: 'Consulta Veterinária', data: 'Quinta-feira, 10:30', tipo: 'Check-up' },
  ]);

  function handleGerarPDF() {
    Alert.alert(
      'Gerar Relatório PDF',
      'Deseja exportar o histórico médico completo dos seus pets em PDF para o veterinário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Gerar e Compartilhar',
          onPress: () => Alert.alert('Sucesso', 'Relatório PDF gerado com sucesso!'),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingTitle}>Olá, Tutor(a)</Text>
          <Text style={styles.greetingSubtitle}>Acompanhe a saúde dos seus companheiros</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation?.navigate('TutorProfile')}
          style={styles.avatarButton}
        >
          <Text style={styles.avatarText}>TU</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meus Pets</Text>
          <TouchableOpacity onPress={() => navigation?.navigate('PetList')}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              activeOpacity={0.8}
              onPress={() => navigation?.navigate('PetForm')}
              style={styles.petCardHorizontal}
            >
              <View style={styles.petAvatarLarge}>
                <Text style={styles.petAvatarText}>{pet.nome.substring(0, 2).toUpperCase()}</Text>
              </View>
              <Text style={styles.petCardName}>{pet.nome}</Text>
              <Text style={styles.petCardBreed}>{pet.raca}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{pet.status}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('PetForm')}
            style={styles.addPetCardHorizontal}
          >
            <View style={styles.addPetIconCircle}>
              <Text style={styles.addPetIconText}>+</Text>
            </View>
            <Text style={styles.addPetCardText}>Novo Pet</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos Eventos</Text>
          <TouchableOpacity onPress={() => navigation?.navigate('AddEvent')}>
            <Text style={styles.seeAllText}>+ Adicionar</Text>
          </TouchableOpacity>
        </View>

        {eventos.map((evento) => (
          <View key={evento.id} style={styles.eventCard}>
            <View style={styles.eventInfo}>
              <Text style={styles.eventPetName}>{evento.pet}</Text>
              <Text style={styles.eventDesc}>{evento.descricao}</Text>
              <Text style={styles.eventDate}>{evento.data}</Text>
            </View>
            <View style={[styles.typeBadge, evento.tipo === 'Urgente' ? styles.badgeRed : styles.badgeGreen]}>
              <Text style={[styles.typeBadgeText, evento.tipo === 'Urgente' ? styles.badgeTextRed : styles.badgeTextGreen]}>
                {evento.tipo}
              </Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleGerarPDF}
          style={styles.pdfBanner}
        >
          <View style={styles.pdfBannerTextContainer}>
            <Text style={styles.pdfBannerTitle}>Relatório em PDF</Text>
            <Text style={styles.pdfBannerSubtitle}>Gerar histórico médico para o veterinário</Text>
          </View>
          <View style={styles.pdfButtonIcon}>
            <Text style={styles.pdfButtonIconText}>PDF</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation?.navigate('Dashboard')} style={styles.bottomTab}>
          <View style={[styles.tabIconCircle, styles.tabIconActive]} />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('PetList')} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>Pets</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('EventList')} style={styles.bottomTab}>
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>Histórico</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  greetingSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a34a',
    fontFamily: 'monospace',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  seeAllText: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  petCardHorizontal: {
    width: 140,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  petAvatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  petAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#475569',
    fontFamily: 'monospace',
  },
  petCardName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  petCardBreed: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    color: '#16a34a',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  addPetCardHorizontal: {
    width: 110,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
  },
  addPetIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  addPetIconText: {
    fontSize: 20,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  addPetCardText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    fontFamily: 'monospace',
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  eventInfo: {
    flex: 1,
  },
  eventPetName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  eventDesc: {
    fontSize: 12,
    color: '#334155',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  eventDate: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeRed: {
    backgroundColor: '#fef2f2',
  },
  badgeGreen: {
    backgroundColor: '#f0fdf4',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  badgeTextRed: {
    color: '#dc2626',
  },
  badgeTextGreen: {
    color: '#16a34a',
  },
  pdfBanner: {
    backgroundColor: '#16a34a',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
  },
  pdfBannerTextContainer: {
    flex: 1,
  },
  pdfBannerTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  pdfBannerSubtitle: {
    color: '#dcfce7',
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  pdfButtonIcon: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pdfButtonIconText: {
    color: '#16a34a',
    fontSize: 12,
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
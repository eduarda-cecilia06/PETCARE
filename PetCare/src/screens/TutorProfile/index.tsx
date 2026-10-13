import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function TutorProfile({ navigation }: any) {
  const [nome, setNome] = useState('Mariana Silva');
  const [email, setEmail] = useState('mariana.silva@exemplo.com');
  const [telefone, setTelefone] = useState('(11) 98765-4321');

  function handleSalvar() {
    Alert.alert('Sucesso', 'Dados do perfil atualizados com sucesso!');
  }

  function handleExcluirConta() {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza de que deseja excluir sua conta? Esta ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => navigation?.navigate('Login'),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil do Tutor</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>MS</Text>
          </View>
          <Text style={styles.tutorName}>{nome}</Text>
          <Text style={styles.tutorBadge}>Tutora Cadastrada</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados Pessoais</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Digite seu nome"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Digite seu e-mail"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
              placeholder="Digite seu telefone"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSalvar}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>Zona de Perigo</Text>
          <Text style={styles.dangerDescription}>
            Ao excluir sua conta, todos os registros dos seus pets e históricos serão apagados permanentemente.
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleExcluirConta}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>Excluir Conta</Text>
          </TouchableOpacity>
        </View>
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
          <View style={styles.tabIconCircle} />
          <Text style={styles.tabLabel}>Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('TutorProfile')} style={styles.bottomTab}>
          <View style={[styles.tabIconCircle, styles.tabIconActive]} />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Perfil</Text>
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
    fontFamily: 'monospace',
    fontWeight: 'bold',
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#16a34a',
    fontFamily: 'monospace',
  },
  tutorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  tutorBadge: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 6,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  input: {
    width: '100%',
    backgroundColor: '#f8fafc',
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontFamily: 'monospace',
  },
  saveButton: {
    backgroundColor: '#22c55e',
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  dangerCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  dangerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  dangerDescription: {
    fontSize: 12,
    color: '#991b1b',
    fontFamily: 'monospace',
    marginBottom: 16,
    lineHeight: 18,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
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
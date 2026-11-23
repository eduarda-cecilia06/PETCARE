import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Field, Button } from '@/ui/components';
import { api } from '@/services/api';

export function RegisterTutor() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  async function cadastrar() {
    if (!nome.trim() || !email.trim() || !senha) return Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return Alert.alert('Atenção', 'Informe um e-mail válido.');
    if (senha.length < 6) return Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
    if (senha !== confirmar) return Alert.alert('Atenção', 'As senhas não coincidem.');

    setLoading(true);
    try {
      await api.post('/api/usuarios', { nome: nome.trim(), email: email.trim(), senha });
      Alert.alert('Conta criada! 🎉', 'Agora é só entrar com seu e-mail e senha.', [{ text: 'Entrar', onPress: () => router.replace('/') }]);
    } catch (e: any) {
      Alert.alert('Erro no cadastro', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen title="Criar conta" back>
      <Field label="Nome completo *" value={nome} onChangeText={setNome} placeholder="Como você se chama?" />
      <Field label="E-mail *" value={email} onChangeText={setEmail} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
      <Field label="Senha *" value={senha} onChangeText={setSenha} placeholder="Mínimo 6 caracteres" secureTextEntry autoCapitalize="none" />
      <Field label="Confirmar senha *" value={confirmar} onChangeText={setConfirmar} placeholder="Repita a senha" secureTextEntry autoCapitalize="none" />
      <Button label="Criar conta" onPress={cadastrar} loading={loading} style={{ marginTop: 8 }} />
    </Screen>
  );
}

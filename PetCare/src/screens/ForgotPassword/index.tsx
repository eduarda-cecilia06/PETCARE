import React, { useState } from 'react';
import { Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Field, Button, Card } from '@/ui/components';
import { api, endpointIndisponivel } from '@/services/api';
import { colors } from '@/ui/theme';

// UC5: Recuperar Senha
export function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nova, setNova] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  async function redefinir() {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return Alert.alert('Atenção', 'Informe o e-mail da sua conta.');
    if (nova.length < 6) return Alert.alert('Atenção', 'A nova senha deve ter pelo menos 6 caracteres.');
    if (nova !== confirmar) return Alert.alert('Atenção', 'As senhas não coincidem.');

    setLoading(true);
    try {
      await api.post('/api/usuarios/recuperar-senha', { email: email.trim(), nova_senha: nova });
      Alert.alert('Senha redefinida', 'Entre com a sua nova senha.', [{ text: 'OK', onPress: () => router.replace('/') }]);
    } catch (e: any) {
      Alert.alert('Não foi possível redefinir', endpointIndisponivel(e) ? 'O servidor ainda não tem o endpoint /api/usuarios/recuperar-senha.' : e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen title="Recuperar senha" back>
      <Card style={{ backgroundColor: colors.infoSoft, borderColor: '#bfdbfe' }}>
        <Text style={{ color: '#1e3a8a', fontSize: 13, lineHeight: 19 }}>Informe o e-mail cadastrado e escolha uma nova senha para voltar a acessar seus pets.</Text>
      </Card>
      <Field label="E-mail" value={email} onChangeText={setEmail} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
      <Field label="Nova senha" value={nova} onChangeText={setNova} placeholder="Mínimo 6 caracteres" secureTextEntry autoCapitalize="none" />
      <Field label="Confirmar nova senha" value={confirmar} onChangeText={setConfirmar} placeholder="Repita a senha" secureTextEntry autoCapitalize="none" />
      <Button label="Redefinir senha" onPress={redefinir} loading={loading} style={{ marginTop: 8 }} />
    </Screen>
  );
}

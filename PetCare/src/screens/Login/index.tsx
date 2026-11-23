import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Field, Button } from '@/ui/components';
import { colors } from '@/ui/theme';
import { api } from '@/services/api';
import { session } from '@/services/session';

export function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [ver, setVer] = useState(false);
  const [loading, setLoading] = useState(false);

  async function entrar() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha.');
      return;
    }
    setLoading(true);
    try {
      const data = await api.post('/api/usuarios/login', { email: email.trim(), senha });
      session.setToken(data.access_token);
      try {
        session.setUsuario(await api.get('/api/usuarios/me'));
      } catch {}
      router.replace('/dashboard');
    } catch (e: any) {
      Alert.alert('Erro ao entrar', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen center>
      <View style={s.hero}>
        <View style={s.logo}>
          <Text style={{ fontSize: 44 }}>🐾</Text>
        </View>
        <Text style={s.brand}>PetCare</Text>
        <Text style={s.title}>Bem-vindo de volta!</Text>
        <Text style={s.subtitle}>Acompanhe a saúde e a rotina dos seus pets</Text>
      </View>

      <Field label="E-mail" value={email} onChangeText={setEmail} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
      <Field label="Senha" value={senha} onChangeText={setSenha} placeholder="••••••••" secureTextEntry={!ver} autoCapitalize="none" onSubmitEditing={entrar} />

      <View style={s.row}>
        <Pressable onPress={() => setVer(!ver)}>
          <Text style={s.link}>{ver ? 'Ocultar senha' : 'Mostrar senha'}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/forgot-password')}>
          <Text style={s.link}>Esqueceu a senha?</Text>
        </Pressable>
      </View>

      <Button label="Entrar" onPress={entrar} loading={loading} style={{ marginTop: 18 }} />

      <View style={s.footer}>
        <Text style={s.footerTxt}>Não tem uma conta? </Text>
        <Pressable onPress={() => router.push('/register')}>
          <Text style={[s.link, { fontWeight: '800' }]}>Cadastre-se</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: 'center', marginBottom: 28 },
  logo: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.primaryBorder },
  brand: { marginTop: 10, fontSize: 30, fontWeight: '800', color: colors.primaryDark },
  title: { marginTop: 14, fontSize: 20, fontWeight: '700', color: colors.text },
  subtitle: { marginTop: 4, fontSize: 13, color: colors.textSoft, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  link: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 26 },
  footerTxt: { color: colors.textSoft, fontSize: 13 },
});

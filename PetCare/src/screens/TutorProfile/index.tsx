import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Card, Field, Button, Loading, SectionTitle } from '@/ui/components';
import { colors } from '@/ui/theme';
import { api, endpointIndisponivel } from '@/services/api';
import { session } from '@/services/session';
import { cancelarTodos } from '@/services/notifications';


export function TutorProfile() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    api
      .get('/api/usuarios/me')
      .then((u) => {
        setNome(u.nome);
        setEmail(u.email);
        session.setUsuario(u);
      })
      .catch((e) => Alert.alert('Erro', e.message))
      .finally(() => setLoading(false));
  }, []);

  async function salvar() {
    if (!nome.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) return Alert.alert('Atenção', 'Informe um nome e um e-mail válidos.');
    setSalvando(true);
    try {
      const u = await api.put('/api/usuarios/me', { nome: nome.trim(), email: email.trim() });
      // o e-mail faz parte do token: se mudou, o servidor devolve um token novo
      if (u?.access_token) session.setToken(u.access_token);
      session.setUsuario({ nome: u?.nome ?? nome.trim(), email: u?.email ?? email.trim() });
      Alert.alert('Pronto! ✅', 'Perfil atualizado com sucesso.');
    } catch (e: any) {
      Alert.alert('Erro ao salvar', endpointIndisponivel(e) ? 'O servidor ainda não tem o endpoint PUT /api/usuarios/me.' : e.message);
    } finally {
      setSalvando(false);
    }
  }

  function sair() {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        onPress: async () => {
          await cancelarTodos();
          session.clear();
          router.replace('/');
        },
      },
    ]);
  }

  function excluirConta() {
    Alert.alert('Excluir conta', 'Todos os seus pets, eventos e fotos serão apagados permanentemente. Deseja continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.del('/api/usuarios/me');
            await cancelarTodos();
            session.clear();
            Alert.alert('Conta excluída', 'Sentiremos sua falta!');
            router.replace('/');
          } catch (e: any) {
            Alert.alert('Erro ao excluir', endpointIndisponivel(e) ? 'O servidor ainda não tem o endpoint DELETE /api/usuarios/me.' : e.message);
          }
        },
      },
    ]);
  }

  const atalhos = [
    { e: '🔔', t: 'Notificações', p: '/notifications' },
    { e: '📄', t: 'Relatórios em PDF', p: '/reports' },
    { e: '💰', t: 'Gastos', p: '/expenses' },
  ];

  return (
    <Screen nav="profile" title="Meu perfil">
      {loading ? (
        <Loading />
      ) : (
        <>
          <View style={s.top}>
            <View style={s.avatar}>
              <Text style={s.initials}>{nome ? nome.trim().substring(0, 2).toUpperCase() : 'PC'}</Text>
            </View>
            <Text style={s.name}>{nome}</Text>
            <Text style={s.email}>{email}</Text>
          </View>

          <Card>
            <Text style={s.cardTitle}>Dados pessoais</Text>
            <Field label="Nome completo" value={nome} onChangeText={setNome} placeholder="Seu nome" />
            <Field label="E-mail" value={email} onChangeText={setEmail} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            <Button label="Salvar alterações" onPress={salvar} loading={salvando} />
          </Card>

          <SectionTitle>Atalhos</SectionTitle>
          <Card style={{ paddingVertical: 4 }}>
            {atalhos.map((a, i) => (
              <Pressable key={a.t} style={[s.link, i < atalhos.length - 1 && s.linkBorder]} onPress={() => router.push(a.p as any)}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>{a.e}</Text>
                <Text style={s.linkTxt}>{a.t}</Text>
                <Text style={s.chev}>›</Text>
              </Pressable>
            ))}
          </Card>

          <Button label="Sair da conta" variant="outline" onPress={sair} style={{ marginBottom: 14 }} />

          <Card style={{ backgroundColor: colors.dangerSoft, borderColor: colors.dangerBorder }}>
            <Text style={s.dangerTitle}>Zona de perigo</Text>
            <Text style={s.dangerTxt}>Ao excluir sua conta, todos os registros dos seus pets e históricos serão apagados permanentemente.</Text>
            <Button label="Excluir conta" variant="danger" onPress={excluirConta} />
          </Card>
        </>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  top: { alignItems: 'center', marginBottom: 18 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.primarySoft, borderWidth: 2, borderColor: colors.primaryBorder, alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 30, fontWeight: '800', color: colors.primaryDark },
  name: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 10 },
  email: { fontSize: 13, color: colors.textSoft, marginTop: 2 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 14 },
  link: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  linkBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  linkTxt: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  chev: { fontSize: 24, color: colors.muted },
  dangerTitle: { fontSize: 15, fontWeight: '800', color: colors.danger, marginBottom: 6 },
  dangerTxt: { fontSize: 12, color: '#991b1b', lineHeight: 18, marginBottom: 14 },
});

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CHAVE = 'petcare:notificacoes';

export type ConfigNotificacao = { ativas: boolean; antecedenciaDias: number };
const PADRAO: ConfigNotificacao = { ativas: true, antecedenciaDias: 1 };

try {
  Notifications.setNotificationHandler({
    handleNotification: async () =>
      ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }) as any,
  });
} catch {

}

export async function lerConfig(): Promise<ConfigNotificacao> {
  try {
    const raw = await AsyncStorage.getItem(CHAVE);
    return raw ? { ...PADRAO, ...JSON.parse(raw) } : PADRAO;
  } catch {
    return PADRAO;
  }
}

export async function salvarConfig(c: ConfigNotificacao) {
  try {
    await AsyncStorage.setItem(CHAVE, JSON.stringify(c));
  } catch {}
}

export async function pedirPermissao(): Promise<boolean> {
  try {
    if (Platform.OS === 'web') return false;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Lembretes PetCare',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const atual = await Notifications.getPermissionsAsync();
    if (atual.granted) return true;
    const pedido = await Notifications.requestPermissionsAsync();
    return pedido.granted;
  } catch {
    return false;
  }
}

function gatilho(date: Date): any {
  const tipo = (Notifications as any).SchedulableTriggerInputTypes;
  return tipo ? { type: tipo.DATE, date } : date;
}

/* Notificação imediata (em ~2s) só para testar. */
export async function notificacaoTeste() {
  const ok = await pedirPermissao();
  if (!ok) return false;
  await Notifications.scheduleNotificationAsync({
    content: { title: 'PetCare 🐾', body: 'Tudo certo! Os lembretes estão funcionando.' },
    trigger: gatilho(new Date(Date.now() + 2000)),
  });
  return true;
}

/* Agenda um lembrete para um evento (data/hora futura). Retorna a data agendada ou null. */
export async function agendarLembrete(ev: { id: number; titulo: string; petNome?: string; quando: Date }) {
  const cfg = await lerConfig();
  if (!cfg.ativas) return null;
  const ok = await pedirPermissao();
  if (!ok) return null;

  const disparo = new Date(ev.quando);
  disparo.setDate(disparo.getDate() - cfg.antecedenciaDias);
  disparo.setHours(9, 0, 0, 0);
  if (disparo.getTime() <= Date.now()) disparo.setTime(Date.now() + 60 * 1000); // se já passou, avisa em 1 min

  const identifier = `evento-${ev.id}`;
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch {}
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: {
      title: `Lembrete: ${ev.titulo}`,
      body: `${ev.petNome ? ev.petNome + ' — ' : ''}${ev.quando.toLocaleDateString('pt-BR')}`,
    },
    trigger: gatilho(disparo),
  });
  return disparo;
}

export async function cancelarLembrete(eventoId: number) {
  try {
    await Notifications.cancelScheduledNotificationAsync(`evento-${eventoId}`);
  } catch {}
}

export async function cancelarTodos() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}
}

/* aqui tá salvando marcado como lida e tal */
const CHAVE_LIDAS = 'petcare:lidas';
export async function lerLidas(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(CHAVE_LIDAS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
export async function marcarLida(id: string) {
  const l = await lerLidas();
  if (!l.includes(id)) await AsyncStorage.setItem(CHAVE_LIDAS, JSON.stringify([...l, id]));
}

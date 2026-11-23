// Sessão do tutor logado (token JWT em memória). Fica fora do React para o api.ts poder ler.
type Listener = () => void;

let token: string | null = null;
let usuario: { id?: number; nome: string; email: string } | null = null;
let onUnauthorized: (() => void) | null = null;
const listeners = new Set<Listener>();

export const session = {
  getToken: () => token,
  getUsuario: () => usuario,
  setToken(t: string | null) {
    token = t;
    listeners.forEach((l) => l());
  },
  setUsuario(u: typeof usuario) {
    usuario = u;
    listeners.forEach((l) => l());
  },
  clear() {
    token = null;
    usuario = null;
    listeners.forEach((l) => l());
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  setUnauthorizedHandler(fn: (() => void) | null) {
    onUnauthorized = fn;
  },
  notifyUnauthorized() {
    onUnauthorized?.();
  },
};

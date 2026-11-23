import { session } from './session';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.66.88.157:8000';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/*true quando o endpoint ainda não existe no back-end (404/405) */
export function endpointIndisponivel(e: unknown) {
  return e instanceof ApiError && (e.status === 404 || e.status === 405) && /not found|method not allowed/i.test(e.message);
}

function mensagemDeErro(data: any, status: number) {
  const d = data?.detail ?? data?.message;
  if (typeof d === 'string') return d;
  if (Array.isArray(d)) {
    // erro de validação do FastAPI (422)
    return d.map((x: any) => `${(x.loc || []).slice(1).join('.') || 'campo'}: ${x.msg}`).join('\n');
  }
  if (status === 401) return 'Sessão expirada. Entre novamente.';
  return 'Erro ao comunicar com o servidor.';
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const { headers, ...rest } = options;
  const token = session.getToken();
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers as Record<string, string> | undefined),
      },
    });
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique se o back-end está rodando e se o IP em src/services/api.ts está correto.',
      0
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && token && !endpoint.includes('/login')) {
      session.notifyUnauthorized();
    }
    throw new ApiError(mensagemDeErro(data, response.status), response.status);
  }

  return data;
}

export const api = {
  get: (url: string) => apiFetch(url, { method: 'GET' }),
  post: (url: string, body?: unknown) => apiFetch(url, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  put: (url: string, body?: unknown) => apiFetch(url, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  patch: (url: string, body?: unknown) => apiFetch(url, { method: 'PATCH', body: JSON.stringify(body ?? {}) }),
  del: (url: string) => apiFetch(url, { method: 'DELETE' }),
};

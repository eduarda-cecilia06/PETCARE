export const API_BASE_URL = 'http://192.168.255.104:8000';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.detail || data?.message || 'Erro ao comunicar com o servidor.';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Falha de conexão com a API.');
  }
}
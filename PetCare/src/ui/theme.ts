// Paleta e medidas do PetCare — um único lugar para customizar o visual do app.
export const colors = {
  primary: '#16a34a',
  primaryDark: '#15803d',
  primarySoft: '#dcfce7',
  primaryBorder: '#86efac',
  bg: '#f4f7f5',
  card: '#ffffff',
  text: '#0f172a',
  textSoft: '#475569',
  muted: '#94a3b8',
  border: '#e2e8f0',
  inputBg: '#f8fafc',
  danger: '#dc2626',
  dangerSoft: '#fef2f2',
  dangerBorder: '#fecaca',
  warning: '#d97706',
  warningSoft: '#fffbeb',
  info: '#2563eb',
  infoSoft: '#eff6ff',
};

export const radius = { sm: 10, md: 14, lg: 20, pill: 999 };

export const shadow = {
  shadowColor: '#0f172a',
  shadowOpacity: 0.06,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 8,
  elevation: 2,
};

// Cores por tipo de evento (enum TipoEvento do diagrama de classes)
export const tipoCor: Record<string, { bg: string; fg: string; emoji: string }> = {
  VACINA: { bg: '#dcfce7', fg: '#15803d', emoji: '💉' },
  CONSULTA: { bg: '#dbeafe', fg: '#1d4ed8', emoji: '🩺' },
  VERMIFUGO: { bg: '#fef3c7', fg: '#b45309', emoji: '🪱' },
  MEDICAMENTO: { bg: '#fce7f3', fg: '#be185d', emoji: '💊' },
  EXAME: { bg: '#ede9fe', fg: '#6d28d9', emoji: '🧪' },
  CIRURGIA: { bg: '#fee2e2', fg: '#b91c1c', emoji: '🏥' },
};

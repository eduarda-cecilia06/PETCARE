export const TIPOS_EVENTO = ['VACINA', 'CONSULTA', 'VERMIFUGO', 'MEDICAMENTO', 'EXAME', 'CIRURGIA'] as const;
export const ESPECIES_PET = ['CACHORRO', 'GATO', 'PASSARO', 'PEIXE', 'ROEDOR', 'REPTIL', 'OUTRO'] as const;

export const TIPO_LABEL: Record<string, string> = {
  VACINA: 'Vacina',
  CONSULTA: 'Consulta',
  VERMIFUGO: 'Vermífugo',
  MEDICAMENTO: 'Medicamento',
  EXAME: 'Exame',
  CIRURGIA: 'Cirurgia',
};

export const ESPECIE_LABEL: Record<string, string> = {
  CACHORRO: 'Cachorro',
  GATO: 'Gato',
  PASSARO: 'Pássaro',
  PEIXE: 'Peixe',
  ROEDOR: 'Roedor',
  REPTIL: 'Réptil',
  OUTRO: 'Outro',
};

export const ESPECIE_EMOJI: Record<string, string> = {
  CACHORRO: '🐶',
  GATO: '🐱',
  PASSARO: '🐦',
  PEIXE: '🐠',
  ROEDOR: '🐹',
  REPTIL: '🦎',
  OUTRO: '🐾',
};

/*Normaliza o que vier do servidor (ex.: "Cão", "vacina") para a chave do enum. */
export function normalizarTipo(t?: string | null): string {
  const x = (t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
  return (TIPOS_EVENTO as readonly string[]).includes(x) ? x : x || 'CONSULTA';
}

export function normalizarEspecie(e?: string | null): string {
  const x = (e || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
  if (x === 'CAO' || x === 'CACHORRO' || x === 'DOG') return 'CACHORRO';
  if ((ESPECIES_PET as readonly string[]).includes(x)) return x;
  if (x === 'AVE') return 'PASSARO';
  if (x === 'COELHO') return 'ROEDOR';
  return 'OUTRO';
}

export function mascaraData(texto: string) {
  const n = texto.replace(/\D/g, '').slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

export function mascaraMoeda(texto: string) {
  let v = texto.replace(/\D/g, '');
  if (!v) return '';
  v = (Number(v) / 100).toFixed(2).replace('.', ',');
  return v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

export function moedaParaNumero(v: string): number | null {
  if (!v) return null;
  const n = parseFloat(v.replace(/\./g, '').replace(',', '.'));
  return isNaN(n) ? null : n;
}

export function formatarReal(n: number | string | null | undefined) {
  const v = Number(n || 0);
  return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

/* dd/mm/aaaa -> aaaa-mm-dd (ou null se inválida) */
export function dataBRparaISO(br: string): string | null {
  const p = br.split('/');
  if (p.length !== 3 || p[2].length !== 4) return null;
  const [d, m, a] = p.map(Number);
  const dt = new Date(a, m - 1, d);
  if (dt.getFullYear() !== a || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return `${p[2]}-${p[1]}-${p[0]}`;
}

/* aaaa-mm-dd ou ISO completo -> dd/mm/aaaa (sem problemas de fuso) */
export function isoParaDataBR(iso?: string | null): string {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
}

/* Interpreta data do servidor como data local (ignora fuso) */
export function parseLocal(iso?: string | null): Date | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(iso);
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +m[3], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
}

export function chaveDia(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function calcularIdade(nascISO?: string | null): string {
  const n = parseLocal(nascISO);
  if (!n) return '';
  const h = new Date();
  let anos = h.getFullYear() - n.getFullYear();
  let meses = h.getMonth() - n.getMonth();
  let dias = h.getDate() - n.getDate();
  if (dias < 0) {
    meses--;
    dias += new Date(h.getFullYear(), h.getMonth(), 0).getDate();
  }
  if (meses < 0) {
    anos--;
    meses += 12;
  }
  if (anos < 0) return '';
  if (anos > 0) return `${anos} ano${anos > 1 ? 's' : ''}${meses ? ` e ${meses} ${meses > 1 ? 'meses' : 'mês'}` : ''}`;
  if (meses > 0) return `${meses} ${meses > 1 ? 'meses' : 'mês'}`;
  return `${dias} dia${dias !== 1 ? 's' : ''}`;
}

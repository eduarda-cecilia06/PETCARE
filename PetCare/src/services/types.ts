export type Pet = {
  id: number;
  nome: string;
  especie: string;
  raca?: string | null;
  data_nascimento?: string | null;
  genero?: string | null;
  peso?: number | null;
  foto?: string | null;
};

export type Evento = {
  id: number;
  pet_id: number;
  tipo: string;
  nome: string;
  data: string;
  descricao?: string | null;
  custo?: number | string | null;
  proxima_dose?: string | null;
  notificacao_ativa?: boolean | null;
  anexo_url?: string | null;
  petNome?: string;
};

export type FotoPet = {
  id: number;
  url_imagem: string;
  descricao?: string | null;
  data_upload?: string | null;
};

export type Notificacao = {
  id: number;
  mensagem: string;
  data_agendada: string;
  lida: boolean;
  evento_id?: number | null;
};

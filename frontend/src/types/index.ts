export enum UserRole {
  INTERESSADO = 'INTERESSADO',
  PROTETOR = 'PROTETOR',
  ADMIN = 'ADMIN',
}

export enum AnimalPorte {
  PEQUENO = 'PEQUENO',
  MEDIO = 'MEDIO',
  GRANDE = 'GRANDE',
}

export enum AnimalEspecie {
  CAO = 'CAO',
  GATO = 'GATO',
  OUTRO = 'OUTRO',
}

export enum AnimalStatus {
  DISPONIVEL = 'DISPONIVEL',
  ADOTADO = 'ADOTADO',
  APADRINHADO = 'APADRINHADO',
  INDISPONIVEL = 'INDISPONIVEL',
}

export enum SolicitacaoTipo {
  ADOCAO = 'ADOCAO',
  APADRINHAMENTO = 'APADRINHAMENTO',
}

export enum SolicitacaoStatus {
  PENDENTE = 'PENDENTE',
  APROVADA = 'APROVADA',
  REJEITADA = 'REJEITADA',
  CANCELADA = 'CANCELADA',
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Foto {
  id: number;
  url: string;
  legenda?: string;
  animalId: number;
}

export interface Animal {
  id: number;
  nome: string;
  especie: AnimalEspecie;
  raca?: string;
  idade: number;
  porte: AnimalPorte;
  descricao: string;
  status: AnimalStatus;
  protetorId: number;
  protetor: User;
  fotos: Foto[];
  solicitacoes?: Solicitacao[];
  createdAt: string;
  updatedAt: string;
}

export interface Solicitacao {
  id: number;
  tipo: SolicitacaoTipo;
  status: SolicitacaoStatus;
  mensagem?: string;
  animalId: number;
  animal: Animal;
  interessadoId: number;
  interessado: User;
  pagamento?: Pagamento;
  createdAt: string;
  updatedAt: string;
}

export interface Pagamento {
  id: number;
  valor: number;
  statusPagamento: string;
  gatewayPagamentoId?: string;
  solicitacaoId: number;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface CreateAnimalRequest {
  nome: string;
  especie: AnimalEspecie;
  raca?: string;
  idade: number;
  porte: AnimalPorte;
  descricao: string;
}

export interface CreateSolicitacaoRequest {
  tipo: SolicitacaoTipo;
  animalId: number;
  mensagem?: string;
}

export interface UpdateSolicitacaoStatusRequest {
  status: SolicitacaoStatus;
}

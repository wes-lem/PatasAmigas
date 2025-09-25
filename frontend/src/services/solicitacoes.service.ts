import api from '@/lib/api';
import { Solicitacao, CreateSolicitacaoRequest, UpdateSolicitacaoStatusRequest } from '@/types';

export const solicitacoesService = {
  async create(solicitacaoData: CreateSolicitacaoRequest): Promise<Solicitacao> {
    const response = await api.post('/solicitacoes', solicitacaoData);
    return response.data;
  },

  async getMinhasSolicitacoes(): Promise<Solicitacao[]> {
    const response = await api.get('/solicitacoes/minhas');
    return response.data;
  },

  async getSolicitacoesRecebidas(): Promise<Solicitacao[]> {
    const response = await api.get('/solicitacoes/recebidas');
    return response.data;
  },

  async getAll(): Promise<Solicitacao[]> {
    const response = await api.get('/admin/solicitacoes');
    return response.data;
  },

  async updateStatus(id: number, statusData: UpdateSolicitacaoStatusRequest): Promise<Solicitacao> {
    const response = await api.patch(`/admin/solicitacoes/${id}/status`, statusData);
    return response.data;
  },

  async cancelarSolicitacao(id: number): Promise<Solicitacao> {
    const response = await api.patch(`/solicitacoes/${id}/cancelar`);
    return response.data;
  },

  async confirmarApadrinhamento(id: number): Promise<Solicitacao> {
    const response = await api.patch(`/solicitacoes/${id}/confirmar-apadrinhamento`);
    return response.data;
  },

  async negarApadrinhamento(id: number): Promise<Solicitacao> {
    const response = await api.patch(`/solicitacoes/${id}/negar-apadrinhamento`);
    return response.data;
  },
};

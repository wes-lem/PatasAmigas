'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/auth.service';
import { solicitacoesService } from '@/services/solicitacoes.service';
import { Solicitacao, SolicitacaoStatus, SolicitacaoTipo, UserRole } from '@/types';
import { Heart, Clock, CheckCircle, XCircle, ArrowLeft, X, Check, UserX } from 'lucide-react';

export default function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(authService.getUser());
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadSolicitacoes();
  }, [user, router]);

  const loadSolicitacoes = async () => {
    try {
      setIsLoading(true);
      let data: Solicitacao[];
      
      if (user?.role === UserRole.PROTETOR) {
        data = await solicitacoesService.getSolicitacoesRecebidas();
      } else {
        data = await solicitacoesService.getMinhasSolicitacoes();
      }
      
      setSolicitacoes(data);
    } catch (err: any) {
      setError('Erro ao carregar solicitações');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: SolicitacaoStatus) => {
    switch (status) {
      case SolicitacaoStatus.PENDENTE:
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case SolicitacaoStatus.APROVADA:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case SolicitacaoStatus.REJEITADA:
        return <XCircle className="w-5 h-5 text-red-500" />;
      case SolicitacaoStatus.CANCELADA:
        return <UserX className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: SolicitacaoStatus) => {
    switch (status) {
      case SolicitacaoStatus.PENDENTE:
        return 'Pendente';
      case SolicitacaoStatus.APROVADA:
        return 'Aprovada';
      case SolicitacaoStatus.REJEITADA:
        return 'Rejeitada';
      case SolicitacaoStatus.CANCELADA:
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getStatusColor = (status: SolicitacaoStatus) => {
    switch (status) {
      case SolicitacaoStatus.PENDENTE:
        return 'bg-yellow-100 text-yellow-800';
      case SolicitacaoStatus.APROVADA:
        return 'bg-green-100 text-green-800';
      case SolicitacaoStatus.REJEITADA:
        return 'bg-red-100 text-red-800';
      case SolicitacaoStatus.CANCELADA:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: SolicitacaoTipo) => {
    switch (tipo) {
      case SolicitacaoTipo.ADOCAO:
        return 'Adoção';
      case SolicitacaoTipo.APADRINHAMENTO:
        return 'Apadrinhamento';
      default:
        return tipo;
    }
  };

  const handleCancelarSolicitacao = async (id: number) => {
    if (!confirm('Tem certeza que deseja cancelar esta solicitação?')) {
      return;
    }

    try {
      await solicitacoesService.cancelarSolicitacao(id);
      // Recarregar as solicitações
      await loadSolicitacoes();
    } catch (error) {
      console.error('Erro ao cancelar solicitação:', error);
      setError('Erro ao cancelar solicitação');
    }
  };

  const handleConfirmarApadrinhamento = async (id: number) => {
    if (!confirm('Tem certeza que deseja confirmar este apadrinhamento?')) {
      return;
    }

    try {
      await solicitacoesService.confirmarApadrinhamento(id);
      // Recarregar as solicitações
      await loadSolicitacoes();
    } catch (error) {
      console.error('Erro ao confirmar apadrinhamento:', error);
      setError('Erro ao confirmar apadrinhamento');
    }
  };

  const handleNegarApadrinhamento = async (id: number) => {
    if (!confirm('Tem certeza que deseja negar este apadrinhamento?')) {
      return;
    }

    try {
      await solicitacoesService.negarApadrinhamento(id);
      // Recarregar as solicitações
      await loadSolicitacoes();
    } catch (error) {
      console.error('Erro ao negar apadrinhamento:', error);
      setError('Erro ao negar apadrinhamento');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <Heart className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">Carregando solicitações...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === UserRole.PROTETOR ? 'Solicitações Recebidas' : 'Minhas Solicitações'}
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              {user?.role === UserRole.PROTETOR 
                ? 'Solicitações de adoção e apadrinhamento para seus animais'
                : 'Acompanhe o status das suas solicitações de adoção e apadrinhamento'
              }
            </p>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Lista de Solicitações */}
        {solicitacoes.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma solicitação encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              {user?.role === UserRole.PROTETOR 
                ? 'Você ainda não recebeu solicitações para seus animais.'
                : 'Você ainda não fez nenhuma solicitação.'
              }
            </p>
            <Link href="/pets">
              <Button>
                <Heart className="w-4 h-4 mr-2" />
                Ver Animais
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {solicitacoes.map((solicitacao) => (
              <div key={solicitacao.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {solicitacao.animal.nome}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(solicitacao.status)}`}>
                        {getStatusLabel(solicitacao.status)}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {getTipoLabel(solicitacao.tipo)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>Animal:</strong> {solicitacao.animal.nome}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Espécie:</strong> {solicitacao.animal.especie}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Raça:</strong> {solicitacao.animal.raca || 'Não informada'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Idade:</strong> {solicitacao.animal.idade} anos
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Porte:</strong> {solicitacao.animal.porte}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>Protetor:</strong> {solicitacao.animal.protetor?.name || 'N/A'}
                        </p>
                        {user?.role === UserRole.PROTETOR && solicitacao.interessado && (
                          <p className="text-sm text-gray-600">
                            <strong>Interessado:</strong> {solicitacao.interessado.name}
                          </p>
                        )}
                        {user?.role === UserRole.INTERESSADO && (
                          <p className="text-sm text-gray-600">
                            <strong>Você:</strong> {user.name}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          <strong>Data:</strong> {new Date(solicitacao.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    {solicitacao.mensagem && (
                      <div className="bg-gray-50 rounded-md p-3 mb-4">
                        <p className="text-sm text-gray-700">
                          <strong>Mensagem:</strong> {solicitacao.mensagem}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center ml-4">
                    {getStatusIcon(solicitacao.status)}
                  </div>
                </div>
                
                {solicitacao.animal.fotos && solicitacao.animal.fotos.length > 0 && (
                  <div className="mt-4">
                    <Image
                      src={`http://localhost:3001${solicitacao.animal.fotos[0].url}`}
                      alt={solicitacao.animal.nome}
                      width={80}
                      height={80}
                      className="object-cover rounded-md"
                    />
                  </div>
                )}

                {/* Botões de Ação */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {/* Ações para Interessado */}
                  {user?.role === UserRole.INTERESSADO && solicitacao.status === SolicitacaoStatus.PENDENTE && (
                    <Button
                      onClick={() => handleCancelarSolicitacao(solicitacao.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  )}

                  {/* Ações para Protetor - Apadrinhamento */}
                  {user?.role === UserRole.PROTETOR && 
                   solicitacao.tipo === SolicitacaoTipo.APADRINHAMENTO && 
                   solicitacao.status === SolicitacaoStatus.PENDENTE && (
                    <>
                      <Button
                        onClick={() => handleConfirmarApadrinhamento(solicitacao.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Confirmar
                      </Button>
                      <Button
                        onClick={() => handleNegarApadrinhamento(solicitacao.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Negar
                      </Button>
                    </>
                  )}

                  {/* Ações para Protetor - Adoção */}
                  {user?.role === UserRole.PROTETOR && 
                   solicitacao.tipo === SolicitacaoTipo.ADOCAO && 
                   solicitacao.status === SolicitacaoStatus.PENDENTE && (
                    <>
                      <Button
                        onClick={() => handleConfirmarApadrinhamento(solicitacao.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Aprovar Adoção
                      </Button>
                      <Button
                        onClick={() => handleNegarApadrinhamento(solicitacao.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Negar Adoção
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

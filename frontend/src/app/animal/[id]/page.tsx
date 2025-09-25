'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { animalsService } from '@/services/animals.service';
import { solicitacoesService } from '@/services/solicitacoes.service';
import { authService } from '@/services/auth.service';
import { Animal, SolicitacaoTipo, UserRole, User } from '@/types';
import { ArrowLeft, MapPin, Calendar, Heart, User as UserIcon, Phone, Mail } from 'lucide-react';

export default function AnimalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAnimal();
    setUser(authService.getUser());
  }, []);

  const loadAnimal = async () => {
    try {
      const animalData = await animalsService.getById(Number(params.id));
      console.log('Animal data:', animalData);
      console.log('Fotos:', animalData.fotos);
      setAnimal(animalData);
    } catch (err) {
      setError('Erro ao carregar animal');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSolicitacao = async (tipo: SolicitacaoTipo) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role === UserRole.PROTETOR && animal?.protetorId === user.id) {
      alert('Você não pode solicitar adoção/apadrinhamento do seu próprio animal');
      return;
    }

    setIsSubmitting(true);
    try {
      await solicitacoesService.create({
        animalId: animal!.id,
        tipo,
        mensagem: `Solicitação de ${tipo === SolicitacaoTipo.ADOCAO ? 'adoção' : 'apadrinhamento'} para ${animal!.nome}`
      });
      
      alert(`Solicitação de ${tipo === SolicitacaoTipo.ADOCAO ? 'adoção' : 'apadrinhamento'} enviada com sucesso!`);
      router.push('/solicitacoes');
    } catch (err) {
      alert('Erro ao enviar solicitação');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIVEL':
        return 'bg-green-100 text-green-800';
      case 'ADOTADO':
        return 'bg-blue-100 text-blue-800';
      case 'APADRINHADO':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DISPONIVEL':
        return 'Disponível';
      case 'ADOTADO':
        return 'Adotado';
      case 'APADRINHADO':
        return 'Apadrinhado';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando animal...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Animal não encontrado</h2>
            <p className="text-gray-600 mb-6">{error || 'O animal que você está procurando não existe.'}</p>
            <Link href="/pets">
              <Button>Voltar para Animais</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canSolicitar = user && (user.role !== UserRole.PROTETOR || (user.role === UserRole.PROTETOR && animal.protetorId !== user.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/pets" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Animais
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{animal.nome}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(animal.status)}`}>
                  {getStatusLabel(animal.status)}
                </span>
                <span className="text-gray-600">{animal.especie} • {animal.raca}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Galeria de Fotos */}
          <div className="space-y-4">
            {/* Foto Principal */}
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {animal.fotos && animal.fotos.length > 0 ? (
                <Image
                  src={animal.fotos[selectedImageIndex]?.url ? `http://localhost:3001${animal.fotos[selectedImageIndex].url}` : '/placeholder-animal.svg'}
                  alt={animal.nome}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {animal.fotos && animal.fotos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {animal.fotos.map((foto, index) => (
                  <button
                    key={foto.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square bg-gray-200 rounded-lg overflow-hidden ${
                      selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <Image
                      src={`http://localhost:3001${foto.url}`}
                      alt={`${animal.nome} - Foto ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Animal */}
          <div className="space-y-6">
            {/* Descrição */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Sobre {animal.nome}</h2>
              <p className="text-gray-600 leading-relaxed">
                {animal.descricao || 'Este animal está procurando um lar cheio de amor e carinho.'}
              </p>
            </div>

            {/* Detalhes */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-800">Idade</span>
                  <p className="font-medium text-gray-500">{animal.idade} anos</p>
                </div>
                <div>
                  <span className="text-sm text-gray-800">Porte</span>
                  <p className="font-medium text-gray-500">{animal.porte}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-800">Espécie</span>
                  <p className="font-medium text-gray-500">{animal.especie}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-800">Raça</span>
                  <p className="font-medium text-gray-500">{animal.raca}</p>
                </div>
              </div>
            </div>

            {/* Protetor */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Protetor</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{animal.protetor?.name}</p>
                  <p className="text-sm text-gray-500">Protetor de animais</p>
                </div>
              </div>
            </div>

            {/* Ações */}
            {animal.status === 'DISPONIVEL' && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interessado?</h3>
                <div className="space-y-3">
                  {canSolicitar ? (
                    <>
                      <Button
                        onClick={() => handleSolicitacao(SolicitacaoTipo.ADOCAO)}
                        disabled={isSubmitting}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        size="lg"
                      >
                        <Heart className="w-5 h-5 mr-2" />
                        Solicitar Adoção
                      </Button>
                      <Button
                        onClick={() => handleSolicitacao(SolicitacaoTipo.APADRINHAMENTO)}
                        disabled={isSubmitting}
                        variant="outline"
                        className="w-full"
                        size="lg"
                      >
                        <Heart className="w-5 h-5 mr-2" />
                        Apadrinhar
                      </Button>
                    </>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        {!user ? 'Faça login para solicitar adoção ou apadrinhamento' : 'Você não pode solicitar seu próprio animal'}
                      </p>
                      {!user && (
                        <div className="space-y-2">
                          <Link href="/login">
                            <Button className="w-full" size="lg">Fazer Login</Button>
                          </Link>
                          <Link href="/register">
                            <Button variant="outline" className="w-full" size="lg">Criar Conta</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

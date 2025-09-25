'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/auth.service';
import { animalsService } from '@/services/animals.service';
import { Animal, UserRole } from '@/types';
import { Plus, PawPrint, Heart, Users, ArrowLeft } from 'lucide-react';

export default function ProtectorDashboard() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(authService.getUser());
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== UserRole.PROTETOR) {
      router.push('/');
      return;
    }

    loadAnimals();
  }, [user, router]);

  const loadAnimals = async () => {
    try {
      setIsLoading(true);
      // Por enquanto, vamos carregar todos os animais
      // Depois podemos criar um endpoint específico para animais do protetor
      const data = await animalsService.getAll();
      // Filtrar apenas os animais do protetor logado
      const myAnimals = data.filter(animal => animal.protetorId === user?.id);
      setAnimals(myAnimals);
    } catch (err: any) {
      setError('Erro ao carregar animais');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <PawPrint className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">Carregando dashboard...</p>
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
              Dashboard do Protetor
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Gerencie seus animais e acompanhe as solicitações
            </p>
          </div>
          
          <Link href="/dashboard/protector/novo-animal">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Animal
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <PawPrint className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Animais</p>
                <p className="text-2xl font-bold text-gray-900">{animals.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Disponíveis</p>
                <p className="text-2xl font-bold text-gray-900">
                  {animals.filter(animal => animal.status === 'DISPONIVEL').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Adotados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {animals.filter(animal => animal.status === 'ADOTADO').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Lista de Animais */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Meus Animais</h2>
          </div>
          
          {animals.length === 0 ? (
            <div className="text-center py-12">
              <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum animal cadastrado
              </h3>
              <p className="text-gray-600 mb-6">
                Comece cadastrando seu primeiro animal para encontrar um lar cheio de amor.
              </p>
              <Link href="/dashboard/protector/novo-animal">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Primeiro Animal
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {animals.map((animal) => (
                <div key={animal.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {animal.fotos && animal.fotos.length > 0 ? (
                        <Image
                          src={`http://localhost:3001${animal.fotos[0].url}`}
                          alt={animal.nome}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <PawPrint className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{animal.nome}</h3>
                        <p className="text-sm text-gray-600">
                          {animal.especie} • {animal.idade} anos • {animal.porte}
                        </p>
                        <p className="text-sm text-gray-500">
                          {animal.raca && `${animal.raca} • `}
                          {new Date(animal.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        animal.status === 'DISPONIVEL' 
                          ? 'bg-green-100 text-green-800'
                          : animal.status === 'ADOTADO'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {animal.status === 'DISPONIVEL' ? 'Disponível' : 
                         animal.status === 'ADOTADO' ? 'Adotado' : 
                         animal.status}
                      </span>
                      
                      <Link href={`/dashboard/protector/editar-animal/${animal.id}`}>
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {animal.descricao && (
                    <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                      {animal.descricao}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

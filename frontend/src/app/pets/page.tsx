'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { AnimalCard } from '@/components/AnimalCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { animalsService } from '@/services/animals.service';
import { authService } from '@/services/auth.service';
import { solicitacoesService } from '@/services/solicitacoes.service';
import { Animal, AnimalEspecie, AnimalPorte, SolicitacaoTipo, UserRole } from '@/types';
import { Search, Filter, PawPrint } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function PetsPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    especie: '',
    porte: '',
  });
  const [user, setUser] = useState(authService.getUser());

  const especieOptions = [
    { value: '', label: 'Todas as espécies' },
    { value: AnimalEspecie.CAO, label: 'Cão' },
    { value: AnimalEspecie.GATO, label: 'Gato' },
    { value: AnimalEspecie.OUTRO, label: 'Outro' },
  ];

  const porteOptions = [
    { value: '', label: 'Todos os portes' },
    { value: AnimalPorte.PEQUENO, label: 'Pequeno' },
    { value: AnimalPorte.MEDIO, label: 'Médio' },
    { value: AnimalPorte.GRANDE, label: 'Grande' },
  ];

  useEffect(() => {
    loadAnimals();
  }, []);

  useEffect(() => {
    filterAnimals();
  }, [animals, searchTerm, filters]);

  const loadAnimals = async () => {
    try {
      setIsLoading(true);
      const data = await animalsService.getAll();
      setAnimals(data);
    } catch (err: any) {
      setError('Erro ao carregar animais');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAnimals = () => {
    let filtered = animals;

    // Filtro por texto
    if (searchTerm) {
      filtered = filtered.filter(animal =>
        animal.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (animal.raca && animal.raca.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por espécie
    if (filters.especie) {
      filtered = filtered.filter(animal => animal.especie === filters.especie);
    }

    // Filtro por porte
    if (filters.porte) {
      filtered = filtered.filter(animal => animal.porte === filters.porte);
    }

    setFilteredAnimals(filtered);
  };

  const handleAdopt = async (animal: Animal) => {
    if (!user) {
      alert('Você precisa estar logado para adotar um animal');
      return;
    }

    try {
      await solicitacoesService.create({
        tipo: SolicitacaoTipo.ADOCAO,
        animalId: animal.id,
        mensagem: `Interesse em adotar ${animal.nome}`,
      });
      alert('Solicitação de adoção enviada com sucesso!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao enviar solicitação');
    }
  };

  const handleSponsor = async (animal: Animal) => {
    if (!user) {
      alert('Você precisa estar logado para apadrinhar um animal');
      return;
    }

    try {
      await solicitacoesService.create({
        tipo: SolicitacaoTipo.APADRINHAMENTO,
        animalId: animal.id,
        mensagem: `Interesse em apadrinhar ${animal.nome}`,
      });
      alert('Solicitação de apadrinhamento enviada com sucesso!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao enviar solicitação');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <Logo className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" size="xl" />
            <p className="text-gray-600">Carregando animais...</p>
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Encontre seu novo melhor amigo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore nossa galeria de animais disponíveis para adoção e apadrinhamento
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, raça ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
              />
            </div>
            
            <Select
              name="especie"
              value={filters.especie}
              onChange={(e) => setFilters({ ...filters, especie: e.target.value })}
              options={especieOptions}
            />
            
            <Select
              name="porte"
              value={filters.porte}
              onChange={(e) => setFilters({ ...filters, porte: e.target.value })}
              options={porteOptions}
            />
          </div>
        </div>

        {/* Resultados */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {filteredAnimals.length === 0 ? (
          <div className="text-center py-12">
            <Logo className="w-16 h-16 text-gray-300 mx-auto mb-4" size="xl" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum animal encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou volte mais tarde para ver novos animais.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredAnimals.length} animal{filteredAnimals.length !== 1 ? 'is' : ''} encontrado{filteredAnimals.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAnimals.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  onAdopt={handleAdopt}
                  onSponsor={handleSponsor}
                  showActions={true}
                />
              ))}
            </div>
          </>
        )}

        {/* CTA para não logados */}
        {!user && (
          <div className="mt-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Quer adotar ou apadrinhar um animal?
              </h3>
              <p className="text-blue-700 mb-4">
                Crie uma conta gratuita para enviar solicitações de adoção e apadrinhamento.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Criar Conta
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline">
                    Já tenho conta
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

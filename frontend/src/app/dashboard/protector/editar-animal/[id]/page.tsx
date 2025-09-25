'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { authService } from '@/services/auth.service';
import { animalsService } from '@/services/animals.service';
import { Animal, AnimalEspecie, AnimalPorte, UserRole } from '@/types';
import { ArrowLeft, Upload, X, PawPrint, Save } from 'lucide-react';

export default function EditarAnimalPage() {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    especie: AnimalEspecie.CAO,
    raca: '',
    idade: 0,
    porte: AnimalPorte.MEDIO,
    descricao: '',
  });
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(authService.getUser());
  const router = useRouter();
  const params = useParams();
  const animalId = params.id as string;

  const especieOptions = [
    { value: AnimalEspecie.CAO, label: 'Cão' },
    { value: AnimalEspecie.GATO, label: 'Gato' },
    { value: AnimalEspecie.OUTRO, label: 'Outro' },
  ];

  const porteOptions = [
    { value: AnimalPorte.PEQUENO, label: 'Pequeno' },
    { value: AnimalPorte.MEDIO, label: 'Médio' },
    { value: AnimalPorte.GRANDE, label: 'Grande' },
  ];

  useEffect(() => {
    if (!user || user.role !== UserRole.PROTETOR) {
      router.push('/');
      return;
    }
    loadAnimal();
  }, [user, router, animalId]);

  const loadAnimal = async () => {
    try {
      setIsLoading(true);
      const data = await animalsService.getById(parseInt(animalId));
      
      // Verificar se o animal pertence ao protetor logado
      if (data.protetorId !== user?.id) {
        setError('Você não tem permissão para editar este animal');
        return;
      }
      
      setAnimal(data);
      setFormData({
        nome: data.nome,
        especie: data.especie,
        raca: data.raca || '',
        idade: data.idade,
        porte: data.porte,
        descricao: data.descricao,
      });
    } catch (err: any) {
      setError('Erro ao carregar animal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    if (!formData.idade || formData.idade < 0 || formData.idade > 30 || !Number.isInteger(formData.idade)) {
      setError('A idade deve ser um número inteiro entre 0 e 30 anos');
      setIsSaving(false);
      return;
    }

    try {
      // Atualizar dados do animal
      await animalsService.update(parseInt(animalId), formData);
      
      // Adicionar novas fotos se houver
      if (newPhotos.length > 0) {
        await animalsService.addPhotos(parseInt(animalId), newPhotos);
      }
      
      router.push('/dashboard/protector');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar animal');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'idade' ? parseInt(value) || 0 : value,
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewPhotos(prev => [...prev, ...files].slice(0, 10)); // Máximo 10 fotos
  };

  const removeNewPhoto = (index: number) => {
    setNewPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const previewNewPhotos = newPhotos.map((photo, index) => (
    <div key={index} className="relative">
      <img
        src={URL.createObjectURL(photo)}
        alt={`Nova foto ${index + 1}`}
        className="w-24 h-24 object-cover rounded-lg"
      />
      <button
        type="button"
        onClick={() => removeNewPhoto(index)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  ));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <Logo className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" size="xl" />
            <p className="text-gray-600">Carregando animal...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Animal não encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              O animal que você está tentando editar não foi encontrado.
            </p>
            <Link href="/dashboard/protector">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/protector" className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Editar Animal: {animal.nome}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Atualize as informações do animal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nome do Animal *"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                placeholder="Ex: Rex, Luna, Bela"
              />
              
              <Select
                label="Espécie *"
                name="especie"
                value={formData.especie}
                onChange={handleChange}
                options={especieOptions}
              />
              
              <Input
                label="Raça"
                name="raca"
                value={formData.raca}
                onChange={handleChange}
                placeholder="Ex: Golden Retriever, Persa"
              />
              
              <Input
                label="Idade (anos) *"
                name="idade"
                type="number"
                min="0"
                max="30"
                step="1"
                value={formData.idade || ''}
                onChange={handleChange}
                required
                placeholder="Ex: 2"
              />
              
              <Select
                label="Porte *"
                name="porte"
                value={formData.porte}
                onChange={handleChange}
                options={porteOptions}
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Descrição</h2>
            
            <Textarea
              label="Conte um pouco sobre o animal *"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Descreva o temperamento, personalidade, cuidados especiais, histórico de saúde, etc..."
            />
          </div>

          {/* Fotos Existentes */}
          {animal.fotos && animal.fotos.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Fotos Atuais</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {animal.fotos.map((foto, index) => (
                  <div key={foto.id} className="relative">
                    <Image
                      src={`http://localhost:3001${foto.url}`}
                      alt={`${animal.nome} - Foto ${index + 1}`}
                      width={200}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Adicionar Novas Fotos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Adicionar Novas Fotos</h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Adicione mais fotos do animal (máximo 10 fotos)
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Formatos aceitos: JPG, PNG, GIF
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Fotos
                </label>
              </div>
              
              {newPhotos.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Novas fotos selecionadas ({newPhotos.length}/10):
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {previewNewPhotos}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end space-x-4">
            <Link href="/dashboard/protector">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <PawPrint className="w-4 h-4 mr-2 animate-pulse" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

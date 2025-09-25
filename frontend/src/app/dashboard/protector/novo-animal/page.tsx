'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { authService } from '@/services/auth.service';
import { animalsService } from '@/services/animals.service';
import { CreateAnimalRequest, AnimalEspecie, AnimalPorte, UserRole } from '@/types';
import { ArrowLeft, Upload, X, PawPrint } from 'lucide-react';

export default function NovoAnimalPage() {
  const [formData, setFormData] = useState<CreateAnimalRequest>({
    nome: '',
    especie: AnimalEspecie.CAO,
    raca: '',
    idade: 1,
    porte: AnimalPorte.MEDIO,
    descricao: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(authService.getUser());
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!user || user.role !== UserRole.PROTETOR) {
      setError('Apenas protetores podem cadastrar animais');
      setIsLoading(false);
      return;
    }

    if (photos.length === 0) {
      setError('Adicione pelo menos uma foto do animal');
      setIsLoading(false);
      return;
    }

    if (!formData.idade || formData.idade < 0 || formData.idade > 30 || !Number.isInteger(formData.idade)) {
      setError('A idade deve ser um número inteiro entre 0 e 30 anos');
      setIsLoading(false);
      return;
    }

    try {
      await animalsService.create(formData, photos);
      router.push('/dashboard/protector');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar animal');
    } finally {
      setIsLoading(false);
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
    setPhotos(prev => [...prev, ...files].slice(0, 10)); // Máximo 10 fotos
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const previewPhotos = photos.map((photo, index) => (
    <div key={index} className="relative">
      <img
        src={URL.createObjectURL(photo)}
        alt={`Preview ${index + 1}`}
        className="w-24 h-24 object-cover rounded-lg"
      />
      <button
        type="button"
        onClick={() => removePhoto(index)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  ));

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
            Cadastrar Novo Animal
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Preencha as informações do animal para encontrar um lar cheio de amor
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

          {/* Fotos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fotos do Animal</h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Adicione fotos do animal (máximo 10 fotos)
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
              
              {photos.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Fotos selecionadas ({photos.length}/10):
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {previewPhotos}
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <PawPrint className="w-4 h-4 mr-2 animate-pulse" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <PawPrint className="w-4 h-4 mr-2" />
                  Cadastrar Animal
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

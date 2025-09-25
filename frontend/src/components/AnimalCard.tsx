import React from 'react';
import Image from 'next/image';
import { Animal, AnimalEspecie, AnimalPorte, AnimalStatus } from '@/types';
import { Button } from './ui/Button';
import { Heart, MapPin, Calendar } from 'lucide-react';

interface AnimalCardProps {
  animal: Animal;
  onAdopt?: (animal: Animal) => void;
  onSponsor?: (animal: Animal) => void;
  showActions?: boolean;
}

export const AnimalCard: React.FC<AnimalCardProps> = ({
  animal,
  onAdopt,
  onSponsor,
  showActions = true,
}) => {
  const getEspecieLabel = (especie: AnimalEspecie) => {
    switch (especie) {
      case AnimalEspecie.CAO:
        return 'Cão';
      case AnimalEspecie.GATO:
        return 'Gato';
      case AnimalEspecie.OUTRO:
        return 'Outro';
      default:
        return especie;
    }
  };

  const getPorteLabel = (porte: AnimalPorte) => {
    switch (porte) {
      case AnimalPorte.PEQUENO:
        return 'Pequeno';
      case AnimalPorte.MEDIO:
        return 'Médio';
      case AnimalPorte.GRANDE:
        return 'Grande';
      default:
        return porte;
    }
  };

  const getStatusColor = (status: AnimalStatus) => {
    switch (status) {
      case AnimalStatus.DISPONIVEL:
        return 'bg-green-100 text-green-800';
      case AnimalStatus.ADOTADO:
        return 'bg-blue-100 text-blue-800';
      case AnimalStatus.APADRINHADO:
        return 'bg-purple-100 text-purple-800';
      case AnimalStatus.INDISPONIVEL:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: AnimalStatus) => {
    switch (status) {
      case AnimalStatus.DISPONIVEL:
        return 'Disponível';
      case AnimalStatus.ADOTADO:
        return 'Adotado';
      case AnimalStatus.APADRINHADO:
        return 'Apadrinhado';
      case AnimalStatus.INDISPONIVEL:
        return 'Indisponível';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        {animal.fotos && animal.fotos.length > 0 ? (
          <Image
            src={`http://localhost:3001${animal.fotos[0].url}`}
            alt={animal.nome}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(animal.status)}`}>
            {getStatusLabel(animal.status)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{animal.nome}</h3>
          <span className="text-sm text-gray-500">{animal.idade} anos</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <span>{getEspecieLabel(animal.especie)}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>{getPorteLabel(animal.porte)}</span>
          </span>
          {animal.raca && (
            <span className="flex items-center gap-1">
              <span>{animal.raca}</span>
            </span>
          )}
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {animal.descricao}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{animal.protetor.name}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(animal.createdAt).toLocaleDateString('pt-BR')}</span>
          </span>
        </div>
        
        {showActions && animal.status === AnimalStatus.DISPONIVEL && (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onAdopt?.(animal)}
            >
              Adotar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onSponsor?.(animal)}
            >
              Apadrinhar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

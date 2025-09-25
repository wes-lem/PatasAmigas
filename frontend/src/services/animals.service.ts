import api from '@/lib/api';
import { Animal, CreateAnimalRequest } from '@/types';

export const animalsService = {
  async getAll(): Promise<Animal[]> {
    const response = await api.get('/animals');
    return response.data;
  },

  async getById(id: number): Promise<Animal> {
    const response = await api.get(`/animals/${id}`);
    return response.data;
  },

  async create(animalData: CreateAnimalRequest, photos: File[]): Promise<Animal> {
    const formData = new FormData();
    
    // Adicionar dados do animal
    Object.entries(animalData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });


    // Adicionar fotos
    photos.forEach((photo) => {
      formData.append('fotos', photo);
    });

    const response = await api.post('/animals', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async update(id: number, animalData: Partial<CreateAnimalRequest>): Promise<Animal> {
    const response = await api.patch(`/animals/${id}`, animalData);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/animals/${id}`);
  },

  async addPhotos(id: number, photos: File[]): Promise<Animal> {
    const formData = new FormData();
    
    photos.forEach((photo) => {
      formData.append('fotos', photo);
    });

    const response = await api.post(`/animals/${id}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

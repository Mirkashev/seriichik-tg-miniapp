import { httpClient } from '@/shared/api/httpClient';
import { mapPetFromDTO } from './model';
import type { PetResponseDTO, Pet } from './model';

export const petApi = {
  getPet: async (chatId: string): Promise<Pet> => {
    const response = await httpClient.get<PetResponseDTO>('/pet', {
      params: { chatId },
    });
    return mapPetFromDTO(response);
  },
};

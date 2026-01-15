import { httpClient } from '@/shared/api/httpClient';
import { mapPetFromDTO } from './model';
import type { PetResponseDTO, Pet } from './model';

export interface ChangePetNameRequest {
  chatId: string;
  name: string;
}

export interface ChangePetNameResponse {
  success: boolean;
}

export const petApi = {
  getPet: async (chatId: string): Promise<Pet> => {
    const response = await httpClient.get<PetResponseDTO>('/pet', {
      params: { chatId },
    });
    return mapPetFromDTO(response);
  },
  changePetName: async (
    request: ChangePetNameRequest
  ): Promise<ChangePetNameResponse> => {
    return httpClient.post<ChangePetNameResponse>('/pet/change-name', request);
  },
};

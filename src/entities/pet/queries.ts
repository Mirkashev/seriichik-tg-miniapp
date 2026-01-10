import { useQuery } from '@tanstack/react-query';
import { petApi } from './api';
import type { Pet } from './model';

export const petKeys = {
  all: ['pet'] as const,
  byChatId: (chatId: string) => [...petKeys.all, chatId] as const,
};

export const usePet = (chatId: string) => {
  return useQuery<Pet>({
    queryKey: petKeys.byChatId(chatId),
    queryFn: () => petApi.getPet(chatId),
    enabled: !!chatId,
  });
};

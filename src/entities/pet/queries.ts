import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { petApi } from "./api";
import type { Pet } from "./model";
import type {
  ChangePetNameRequest,
  ChangePetNameResponse,
  RestoreStreakRequest,
  RestoreStreakResponse,
} from "./api";

export const petKeys = {
  all: ["pet"] as const,
  byChatId: (chatId: string) => [...petKeys.all, chatId] as const,
};

export const usePet = (chatId: string) => {
  return useQuery<Pet>({
    queryKey: petKeys.byChatId(chatId),
    queryFn: () => petApi.getPet(chatId),
    enabled: !!chatId,
    refetchInterval: 1000 * 60, // 1 minute
  });
};

export const useChangePetName = () => {
  const queryClient = useQueryClient();

  return useMutation<ChangePetNameResponse, Error, ChangePetNameRequest>({
    mutationFn: (request) => petApi.changePetName(request),
    onSuccess: (_, variables) => {
      // Инвалидируем кэш питомца после успешного изменения имени
      queryClient.invalidateQueries({
        queryKey: petKeys.byChatId(variables.chatId),
      });
    },
  });
};

export const useRestoreStreak = () => {
  const queryClient = useQueryClient();

  return useMutation<RestoreStreakResponse, Error, RestoreStreakRequest>({
    mutationFn: (request) => petApi.restoreStreak(request),
    onSuccess: (_, variables) => {
      // Инвалидируем кэш питомца после успешного восстановления streak
      queryClient.invalidateQueries({
        queryKey: petKeys.byChatId(variables.chatId),
      });
    },
  });
};

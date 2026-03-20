import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from './api';
import type {
  UpdateChatNotificationsRequest,
  UpdateChatNotificationsResponse,
} from './api';
import { petKeys } from '@/entities/pet';
import { toast } from 'sonner';

export const useUpdateChatNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateChatNotificationsResponse,
    Error,
    UpdateChatNotificationsRequest
  >({
    mutationFn: (request) => chatApi.updateChatNotifications(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: petKeys.byChatId(variables.chatId),
      });
    },
    onError: () => {
      toast.error('Не удалось изменить настройку уведомлений');
    },
  });
};

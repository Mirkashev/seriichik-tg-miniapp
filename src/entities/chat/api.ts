import { httpClient } from '@/shared/api/httpClient';

export interface UpdateChatNotificationsRequest {
  chatId: string;
  enabled: boolean;
}

export interface UpdateChatNotificationsResponse {
  success: boolean;
  enabled: boolean;
}

export const chatApi = {
  updateChatNotifications: (
    request: UpdateChatNotificationsRequest
  ): Promise<UpdateChatNotificationsResponse> =>
    httpClient.put<UpdateChatNotificationsResponse>(
      '/chat/notifications',
      request
    ),
};

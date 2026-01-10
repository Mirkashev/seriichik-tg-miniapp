import { httpClient } from '@/shared/api/httpClient';
import { mapPartnerFromDTO } from './model';
import type { PartnersApiResponse, PartnersPageResponse } from './model';

export const partnerApi = {
  getPartners: async (fromUserId: number, cursor?: string): Promise<PartnersPageResponse> => {
    const response = await httpClient.get<PartnersApiResponse>('/partners', {
      params: { fromUserId, cursor },
    });

    // Извлекаем partners из ответа и маппим
    const partners = response.partners.map(mapPartnerFromDTO);

    return {
      partners,
      hasMore: partners.length > 0, // This should be determined by backend response
      nextCursor: cursor ? undefined : String(Date.now()), // Placeholder - should come from backend
    };
  },
};

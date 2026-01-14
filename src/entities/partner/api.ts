import { httpClient } from '@/shared/api/httpClient';
import { mapPartnerFromDTO } from './model';
import type { PartnersApiResponse, PartnersPageResponse } from './model';

export const partnerApi = {
  getPartners: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PartnersPageResponse> => {
    const response = await httpClient.get<PartnersApiResponse>('/partners', {
      params: { page, limit },
    });

    // Извлекаем partners из ответа и маппим
    const partners = response.partners.map(mapPartnerFromDTO);

    return {
      partners,
      pagination: response.pagination,
    };
  },
};

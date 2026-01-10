import { useInfiniteQuery } from '@tanstack/react-query';
import { partnerApi } from './api';
import type { PartnersPageResponse } from './model';

export const partnerKeys = {
  all: ['partners'] as const,
  byUserId: (fromUserId: number) => [...partnerKeys.all, fromUserId] as const,
};

export const usePartners = (fromUserId: number) => {
  return useInfiniteQuery<PartnersPageResponse>({
    queryKey: partnerKeys.byUserId(fromUserId),
    queryFn: ({ pageParam }) => partnerApi.getPartners(fromUserId, pageParam as string | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    enabled: !!fromUserId,
  });
};

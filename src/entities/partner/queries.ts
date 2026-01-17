import { useInfiniteQuery } from "@tanstack/react-query";
import { partnerApi } from "./api";
import type { PartnersPageResponse } from "./model";

export const partnerKeys = {
  all: ["partners"] as const,
  byLimit: (limit: number, searchText?: string) =>
    [...partnerKeys.all, limit, ...(searchText ? [searchText] : [])] as const,
};

export const searchPartnerKeys = {
  all: ["search-partners"] as const,
  byLimit: (limit: number, searchText?: string) =>
    [
      ...searchPartnerKeys.all,
      limit,
      ...(searchText ? [searchText] : []),
    ] as const,
};

export const usePartners = (limit: number = 20, searchText?: string) => {
  return useInfiniteQuery<PartnersPageResponse>({
    queryKey: partnerKeys.byLimit(limit, searchText),
    queryFn: ({ pageParam }) =>
      partnerApi.getPartners(pageParam as number, limit, searchText),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
  });
};

export const useSearchPartners = (limit: number = 20, searchText?: string) => {
  return useInfiniteQuery<PartnersPageResponse>({
    queryKey: searchPartnerKeys.byLimit(limit, searchText),
    queryFn: ({ pageParam }) =>
      partnerApi.getPartners(pageParam as number, limit, searchText),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
    enabled: !!searchText,
  });
};

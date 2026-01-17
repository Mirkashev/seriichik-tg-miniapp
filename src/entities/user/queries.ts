import { useMutation, useQuery } from "@tanstack/react-query";
import { userApi } from "./api";
import type { MeResponseDTO, UpdateTimezoneResponseDTO } from "./model";

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
};

export const useMe = () => {
  return useQuery<MeResponseDTO>({
    queryKey: userKeys.me(),
    queryFn: () => userApi.getMe(),
    retry: false,
  });
};

export const useUpdateTimezone = () => {
  return useMutation<UpdateTimezoneResponseDTO>({
    mutationFn: () => userApi.updateTimezone(),
  });
};

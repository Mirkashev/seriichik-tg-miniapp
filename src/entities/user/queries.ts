import { useQuery } from "@tanstack/react-query";
import { userApi } from "./api";
import type { MeResponseDTO } from "./model";

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
};

export const useMe = () => {
  return useQuery<MeResponseDTO>({
    queryKey: userKeys.me(),
    queryFn: () => userApi.getMe(),
  });
};

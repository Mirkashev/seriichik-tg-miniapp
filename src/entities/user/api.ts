import { httpClient } from "@/shared/api/httpClient";
import type { MeResponseDTO } from "./model";

export const userApi = {
  getMe: async (): Promise<MeResponseDTO> => {
    return await httpClient.get<MeResponseDTO>("/me");
  },
};

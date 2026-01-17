import { httpClient } from "@/shared/api/httpClient";
import type { MeResponseDTO, UpdateTimezoneResponseDTO } from "./model";

export const userApi = {
  getMe: async (): Promise<MeResponseDTO> => {
    return await httpClient.get<MeResponseDTO>("/me");
  },

  updateTimezone: async (): Promise<UpdateTimezoneResponseDTO> => {
    return await httpClient.put<UpdateTimezoneResponseDTO>("/user/timezone");
  },
};

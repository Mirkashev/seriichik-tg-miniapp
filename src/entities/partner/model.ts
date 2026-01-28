export interface PartnerResponseDTO {
  chatId: string;
  toUserId: number | string; // Может приходить как строка или число
  toUserFirstName?: string;
  toUserLastName?: string;
  toUserUsername?: string;
  toUserPhotoUrl?: string; // URL фотографии пользователя из Telegram
  pet?: {
    id: string;
    level: number;
    exp: number;
    name?: string; // Имя питомца
  };
  streakCount: number;
  isApplied: boolean;
  isActive: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PartnersApiResponse {
  partners: PartnerResponseDTO[];
  pagination: PaginationInfo;
}

export interface Partner {
  chatId: string;
  toUserId: number;
  toUserFirstName?: string;
  toUserLastName?: string;
  toUserUsername?: string;
  toUserPhotoUrl?: string; // URL фотографии пользователя из Telegram
  pet?: {
    id: string;
    level: number;
    exp: number;
    name?: string; // Имя питомца
  };
  streakCount: number;
  isApplied: boolean;
  isActive: boolean;
}

export const mapPartnerFromDTO = (dto: PartnerResponseDTO): Partner => ({
  chatId: dto.chatId,
  toUserId:
    typeof dto.toUserId === "string" ? Number(dto.toUserId) : dto.toUserId,
  toUserFirstName: dto.toUserFirstName,
  toUserLastName: dto.toUserLastName,
  toUserUsername: dto.toUserUsername,
  toUserPhotoUrl: dto.toUserPhotoUrl,
  pet: dto.pet,
  streakCount: dto.streakCount,
  isApplied: dto.isApplied,
  isActive: dto.isActive
});

export interface PartnersPageResponse {
  partners: Partner[];
  pagination: PaginationInfo;
}

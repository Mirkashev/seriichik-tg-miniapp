export interface PartnerResponseDTO {
  chatId: string;
  toUserId: number | string; // Может приходить как строка или число
  toUserFirstName?: string;
  toUserLastName?: string;
  toUserUsername?: string;
  pet?: {
    id: string;
    level: number;
    exp: number;
  };
  streakCount: number;
  isApplied: boolean;
}

export interface PartnersApiResponse {
  partners: PartnerResponseDTO[];
}

export interface Partner {
  chatId: string;
  toUserId: number;
  toUserFirstName?: string;
  toUserLastName?: string;
  toUserUsername?: string;
  pet?: {
    id: string;
    level: number;
    exp: number;
  };
  streakCount: number;
  isApplied: boolean;
}

export const mapPartnerFromDTO = (dto: PartnerResponseDTO): Partner => ({
  chatId: dto.chatId,
  toUserId: typeof dto.toUserId === 'string' ? Number(dto.toUserId) : dto.toUserId,
  toUserFirstName: dto.toUserFirstName,
  toUserLastName: dto.toUserLastName,
  toUserUsername: dto.toUserUsername,
  pet: dto.pet,
  streakCount: dto.streakCount,
  isApplied: dto.isApplied,
});

export interface PartnersPageResponse {
  partners: Partner[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface MeResponseDTO {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
  isBotOwner: boolean;
  timeZone?: string | null;
  timeZoneUpdatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateTimezoneResponseDTO {
  success: boolean;
  timeZone: string;
}

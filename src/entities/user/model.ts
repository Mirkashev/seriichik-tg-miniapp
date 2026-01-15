export interface MeResponseDTO {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
  isBotOwner: boolean;
  createdAt: Date;
  updatedAt: Date;
}

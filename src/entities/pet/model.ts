export interface PetResponseDTO {
  id: string;
  chatId: string;
  level: number;
  exp: number;
  expForNextLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pet {
  id: string;
  chatId: string;
  level: number;
  exp: number;
  expForNextLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

export const mapPetFromDTO = (dto: PetResponseDTO): Pet => ({
  id: dto.id,
  chatId: dto.chatId,
  level: dto.level,
  exp: dto.exp,
  expForNextLevel: dto.expForNextLevel,
  createdAt: new Date(dto.createdAt),
  updatedAt: new Date(dto.updatedAt),
});

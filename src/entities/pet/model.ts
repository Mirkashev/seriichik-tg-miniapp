export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  isBotOwner: boolean;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl?: string;
  timeZone?: string | null;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export enum QuestType {
  TEXT_1 = "TEXT_1",
  VIDEO_1 = "VIDEO_1",
  TEXT_10 = "TEXT_10",
}

export interface Quest {
  id: string;
  chatId: string;
  userId: number;
  type: QuestType;
  currentValue: number;
  isCompleted: boolean;
  completedAt?: Date;
  lastResetAt?: Date;
  rewardedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PetResponseDTO {
  id: string;
  chatId: string;
  level: number;
  exp: number;
  expForNextLevel: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  toUser: User;
  fromUser: User;
  streakCount: number;
  quests: Quest[];
  streakLastIncrementAt: Date;
  streakRestoreCount: number;
  streakRestoreUpdatedAt: Date | null;
}

export interface Pet {
  id: string;
  chatId: string;
  level: number;
  exp: number;
  expForNextLevel: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  toUser: User;
  fromUser: User;
  streakCount: number;
  quests: Quest[];
  streakLastIncrementAt: Date;
  streakRestoreCount: number;
  streakRestoreUpdatedAt: Date | null;
}

export const mapPetFromDTO = (dto: PetResponseDTO): Pet => ({
  id: dto.id,
  chatId: dto.chatId,
  level: dto.level,
  exp: dto.exp,
  expForNextLevel: dto.expForNextLevel,
  streakLastIncrementAt: new Date(dto.streakLastIncrementAt),
  createdAt: new Date(dto.createdAt),
  updatedAt: new Date(dto.updatedAt),
  name: dto.name,
  toUser: {
    ...dto.toUser,
    createdAt: new Date(dto.toUser.createdAt),
    updatedAt: new Date(dto.toUser.updatedAt),
  },
  fromUser: {
    ...dto.fromUser,
    createdAt: new Date(dto.fromUser.createdAt),
    updatedAt: new Date(dto.fromUser.updatedAt),
  },
  streakCount: dto.streakCount,
  streakRestoreCount: dto.streakRestoreCount,
  streakRestoreUpdatedAt: dto.streakRestoreUpdatedAt
    ? new Date(dto.streakRestoreUpdatedAt)
    : null,
  quests: dto.quests.map((quest) => ({
    ...quest,
    createdAt: new Date(quest.createdAt),
    updatedAt: new Date(quest.updatedAt),
    completedAt: quest.completedAt ? new Date(quest.completedAt) : undefined,
    lastResetAt: quest.lastResetAt ? new Date(quest.lastResetAt) : undefined,
    rewardedAt: quest.rewardedAt ? new Date(quest.rewardedAt) : undefined,
  })),
});

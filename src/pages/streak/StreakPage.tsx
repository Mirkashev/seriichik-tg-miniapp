import { useParams } from 'react-router-dom';
import { usePet } from '@/entities/pet';
import { ProgressBar } from '@/shared/ui/ProgressBar';

export const StreakPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { data: pet, isLoading, error } = usePet(chatId || '');

  if (isLoading) {
    return (
      <div>
        <h1>Streak</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Streak</h1>
        <p>Error loading pet data</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div>
        <h1>Streak</h1>
        <p>Pet not found</p>
      </div>
    );
  }

  const currentExp = pet.exp;
  const expForNextLevel = pet.expForNextLevel;
  const progressValue = expForNextLevel > 0 ? currentExp : 0;
  const progressMax = expForNextLevel;

  return (
    <div>
      <h1>Streak</h1>
      <div>
        <h2>Level: {pet.level}</h2>
        <div>
          <p>EXP: {pet.exp}</p>
          <p>EXP for Next Level: {pet.expForNextLevel}</p>
        </div>
        <div>
          <ProgressBar value={progressValue} max={progressMax} showLabel />
        </div>
      </div>
    </div>
  );
};

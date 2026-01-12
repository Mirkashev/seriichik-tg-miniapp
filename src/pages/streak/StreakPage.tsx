import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { usePet, QuestType, type Quest } from "@/entities/pet";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import { Typography } from "@/shared/ui/Typography";
import { getAvatarFallback } from "@/shared/utils/telegramPhoto";
import petLevel1 from "@/assets/images/pets/1.png";
import petLevel2 from "@/assets/images/pets/2.png";
import petLevel3 from "@/assets/images/pets/3.png";
import petLevel4 from "@/assets/images/pets/4.png";
import petLevel5 from "@/assets/images/pets/5.png";
import styles from "./StreakPage.module.scss";

interface Task {
  id: string;
  text: string;
  points: number;
  completed: boolean;
  counter?: number;
  avatars?: string[];
}

const getUserName = (user: {
  firstName?: string;
  lastName?: string;
  username?: string;
}): string => {
  if (user.firstName || user.lastName) {
    return [user.firstName, user.lastName].filter(Boolean).join(" ");
  }
  return user.username || "Unknown";
};

const getQuestText = (type: QuestType): string => {
  switch (type) {
    case QuestType.TEXT_1:
      return "Отправить 1 сообщение";
    case QuestType.VIDEO_1:
      return "Отправить 1 видеосообщение";
    case QuestType.TEXT_10:
      return "Отправить 10 сообщений";
    default:
      return "Неизвестный квест";
  }
};

const getQuestPoints = (type: QuestType): number => {
  switch (type) {
    case QuestType.TEXT_1:
      return 1;
    case QuestType.VIDEO_1:
      return 2;
    case QuestType.TEXT_10:
      return 4;
    default:
      return 0;
  }
};

const getQuestTarget = (type: QuestType): number => {
  switch (type) {
    case QuestType.TEXT_1:
      return 1;
    case QuestType.VIDEO_1:
      return 1;
    case QuestType.TEXT_10:
      return 10;
    default:
      return 0;
  }
};

const getPetImage = (level: number): string => {
  const petImages: Record<number, string> = {
    1: petLevel1,
    2: petLevel2,
    3: petLevel3,
    4: petLevel4,
    5: petLevel5,
  };

  // Если уровень больше 5, используем изображение уровня 5
  const imageLevel = Math.min(level, 5);
  // Если уровень меньше 1, используем изображение уровня 1
  const finalLevel = Math.max(imageLevel, 1);

  return petImages[finalLevel] || petLevel1;
};

export const StreakPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { data: pet, isLoading, error } = usePet(chatId || "");

  // Получаем аватары из данных пета
  const avatars = useMemo(() => {
    if (!pet) return [];

    const toUserName = getUserName(pet.toUser);
    const fromUserName = getUserName(pet.fromUser);

    return [getAvatarFallback(toUserName), getAvatarFallback(fromUserName)];
  }, [pet]);

  // Преобразуем квесты в задачи для отображения
  const tasks: Task[] = useMemo(() => {
    if (!pet) return [];

    // Группируем квесты по типу
    const questsByType = pet.quests.reduce(
      (acc, quest) => {
        if (!acc[quest.type]) {
          acc[quest.type] = [];
        }
        acc[quest.type].push(quest);
        return acc;
      },
      {} as Record<QuestType, Quest[]>
    );

    // Создаем задачи для каждого типа квеста
    const allQuestTypes = [
      QuestType.TEXT_1,
      QuestType.VIDEO_1,
      QuestType.TEXT_10,
    ];

    return allQuestTypes.map((questType) => {
      const quests = questsByType[questType] || [];
      const toUserQuest = quests.find((q) => q.userId === pet.toUser.id);
      const fromUserQuest = quests.find((q) => q.userId === pet.fromUser.id);

      // Определяем, завершен ли квест (оба пользователя должны завершить)
      const toUserCompleted = toUserQuest?.isCompleted ?? false;
      const fromUserCompleted = fromUserQuest?.isCompleted ?? false;
      const isCompleted = toUserCompleted && fromUserCompleted;

      // Определяем прогресс для квестов типа TEXT_10
      let counter: number | undefined;
      if (questType === QuestType.TEXT_10) {
        const toUserProgress = toUserQuest?.currentValue ?? 0;
        const fromUserProgress = fromUserQuest?.currentValue ?? 0;
        // Показываем минимальный прогресс (когда оба завершат, показываем target)
        const maxProgress = Math.max(toUserProgress, fromUserProgress);
        const target = getQuestTarget(questType);
        if (maxProgress > 0 && maxProgress < target) {
          counter = maxProgress;
        }
      }

      // Определяем аватары пользователей, которые выполнили квест
      // Показываем аватары только для незавершенных квестов
      const completedAvatars: string[] = [];
      if (!isCompleted) {
        if (toUserCompleted) {
          const toUserName = getUserName(pet.toUser);
          completedAvatars.push(getAvatarFallback(toUserName));
        }
        if (fromUserCompleted) {
          const fromUserName = getUserName(pet.fromUser);
          completedAvatars.push(getAvatarFallback(fromUserName));
        }
      }

      return {
        id: questType,
        text: getQuestText(questType),
        points: getQuestPoints(questType),
        completed: isCompleted,
        counter,
        avatars: completedAvatars.length > 0 ? completedAvatars : undefined,
      };
    });
  }, [pet]);

  // Получаем класс для фона в зависимости от уровня
  const getBackgroundClass = (level: number) => {
    if (level >= 5) return styles.pageLevel5;
    if (level >= 4) return styles.pageLevel4;
    if (level >= 3) return styles.pageLevel3;
    if (level >= 2) return styles.pageLevel2;
    return styles.pageLevel1;
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Typography variant="titleFirstBold">Загрузка...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <Typography variant="titleFirstBold">Ошибка загрузки</Typography>
        <Typography variant="body">
          Не удалось загрузить данные питомца
        </Typography>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className={styles.error}>
        <Typography variant="titleFirstBold">Питомец не найден</Typography>
      </div>
    );
  }

  const currentExp = pet.exp;
  const expForNextLevel = pet.expForNextLevel;
  const progressValue = expForNextLevel > 0 ? currentExp : 0;
  const progressMax = expForNextLevel;
  const remainingPoints = progressMax - progressValue;
  const petName = pet.name || "Питомец";
  const petImageUrl = getPetImage(pet.level);

  return (
    <div className={`${styles.page} ${getBackgroundClass(pet.level)}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.streakCounter}>
          <Typography variant="body" className={styles.streakLabel}>
            Дней стрика
          </Typography>
          <div className={styles.streakNumber}>{pet.streakCount}</div>
        </div>
        <div className={styles.avatars}>
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className={styles.avatar}
            />
          ))}
        </div>
      </div>

      {/* Pet Section */}
      <div className={styles.petSection}>
        <div className={styles.petImageContainer}>
          <img src={petImageUrl} alt="Pet" className={styles.petImage} />
          <span className={styles.petNavArrow}>›</span>
        </div>
        <div className={styles.petNameContainer}>
          <Typography
            variant="titleFirstBold"
            className={styles.petName}
            as="span"
          >
            {petName}
          </Typography>
          <svg
            className={styles.editIcon}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.3333 2.00001C11.5084 1.82491 11.7163 1.68698 11.9444 1.59427C12.1726 1.50156 12.4163 1.45605 12.662 1.46068C12.9077 1.46531 13.1498 1.52 13.3733 1.62134C13.5968 1.72268 13.7974 1.86856 13.9627 2.05001C14.128 2.23146 14.2547 2.44489 14.3359 2.6769C14.4171 2.90891 14.4511 3.15487 14.4356 3.39968C14.4201 3.64449 14.3554 3.8834 14.2453 4.10168C14.1352 4.31996 13.982 4.5134 13.7933 4.67001L5.12667 13.3333L1.33333 14.6667L2.66667 10.8733L11.3333 2.00001Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className={styles.progressSection}>
          <ProgressBar
            value={progressValue}
            max={progressMax}
            showLabel
            labelPosition="inside"
            color="#FB8A0E"
            striped
          />
          <Typography
            variant="captionFirst"
            className={styles.progressDescription}
          >
            {remainingPoints} очков до нового облика
          </Typography>
        </div>
      </div>

      {/* Tasks Card */}
      <div className={styles.tasksCard}>
        <Typography variant="titleSecondBold" className={styles.tasksTitle}>
          Вырасти питомца
        </Typography>
        <ul className={styles.tasksList}>
          {tasks.map((task) => (
            <li key={task.id} className={styles.taskItem}>
              <div
                className={`${styles.taskIcon} ${
                  task.completed ? styles.completed : styles.incomplete
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.3333 4L6 11.3333L2.66667 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className={styles.taskContent}>
                <Typography variant="body" className={styles.taskText}>
                  {task.text}
                </Typography>
                <div className={styles.taskMeta}>
                  {task.counter !== undefined && (
                    <div className={styles.taskCounter}>{task.counter}</div>
                  )}
                  {task.avatars && (
                    <div className={styles.taskAvatars}>
                      {task.avatars.map((avatar, index) => (
                        <img
                          key={index}
                          src={avatar}
                          alt={`Task avatar ${index + 1}`}
                          className={styles.taskAvatar}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <Typography
                  variant="captionFirst"
                  className={styles.taskPoints}
                >
                  +{task.points} growth point
                </Typography>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

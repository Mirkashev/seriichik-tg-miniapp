import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePet, QuestType, type Quest } from "@/entities/pet";
import { Typography } from "@/shared/ui/Typography";
import { Loader } from "@/shared/ui/Loader";
import { getAvatarFallback } from "@/shared/utils/telegramPhoto";
import { PetSection } from "./ui/PetSection";
import { getPetImage } from "./utils/getPetImage";
import styles from "./StreakPage.module.scss";
import { postEvent, backButton } from "@tma.js/sdk-react";
import { isIOS } from "react-device-detect";
import CheckMark from "@/assets/icons/check-mark.svg?svgr";

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

export const StreakPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { data: pet, isLoading, error } = usePet(chatId || "");
  const navigate = useNavigate();

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

  useEffect(() => {
    postEvent("web_app_set_background_color", { color: "#f8f8f8" });
    postEvent("web_app_set_header_color", { color: "#ffd179" });
    backButton.mount();
    backButton.show();
    backButton.onClick(() => {
      navigate("/streaks");
    });
  }, [navigate, pet]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader />
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
    <div className={styles.page} style={{ paddingTop: isIOS ? "100px" : 0 }}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.streakCounter}>
          <Typography variant="titleThird" className={styles.streakLabel}>
            Дней стрика
          </Typography>
          <Typography variant="largeTitleBold" className={styles.streakNumber}>
            {pet.streakCount}
          </Typography>
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
      <PetSection
        petName={petName}
        petImageUrl={petImageUrl}
        progressValue={progressValue}
        progressMax={progressMax}
        remainingPoints={remainingPoints}
      />

      {/* Tasks Card */}
      <div className={styles.tasksCard}>
        <Typography variant="titleSecondBold" className={styles.tasksTitle}>
          Вырасти питомца
        </Typography>
        <ul className={styles.tasksList}>
          {tasks.map((task) => (
            <li key={task.id} className={styles.taskItem}>
              <CheckMark
                width={42}
                height={42}
                className={`${styles.taskIcon} ${task.completed ? styles.completed : styles.incomplete}`}
              />
              <div className={styles.taskContent}>
                <Typography
                  variant="titleThirdBold"
                  className={styles.taskText}
                >
                  {task.text}
                </Typography>
                <Typography variant="titleThird" className={styles.taskPoints}>
                  <span className={styles.taskPointsNumber}>
                    +{task.points}
                  </span>{" "}
                  exp
                </Typography>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

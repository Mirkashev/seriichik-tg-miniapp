import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePet, QuestType, type User, useRestoreStreak } from "@/entities/pet";
import { Typography } from "@/shared/ui/Typography";
import { Loader } from "@/shared/ui/Loader";
import { PetSection } from "./ui/PetSection";
import styles from "./StreakPage.module.scss";
import { backButton } from "@tma.js/sdk-react";
import { isIOS } from "react-device-detect";
import {
  accentColors,
  linearGradientAccentColors,
  taskIconColors,
} from "@/shared/consts";
import { getAvatarFallback } from "@/shared/utils/helpers/telegramPhoto";

import badge1 from "@/assets/images/badges/1.png";
import badge2 from "@/assets/images/badges/2.png";
import badge3 from "@/assets/images/badges/3.png";
import badge4 from "@/assets/images/badges/4.png";
import badge5 from "@/assets/images/badges/5.png";

import noBadge2 from "@/assets/images/badges/no-2.png";
import noBadge3 from "@/assets/images/badges/no-3.png";
import noBadge4 from "@/assets/images/badges/no-4.png";
import noBadge5 from "@/assets/images/badges/no-5.png";

import coldPet from "@/assets/images/pets/cold-1.png";
import coldPet2 from "@/assets/images/pets/cold-2.png";
import coldPet3 from "@/assets/images/pets/cold-3.png";
import coldPet4 from "@/assets/images/pets/cold-4.png";
import coldPet5 from "@/assets/images/pets/cold-5.png";

const coldPetImages = [coldPet, coldPet2, coldPet3, coldPet4, coldPet5];

import { getTodayStart } from "@/shared/utils/helpers/getTodayStart";
import { Button } from "@/shared/ui/Button";

const allBadges = [badge1, badge2, badge3, badge4, badge5];
const noBadges = ["", noBadge2, noBadge3, noBadge4, noBadge5];

// TODO: в будущем добавить транзишн для header цвета
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

  const { mutateAsync: restoreStreak, isPending: isRestoringStreak } =
    useRestoreStreak();

  const todayStart = getTodayStart(pet?.fromUser.timeZone);

  const stateSad =
    pet && todayStart.getTime() > pet.streakLastIncrementAt.getTime();

  const stateCold =
    pet &&
    todayStart.getTime() - pet.streakLastIncrementAt.getTime() >
      48 * 60 * 60 * 1000;

  const [currentSlide, setCurrentSlide] = useState(0);

  const usersByQuestType = useMemo(() => {
    if (!pet) return {} as Record<QuestType, (User & { counter: number })[]>;

    return pet.quests.reverse().reduce(
      (acc, quest) => {
        acc[quest.type] = [
          ...(acc[quest.type] || []),
          quest.userId === pet.toUser.id
            ? { ...pet.toUser, counter: quest.currentValue }
            : { ...pet.fromUser, counter: quest.currentValue },
        ];
        return acc;
      },
      {} as Record<QuestType, (User & { counter: number })[]>
    );
  }, [pet]);

  const tasks = useMemo(() => {
    if (!pet) return [];

    const allTasks = pet.quests.map((quest) => ({
      id: quest.id,
      text: getQuestText(quest.type),
      points: getQuestPoints(quest.type),
      target: getQuestTarget(quest.type),
      questType: quest.type,
    }));

    // Keep only unique tasks by questType
    const seenTypes = new Set<QuestType>();
    return allTasks.filter((task) => {
      if (seenTypes.has(task.questType)) {
        return false;
      }
      seenTypes.add(task.questType);
      return true;
    });
  }, [pet]);

  useEffect(() => {
    document.body.style.background = `linear-gradient(180deg, #${stateSad || stateCold ? "C9C6D9" : linearGradientAccentColors[currentSlide]} 0%, #f8f8f8 100%)`;
  }, [stateSad, stateCold, currentSlide]);

  useEffect(() => {
    try {
      backButton.mount();
      backButton.show();
      backButton.onClick(() => {
        navigate("/streaks");
      });
    } catch (error: unknown) {
      console.warn("Failed to mount back button:", error);
    }
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
        <Typography variant="textXlBold">Ошибка загрузки</Typography>
        <Typography variant="textXs">
          Не удалось загрузить данные питомца
        </Typography>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className={styles.error}>
        <Typography variant="textXlBold">Питомец не найден</Typography>
      </div>
    );
  }

  return (
    <div
      className={styles.page}
      style={{ paddingTop: isIOS ? "100px" : "24px" }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.streakCounter}>
          <Typography variant="textMd" className={styles.streakLabel}>
            Дней стрика
          </Typography>
          <Typography
            variant="displayLgSemibold"
            className={styles.streakNumber}
          >
            {pet.streakCount}
          </Typography>
        </div>
        <div className={styles.avatars}>
          <img
            src={
              pet.toUser.avatarUrl || getAvatarFallback(pet.toUser.firstName)
            }
            alt={`Avatar ${pet.toUser.firstName}`}
            className={styles.avatar}
            style={{
              border: `2px solid #${stateSad || stateCold ? "C9C6D9" : linearGradientAccentColors[currentSlide]}`,
              zIndex: 1,
            }}
          />
          <img
            src={
              pet.fromUser.avatarUrl ||
              getAvatarFallback(pet.fromUser.firstName)
            }
            alt={`Avatar ${pet.fromUser.firstName}`}
            className={styles.avatar}
          />
        </div>
      </div>

      {stateCold && (
        <div className={styles.cold}>
          <img
            src={coldPetImages[pet.level - 1]}
            alt="Cold Pet"
            className={styles.coldPet}
          />

          <div className={styles.coldContent}>
            <Typography
              className={styles.coldContentTitle}
              variant="displayXsSemibold"
            >
              Ваша серия закончилась!
            </Typography>
            {pet.streakRestoreCount < 3 ||
            (pet.streakRestoreUpdatedAt &&
              pet.streakRestoreUpdatedAt.getMonth() !==
                new Date().getMonth()) ? (
              <>
                <Typography variant="textMd" className={styles.coldContentText}>
                  Восстановление доступно <span>48 часов</span>
                </Typography>
                <Typography variant="textMd" className={styles.coldContentText}>
                  Еще{" "}
                  <span>
                    {pet.streakRestoreUpdatedAt &&
                    pet.streakRestoreUpdatedAt.getMonth() !==
                      new Date().getMonth()
                      ? 3
                      : 3 - pet.streakRestoreCount}{" "}
                    восстановления
                  </span>{" "}
                  в этом месяце
                </Typography>
              </>
            ) : (
              <Typography variant="textMd" className={styles.coldContentText}>
                Пишите 3 дня друг другу, чтобы вырастить нового Серийчика
              </Typography>
            )}
          </div>

          {pet.streakRestoreCount < 3 ||
          (pet.streakRestoreUpdatedAt &&
            pet.streakRestoreUpdatedAt.getMonth() !== new Date().getMonth()) ? (
            <Button
              onClick={() => restoreStreak({ chatId: chatId || "" })}
              disabled={isRestoringStreak}
            >
              Восстановить
            </Button>
          ) : (
            <div />
          )}
        </div>
      )}

      {/* Pet Section */}
      {!stateCold && (
        <PetSection
          pet={pet}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />
      )}

      {/* Tasks Card */}
      {!stateCold && (
        <div className={styles.tasksCard}>
          <Typography variant="textLgBold" className={styles.tasksTitle}>
            Вырасти питомца
          </Typography>
          <ul className={styles.tasksList}>
            {tasks.map((task) => (
              <li key={task.id} className={styles.taskItem}>
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 42 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.8717 35.5614C7.7913 35.5614 6.35156 34.1049 6.35156 31.0246V27.442C6.35156 27.1239 6.25112 26.8895 6.01674 26.6551L3.48884 24.1105C1.3125 21.9342 1.29576 19.8917 3.48884 17.7154L6.01674 15.1708C6.25112 14.9364 6.35156 14.702 6.35156 14.3839V10.8013C6.35156 7.6875 7.7913 6.26451 10.8717 6.26451H14.4542C14.7891 6.26451 15.0234 6.16406 15.2578 5.94643L17.8025 3.41853C19.9788 1.22545 22.0045 1.20871 24.1975 3.40179L26.7422 5.94643C26.9766 6.1808 27.2109 6.26451 27.529 6.26451H31.1116C34.192 6.26451 35.6484 7.72098 35.6484 10.8013V14.3839C35.6484 14.702 35.7321 14.9196 35.9665 15.1708L38.4944 17.7154C40.6708 19.8917 40.6875 21.9342 38.4944 24.1105L35.9665 26.6551C35.7321 26.8895 35.6484 27.1239 35.6484 27.442V31.0246C35.6484 34.1049 34.192 35.5614 31.1116 35.5614H27.529C27.2109 35.5614 26.9766 35.6451 26.7422 35.8795L24.1975 38.4074C22.0212 40.5837 19.9788 40.6004 17.8025 38.4074L15.2578 35.8795C15.0067 35.6451 14.7891 35.5614 14.4542 35.5614H10.8717Z"
                    fill={
                      usersByQuestType[task.questType].some(
                        (user) => user.counter !== task.target
                      )
                        ? "var(--surface-default)"
                        : taskIconColors[currentSlide]
                    }
                  />
                  <path
                    d="M27.6667 16L18.5 25.1667L14.3333 21"
                    stroke={
                      usersByQuestType[task.questType].some(
                        (user) => user.counter !== task.target
                      )
                        ? "var(--text-second)"
                        : accentColors[currentSlide]
                    }
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <div className={styles.taskContent}>
                  <Typography
                    variant="textMdSemibold"
                    className={styles.taskText}
                  >
                    {task.text}
                  </Typography>
                  <div className={styles.taskPointsContainer}>
                    <Typography variant="textMd" className={styles.taskPoints}>
                      <span
                        style={{
                          color: stateSad
                            ? "#C9C6D9"
                            : accentColors[currentSlide],
                        }}
                      >
                        +{task.points}
                      </span>{" "}
                      очк{task.points > 1 ? "а" : "о"} опыта
                    </Typography>
                    {usersByQuestType[task.questType].some(
                      (user) => user.counter !== task.target
                    ) && (
                      <div className={styles.avatarProgressContainer}>
                        {usersByQuestType[task.questType].map((user, index) => (
                          <div
                            key={index}
                            className={styles.taskAvatarContainer}
                          >
                            {user.counter !== task.target &&
                              user.counter > 0 && (
                                <Typography
                                  variant="textXs"
                                  className={styles.taskAvatarText}
                                >
                                  {user.counter}
                                </Typography>
                              )}
                            <img
                              style={{
                                opacity: user.counter === task.target ? 0.4 : 1,
                              }}
                              src={
                                user.avatarUrl ||
                                getAvatarFallback(user.firstName)
                              }
                              alt={`Avatar ${index + 1}`}
                              className={styles.taskAvatar}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!stateCold && (
        <div className={styles.badge}>
          <Typography variant="textLgBold">Бейдж</Typography>
          <div className={styles.badgeContent}>
            <div className={styles.badgeItem}>
              <img
                src={allBadges[0]}
                alt="Badge"
                className={styles.badgeImage}
              />
              <Typography className={styles.badgeItemText} variant="textSm">
                3д
              </Typography>
            </div>
            <div className={styles.badgeItem}>
              <img
                src={pet.streakCount >= 10 ? allBadges[1] : noBadges[1]}
                alt="Badge"
                className={styles.badgeImage}
              />
              <Typography className={styles.badgeItemText} variant="textSm">
                10д
              </Typography>
            </div>
            <div className={styles.badgeItem}>
              <img
                src={pet.streakCount >= 30 ? allBadges[2] : noBadges[2]}
                alt="Badge"
                className={styles.badgeImage}
              />
              <Typography className={styles.badgeItemText} variant="textSm">
                30д
              </Typography>
            </div>
            <div className={styles.badgeItem}>
              <img
                src={pet.streakCount >= 100 ? allBadges[3] : noBadges[3]}
                alt="Badge"
                className={styles.badgeImage}
              />
              <Typography className={styles.badgeItemText} variant="textSm">
                100д
              </Typography>
            </div>
            <div className={styles.badgeItem}>
              <img
                src={pet.streakCount >= 200 ? allBadges[4] : noBadges[4]}
                alt="Badge"
                className={styles.badgeImage}
              />
              <Typography className={styles.badgeItemText} variant="textSm">
                200д
              </Typography>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLaunchParams } from "@tma.js/sdk-react";
import { usePartners } from "@/entities/partner";
import type { Partner } from "@/entities/partner";
import { Button } from "@/shared/ui/Button";
import { Typography } from "@/shared/ui/Typography";
import { getAvatarFallback } from "@/shared/utils/telegramPhoto";
import styles from "./StreaksPage.module.scss";

export const StreaksPage = () => {
  const navigate = useNavigate();
  const launchParams = useLaunchParams(true);
  const user = launchParams.tgWebAppData?.user;
  const userId = user?.id;

  const isPremium = useMemo(() => {
    return user?.is_premium ?? false;
  }, [user]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = usePartners(userId || 0);

  const partners = useMemo(() => {
    return data?.pages.flatMap((page) => page.partners) ?? [];
  }, [data]);

  const getPartnerName = (partner: Partner) => {
    if (partner.toUserFirstName || partner.toUserLastName) {
      return [partner.toUserFirstName, partner.toUserLastName]
        .filter(Boolean)
        .join(" ");
    }
    return partner.toUserUsername || "Unknown";
  };

  const getStreakEmoji = (count: number): string => {
    if (count >= 200) return "🔥";
    if (count >= 100) return "🔥";
    if (count >= 30) return "🔥";
    if (count >= 10) return "🔥";
    if (count >= 4) return "🔥";
    return "🤔";
  };

  const getStreakColor = (count: number): string => {
    if (count >= 200) return "#FF69B4"; // pink
    if (count >= 100) return "#FF69B4"; // pink
    if (count >= 30) return "#FF0000"; // red
    if (count >= 10) return "#FF8C00"; // orange
    if (count >= 4) return "#FFD700"; // yellow
    return "#808080"; // gray
  };

  const getSecondaryText = (partner: Partner): string => {
    if (partner.pet?.name) {
      return partner.pet.name;
    }
    if (partner.streakCount === 0) {
      return "Восстановите свою 3 дневную серию";
    }
    // Можно добавить другие статусы
    return "";
  };

  const handleCopyBotUsername = () => {
    navigator.clipboard.writeText("@serichikbot");
  };

  const handleGoToSettings = () => {
    // TODO: Implement navigation to Telegram settings
  };

  const handleInviteFriend = () => {
    // TODO: Implement invite friend functionality
  };

  const handleVideoInstructions = () => {
    // TODO: Implement video instructions
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.page}>
        <Typography variant="titleFirstBold">Загрузка...</Typography>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.page}>
        <Typography variant="titleFirstBold">Ошибка загрузки</Typography>
      </div>
    );
  }

  // Empty states (before partners appear)
  if (partners.length === 0) {
    // Premium user guide
    if (isPremium) {
      return (
        <div className={styles.page}>
          <div className={styles.premiumGuide}>
            <Typography variant="largeTitleBold" className={styles.guideTitle}>
              Как завести серийчика?
            </Typography>

            {/* Step 1 */}
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>
                <Typography variant="bodyBold">1</Typography>
              </div>
              <div className={styles.stepContent}>
                <Typography variant="body" className={styles.stepText}>
                  Открой Настройки в Telegram
                </Typography>
              </div>
            </div>

            {/* Step 2 */}
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>
                <Typography variant="bodyBold">2</Typography>
              </div>
              <div className={styles.stepContent}>
                <Typography variant="body" className={styles.stepText}>
                  Нажми «Telegram для бизнеса»
                </Typography>
                <button
                  className={`${styles.stepButton} ${styles.stepButtonBlue}`}
                  onClick={handleGoToSettings}
                >
                  <div className={styles.stepButtonContent}>
                    <div
                      className={`${styles.stepButtonIcon} ${styles.stepButtonIconBlue}`}
                    >
                      <span style={{ color: "white", fontSize: "16px" }}>
                        💼
                      </span>
                    </div>
                    <div className={styles.stepButtonText}>
                      <Typography variant="bodyBold">
                        Telegram для бизнеса
                      </Typography>
                    </div>
                  </div>
                  <span className={styles.stepButtonArrow}>›</span>
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>
                <Typography variant="bodyBold">3</Typography>
              </div>
              <div className={styles.stepContent}>
                <Typography variant="body" className={styles.stepText}>
                  Открой раздел «Чат-боты»
                </Typography>
                <button
                  className={`${styles.stepButton} ${styles.stepButtonGray}`}
                  onClick={handleGoToSettings}
                >
                  <div className={styles.stepButtonContent}>
                    <div
                      className={`${styles.stepButtonIcon} ${styles.stepButtonIconGray}`}
                    >
                      <span style={{ color: "white", fontSize: "16px" }}>
                        🤖
                      </span>
                    </div>
                    <div className={styles.stepButtonText}>
                      <Typography variant="bodyBold" style={{ color: "white" }}>
                        Чат-боты
                      </Typography>
                      <div className={styles.stepButtonSubtext}>
                        <Typography
                          variant="captionFirst"
                          style={{ color: "rgba(255, 255, 255, 0.6)" }}
                        >
                          Подключение сторонних ботов для взаимодействия с
                          клиентами.
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <span className={styles.stepButtonArrow}>›</span>
                </button>
              </div>
            </div>

            {/* Step 4 */}
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>
                <Typography variant="bodyBold">4</Typography>
              </div>
              <div className={styles.stepContent}>
                <Typography variant="body" className={styles.stepText}>
                  Добавь этого бота
                </Typography>
                <div className={styles.botInput}>
                  <Typography variant="bodyBold" className={styles.botUsername}>
                    @serichikbot
                  </Typography>
                  <button
                    className={styles.copyIcon}
                    onClick={handleCopyBotUsername}
                    aria-label="Копировать"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.3333 10.75V14.25C13.3333 15.6307 12.214 16.75 10.8333 16.75H5.75C4.36929 16.75 3.25 15.6307 3.25 14.25V5.75C3.25 4.36929 4.36929 3.25 5.75 3.25H9.25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.75 6.75V11.25C16.75 12.6307 15.6307 13.75 14.25 13.75H10.75"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.75 3.25H14.25C15.6307 3.25 16.75 4.36929 16.75 5.75V9.25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <Button onClick={handleGoToSettings}>Перейти в настройки</Button>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleVideoInstructions();
                }}
                className={styles.videoLink}
              >
                <Button variant="secondary">Видео инструкция</Button>
              </a>
            </div>
          </div>
        </div>
      );
    }

    // Non-Premium empty state
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <div className={styles.character}>
            <div className={styles.characterPlaceholder}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div className={styles.characterEyes}>
                  <div className={styles.characterEye}></div>
                  <div className={styles.characterEye}></div>
                </div>
                <div className={styles.characterMouth}></div>
              </div>
            </div>
          </div>
          <div className={styles.emptyStateContent}>
            <Typography
              variant="largeTitleBold"
              className={styles.emptyStateTitle}
            >
              Хочешь завести серийчика?
            </Typography>
            <Typography variant="body" className={styles.emptyStateText}>
              Создавать серию можно с Premium. Попроси друга с подпиской создать
              серийчика с тобой!
            </Typography>
            <Button
              onClick={handleInviteFriend}
              className={styles.inviteButton}
            >
              Позвать друга
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main state with partners list
  return (
    <div className={styles.mainPage}>
      {/* Header */}
      <div className={styles.header}>
        <Typography variant="largeTitleBold">Серии</Typography>
        <button
          className={styles.helpButton}
          onClick={() => {
            // TODO: Show help/info
          }}
          aria-label="Помощь"
        >
          <Typography variant="titleFirst">❓</Typography>
        </button>
      </div>

      {/* Partners List */}
      <div className={styles.listContainer}>
        {partners.length === 0 ? (
          <div className={styles.emptyList}>
            <Typography variant="body" style={{ color: "var(--text-second)" }}>
              Нет стриков
            </Typography>
          </div>
        ) : (
          <ul className={styles.partnersList}>
            {partners.map((partner) => {
              const partnerName = getPartnerName(partner);
              const secondaryText = getSecondaryText(partner);
              const streakEmoji = getStreakEmoji(partner.streakCount);
              const streakColor = getStreakColor(partner.streakCount);
              const avatarUrl =
                partner.toUserPhotoUrl || getAvatarFallback(partnerName);

              return (
                <li
                  key={partner.chatId}
                  className={styles.partnerItem}
                  onClick={() => navigate(`/streak/${partner.chatId}`)}
                >
                  <div className={styles.partnerAvatar}>
                    <img
                      src={avatarUrl}
                      alt={partnerName}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getAvatarFallback(partnerName);
                      }}
                    />
                  </div>
                  <div className={styles.partnerInfo}>
                    <div className={styles.partnerHeader}>
                      <Typography
                        variant="bodyBold"
                        className={styles.partnerName}
                        title={partnerName}
                      >
                        {partnerName.length > 20
                          ? `${partnerName.slice(0, 20)}...`
                          : partnerName}
                      </Typography>
                      {partner.streakCount > 0 && (
                        <div
                          className={styles.streakIndicator}
                          style={{ color: streakColor }}
                        >
                          <span>{streakEmoji}</span>
                          <Typography variant="bodyBold">
                            {partner.streakCount}
                          </Typography>
                        </div>
                      )}
                    </div>
                    {secondaryText && (
                      <Typography
                        variant="captionFirst"
                        className={styles.secondaryText}
                      >
                        {secondaryText}
                      </Typography>
                    )}
                  </div>
                  <div className={styles.arrow}>›</div>
                </li>
              );
            })}
          </ul>
        )}
        {hasNextPage && (
          <div className={styles.loadMoreContainer}>
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="secondary"
            >
              {isFetchingNextPage ? "Загрузка..." : "Загрузить еще"}
            </Button>
          </div>
        )}
      </div>

      {/* Fixed bottom button */}
      <div className={styles.bottomButton}>
        <Button onClick={handleInviteFriend}>Позвать друзей</Button>
      </div>
    </div>
  );
};

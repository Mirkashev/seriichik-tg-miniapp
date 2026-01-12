import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLaunchParams, shareURL, openLink } from "@tma.js/sdk-react";
import { usePartners } from "@/entities/partner";
import type { Partner } from "@/entities/partner";
import { Button } from "@/shared/ui/Button";
import { Typography } from "@/shared/ui/Typography";
import { getAvatarFallback } from "@/shared/utils/telegramPhoto";
import { BeforeStreakPremium } from "./ui/BeforeStreakPremium";
import { BeforeStreakNoPremium } from "./ui/BeforeStreakNoPremium";
import styles from "./StreaksPage.module.scss";

export const StreaksPage = () => {
  const navigate = useNavigate();
  const launchParams = useLaunchParams(true);
  const user = launchParams.tgWebAppData?.user;
  const userId = user?.id;

  const [showState, setShowState] = useState<
    "before-streak-premium" | "before-streak-no-premium" | "streaks" | null
  >(null);

  const isPremium = user?.isPremium;

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
    openLink("https://telegram.org/settings");
  };

  const handleInviteFriend = () => {
    shareURL("t.me", "Привет! Давай заведем серийчика!");
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

  // Empty states (before partners appear) - original logic
  if (partners.length === 0) {
    if (isPremium) {
      return (
        <BeforeStreakPremium
          onGoToSettings={handleGoToSettings}
          onCopyBotUsername={handleCopyBotUsername}
          onVideoInstructions={handleVideoInstructions}
          onSwitchToNoPremium={() => setShowState("before-streak-no-premium")}
          onSwitchToStreaks={() => setShowState("streaks")}
        />
      );
    }

    return (
      <BeforeStreakNoPremium
        onInviteFriend={handleInviteFriend}
        onSwitchToPremium={() => setShowState("before-streak-premium")}
        onSwitchToStreaks={() => setShowState("streaks")}
      />
    );
  }

  // Test mode: render based on showState if manually set
  if (showState === "before-streak-premium") {
    return (
      <BeforeStreakPremium
        onGoToSettings={handleGoToSettings}
        onCopyBotUsername={handleCopyBotUsername}
        onVideoInstructions={handleVideoInstructions}
        onSwitchToNoPremium={() => setShowState("before-streak-no-premium")}
        onSwitchToStreaks={() => setShowState(null)}
      />
    );
  }

  if (showState === "before-streak-no-premium") {
    return (
      <BeforeStreakNoPremium
        onInviteFriend={handleInviteFriend}
        onSwitchToPremium={() => setShowState("before-streak-premium")}
        onSwitchToStreaks={() => setShowState(null)}
      />
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

      {/* Test buttons */}
      <div style={{ padding: "8px 16px", display: "flex", gap: "8px" }}>
        <Button
          variant="secondary"
          onClick={() => setShowState("before-streak-premium")}
          style={{ fontSize: "12px", padding: "4px 8px" }}
        >
          → Premium
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowState("before-streak-no-premium")}
          style={{ fontSize: "12px", padding: "4px 8px" }}
        >
          → No Premium
        </Button>
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

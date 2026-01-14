import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLaunchParams,
  shareURL,
  postEvent,
  backButton,
} from "@tma.js/sdk-react";
import { usePartners } from "@/entities/partner";
import type { Partner } from "@/entities/partner";
import { Button } from "@/shared/ui/Button";
import { Typography } from "@/shared/ui/Typography";
import { Loader } from "@/shared/ui/Loader";
import { getAvatarFallback } from "@/shared/utils/telegramPhoto";
import { BeforeStreakPremium } from "./ui/BeforeStreakPremium";
import { BeforeStreakNoPremium } from "./ui/BeforeStreakNoPremium";
import HelpIcon from "@/assets/icons/question.svg?svgr";
import styles from "./StreaksPage.module.scss";
import { Input } from "@/shared/ui/Input";
import { useDebounce } from "@/shared/utils/hooks/useDebounce";
import SearchIcon from "@/assets/icons/search.svg?svgr";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg?svgr";
import { isIOS } from "react-device-detect";
import { Modal } from "@/shared/ui/Modal";
import seriichikIncoming from "@/assets/images/seriichik-incoming.png";

export const StreaksPage = () => {
  const navigate = useNavigate();
  const launchParams = useLaunchParams(true);
  const user = launchParams.tgWebAppData?.user;

  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(isIOS);

  // TODO: add search to backend
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  console.log(debouncedSearch);

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
  } = usePartners();

  console.log(data);

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

    if (partner.streakCount < 3) {
      return "Пет появится на 3-ий день";
    }
    // Можно добавить другие статусы
    return "";
  };

  const handleCopyBotUsername = () => {
    navigator.clipboard.writeText("@serichikbot");
  };

  const handleInviteFriend = () => {
    // TODO: после появления запроса на получение данных юзера добавить 2 новые модалки
    const text = "Привет! Давай заведем серийчика!";
    const botUrl = "@testMirkBot";

    // TODO: проверить работу на винде, возможно там будет работать нативно
    const isDesktop =
      /Mac|Windows|Linux/.test(navigator.platform) ||
      (navigator.userAgent.includes("Mac") &&
        !navigator.userAgent.includes("Mobile"));

    if (isDesktop) {
      // На десктопе открываем share ссылку в новом окне браузера
      const encodedText = encodeURIComponent(text);
      const encodedUrl = encodeURIComponent(
        `https://t.me/${botUrl.replace("@", "")}`
      );
      const shareLink = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;

      // Открываем в новом окне браузера
      window.open(shareLink, "_blank", "noopener,noreferrer");
      return;
    }

    // На мобильных устройствах используем shareURL из SDK
    shareURL(botUrl, text);
  };

  const handleVideoInstructions = () => {
    // TODO: Implement video instructions
  };

  useEffect(() => {
    if (partners.length > 0) {
      postEvent("web_app_set_background_color", { color: "#ffffff" });
      postEvent("web_app_set_header_color", { color: "#ffffff" });
      backButton.mount();
      backButton.hide();
    }
  }, [partners]);

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.page}>
        <Loader />
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
    <div className={styles.mainPage} style={{ paddingTop: isIOS ? "82px" : 0 }}>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.modalContent}>
          <img
            className={styles.modalImage}
            src={seriichikIncoming}
            alt="Серийчик"
          />
          <Typography variant="titleFirstBold">
            Серийчик скоро вылупится
          </Typography>
          <Typography className={styles.modalText} variant="titleSecond">
            Общайтесь 3 дня подряд, чтобы начать серию и смотрите как из яйца
            выплупится Серийчик
          </Typography>
          <Button
            className={styles.modalButton}
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Понятно
          </Button>
        </div>
      </Modal>
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
          <HelpIcon width={20} height={20} />
        </button>
      </div>

      {/* Test buttons */}
      <div
        style={{
          padding: "8px 16px",
          display: "flex",
          gap: "8px",
          position: "fixed",
          top: "128px",
          left: "0",
          right: "0",
          zIndex: 100,
        }}
      >
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

      <div className={styles.inputWrapper}>
        <Input
          iconLeft={<SearchIcon width={20} height={20} />}
          name="search-partners"
          placeholder="Имя или юзернейм"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
                  onClick={() => {
                    if (partner.pet)
                      return navigate(`/streak/${partner.chatId}`);

                    setIsModalOpen(true);
                  }}
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
                        variant="titleThirdBold"
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
                        variant="titleThird"
                        className={styles.secondaryText}
                      >
                        {secondaryText}
                      </Typography>
                    )}
                  </div>
                  <ChevronRightIcon width={20} height={20} />
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

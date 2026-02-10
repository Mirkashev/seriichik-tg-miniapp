import { useEffect, useMemo, useRef, useState, } from "react";
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
import { getAvatarFallback } from "@/shared/utils/helpers/telegramPhoto";
import { sanitizeUtf16 } from "@/shared/utils/helpers/sanitizeUtf16";
import { BeforeStreakPremium } from "./ui/BeforeStreakPremium";
import { BeforeStreakNoPremium } from "./ui/BeforeStreakNoPremium";
import { PartnerItem } from "./ui/PartnerItem";
import HelpIcon from "@/assets/icons/question.svg?svgr";
import styles from "./StreaksPage.module.scss";
import { Input } from "@/shared/ui/Input";
import { useDebounce } from "@/shared/utils/hooks/useDebounce";
import SearchIcon from "@/assets/icons/search.svg?svgr";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg?svgr";
import { isMobile } from "react-device-detect";
import { Modal } from "@/shared/ui/Modal";
import seriichikIncoming from "@/assets/images/seriichik-incoming.png";
import { useMe, useUpdateTimezone } from "@/entities/user";
import { BeforeStreakPremiumConnected } from "./ui/BeforeStreakPremiumConnected";
import { useSearchPartners } from "@/entities/partner/queries";

import StreakImgNoPet from '@/assets/images/badges/no-pet.png'
import StreakImgFirst from '@/assets/images/badges/1.png'
import StreakImgSecond from '@/assets/images/badges/2.png'
import StreakImgThird from '@/assets/images/badges/3.png'


const text =
  "👋 Привет! Присоединяйся к Серийчик Боту!\n\nЯ помогу тебе отслеживать серии общения и развивать виртуального пета.";

const textNoPremium =
  "👋 Привет! У есть тебя премиум подписка? Давай вместе растить серийчика!";

export const StreaksPage = () => {
  const navigate = useNavigate();
  const launchParams = useLaunchParams(true);
  const user = launchParams.tgWebAppData?.user;

  const ref = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isNoPremiumModalOpen, setIsNoPremiumModalOpen] = useState(false);

  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const isPremium = user?.isPremium;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = usePartners(20);

  const { data: searchData, isLoading: isSearchLoading } = useSearchPartners(
    20,
    debouncedSearch
  );

  const { data: userData, isLoading: isUserDataLoading } = useMe();
  const { mutate: updateTimezone } = useUpdateTimezone();

  const searchPartners = useMemo(() => {
    return searchData?.pages.flatMap((page) => page.partners) ?? [];
  }, [searchData]);

  const partners = useMemo(() => {
    return data?.pages.flatMap((page) => page.partners) ?? [];
  }, [data]);

  const getPartnerName = (partner: Partner) => {
    if (partner.toUserFirstName || partner.toUserLastName) {
      return sanitizeUtf16(
        [partner.toUserFirstName, partner.toUserLastName]
          .filter(Boolean)
          .join(" ")
      );
    }
    return sanitizeUtf16(partner.toUserUsername) || "Unknown";
  };

  const getStreakEmoji = (count: number): string => {
    if (count > 100) return StreakImgThird;
    if (count > 30) return StreakImgSecond;
    if (count > 2) return StreakImgFirst;
    return StreakImgNoPet
  };

  const getStreakColor = (count: number): string => {
    if (count > 100) return "#D841A5";
    if (count > 30) return "#F15C1E";
    return "#FB8A0E";
  };

  const getSecondaryText = (partner: Partner): string => {
    if (partner.pet?.name) {
      return sanitizeUtf16(partner.pet.name);
    }

    if (partner.streakCount < 3) {
      return "Пет появится на 3-ий день";
    }
    return "";
  };

  const handleCopyBotUsername = () => {
    navigator.clipboard.writeText(import.meta.env.VITE_BOT_NAME);
  };

  const handleInviteFriend = (text: string) => () => {
    // TODO: после появления запроса на получение данных юзера добавить 2 новые модалки

    const botUrl = `https://t.me/${import.meta.env.VITE_BOT_NAME}`;

    // TODO: проверить работу на винде, возможно там будет работать нативно
    const isDesktop =
      /Mac|Windows|Linux/.test(navigator.platform) ||
      (navigator.userAgent.includes("Mac") &&
        !navigator.userAgent.includes("Mobile"));

    // TODO: добавить в модалку инлайн кнопку с редиректом на бота
    if (isDesktop) {
      // На десктопе открываем share ссылку в новом окне браузера
      const encodedText = encodeURIComponent("\n" + text);
      const encodedUrl = encodeURIComponent(botUrl);
      const shareLink = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;

      // Открываем в новом окне браузера
      window.open(shareLink, "_blank", "noopener,noreferrer");
      return;
    }

    // На мобильных устройствах используем shareURL из SDK
    shareURL(botUrl, text);
  };

  const handleOpenPremiumModal = () => {
    setIsPremiumModalOpen(true);
  };

  const handleOpenNoPremiumModal = () => {
    setIsNoPremiumModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setSearchModalOpen(false);
    setSearch("");
  };

  const handleVideoInstructions = () => {
    // TODO: Implement video instructions
  };

  useEffect(() => {
    if (partners.length > 0) {
      try {
        postEvent("web_app_set_background_color", { color: "#ffffff" });
        postEvent("web_app_set_header_color", { color: "#ffffff" });
        backButton.mount();
        backButton.hide();
      } catch (error: unknown) {
        console.warn("Failed to set background color:", error);
      }
    }
  }, [partners]);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [searchModalOpen]);

  useEffect(() => {
    if (userData) {
      const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Проверяем, нужно ли обновлять таймзону
      if (userData.timeZone !== browserTimeZone) {
        // Если есть дата последнего обновления, проверяем прошло ли 48 часов
        if (userData.timeZoneUpdatedAt) {
          const lastUpdated = new Date(userData.timeZoneUpdatedAt);
          const hoursSinceUpdate =
            (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60);

          // Обновляем только если прошло >= 48 часов
          if (hoursSinceUpdate >= 48) {
            updateTimezone();
          }
        } else {
          // Если даты нет (первый раз), обновляем сразу
          updateTimezone();
        }
      }
    }
  }, [userData, updateTimezone]);

  // Loading state
  if (isLoading || isUserDataLoading) {
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
        <Typography variant="textXlBold">Ошибка загрузки</Typography>
      </div>
    );
  }

  if (partners.length === 0) {
    if (isPremium) {
      if (userData?.isBotOwner) {
        return (
          <BeforeStreakPremiumConnected
            onInviteFriend={handleInviteFriend(text)}
          />
        );
      }

      return (
        <BeforeStreakPremium
          onCopyBotUsername={handleCopyBotUsername}
          onVideoInstructions={handleVideoInstructions}
        />
      );
    }

    return (
      <BeforeStreakNoPremium
        onInviteFriend={handleInviteFriend(textNoPremium)}
      />
    );
  }

  // Main state with partners list
  return (
    <div className={styles.mainPage} style={{ paddingTop: isMobile ? "82px" : 0 }}>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.modalContent}>
          <img
            className={styles.modalImage}
            src={seriichikIncoming}
            alt="Серийчик"
          />
          <Typography className={styles.modalTitle} variant="displayXsSemibold">
            Серийчик скоро вылупится
          </Typography>
          <Typography className={styles.modalText} variant="textMd">
            Общайтесь 3 дня подряд, чтобы начать серию и смотрите как из яйца
            вылупится Серийчик
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

      <Modal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      >
        <div className={styles.modalContent}>
          <img
            className={styles.modalImage}
            src={seriichikIncoming}
            alt="Премиум"
          />
          <Typography variant="displayXsSemibold">
            Серийчик с друзьями
          </Typography>
          <Typography className={styles.modalText} variant="textMd">
            Чтобы расти Серийчика вместе с друзьями, подключи бота к Telegram
            Business
          </Typography>
          <Button
            className={styles.modalButton}
            onClick={handleVideoInstructions}
          >
            Как подключить?
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isNoPremiumModalOpen}
        onClose={() => setIsNoPremiumModalOpen(false)}
      >
        <div className={styles.modalContent}>
          <img
            className={styles.modalImage}
            src={seriichikIncoming}
            alt="Премиум"
          />
          <Typography variant="displayXsSemibold">
            Хочешь завести серийчика?
          </Typography>
          <Typography className={styles.modalText} variant="textMd">
            Создавать серию можно с Premium. Попроси друга с подпиской создать
            серийчика с тобой!
          </Typography>
          <Button
            className={styles.modalButton}
            onClick={handleInviteFriend(textNoPremium)}
          >
            Позвать друга
          </Button>
        </div>
      </Modal>

      <Modal isOpen={searchModalOpen} onClose={handleCloseSearchModal}>
        <div
          onClick={(e) => e.stopPropagation()}
          className={styles.searchModalContent}
          style={{ paddingTop: isMobile ? "82px" : 0 }}
        >
          <div className={styles.searchModalHeader}>
            <button
              className={styles.searchModalCloseButton}
              onClick={handleCloseSearchModal}
            >
              <ChevronRightIcon
                style={{ transform: "rotate(180deg)" }}
                width={20}
                height={20}
              />
            </button>
            <Typography variant="displayXsBold">Поиск</Typography>
          </div>

          <div className={styles.searchModalBody}>
            <div className={styles.searchModalInput}>
              <Input
                iconLeft={<SearchIcon width={20} height={20} />}
                name="search-partners"
                placeholder="Имя или юзернейм"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                ref={ref}
              />
            </div>

            <div className={styles.searchModalResults}>
              {isSearchLoading && (
                <div className={styles.searchModalLoader}>
                  <Loader />
                </div>
              )}

              {!isSearchLoading && (
                <div className={styles.listContainer} style={{ marginTop: 16 }}>
                  {searchPartners.length === 0 ? (
                    <div className={styles.emptyList}>
                      <Typography variant="textLgSemibold">
                        Ничего не нашли
                      </Typography>
                    </div>
                  ) : (
                    <ul className={styles.partnersList}>
                      {searchPartners.map((partner) => {
                        const partnerName = getPartnerName(partner);
                        const secondaryText = getSecondaryText(partner);
                        const streakEmoji = getStreakEmoji(partner.streakCount);
                        const streakColor = getStreakColor(partner.streakCount);
                        const avatarUrl =
                          partner.toUserPhotoUrl ||
                          getAvatarFallback(partnerName);

                        return (
                          <PartnerItem
                            key={partner.chatId}
                            partner={partner}
                            partnerName={partnerName}
                            secondaryText={secondaryText}
                            streakEmoji={streakEmoji}
                            streakColor={streakColor}
                            avatarUrl={avatarUrl}
                            onItemClick={() => {
                              if (partner.pet)
                                return navigate(`/streak/${partner.chatId}`);
                              setIsModalOpen(true);
                            }}
                          />
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
              )}
            </div>
          </div>
        </div>
      </Modal>
      {/* Header */}
      <div className={styles.header}>
        <Typography variant="displayXsBold">Серии</Typography>
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

      <div className={styles.inputWrapper}>
        <Input
          iconLeft={<SearchIcon width={20} height={20} />}
          name="search-partners"
          placeholder="Имя или юзернейм"
          onClick={() => setSearchModalOpen(true)}
          value={""}
          onFocus={(e) => {
            e.target.blur();
          }}
        />
      </div>

      {/* Partners List */}
      <div className={styles.listContainer}>
        {partners.length === 0 ? (
          <div className={styles.emptyList}>
            <Typography
              variant="textXs"
              style={{ color: "var(--text-second)" }}
            >
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
                <PartnerItem
                  key={partner.chatId}
                  partner={partner}
                  partnerName={partnerName}
                  secondaryText={secondaryText}
                  streakEmoji={streakEmoji}
                  streakColor={streakColor}
                  avatarUrl={avatarUrl}
                  onItemClick={() => {
                    if (partner.pet) return navigate(`/streak/${partner.chatId}`);
                    setIsModalOpen(true);
                  }}
                />
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
        <Button
          onClick={
            isPremium && !userData?.isBotOwner
              ? handleOpenPremiumModal
              : !isPremium
                ? handleOpenNoPremiumModal
                : handleInviteFriend(isPremium ? text : textNoPremium)
          }
        >
          Предложить серию
        </Button>
      </div>
    </div>
  );
};

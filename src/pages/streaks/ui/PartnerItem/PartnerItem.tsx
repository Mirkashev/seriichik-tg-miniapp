import { Typography } from "@/shared/ui/Typography";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg?svgr";
import IconAlert from "@/assets/icons/alert-triangle.svg?svgr";
import { getAvatarFallback } from "@/shared/utils/helpers/telegramPhoto";
import type { Partner } from "@/entities/partner";
import styles from "./PartnerItem.module.scss";
import { useState } from "react";

interface PartnerItemProps {
  partner: Partner;
  partnerName: string;
  secondaryText: string;
  streakEmoji: string;
  streakColor: string;
  avatarUrl: string;
  onItemClick: () => void;
}

export const PartnerItem = ({
  partner,
  partnerName,
  secondaryText,
  streakEmoji,
  streakColor,
  avatarUrl,
  onItemClick,
}: PartnerItemProps) => {

  const [showAlert, setShowAlert] = useState(false);
  return (
    <li className={styles.partnerItem} onClick={onItemClick}>
      {!partner.isActive && (
        <div className={styles.notActiveBadge}>
          <button
            className={styles.notActiveBadgeAction}
            onClick={(e) => {
              e.stopPropagation();
              setShowAlert((prev) => !prev)
            }}
          >
            <IconAlert />
          </button>
          {showAlert && <div className={styles.notActiveBadgeTextWrapper}>
            <Typography variant="textXs">
              Серийчик не работает! Добавьте бота
            </Typography>
          </div>}
        </div>
      )}
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
            variant="textMdSemibold"
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
              <img className={styles.streakIcon} src={streakEmoji} alt="streak" />
              <Typography variant="textMdSemibold">
                {partner.streakCount}
              </Typography>
            </div>
          )}
        </div>
        {secondaryText && (
          <Typography variant="textMd" className={styles.secondaryText}>
            {secondaryText}
          </Typography>
        )}
      </div>
      <ChevronRightIcon width={20} height={20} />
    </li>
  );
};

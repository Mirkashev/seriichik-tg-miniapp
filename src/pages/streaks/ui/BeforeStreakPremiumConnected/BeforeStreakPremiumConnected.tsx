import { Typography } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import styles from "./BeforeStreakPremiumConnected.module.scss";
import character from "@/assets/images/no-premium-pet.png";
import { isMobile } from "react-device-detect";
import HelpIcon from "@/assets/icons/question.svg?svgr";

interface BeforeStreakNoPremiumProps {
  onInviteFriend: () => void;
}

export const BeforeStreakPremiumConnected = ({
  onInviteFriend,
}: BeforeStreakNoPremiumProps) => {
  return (
    <div
      className={styles.page}
      style={{ paddingTop: isMobile ? "100px" : "24px" }}
    >
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

      <div className={styles.emptyState}>
        <img src={character} alt="Character" className={styles.character} />
        <div className={styles.emptyStateContent}>
          <Typography
            variant="displayXsBold"
            className={styles.emptyStateTitle}
          >
            Тут появятся ваши серии
          </Typography>
          <Typography variant="textMd" className={styles.emptyStateText}>
            Напиши друзьям и дождись ответа, чтобы начать серию. Через 3 дня
            Серийчик вылупится, и вы сможете его растить
          </Typography>
          <Button onClick={onInviteFriend} className={styles.inviteButton}>
            Предложить серию
          </Button>
        </div>
      </div>
    </div>
  );
};

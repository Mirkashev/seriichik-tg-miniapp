import { Typography } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import styles from "./BeforeStreakNoPremium.module.scss";
import character from "@/assets/images/no-premium-pet.png";
import { isIOS } from "react-device-detect";

interface BeforeStreakNoPremiumProps {
  onInviteFriend: () => void;
  onSwitchToPremium: () => void;
  onSwitchToStreaks: () => void;
}

export const BeforeStreakNoPremium = ({
  onInviteFriend,
  onSwitchToPremium,
  onSwitchToStreaks,
}: BeforeStreakNoPremiumProps) => {
  return (
    <div className={styles.page} style={{ paddingTop: isIOS ? "100px" : 0 }}>
      <div className={styles.emptyState}>
        <img src={character} alt="Character" className={styles.character} />
        <div className={styles.emptyStateContent}>
          <Typography
            variant="titleFirstBold"
            className={styles.emptyStateTitle}
          >
            Хочешь завести серийчика?
          </Typography>
          <Typography variant="titleSecond" className={styles.emptyStateText}>
            Создавать серию можно с Premium. Попроси друга с подпиской создать
            серийчика с тобой!
          </Typography>
          <Button onClick={onInviteFriend} className={styles.inviteButton}>
            Позвать друга
          </Button>
        </div>
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
          onClick={onSwitchToPremium}
          style={{ fontSize: "12px", padding: "4px 8px" }}
        >
          → Premium
        </Button>
        <Button
          variant="secondary"
          onClick={onSwitchToStreaks}
          style={{ fontSize: "12px", padding: "4px 8px" }}
        >
          → Streaks
        </Button>
      </div>
    </div>
  );
};

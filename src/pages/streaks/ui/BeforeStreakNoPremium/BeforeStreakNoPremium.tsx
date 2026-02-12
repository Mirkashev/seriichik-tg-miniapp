import { Typography } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import styles from "./BeforeStreakNoPremium.module.scss";
import character from "@/assets/images/no-premium-pet.png";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import { useLaunchParams } from "@tma.js/sdk-react";

interface BeforeStreakNoPremiumProps {
  onInviteFriend: () => void;
}

export const BeforeStreakNoPremium = ({
  onInviteFriend,
}: BeforeStreakNoPremiumProps) => {
  const launchParams = useLaunchParams(true);
  const user = launchParams.tgWebAppData?.user;

  useEffect(() => {
    try {
      ym(106770151, 'params', {
        type: 'onboarding_started',
        premium: user?.isPremium
      });
    } catch (error) {
      console.log(error)
    }

  }, [user?.isPremium])

  return (
    <div className={styles.page} style={{ paddingTop: isMobile ? "100px" : 0 }}>
      <div className={styles.emptyState}>
        <img src={character} alt="Character" className={styles.character} />
        <div className={styles.emptyStateContent}>
          <Typography
            variant="displayXsBold"
            className={styles.emptyStateTitle}
          >
            Хочешь завести серийчика?
          </Typography>
          <Typography variant="textMd" className={styles.emptyStateText}>
            Создавать серию можно с Premium. Попроси друга с подпиской создать
            серийчика с тобой!
          </Typography>
          <Button onClick={onInviteFriend} className={styles.inviteButton}>
            Позвать друга
          </Button>
        </div>
      </div>
    </div>
  );
};

import { toast } from "sonner";
import { Typography } from "@/shared/ui/Typography";
// import { Button } from "@/shared/ui/Button";
import styles from "./BeforeStreakPremium.module.scss";
import CopyIcon from "@/assets/icons/copy.svg?svgr";
import telegramBusinessImg from "@/assets/images/telegram-business.png";
import botsImg from "@/assets/images/chat-bots.png";
import { isMobile } from "react-device-detect";

interface BeforeStreakPremiumProps {
  onCopyBotUsername: () => void;
  onVideoInstructions: () => void;
}

export const BeforeStreakPremium = ({
  onCopyBotUsername,
  onVideoInstructions,
}: BeforeStreakPremiumProps) => {
  console.log(onVideoInstructions);
  return (
    <div
      className={styles.page}
      style={{ paddingTop: isMobile ? "100px" : "24px" }}
    >
      <div className={styles.premiumGuide}>
        <Typography variant="displayXsSemibold" className={styles.guideTitle}>
          Как завести серийчика?
        </Typography>
        {/* Step 1 */}
        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>
            <Typography variant="textXs">1</Typography>
          </div>
          <div className={styles.stepContent}>
            <Typography variant="textMdSemibold" className={styles.stepText}>
              Открой Настройки в Telegram
            </Typography>
          </div>
        </div>

        {/* Step 2 */}
        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>
            <Typography variant="textXs">2</Typography>
          </div>
          <div className={styles.stepContent}>
            <Typography variant="textMdSemibold" className={styles.stepText}>
              Нажми «Telegram для бизнеса»
            </Typography>
            <img className={styles.telegramBusinessImg} src={telegramBusinessImg} alt="Telegram для бизнеса" />
          </div>
        </div>

        {/* Step 3 */}
        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>
            <Typography variant="textXs">3</Typography>
          </div>
          <div className={styles.stepContent}>
            <Typography variant="textMdSemibold" className={styles.stepText}>
              Открой раздел «Чат-боты»
            </Typography>
            <img className={styles.botsImg} src={botsImg} alt="Чат-боты" />
          </div>
        </div>

        {/* Step 4 */}
        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>
            <Typography variant="textXs">4</Typography>
          </div>
          <div className={styles.stepContent}>
            <Typography variant="textMdSemibold" className={styles.stepText}>
              Добавь этого бота
            </Typography>
            <button
              onClick={() => {
                onCopyBotUsername();
                toast.success("Скопировано в буфер обмена", {
                  icon: <CopyIcon width={20} height={20} />,
                  id: "copy-toast"
                });
              }}
              aria-label="Копировать" className={styles.botInput}>
              <Typography variant="textMd" className={styles.botUsername}>
                @{import.meta.env.VITE_BOT_NAME}
              </Typography>
              <CopyIcon
                className={styles.copyIcon} width={20} height={20} />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        {/* <Button onClick={onVideoInstructions}>Видео инструкция</Button> */}
      </div>
    </div>
  );
};

import { toast } from "sonner";
import { Typography } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import styles from "./BeforeStreakPremium.module.scss";
import CopyIcon from "@/assets/icons/copy.svg?svgr";
import telegramBusinessImg from "@/assets/images/telegram-business.png";
import botsImg from "@/assets/images/chat-bots.png";
import { isIOS } from "react-device-detect";

interface BeforeStreakPremiumProps {
  onCopyBotUsername: () => void;
  onVideoInstructions: () => void;
  onSwitchToNoPremium: () => void;
  onSwitchToStreaks: () => void;
}

export const BeforeStreakPremium = ({
  onCopyBotUsername,
  onVideoInstructions,
  onSwitchToNoPremium,
  onSwitchToStreaks,
}: BeforeStreakPremiumProps) => {
  return (
    <div
      className={styles.page}
      style={{ paddingTop: isIOS ? "100px" : "24px" }}
    >
      <div className={styles.premiumGuide}>
        <Typography variant="textXlBold" className={styles.guideTitle}>
          Как завести серийчика?
        </Typography>
        {/* Step 1 */}
        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>
            <Typography variant="textSm">1</Typography>
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
            <Typography variant="textSm">2</Typography>
          </div>
          <div className={styles.stepContent}>
            <Typography variant="textMdSemibold" className={styles.stepText}>
              Нажми «Telegram для бизнеса»
            </Typography>
            <img src={telegramBusinessImg} alt="Telegram для бизнеса" />
          </div>
        </div>

        {/* Step 3 */}
        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>
            <Typography variant="textSm">3</Typography>
          </div>
          <div className={styles.stepContent}>
            <Typography variant="textMdSemibold" className={styles.stepText}>
              Открой раздел «Чат-боты»
            </Typography>
            <img src={botsImg} alt="Чат-боты" />
          </div>
        </div>

        {/* Step 4 */}
        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>
            <Typography variant="textSm">4</Typography>
          </div>
          <div className={styles.stepContent}>
            <Typography variant="textMdSemibold" className={styles.stepText}>
              Добавь этого бота
            </Typography>
            <div className={styles.botInput}>
              <Typography variant="textMd" className={styles.botUsername}>
                @serichikbot
              </Typography>
              <button
                className={styles.copyIcon}
                onClick={() => {
                  onCopyBotUsername();
                  toast.success("Скопировано");
                }}
                aria-label="Копировать"
              >
                <CopyIcon width={16} height={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button onClick={onVideoInstructions}>Видео инструкция</Button>
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
          onClick={onSwitchToNoPremium}
          style={{ fontSize: "12px", padding: "4px 8px" }}
        >
          → No Premium
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

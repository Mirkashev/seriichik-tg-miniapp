import { toast } from "sonner";
import { Typography } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import styles from "./BeforeStreakPremium.module.scss";
import CopyIcon from "@/assets/icons/copy.svg?svgr";
import telegramBusinessImg from "@/assets/images/telegram-business.png";
import botsImg from "@/assets/images/chat-bots.png";

interface BeforeStreakPremiumProps {
  onGoToSettings: () => void;
  onCopyBotUsername: () => void;
  onVideoInstructions: () => void;
  onSwitchToNoPremium: () => void;
  onSwitchToStreaks: () => void;
}

export const BeforeStreakPremium = ({
  onGoToSettings,
  onCopyBotUsername,
  onVideoInstructions,
  onSwitchToNoPremium,
  onSwitchToStreaks,
}: BeforeStreakPremiumProps) => {
  return (
    <div className={styles.page}>
      <div className={styles.premiumGuide}>
        <Typography variant="titleFirstBold" className={styles.guideTitle}>
          Как завести серийчика?
        </Typography>
        {/* Step 1 */}
        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>
            <Typography variant="body">1</Typography>
          </div>
          <div className={styles.stepContent}>
            <Typography variant="titleThirdBold" className={styles.stepText}>
              Открой Настройки в Telegram
            </Typography>
          </div>
        </div>

        {/* Step 2 */}
        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>
            <Typography variant="body">2</Typography>
          </div>
          <div className={styles.stepContent}>
            <Typography variant="titleThirdBold" className={styles.stepText}>
              Нажми «Telegram для бизнеса»
            </Typography>
            <img src={telegramBusinessImg} alt="Telegram для бизнеса" />
          </div>
        </div>

        {/* Step 3 */}
        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>
            <Typography variant="body">3</Typography>
          </div>
          <div className={styles.stepContent}>
            <Typography variant="titleThirdBold" className={styles.stepText}>
              Открой раздел «Чат-боты»
            </Typography>
            <img src={botsImg} alt="Чат-боты" />
          </div>
        </div>

        {/* Step 4 */}
        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>
            <Typography variant="body">4</Typography>
          </div>
          <div className={styles.stepContent}>
            <Typography variant="titleThirdBold" className={styles.stepText}>
              Добавь этого бота
            </Typography>
            <div className={styles.botInput}>
              <Typography variant="titleThird" className={styles.botUsername}>
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
        <Button onClick={onGoToSettings}>Перейти в настройки</Button>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onVideoInstructions();
          }}
          className={styles.videoLink}
        >
          <Button variant="secondary">Видео инструкция</Button>
        </a>
      </div>

      {/* Test buttons */}
      <div
        style={{
          padding: "8px 16px",
          display: "flex",
          gap: "8px",
          position: "fixed",
          top: "16px",
          left: "0",
          right: "0",
          zIndex: 100,
          backgroundColor: "#fff9e6",
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

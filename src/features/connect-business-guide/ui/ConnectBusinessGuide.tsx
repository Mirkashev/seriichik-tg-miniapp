import { toast } from 'sonner';
import { Typography } from '@/shared/ui/Typography';
import styles from './ConnectBusinessGuide.module.scss';
import CopyIcon from '@/assets/icons/copy.svg?svgr';
import { isMobile, isIOS } from 'react-device-detect';
import { useEffect } from 'react';
import { trackAmplitude } from '@/shared/analytics/track';
import firstIos from '@/assets/images/guide/first-ios.png';
import firstAndroid from '@/assets/images/guide/first-android.png';
import firstAndroidSecondary from '@/assets/images/guide/first-2-android.png';
import secondIos from '@/assets/images/guide/second-ios.png';
import secondAndroid from '@/assets/images/guide/second-android.png';
// import buttonStyles from '@/shared/ui/Button/Button.module.scss';

// const VIDEO_INSTRUCTION_START_PARAM = 'video_instruction';

interface ConnectBusinessGuideProps {
  onCopyBotUsername: () => void;
}

export const ConnectBusinessGuide = ({
  onCopyBotUsername,
}: ConnectBusinessGuideProps) => {
  useEffect(() => {
    trackAmplitude('onboarding_started');
  }, []);

  return (
    <div
      className={styles.page}
      style={{ paddingTop: isMobile ? '100px' : '24px' }}
    >
      <div className={styles.premiumGuide}>
        <Typography variant='displayXsSemibold' className={styles.guideTitle}>
          Как завести серийчика?
        </Typography>
        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>
            <Typography variant='textXs'>1</Typography>
          </div>
          <div className={styles.stepContent}>
            <Typography variant='textMdSemibold' className={styles.stepText}>
              {isIOS
                ? 'Откройте свой профиль и нажмите «Изм.»'
                : 'Откройте свой профиль, перейдите в настройки, нажмите аккаунт'}
            </Typography>
            <img src={isIOS ? firstIos : firstAndroid} />
            {!isIOS && <img src={firstAndroidSecondary} />}
          </div>
        </div>

        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>
            <Typography variant='textXs'>2</Typography>
          </div>
          <div className={styles.stepContent}>
            <Typography variant='textMdSemibold' className={styles.stepText}>
              Найдите «Автоматизация чатов»
            </Typography>
            <img src={isIOS ? secondIos : secondAndroid} />
          </div>
        </div>

        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>
            <Typography variant='textXs'>3</Typography>
          </div>
          <div className={styles.stepContent}>
            <Typography variant='textMdSemibold' className={styles.stepText}>
              Введите @{import.meta.env.VITE_BOT_NAME} и нажмите «Добавить»
            </Typography>
            <button
              onClick={() => {
                onCopyBotUsername();
                toast.success('Скопировано в буфер обмена', {
                  icon: <CopyIcon width={20} height={20} />,
                  id: 'copy-toast',
                });
              }}
              aria-label='Копировать'
              className={styles.botInput}
            >
              <Typography variant='textMd' className={styles.botUsername}>
                @{import.meta.env.VITE_BOT_NAME}
              </Typography>
              <CopyIcon className={styles.copyIcon} />
            </button>
          </div>
        </div>

        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>
            <Typography variant='textXs'>4</Typography>
          </div>
          <div className={styles.stepContent}>
            <Typography variant='textMdSemibold' className={styles.stepText}>
              Введите @{import.meta.env.VITE_BOT_NAME} в чате с другом
            </Typography>
            <div className={styles.separator}>
              <div className={styles.separatorVisual} />
              <Typography variant='textXs'>или</Typography>
              <div className={styles.separatorVisual} />
            </div>

            <Typography variant='textMdSemibold' className={styles.stepText}>
              Нажмите кнопку «Предложить серию» в приложении
            </Typography>
          </div>
        </div>
      </div>

      {/* <div className={styles.actions}>
        <Typography
          as='a'
          variant='textMdSemibold'
          href={`https://t.me/${import.meta.env.VITE_BOT_NAME}?start=${VIDEO_INSTRUCTION_START_PARAM}`}
          target='_blank'
          rel='noopener noreferrer'
          className={`${styles.videoInstructionLink} ${buttonStyles.button} ${buttonStyles.main}`}
        >
          Видео инструкция
        </Typography>
      </div> */}
    </div>
  );
};

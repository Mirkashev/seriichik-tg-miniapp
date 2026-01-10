import type { HTMLAttributes } from 'react';
import styles from './ProgressBar.module.scss';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
}

export const ProgressBar = ({
  value,
  max = 100,
  showLabel = false,
  className = '',
  ...props
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`${styles.wrapper} ${className}`} {...props}>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <span className={styles.label}>
          {value} / {max}
        </span>
      )}
    </div>
  );
};

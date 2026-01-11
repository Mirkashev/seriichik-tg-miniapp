import type { HTMLAttributes } from 'react';
import styles from './ProgressBar.module.scss';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: string;
  striped?: boolean;
  labelPosition?: 'inside' | 'outside';
}

export const ProgressBar = ({
  value,
  max = 100,
  showLabel = false,
  color,
  striped = false,
  labelPosition = 'outside',
  className = '',
  ...props
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`${styles.wrapper} ${className}`} {...props}>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${striped ? styles.striped : ''}`}
          style={{ 
            width: `${percentage}%`,
            ...(color && { backgroundColor: color })
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          {showLabel && labelPosition === 'inside' && (
            <span className={styles.labelInside}>
              {value} / {max}
            </span>
          )}
        </div>
      </div>
      {showLabel && labelPosition === 'outside' && (
        <span className={styles.label}>
          {value} / {max}
        </span>
      )}
    </div>
  );
};

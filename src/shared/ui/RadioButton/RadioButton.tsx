import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './RadioButton.module.scss';

export interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={styles.wrapper}>
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className={`${styles.radio} ${className}`}
          {...props}
        />
        {label && (
          <label htmlFor={radioId} className={styles.label}>
            {label}
          </label>
        )}
      </div>
    );
  }
);

RadioButton.displayName = 'RadioButton';

import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.scss';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const checkboxId = id ?? "";

    return (
      <div className={styles.wrapper}>
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={`${styles.checkbox} ${className}`}
          {...props}
        />
        {label && (
          <label htmlFor={checkboxId} className={styles.label}>
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

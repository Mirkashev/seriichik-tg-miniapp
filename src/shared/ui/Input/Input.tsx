import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./Input.module.scss";
import { Typography } from "../Typography";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, iconLeft, iconRight, className = "", ...props }, ref) => {
    const hasIcons = iconLeft || iconRight;

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={props.id} className={styles.label}>
            {label}
          </label>
        )}
        <div
          className={`${styles.inputContainer} ${hasIcons ? styles.withIcons : ""}`}
        >
          {iconLeft && <div className={styles.iconLeft}>{iconLeft}</div>}
          <Typography
            variant="textMd"
            as="input"
            ref={ref}
            className={`${styles.input} ${error ? styles.error : ""} ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />

          {iconRight && <div className={styles.iconRight}>{iconRight}</div>}
        </div>
        {error && (
          <span
            id={`${props.id}-error`}
            className={styles.errorMessage}
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

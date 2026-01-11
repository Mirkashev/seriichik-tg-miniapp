import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";
import { Typography } from "../Typography/Typography";

export type ButtonVariant = "main" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  disabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "main", disabled = false, className = "", ...props }, ref) => {
    const classNames = [
      styles.button,
      styles[variant],
      disabled ? styles.disabled : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Typography
        as="button"
        variant="titleThirdBold"
        ref={ref}
        className={classNames}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

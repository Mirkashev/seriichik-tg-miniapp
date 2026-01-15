import { forwardRef } from "react";
import type { ReactNode } from "react";
import styles from "./Typography.module.scss";

export type TypographyVariant =
  // Text variants
  | "textXs"
  | "textXsMedium"
  | "textXsSemibold"
  | "textXsBold"
  | "textSm"
  | "textSmMedium"
  | "textSmSemibold"
  | "textSmBold"
  | "textMd"
  | "textMdMedium"
  | "textMdSemibold"
  | "textMdBold"
  | "textLg"
  | "textLgMedium"
  | "textLgSemibold"
  | "textLgBold"
  | "textXl"
  | "textXlMedium"
  | "textXlSemibold"
  | "textXlBold"
  // Display variants
  | "displayXs"
  | "displayXsMedium"
  | "displayXsSemibold"
  | "displayXsBold"
  | "displaySm"
  | "displaySmMedium"
  | "displaySmSemibold"
  | "displaySmBold"
  | "displayMd"
  | "displayMdMedium"
  | "displayMdSemibold"
  | "displayMdBold"
  | "displayLg"
  | "displayLgMedium"
  | "displayLgSemibold"
  | "displayLgBold"
  | "displayXl"
  | "displayXlMedium"
  | "displayXlSemibold"
  | "displayXlBold"
  | "display2xl"
  | "display2xlMedium"
  | "display2xlSemibold"
  | "display2xlBold";

export interface TypographyProps {
  variant: TypographyVariant;
  children?: ReactNode;
}

export const Typography: PolymorphicComponentWithRef<"span", TypographyProps> =
  forwardRef(({ variant, className, children, as, ...props }, ref) => {
    const Tag = as ?? "span";
    const classNames = [styles.typography, styles[variant], className]
      .filter(Boolean)
      .join(" ");

    return (
      <Tag ref={ref} className={classNames} {...props}>
        {children}
      </Tag>
    );
  });

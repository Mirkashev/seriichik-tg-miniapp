import { forwardRef } from "react";
import type { ReactNode } from "react";
import styles from "./Typography.module.scss";

export type TypographyVariant =
  | "largeTitle"
  | "largeTitleBold"
  | "titleFirst"
  | "titleFirstBold"
  | "titleSecond"
  | "titleSecondBold"
  | "titleThird"
  | "titleThirdBold"
  | "headline"
  | "headlineBold"
  | "body"
  | "bodyBold"
  | "callout"
  | "calloutBold"
  | "subHeadline"
  | "subHeadlineBold"
  | "footNote"
  | "footNoteBold"
  | "captionFirst"
  | "captionFirstBold"
  | "captionSecond"
  | "captionSecondBold";

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

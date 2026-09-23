import type { CSSProperties, ReactNode } from "react";

export type TextVariant =
  | "displayLarge"
  | "headlineMedium"
  | "headlineSmall"
  | "titleLarge"
  | "titleMedium"
  | "titleSmall"
  | "bodyLarge"
  | "bodyMedium"
  | "bodySmall"
  | "labelLarge"
  | "labelMedium"
  | "labelSmall";

interface TextProps {
  variant?: TextVariant;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

/** Equivalente DOM de `<Text variant="...">` de react-native-paper. */
export default function Text({
  variant = "bodyLarge",
  style,
  className,
  children,
}: TextProps) {
  const classes = ["t-" + variant, className].filter(Boolean).join(" ");
  return (
    <span className={classes} style={style}>
      {children}
    </span>
  );
}

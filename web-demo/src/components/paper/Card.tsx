import type { CSSProperties, ReactNode } from "react";

type Mode = "elevated" | "outlined" | "contained";

interface CardProps {
  mode?: Mode;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

interface CardContentProps {
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

function Card({ mode = "elevated", style, className, children }: CardProps) {
  const classes = ["paper-card", `paper-card--${mode}`, className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}

function CardContent({ style, className, children }: CardContentProps) {
  const classes = ["paper-card-content", className].filter(Boolean).join(" ");
  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}

Card.Content = CardContent;

export default Card;

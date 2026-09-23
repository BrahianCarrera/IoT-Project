import type { CSSProperties, ReactNode } from "react";

interface ButtonProps {
  mode?: "contained" | "outlined" | "text";
  onPress?: () => void;
  style?: CSSProperties;
  children?: ReactNode;
}

export default function Button({ mode = "contained", onPress, style, children }: ButtonProps) {
  return (
    <button
      type="button"
      className={`paper-button paper-button--${mode}`}
      style={style}
      onClick={onPress}
    >
      {children}
    </button>
  );
}

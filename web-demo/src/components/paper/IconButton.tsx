import type { CSSProperties } from "react";
import MdiIcon from "@/components/Icon";

interface IconButtonProps {
  icon: string;
  mode?: "plain" | "contained-tonal";
  size?: number;
  onPress?: () => void;
  style?: CSSProperties;
  ariaLabel?: string;
}

export default function IconButton({
  icon,
  mode = "plain",
  size = 24,
  onPress,
  style,
  ariaLabel,
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? icon}
      className={
        "paper-icon-button" +
        (mode === "contained-tonal" ? " paper-icon-button--tonal" : "")
      }
      style={style}
      onClick={onPress}
    >
      <MdiIcon name={icon} size={size} />
    </button>
  );
}

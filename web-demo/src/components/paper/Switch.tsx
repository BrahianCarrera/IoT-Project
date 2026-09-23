import type { CSSProperties } from "react";

interface SwitchProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  color?: string;
  disabled?: boolean;
}

export default function Switch({
  value,
  onValueChange,
  color,
  disabled,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      disabled={disabled}
      className={"paper-switch" + (value ? " paper-switch--on" : "")}
      style={color ? ({ "--switch-color": color } as CSSProperties) : undefined}
      onClick={() => onValueChange?.(!value)}
    >
      <span className="paper-switch__thumb" />
    </button>
  );
}

import type { CSSProperties } from "react";
import MdiIcon from "@/components/Icon";

export interface SegmentedButton {
  value: string;
  label: string;
  icon?: string;
}

interface SegmentedButtonsProps {
  value: string;
  onValueChange: (value: string) => void;
  buttons: SegmentedButton[];
  style?: CSSProperties;
  density?: "small" | "regular";
}

export default function SegmentedButtons({
  value,
  onValueChange,
  buttons,
  style,
  density = "regular",
}: SegmentedButtonsProps) {
  return (
    <div
      className={
        "paper-segmented" + (density === "small" ? " paper-segmented--small" : "")
      }
      style={style}
      role="group"
    >
      {buttons.map((button) => {
        const selected = button.value === value;
        return (
          <button
            key={button.value}
            type="button"
            className={
              "paper-segmented__item" +
              (selected ? " paper-segmented__item--selected" : "")
            }
            aria-pressed={selected}
            onClick={() => onValueChange(button.value)}
          >
            {button.icon && <MdiIcon name={button.icon} size={16} />}
            <span>{button.label}</span>
          </button>
        );
      })}
    </div>
  );
}

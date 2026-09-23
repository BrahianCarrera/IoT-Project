import type { CSSProperties, ReactNode } from "react";
import MdiIcon from "@/components/Icon";

interface ChipProps {
  icon?: string;
  style?: CSSProperties;
  textStyle?: CSSProperties;
  children?: ReactNode;
}

export default function Chip({ icon, style, textStyle, children }: ChipProps) {
  return (
    <div className="paper-chip" style={style}>
      {icon && <MdiIcon name={icon} size={18} />}
      <span className="paper-chip__label" style={textStyle}>
        {children}
      </span>
    </div>
  );
}

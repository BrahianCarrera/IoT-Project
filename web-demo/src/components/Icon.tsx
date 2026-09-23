import { Icon } from "@iconify/react";

export interface MdiIconProps {
  /** Nombre Material Design Icons sin prefijo (ej. "water-pump") */
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
}

export default function MdiIcon({
  name,
  size = 24,
  color = "currentColor",
  className,
}: MdiIconProps) {
  return (
    <Icon
      icon={`mdi:${name}`}
      width={size}
      height={size}
      color={color}
      className={className}
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    />
  );
}

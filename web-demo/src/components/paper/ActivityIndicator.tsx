import type { CSSProperties } from "react";

interface ActivityIndicatorProps {
  size?: number | "small" | "large";
  color?: string;
}

export default function ActivityIndicator({
  size = "large",
  color,
}: ActivityIndicatorProps) {
  const dimension = size === "small" ? 24 : size === "large" ? 48 : size;
  const style: CSSProperties & Record<string, string | number> = {
    width: dimension,
    height: dimension,
    ["--spinner-color" as string]: color ?? "var(--primary)",
  };

  return (
    <span
      className="paper-activity-indicator"
      style={style}
      role="status"
      aria-label="Cargando"
    />
  );
}

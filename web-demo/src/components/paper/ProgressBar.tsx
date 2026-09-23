import type { CSSProperties } from "react";

interface ProgressBarProps {
  progress: number;
  color?: string;
  style?: CSSProperties;
}

export default function ProgressBar({
  progress,
  color,
  style,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
  return (
    <div className="paper-progress" style={style}>
      <div
        className="paper-progress__fill"
        style={{
          width: `${clamped * 100}%`,
          backgroundColor: color ?? "var(--primary)",
        }}
      />
    </div>
  );
}

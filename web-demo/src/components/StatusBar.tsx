import { useEffect, useState } from "react";

interface StatusBarProps {
  color?: string;
}

/** Barra de estado falsa estilo iOS para completar la simulación del dispositivo. */
export default function StatusBar({ color }: StatusBarProps) {
  const [time, setTime] = useState(() => formatNow());

  useEffect(() => {
    const id = setInterval(() => setTime(formatNow()), 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="status-bar" style={{ color }} aria-hidden="true">
      <span className="status-bar__time">{time}</span>
      <span className="status-bar__icons">
        {/* Señal celular */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* Wi-Fi */}
        <svg width="16" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2M12,3C7.31,3 3.07,4.9 0,7.98L2.12,10.1C4.62,7.59 8.14,6 12,6C15.86,6 19.38,7.59 21.88,10.1L24,7.98C20.93,4.9 16.69,3 12,3M12,9C8.96,9 6.29,10.28 4.4,12.35L6.52,14.47C7.92,12.87 9.86,12 12,12C14.14,12 16.08,12.87 17.48,14.47L19.6,12.35C17.71,10.28 15.04,9 12,9M12,15C10.73,15 9.57,15.5 8.73,16.31L12,20.5L15.27,16.31C14.43,15.5 13.27,15 12,15Z" />
        </svg>
        {/* Batería */}
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="12"
            rx="3.5"
            stroke="currentColor"
            opacity="0.4"
          />
          <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
          <path
            d="M24.5 4.5v4c1-.4 1.7-1.2 1.7-2s-.7-1.6-1.7-2z"
            fill="currentColor"
            opacity="0.4"
          />
        </svg>
      </span>
    </div>
  );
}

function formatNow(): string {
  return new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

import { useLayoutEffect, useState, type ReactNode } from "react";
import StatusBar from "@/components/StatusBar";
import { Colors, type ColorScheme } from "@/theme/colors";

const FRAME_W = 414;
const FRAME_H = 868;

interface PhoneFrameProps {
  children: ReactNode;
  scheme: ColorScheme;
}

/**
 * Marco de dispositivo (estilo iPhone) que contiene la app, dejando claro
 * que el proyecto original es una aplicación móvil.
 */
export default function PhoneFrame({ children, scheme }: PhoneFrameProps) {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const update = () => {
      const available = window.innerWidth - 24;
      setScale(Math.min(1, Math.max(0.5, available / FRAME_W)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const statusBarColor =
    scheme === "dark" ? Colors.dark.onSurface : Colors.light.onSurface;

  return (
    <div
      className="phone-scaler"
      style={{ width: FRAME_W * scale, height: FRAME_H * scale }}
    >
      <div
        className="phone-frame"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {/* Botones laterales */}
        <span className="phone-btn phone-btn--mute" />
        <span className="phone-btn phone-btn--vol-up" />
        <span className="phone-btn phone-btn--vol-down" />
        <span className="phone-btn phone-btn--power" />

        <div className="phone-screen">
          {children}

          <StatusBar color={statusBarColor} />
          <div className="phone-island" />
          <div
            className="phone-home-indicator"
            style={{
              backgroundColor:
                scheme === "dark"
                  ? "rgba(226,227,221,0.85)"
                  : "rgba(26,28,25,0.85)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

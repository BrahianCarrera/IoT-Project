import { useState } from "react";
import TabBar, { type TabKey } from "@/components/TabBar";
import ControlScreen from "@/screens/ControlScreen";
import HistorialScreen from "@/screens/HistorialScreen";
import InicioScreen from "@/screens/InicioScreen";

/**
 * Réplica del contenido de la app móvil original (app/(tabs)) presentada
 * dentro del marco de teléfono de la demo web.
 */
export default function MiCultivoApp() {
  const [tab, setTab] = useState<TabKey>("inicio");

  return (
    <div className="app-root">
      <main className="app-content" key={tab}>
        {tab === "inicio" && <InicioScreen />}
        {tab === "historial" && <HistorialScreen />}
        {tab === "control" && <ControlScreen />}
      </main>
      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}

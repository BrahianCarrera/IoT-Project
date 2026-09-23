import MetricCard from "@/components/MetricCard";
import PlantFooter from "@/components/PlantFooter";
import PlantHeader from "@/components/PlantHeader";
import StatusCard from "@/components/StatusCard";
import WaterLevelCard from "@/components/WaterLevelCard";
import ActivityIndicator from "@/components/paper/ActivityIndicator";
import Text from "@/components/paper/Text";
import { useCultivoControl } from "@/hooks/useCultivoControl";
import { useCultivoMetrics } from "@/hooks/useCultivoMetrics";
import { formatDate } from "@/utils/dateUtils";

export default function InicioScreen() {
  const { controlState, isLoading, error } = useCultivoControl();

  const {
    metrics,
    isLoadingMetrics,
    errorMetrics,
    getMetricStatus,
  } = useCultivoMetrics();

  if (isLoading || isLoadingMetrics) {
    return (
      <div className="center-screen">
        <ActivityIndicator size="large" color="var(--primary)" />
        <Text style={{ marginTop: 10, color: "var(--on-surface)" }}>
          Cargando datos en tiempo real...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center-screen">
        <Text
          style={{
            color: "var(--error)",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          ⚠️ Error de Conexión
        </Text>
        <Text style={{ color: "var(--on-surface)" }}>
          No se pudo conectar con la base de datos.
        </Text>
        <Text style={{ color: "var(--on-surface)" }}>{error}</Text>
      </div>
    );
  }

  return (
    <div className="safe-screen">
      <div className="scroll-view inicio-scroll">
        <PlantHeader
          isConnected={!errorMetrics}
          lastUpdate={formatDate(metrics.timestamp)}
        />

        <StatusCard
          isBombaActive={controlState.bomba}
          isValvulaActive={controlState.valvula}
          lastWatering={formatDate(metrics.timestamp)}
        />

        <div className="metrics-grid">
          <MetricCard
            title="Temperatura"
            value={metrics.temperatura}
            unit="°C"
            icon="thermometer"
            min={18}
            max={30}
            status={getMetricStatus(metrics.temperatura, 18, 30)}
          />

          <MetricCard
            title="Humedad del Aire"
            value={metrics.humedad_aire}
            unit="%"
            icon="cloud"
            min={40}
            max={80}
            status={getMetricStatus(metrics.humedad_aire, 40, 80)}
          />

          <MetricCard
            title="pH"
            value={metrics.ph}
            unit=""
            icon="ph"
            min={5.5}
            max={7.0}
            status={getMetricStatus(metrics.ph, 5.5, 7.0)}
          />

          <MetricCard
            title="Humedad del Suelo"
            value={metrics.humedad_suelo}
            unit="%"
            icon="earth"
            min={20}
            max={90}
            status={getMetricStatus(metrics.humedad_suelo, 20, 90)}
          />
        </div>

        <WaterLevelCard
          waterLevel={metrics.nivel_agua}
          status={getMetricStatus(metrics.nivel_agua, 20, 100)}
        />

        <PlantFooter />
      </div>
    </div>
  );
}

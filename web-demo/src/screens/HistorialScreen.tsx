import HistoryCharts from "@/components/HistoryCharts";
import MdiIcon from "@/components/Icon";
import ActivityIndicator from "@/components/paper/ActivityIndicator";
import Card from "@/components/paper/Card";
import Text from "@/components/paper/Text";
import { useCultivoHistory } from "@/hooks/useCultivoHistory";
import type { CultivoData } from "@/types/CultivoTypes";
import { formatDate } from "@/utils/dateUtils";

function ReadingCard({ item }: { item: CultivoData }) {
  return (
    <Card className="reading-card">
      <Card.Content>
        <div className="reading-card__header">
          <Text
            variant="titleMedium"
            style={{ color: "var(--primary)", fontWeight: "bold" }}
          >
            {formatDate(item.timestamp)}
          </Text>
        </div>

        <div className="reading-card__row">
          <div className="reading-card__metric">
            <MdiIcon name="thermometer" size={20} color="var(--error)" />
            <Text variant="bodyMedium">Temp: {item.temperatura}°C</Text>
          </div>
          <div className="reading-card__metric">
            <MdiIcon name="ph" size={20} color="var(--tertiary)" />
            <Text variant="bodyMedium">pH: {item.ph}</Text>
          </div>
        </div>

        <div className="reading-card__row">
          <div className="reading-card__metric">
            <MdiIcon name="water-percent" size={20} color="var(--secondary)" />
            <Text variant="bodyMedium">Nivel Agua: {item.nivel_agua}%</Text>
          </div>
          <div className="reading-card__metric">
            <MdiIcon
              name="earth"
              size={20}
              color="var(--on-surface-variant)"
            />
            <Text variant="bodyMedium">Suelo: {item.humedad_suelo}%</Text>
          </div>
        </div>

        <div className="reading-card__row">
          <div className="reading-card__metric">
            <MdiIcon name="cloud" size={20} color="var(--secondary)" />
            <Text variant="bodyMedium">
              Humedad Aire: {item.humedad_aire}%
            </Text>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

export default function HistorialScreen() {
  const { history, isLoading, error } = useCultivoHistory();

  if (isLoading) {
    return (
      <div className="center-screen">
        <ActivityIndicator size="large" color="var(--primary)" />
        <Text style={{ marginTop: 10, color: "var(--on-surface)" }}>
          Cargando historial...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center-screen">
        <Text style={{ color: "var(--error)" }}>{error}</Text>
      </div>
    );
  }

  return (
    <div className="safe-screen">
      <div className="historial-header">
        <Text
          variant="headlineMedium"
          style={{ color: "var(--on-background)" }}
        >
          Historial
        </Text>
        <Text variant="bodyMedium" style={{ color: "var(--on-surface-variant)" }}>
          Últimas 50 lecturas
        </Text>
      </div>

      <div className="scroll-view historial-list">
        <HistoryCharts data={history} />
        <Text
          variant="titleMedium"
          className="historial-list__subtitle"
        >
          Últimas Lecturas
        </Text>

        {history.length === 0 ? (
          <div className="historial-list__empty">
            <Text style={{ color: "var(--on-surface-variant)" }}>
              No hay datos históricos disponibles.
            </Text>
          </div>
        ) : (
          history.map((item, index) => (
            <ReadingCard key={(item as CultivoData & { id?: string }).id ?? index} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

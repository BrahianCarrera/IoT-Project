import MdiIcon from "@/components/Icon";
import Card from "@/components/paper/Card";
import Text from "@/components/paper/Text";
import type { MetricStatus } from "@/types/CultivoTypes";

interface WaterLevelCardProps {
  waterLevel: number;
  status: MetricStatus;
}

const STATUS_COLOR: Record<MetricStatus, string> = {
  optimal: "var(--primary)",
  warning: "var(--tertiary)",
  critical: "var(--error)",
};

const WaterLevelCard = ({ waterLevel, status }: WaterLevelCardProps) => {
  const statusColor = STATUS_COLOR[status] ?? "var(--outline)";

  return (
    <Card
      className="water-card"
      style={{ backgroundColor: "var(--elevation-level2)" }}
    >
      <Card.Content>
        <div className="water-card__header">
          <MdiIcon name="cup-water" size={24} color="var(--primary)" />
          <Text
            variant="titleMedium"
            className="water-card__title"
            style={{ color: "var(--on-surface)" }}
          >
            Nivel de Agua
          </Text>
        </div>

        <div className="water-card__container">
          <div
            className="water-card__bar"
            style={{ backgroundColor: "var(--surface-variant)" }}
          >
            <div
              className="water-card__fill"
              style={{
                height: `${waterLevel}%`,
                backgroundColor: statusColor,
              }}
            />
          </div>

          <Text
            variant="headlineSmall"
            className="water-card__value"
            style={{ color: "var(--on-surface)" }}
          >
            {waterLevel.toFixed(0)}%
          </Text>
        </div>
      </Card.Content>
    </Card>
  );
};

export default WaterLevelCard;

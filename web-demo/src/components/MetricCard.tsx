import MdiIcon from "@/components/Icon";
import Card from "@/components/paper/Card";
import ProgressBar from "@/components/paper/ProgressBar";
import Text from "@/components/paper/Text";
import type { MetricStatus } from "@/types/CultivoTypes";

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: string;
  min: number;
  max: number;
  status: MetricStatus;
}

const STATUS_COLOR: Record<MetricStatus, string> = {
  optimal: "var(--primary)",
  warning: "var(--tertiary)",
  critical: "var(--error)",
};

const MetricCard = ({
  title,
  value,
  unit,
  icon,
  min,
  max,
  status,
}: MetricCardProps) => {
  const statusColor = STATUS_COLOR[status] ?? "var(--outline)";

  return (
    <Card
      className="metric-card"
      style={{ backgroundColor: "var(--elevation-level2)" }}
    >
      <Card.Content style={{ padding: 16 }}>
        <div className="metric-card__header">
          <MdiIcon name={icon} size={24} color={statusColor} />
          <Text
            variant="labelMedium"
            className="metric-card__title"
            style={{ color: "var(--on-surface)" }}
          >
            {title}
          </Text>
        </div>

        <Text
          variant="headlineSmall"
          className="metric-card__value"
          style={{ color: statusColor }}
        >
          {value.toFixed(1)}
          {unit}
        </Text>

        <ProgressBar
          progress={value < min || value > max ? 0 : (value - min) / (max - min)}
          color={statusColor}
          style={{ height: 6, borderRadius: 3, marginBottom: 4 }}
        />

        <Text
          variant="bodySmall"
          className="metric-card__range"
          style={{ color: "var(--on-surface-variant)" }}
        >
          Rango: {min}-{max}
          {unit}
        </Text>
      </Card.Content>
    </Card>
  );
};

export default MetricCard;

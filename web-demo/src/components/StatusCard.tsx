import MdiIcon from "@/components/Icon";
import Text from "@/components/paper/Text";

interface StatusCardProps {
  isBombaActive: boolean;
  isValvulaActive: boolean;
  lastWatering: string;
}

const StatusCard = ({
  isBombaActive,
  isValvulaActive,
  lastWatering,
}: StatusCardProps) => {
  const activeColor = "var(--primary)";
  const inactiveColor = "var(--on-surface-variant)";

  return (
    <div className="status-card">
      <div className="paper-card-content">
        <div className="status-card__row">
          <MdiIcon
            name="pump"
            size={20}
            color={isBombaActive ? activeColor : inactiveColor}
          />
          <Text
            variant="bodyMedium"
            className="status-card__text"
            style={{
              color: isBombaActive ? activeColor : inactiveColor,
              fontWeight: isBombaActive ? "bold" : "normal",
            }}
          >
            Bomba: {isBombaActive ? "Encendida" : "Apagada"}
          </Text>
        </div>

        <div className="status-card__row">
          <MdiIcon
            name="pipe-valve"
            size={20}
            color={isValvulaActive ? activeColor : inactiveColor}
          />
          <Text
            variant="bodyMedium"
            className="status-card__text"
            style={{
              color: isValvulaActive ? activeColor : inactiveColor,
              fontWeight: isValvulaActive ? "bold" : "normal",
            }}
          >
            Válvula Principal: {isValvulaActive ? "Encendida" : "Apagada"}
          </Text>
        </div>

        <div className="status-card__row">
          <Text
            variant="bodyMedium"
            className="status-card__text"
            style={{ color: inactiveColor }}
          >
            {`Último riego: ${lastWatering}`}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;

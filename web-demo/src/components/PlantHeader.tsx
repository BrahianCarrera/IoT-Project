import Chip from "@/components/paper/Chip";
import Text from "@/components/paper/Text";

interface PlantHeaderProps {
  isConnected: boolean;
  lastUpdate: string;
}

const PlantHeader = ({ isConnected, lastUpdate }: PlantHeaderProps) => {
  return (
    <div className="plant-header">
      <Text
        variant="headlineMedium"
        className="plant-header__title"
        style={{ color: "var(--primary)" }}
      >
        🌱 Cultivo Hidropónico
      </Text>

      <Chip
        icon={isConnected ? "wifi" : "wifi-off"}
        style={{
          borderRadius: 20,
          backgroundColor: isConnected ? "var(--primary)" : "var(--error)",
        }}
        textStyle={{ color: "var(--on-primary)" }}
      >
        {isConnected ? "Conectado" : "Desconectado"}
      </Chip>

      <Text>Ultima Conexion : {lastUpdate}</Text>
    </div>
  );
};

export default PlantHeader;

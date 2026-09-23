import Text from "@/components/paper/Text";

const PlantFooter = () => {
  return (
    <div className="plant-footer">
      <Text
        variant="bodySmall"
        className="plant-footer__text"
        style={{ color: "var(--on-surface-variant)" }}
      >
        Sistema IoT Hidropónico v1.0
      </Text>
      <Text
        variant="bodySmall"
        className="plant-footer__text"
        style={{ color: "var(--on-surface-variant)" }}
      >
        Última actualización: {new Date().toLocaleTimeString()}
      </Text>
    </div>
  );
};

export default PlantFooter;

import MdiIcon from "@/components/Icon";
import ActivityIndicator from "@/components/paper/ActivityIndicator";
import Button from "@/components/paper/Button";
import Card from "@/components/paper/Card";
import Switch from "@/components/paper/Switch";
import Text from "@/components/paper/Text";
import { useCultivoControl } from "@/hooks/useCultivoControl";

export default function ControlScreen() {
  const {
    controlState,
    isLoading,
    error,
    toggleBomba,
    toggleValvula,
    toggleMedirPh,
    refetch,
  } = useCultivoControl();

  if (isLoading) {
    return (
      <div className="center-screen">
        <ActivityIndicator size="large" color="var(--primary)" />
        <Text
          variant="bodyLarge"
          style={{ marginTop: 16, color: "var(--on-surface)" }}
        >
          Sincronizando controles...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center-screen">
        <MdiIcon name="alert-circle" size={48} color="var(--error)" />
        <Text style={{ color: "var(--error)", marginTop: 16, textAlign: "center" }}>
          {error}
        </Text>
        <Button mode="contained" onPress={refetch} style={{ marginTop: 20 }}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="safe-screen">
      <div className="scroll-view control-scroll">
        <div className="control-header">
          <Text
            variant="headlineMedium"
            style={{ color: "var(--primary)", fontWeight: "bold" }}
          >
            Panel de Control
          </Text>
          <Text variant="bodyLarge" style={{ color: "var(--on-surface-variant)" }}>
            Gestión manual de dispositivos
          </Text>
        </div>

        <Text
          variant="titleMedium"
          className="control-section-title"
        >
          Actuadores
        </Text>

        <Card className="control-card">
          <Card.Content className="control-card__row">
            <div className="control-card__icon-group">
              <div
                className="control-card__icon-bg"
                style={{
                  backgroundColor: controlState.bomba
                    ? "var(--primary-container)"
                    : "var(--surface-variant)",
                }}
              >
                <MdiIcon
                  name={controlState.bomba ? "water-pump" : "water-pump-off"}
                  size={28}
                  color={
                    controlState.bomba
                      ? "var(--primary)"
                      : "var(--on-surface-variant)"
                  }
                />
              </div>
              <div className="control-card__text">
                <Text variant="titleMedium" style={{ fontWeight: "600" }}>
                  Bomba de Riego
                </Text>
                <Text
                  variant="bodySmall"
                  style={{
                    color: controlState.bomba
                      ? "var(--primary)"
                      : "var(--on-surface-variant)",
                  }}
                >
                  {controlState.bomba ? "Encendida" : "Apagada"}
                </Text>
              </div>
            </div>
            <Switch
              value={controlState.bomba}
              onValueChange={toggleBomba}
              color="var(--primary)"
            />
          </Card.Content>
        </Card>

        <Card className="control-card">
          <Card.Content className="control-card__row">
            <div className="control-card__icon-group">
              <div
                className="control-card__icon-bg"
                style={{
                  backgroundColor: controlState.valvula
                    ? "var(--primary-container)"
                    : "var(--surface-variant)",
                }}
              >
                <MdiIcon
                  name={controlState.valvula ? "valve" : "valve-closed"}
                  size={28}
                  color={
                    controlState.valvula
                      ? "var(--primary)"
                      : "var(--on-surface-variant)"
                  }
                />
              </div>
              <div className="control-card__text">
                <Text variant="titleMedium" style={{ fontWeight: "600" }}>
                  Válvula de Llenado
                </Text>
                <Text
                  variant="bodySmall"
                  style={{
                    color: controlState.valvula
                      ? "var(--primary)"
                      : "var(--on-surface-variant)",
                  }}
                >
                  {controlState.valvula ? "Abierta" : "Cerrada"}
                </Text>
              </div>
            </div>
            <Switch
              value={controlState.valvula}
              onValueChange={toggleValvula}
              color="var(--primary)"
            />
          </Card.Content>
        </Card>

        <Text
          variant="titleMedium"
          className="control-section-title control-section-title--spaced"
        >
          Sensores
        </Text>

        <Card className="control-card">
          <Card.Content>
            <div className="control-card__header">
              <div
                className="control-card__icon-bg"
                style={{ backgroundColor: "var(--secondary-container)" }}
              >
                <MdiIcon name="flask" size={28} color="var(--secondary)" />
              </div>
              <div className="control-card__text">
                <Text variant="titleMedium" style={{ fontWeight: "600" }}>
                  Sensor de pH
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  Lectura bajo demanda
                </Text>
              </div>
            </div>

            <div className="control-card__action">
              <Text
                variant="bodyMedium"
                className="control-card__action-text"
                style={{ color: "var(--on-surface-variant)" }}
              >
                Activa el sensor temporalmente para tomar una lectura precisa
                del pH actual.
              </Text>
              <Switch
                value={controlState.medir_ph}
                onValueChange={toggleMedirPh}
                color="var(--primary)"
              />
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}

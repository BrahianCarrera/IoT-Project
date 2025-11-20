import ActionButtons from "@/components/ActionButtons";
import MetricCard from "@/components/MetricCard";
import PlantFooter from "@/components/PlantFooter";
import PlantHeader from "@/components/PlantHeader";
import StatusCard from "@/components/StatusCard";
import WaterLevelCard from "@/components/WaterLevelCard";
import { useCultivoMetrics } from "@/hooks/useCultivoMetrics";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const theme = useTheme();

  // 2. Desestructuración de las variables del nuevo Hook de Firebase
  const {
    metrics,
    isLoading,
    error,
    isControlling, // Reemplaza a isWatering para indicar que una operación de control está en curso
    getMetricStatus,
    handleToggleBomba, // Reemplaza a handleWatering
  } = useCultivoMetrics();

  // Función de actualización (opcional si usas onValue, pero se mantiene la alerta)
  const handleRefresh = () => {
    Alert.alert("Actualizando", "Sincronizando datos con los sensores...");
    // Nota: Gracias al onValue del hook, los datos ya se actualizan en tiempo real.
    // Esta función podría usarse para recargar datos históricos o forzar una actualización manual.
  };

  // 3. Adaptación del control de riego (ahora es el control de la bomba)
  const handleBombaControl = () => {
    if (isControlling) return; // Deshabilita si ya hay una operación en curso

    const action = metrics.bomba ? "Apagada" : "Encendida";

    Alert.alert(
      "Control de Bomba",
      `¿Deseas cambiar el estado de la bomba a: ${action}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            // Llama a la nueva función de control de Firebase
            await handleToggleBomba();

            // Muestra una alerta de confirmación
            Alert.alert(
              "Operación en Curso",
              `La bomba está siendo ${action}. El estado se actualizará en unos segundos.`,
            );
          },
        },
      ],
    );
  };

  // --- 4. Manejo de Estado de Carga y Error ---
  if (isLoading) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 10, color: theme.colors.onSurface }}>
          Cargando datos en tiempo real...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text
          style={{
            color: theme.colors.error,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          ⚠️ Error de Conexión
        </Text>
        <Text style={{ color: theme.colors.onSurface }}>
          No se pudo conectar con la base de datos.
        </Text>
        <Text style={{ color: theme.colors.onSurface }}>{error}</Text>
      </View>
    );
  }

  // Si los datos están cargados y no hay error, muestra la interfaz normal
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        
        <PlantHeader
          isConnected={!error} 
          lastUpdate={metrics.timestamp}
        />

        <StatusCard
          isBombaActive={metrics.bomba}
          isValvulaActive={metrics.valvula}
          isWatering={metrics.regando}
          lastWatering={metrics.timestamp}
        />

        <View style={styles.metricsGrid}>
          
          <MetricCard
            title="Temperatura"
            value={metrics.temperatura} 
            unit="°C"
            icon="thermometer"
            min={18}
            max={30}
            status={getMetricStatus(metrics.temperatura, 18, 30)}
          />

          {/* HUMEDAD DEL AIRE (Reemplaza la humedad genérica) */}
          <MetricCard
            title="Humedad del Aire"
            value={metrics.humedad_aire} // USAR `humedad_aire` de Firebase
            unit="%"
            icon="water-percent"
            min={40}
            max={80}
            status={getMetricStatus(metrics.humedad_aire, 40, 80)}
          />

          {/* PH */}
          <MetricCard
            title="pH"
            value={metrics.ph} // USAR `ph` de Firebase
            unit=""
            icon="ph"
            min={5.5}
            max={7.0}
            status={getMetricStatus(metrics.ph, 5.5, 7.0)}
          />

          {/* CONDUCTIVIDAD (Si usas otro nombre como EC, ajústalo) */}
          {/* Aquí usaremos la humedad del suelo como ejemplo, ya que EC no está en tu DB */}
          <MetricCard
            title="Humedad del Suelo"
            value={metrics.humedad_suelo}
            unit="%"
            icon="earth"
            min={20}
            max={90}
            status={getMetricStatus(metrics.humedad_suelo, 20, 90)}
          />
        </View>

        <WaterLevelCard
          waterLevel={metrics.nivel_agua} // USAR `nivel_agua` de Firebase
          status={getMetricStatus(metrics.nivel_agua, 20, 100)}
        />

        <ActionButtons
          isControlling={isControlling} // Muestra spinner si está controlando
          bombaActive={metrics.bomba} // Pasa el estado actual de la bomba
          onToggleBomba={handleBombaControl} // Usa la nueva función de control
          onRefresh={handleRefresh}
        />

        <PlantFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
  metricsGrid: {
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    gap: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

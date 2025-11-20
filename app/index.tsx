import ActionButtons from "@/components/ActionButtons";
import MetricCard from "@/components/MetricCard";
import PlantFooter from "@/components/PlantFooter";
import PlantHeader from "@/components/PlantHeader";
import StatusCard from "@/components/StatusCard";
import WaterLevelCard from "@/components/WaterLevelCard";
import { usePlantMetrics } from "@/hooks/usePlantMetrics";
import React from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const theme = useTheme();
  const { metrics, isWatering, isConnected, getMetricStatus, handleWatering } =
    usePlantMetrics();

  const handleRefresh = () => {
    Alert.alert("Actualizando", "Sincronizando datos con los sensores...");
  };

  const handleWateringWithAlert = () => {
    Alert.alert(
      "Riego Iniciado",
      "El sistema de riego se ha activado. La planta será regada por 30 segundos.",
      [
        {
          text: "OK",
          onPress: () => {
            handleWatering();
            setTimeout(() => {
              Alert.alert(
                "Riego Completado",
                "La planta ha sido regada exitosamente."
              );
            }, 3000);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView style={styles.container}>
        <PlantHeader isConnected={isConnected} />

        <StatusCard
          isWatering={isWatering}
          lastWatering={metrics.lastWatering}
          lightLevel={metrics.lightLevel}
        />

        <View style={styles.metricsGrid}>
          <MetricCard
            title="Temperatura"
            value={metrics.temperature}
            unit="°C"
            icon="thermometer"
            min={18}
            max={30}
            status={getMetricStatus(metrics.temperature, 18, 30)}
          />

          <MetricCard
            title="Humedad"
            value={metrics.humidity}
            unit="%"
            icon="water-percent"
            min={40}
            max={80}
            status={getMetricStatus(metrics.humidity, 40, 80)}
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
            title="Conductividad"
            value={metrics.ec}
            unit="mS/cm"
            icon="flash"
            min={1.0}
            max={3.0}
            status={getMetricStatus(metrics.ec, 1.0, 3.0)}
          />
        </View>

        <WaterLevelCard
          waterLevel={metrics.waterLevel}
          status={getMetricStatus(metrics.waterLevel, 20, 100)}
        />

        <ActionButtons
          isWatering={isWatering}
          onWatering={handleWateringWithAlert}
          onRefresh={handleRefresh}
        />

        <PlantFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  metricsGrid: {
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    gap: 8,
  },
});

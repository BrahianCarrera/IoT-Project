import MetricCard from "@/components/MetricCard";
import PlantFooter from "@/components/PlantFooter";
import PlantHeader from "@/components/PlantHeader";
import StatusCard from "@/components/StatusCard";
import WaterLevelCard from "@/components/WaterLevelCard";
import { useCultivoControl } from "@/hooks/useCultivoControl";
import { useCultivoMetrics } from "@/hooks/useCultivoMetrics";
import { formatDate } from "@/utils/dateUtils";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const theme = useTheme();
  const { controlState, isLoading, error  } = useCultivoControl();

  const {
    metrics,
    isLoadingMetrics,
    errorMetrics,
    isControlling,
    getMetricStatus,
  } = useCultivoMetrics();

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
          isConnected={!errorMetrics} 
          lastUpdate={formatDate(metrics.timestamp)}
        />

        <StatusCard
          isBombaActive={controlState.bomba}
          isValvulaActive={controlState.valvula}
          lastWatering={formatDate(metrics.timestamp)}
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
        </View>

        <WaterLevelCard
          waterLevel={metrics.nivel_agua} 
          status={getMetricStatus(metrics.nivel_agua, 20, 100)}
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

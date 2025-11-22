import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text, useTheme } from "react-native-paper";

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  min: number;
  max: number;
  status: "optimal" | "warning" | "critical";
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  min,
  max,
  status,
}) => {
  const theme = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case "optimal":
        return theme.colors.primary;
      case "warning":
        return theme.colors.tertiary;
      case "critical":
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const statusColor = getStatusColor();

  return (
    <Card
      style={[styles.metricCard, { backgroundColor: theme.colors.elevation.level2, elevation: 2 }]}
    >
      <Card.Content style={styles.metricContent}>
        <View style={styles.metricHeader}>
          <MaterialCommunityIcons name={icon} size={24} color={statusColor} />
          <Text
            variant="labelMedium"
            style={[styles.metricTitle, { color: theme.colors.onSurface }]}
          >
            {title}
          </Text>
        </View>

        <Text
          variant="headlineSmall"
          style={[styles.metricValue, { color: statusColor }]}
        >
          {value.toFixed(1)}
          {unit}
        </Text>

        <ProgressBar
          progress={value < min || value > max ? 0 : (value - min) / (max - min)}
          color={statusColor}
          style={styles.progressBar}
        />

        <Text
          variant="bodySmall"
          style={[styles.metricRange, { color: theme.colors.onSurfaceVariant }]}
        >
          Rango: {min}-{max}
          {unit}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  metricCard: {
    margin: 16,
    borderRadius: 16,
  },
  metricContent: {
    padding: 16,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metricTitle: {
    marginLeft: 8,
    fontWeight: "600",
  },
  metricValue: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  metricRange: {
    opacity: 0.7,
  },
});

export default MetricCard;

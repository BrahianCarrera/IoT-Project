import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

interface WaterLevelCardProps {
  waterLevel: number;
  status: 'optimal' | 'warning' | 'critical';
}

const WaterLevelCard: React.FC<WaterLevelCardProps> = ({ waterLevel, status }) => {
  const theme = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'optimal':
        return theme.colors.primary;
      case 'warning':
        return theme.colors.tertiary;
      case 'critical':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const statusColor = getStatusColor();

  return (
    <Card 
      style={[
        styles.waterLevelCard,
        { backgroundColor: theme.colors.surface }
      ]}
      elevation={2}
    >
      <Card.Content>
        <View style={styles.waterLevelHeader}>
          <MaterialCommunityIcons
            name="cup-water"
            size={24}
            color={theme.colors.primary}
          />
          <Text 
            variant="titleMedium"
            style={[
              styles.waterLevelTitle,
              { color: theme.colors.onSurface }
            ]}
          >
            Nivel de Agua
          </Text>
        </View>
        
        <View style={styles.waterLevelContainer}>
          <View 
            style={[
              styles.waterLevelBar,
              { backgroundColor: theme.colors.surfaceVariant }
            ]}
          >
            <View
              style={[
                styles.waterLevelFill,
                {
                  height: `${waterLevel}%`,
                  backgroundColor: statusColor,
                },
              ]}
            />
          </View>
          
          <Text 
            variant="headlineSmall"
            style={[
              styles.waterLevelText,
              { color: theme.colors.onSurface }
            ]}
          >
            {waterLevel.toFixed(0)}%
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  waterLevelCard: {
    margin: 16,
    borderRadius: 16,
  },
  waterLevelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  waterLevelTitle: {
    marginLeft: 8,
    fontWeight: "600",
  },
  waterLevelContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 100,
  },
  waterLevelBar: {
    width: 30,
    height: 80,
    borderRadius: 15,
    overflow: "hidden",
    marginRight: 16,
  },
  waterLevelFill: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderRadius: 15,
  },
  waterLevelText: {
    fontWeight: "bold",
  },
});

export default WaterLevelCard;

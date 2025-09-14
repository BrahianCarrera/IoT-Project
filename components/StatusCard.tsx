import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Surface, Text, useTheme } from "react-native-paper";

interface StatusCardProps {
  isWatering: boolean;
  lastWatering: string;
  lightLevel: number;
}

const StatusCard: React.FC<StatusCardProps> = ({ 
  isWatering, 
  lastWatering, 
  lightLevel 
}) => {
  const theme = useTheme();

  return (
    <Surface 
      style={[
        styles.statusCard,
        { backgroundColor: theme.colors.surfaceVariant }
      ]} 
      elevation={2}
    >
      <Card.Content>
        <View style={styles.statusRow}>
          <MaterialCommunityIcons
            name="water"
            size={20}
            color={isWatering ? theme.colors.primary : theme.colors.onSurfaceVariant}
          />
          <Text 
            variant="bodyMedium"
            style={[
              styles.statusText,
              { color: theme.colors.onSurfaceVariant }
            ]}
          >
            {isWatering ? "Regando..." : `Último riego: ${lastWatering}`}
          </Text>
        </View>
        
        <View style={styles.statusRow}>
          <MaterialCommunityIcons
            name="lightbulb-on"
            size={20}
            color={lightLevel > 50 ? theme.colors.tertiary : theme.colors.onSurfaceVariant}
          />
          <Text 
            variant="bodyMedium"
            style={[
              styles.statusText,
              { color: theme.colors.onSurfaceVariant }
            ]}
          >
            Luz: {lightLevel.toFixed(0)}%
          </Text>
        </View>
      </Card.Content>
    </Surface>
  );
};

const styles = StyleSheet.create({
  statusCard: {
    margin: 16,
    borderRadius: 16,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  statusText: {
    marginLeft: 8,
  },
});

export default StatusCard;

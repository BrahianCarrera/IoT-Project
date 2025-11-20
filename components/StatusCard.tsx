import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Surface, Text, useTheme } from "react-native-paper";

interface StatusCardProps {
  isBombaActive: boolean;
  isValvulaActive: boolean;
  isWatering: boolean; 
  lastWatering: string; 
  
}

const StatusCard: React.FC<StatusCardProps> = ({ 
  isBombaActive,
  isValvulaActive,
  isWatering, 
  lastWatering, 
  
}) => {
  const theme = useTheme();
  
  // Color primario para el estado ACTIVO, color de fondo para inactivo
  const activeColor = theme.colors.primary;
  const inactiveColor = theme.colors.onSurfaceVariant;

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
            name="pump" 
            size={20}
            color={isBombaActive ? activeColor : inactiveColor}
          />
          <Text 
            variant="bodyMedium"
            style={[
              styles.statusText,
              { color: isBombaActive ? activeColor : inactiveColor, fontWeight: isBombaActive ? 'bold' : 'normal' }
            ]}
          >
            Bomba: {isBombaActive ? "**ENCENDIDA**" : "Apagada"}
          </Text>
        </View>

        
        <View style={styles.statusRow}>
          <MaterialCommunityIcons
            name="pipe-valve" // Icono de válvula
            size={20}
            color={isValvulaActive ? activeColor : inactiveColor}
          />
          <Text 
            variant="bodyMedium"
            style={[
              styles.statusText,
              { color: isValvulaActive ? activeColor : inactiveColor, fontWeight: isValvulaActive ? 'bold' : 'normal' }
            ]}
          >
            Válvula Principal: {isValvulaActive ? "**ABIERTA**" : "Cerrada"}
          </Text>
        </View>

      
        <View style={styles.statusRow}>
          <MaterialCommunityIcons
            name="water"
            size={20}
            color={isWatering ? activeColor : inactiveColor}
          />
          <Text 
            variant="bodyMedium"
            style={[
              styles.statusText,
              { color: inactiveColor }
            ]}
          >
            {isWatering ? "Regando..." : `Último riego (DB Timestamp): ${lastWatering}`}
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
    paddingHorizontal: 8, // Ajuste para el contenido
    paddingVertical: 4,
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
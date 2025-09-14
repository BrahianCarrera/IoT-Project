import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

interface ActionButtonsProps {
  isWatering: boolean;
  onWatering: () => void;
  onRefresh: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  isWatering, 
  onWatering, 
  onRefresh 
}) => {
  const theme = useTheme();

  return (
    <View style={styles.actionButtons}>
      <Button
        mode="contained"
        icon="water"
        onPress={onWatering}
        disabled={isWatering}
        style={[
          styles.waterButton,
          { 
            backgroundColor: isWatering 
              ? theme.colors.surfaceDisabled 
              : theme.colors.primary 
          }
        ]}
        contentStyle={styles.buttonContent}
        labelStyle={{ color: theme.colors.onPrimary }}
      >
        {isWatering ? "Regando..." : "💧 Regar Planta"}
      </Button>

      <Button
        mode="outlined"
        icon="refresh"
        onPress={onRefresh}
        style={[
          styles.refreshButton,
          { borderColor: theme.colors.primary }
        ]}
        contentStyle={styles.buttonContent}
        labelStyle={{ color: theme.colors.primary }}
      >
        Actualizar Datos
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    padding: 16,
    gap: 12,
  },
  waterButton: {
    borderRadius: 12,
    elevation: 3,
  },
  refreshButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default ActionButtons;

import React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, useTheme } from "react-native-paper";

interface ActionButtonsProps {
  isControlling: boolean;        
  bombaActive: boolean;          
  onToggleBomba: () => void;     
  onRefresh: () => void;         
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isControlling,
  bombaActive,
  onToggleBomba,
  onRefresh,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.actionButtons}>
      {/* BOTÓN CONTROL DE BOMBA */}
      <Button
        mode="contained"
        onPress={onToggleBomba}
        disabled={isControlling}
        icon={bombaActive ? "power" : "power-off"}
        style={[
          styles.waterButton,
          {
            backgroundColor: bombaActive
              ? theme.colors.error          
              : theme.colors.primary,      
          },
        ]}
        contentStyle={styles.buttonContent}
        labelStyle={{ color: theme.colors.onPrimary }}
      >
        {isControlling ? (
          <ActivityIndicator color={theme.colors.onPrimary} />
        ) : bombaActive ? (
          "Apagar Bomba"
        ) : (
          "Encender Bomba"
        )}
      </Button>

     
      <Button
        mode="outlined"
        icon="refresh"
        onPress={onRefresh}
        style={[styles.refreshButton, { borderColor: theme.colors.primary }]}
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

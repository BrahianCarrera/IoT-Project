import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";

interface PlantHeaderProps {
  isConnected: boolean;
}

const PlantHeader: React.FC<PlantHeaderProps> = ({ isConnected }) => {
  const theme = useTheme();

  return (
    <View style={styles.header}>
      <Text 
        variant="headlineMedium"
        style={[
          styles.title,
          { color: theme.colors.primary }
        ]}
      >
        🌱 Cultivo Hidropónico
      </Text>
      
      <Chip
        icon={isConnected ? "wifi" : "wifi-off"}
        style={[
          styles.statusChip,
          { 
            backgroundColor: isConnected 
              ? theme.colors.primary 
              : theme.colors.error 
          }
        ]}
        textStyle={{ color: theme.colors.onPrimary }}
      >
        {isConnected ? "Conectado" : "Desconectado"}
      </Chip>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontWeight: "bold",
  },
  statusChip: {
    borderRadius: 20,
  },
});

export default PlantHeader;

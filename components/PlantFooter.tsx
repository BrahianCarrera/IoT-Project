import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

const PlantFooter: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.footer}>
      <Text 
        variant="bodySmall"
        style={[
          styles.footerText,
          { color: theme.colors.onSurfaceVariant }
        ]}
      >
        Sistema IoT Hidropónico v1.0
      </Text>
      <Text 
        variant="bodySmall"
        style={[
          styles.footerText,
          { color: theme.colors.onSurfaceVariant }
        ]}
      >
        Última actualización: {new Date().toLocaleTimeString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    marginBottom: 4,
    opacity: 0.7,
  },
});

export default PlantFooter;

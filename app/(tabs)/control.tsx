import { useCultivoControl } from '@/hooks/useCultivoControl';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Switch, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ControlScreen() {
  const theme = useTheme();
  const { controlState, isLoading, error, toggleBomba, toggleValvula, togglePh, refetch } = useCultivoControl();

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurface }}>
          Sincronizando controles...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <MaterialCommunityIcons name="alert-circle" size={48} color={theme.colors.error} />
        <Text style={{ color: theme.colors.error, marginTop: 16, textAlign: 'center' }}>
          {error}
        </Text>
        <Button mode="contained" onPress={refetch} style={{ marginTop: 20 }}>
          Reintentar
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            Panel de Control
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            Gestión manual de dispositivos
          </Text>
        </View>

        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Actuadores
        </Text>

        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconBackground, { backgroundColor: controlState.bomba ? theme.colors.primaryContainer : theme.colors.surfaceVariant }]}>
                <MaterialCommunityIcons 
                  name={controlState.bomba ? "water-pump" : "water-pump-off"} 
                  size={28} 
                  color={controlState.bomba ? theme.colors.primary : theme.colors.onSurfaceVariant} 
                />
              </View>
              <View style={styles.textContainer}>
                <Text variant="titleMedium" style={{ fontWeight: '600' }}>Bomba de Riego</Text>
                <Text variant="bodySmall" style={{ color: controlState.bomba ? theme.colors.primary : theme.colors.onSurfaceVariant }}>
                  {controlState.bomba ? "Encendida" : "Apagada"}
                </Text>
              </View>
            </View>
            <Switch
              value={controlState.bomba}
              onValueChange={toggleBomba}
              color={theme.colors.primary}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconBackground, { backgroundColor: controlState.valvula ? theme.colors.primaryContainer : theme.colors.surfaceVariant }]}>
                <MaterialCommunityIcons 
                  name={controlState.valvula ? "valve" : "valve-closed"} 
                  size={28} 
                  color={controlState.valvula ? theme.colors.primary : theme.colors.onSurfaceVariant} 
                />
              </View>
              <View style={styles.textContainer}>
                <Text variant="titleMedium" style={{ fontWeight: '600' }}>Válvula de Llenado</Text>
                <Text variant="bodySmall" style={{ color: controlState.valvula ? theme.colors.primary : theme.colors.onSurfaceVariant }}>
                  {controlState.valvula ? "Abierta" : "Cerrada"}
                </Text>
              </View>
            </View>
            <Switch
              value={controlState.valvula}
              onValueChange={toggleValvula}
              color={theme.colors.primary}
            />
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface, marginTop: 24 }]}>
          Sensores
        </Text>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBackground, { backgroundColor: theme.colors.secondaryContainer }]}>
                <MaterialCommunityIcons 
                  name="flask" 
                  size={28} 
                  color={theme.colors.secondary} 
                />
              </View>
              <View style={styles.textContainer}>
                <Text variant="titleMedium" style={{ fontWeight: '600' }}>Sensor de pH</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Lectura bajo demanda
                </Text>
              </View>
            </View>
            
            <View style={styles.actionContainer}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, marginRight: 16 }}>
                Activa el sensor temporalmente para tomar una lectura precisa del pH actual.
              </Text>
              <Switch
                value={controlState.ph}
                onValueChange={togglePh}
                color={theme.colors.primary}
              />
            </View>
          </Card.Content>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});

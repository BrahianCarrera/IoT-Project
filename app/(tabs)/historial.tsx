import HistoryCharts from '@/components/HistoryCharts';
import { useCultivoHistory } from '@/hooks/useCultivoHistory';
import { CultivoData } from '@/types/CultivoTypes';
import { formatDate } from '@/utils/dateUtils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistorialScreen() {
  const theme = useTheme();
  const { history, isLoading, error } = useCultivoHistory();
  
  const renderItem = ({ item }: { item: CultivoData }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerRow}>
            <Text variant="titleMedium" style={{color: theme.colors.primary, fontWeight: 'bold'}}>
                {formatDate(item.timestamp)}
            </Text>
        </View>
        
        <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
                <MaterialCommunityIcons name="thermometer" size={20} color={theme.colors.error} />
                <Text variant="bodyMedium">Temp: {item.temperatura}°C</Text>
            </View>
             <View style={styles.metricItem}>
                <MaterialCommunityIcons name="ph" size={20} color={theme.colors.tertiary} />
                <Text variant="bodyMedium">pH: {item.ph}</Text>
            </View>
        </View>
        
        <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
                <MaterialCommunityIcons name="water-percent" size={20} color={theme.colors.secondary} />
                <Text variant="bodyMedium">Nivel Agua: {item.nivel_agua}%</Text>
            </View>
            <View style={styles.metricItem}>
                <MaterialCommunityIcons name="earth" size={20} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodyMedium">Suelo: {item.humedad_suelo}%</Text>
            </View>
        </View>
        <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
                <MaterialCommunityIcons name="cloud" size={20} color={theme.colors.secondary} />
                <Text variant="bodyMedium">Humedad Aire: {item.humedad_aire}%</Text>
            </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 10, color: theme.colors.onSurface }}>Cargando historial...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error }}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>Historial</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Últimas 50 lecturas</Text>
      </View>
      
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
            <View>
                <HistoryCharts data={history} />
                <Text variant="titleMedium" style={{ paddingHorizontal: 16, marginBottom: 8, fontWeight: 'bold' }}>
                    Últimas Lecturas
                </Text>
            </View>
        }
        ListEmptyComponent={
            <View style={styles.centerContainer}>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>No hay datos históricos disponibles.</Text>
            </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  }
});

import { CultivoData } from '@/types/CultivoTypes';
import React, { useMemo, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, IconButton, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HistoryChartsProps {
  data: CultivoData[];
}

type MetricType = 'temperatura' | 'ph' | 'humedad_aire' | 'humedad_suelo' | 'nivel_agua';

export default function HistoryCharts({ data }: HistoryChartsProps) {
  const theme = useTheme();
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('temperatura');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => theme.colors.primary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
    labelColor: (opacity = 1) => theme.colors.onSurfaceVariant,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: theme.colors.primary
    }
  };

  const getChartData = (limit: number) => {
    const recentData = [...data].reverse().slice(-limit);
    
    if (recentData.length === 0) return null;

    // Create labels based on index or timestamp if available, for now just index
    const labels = recentData.map((_, i) => (i + 1).toString());

    return {
      labels: labels,
      datasets: [
        {
          data: recentData.map(d => d[selectedMetric] || 0),
          color: (opacity = 1) => theme.colors.primary,
          strokeWidth: 2
        }
      ],
      legend: [getMetricLabel(selectedMetric)]
    };
  };

  const previewData = useMemo(() => getChartData(10), [data, selectedMetric, theme.colors.primary]);
  const fullscreenData = useMemo(() => getChartData(50), [data, selectedMetric, theme.colors.primary]);

  function getMetricLabel(metric: MetricType) {
    switch(metric) {
      case 'temperatura': return 'Temperatura (°C)';
      case 'ph': return 'pH';
      case 'humedad_aire': return 'Humedad Aire (%)';
      case 'humedad_suelo': return 'Humedad Suelo (%)';
      case 'nivel_agua': return 'Nivel Agua (%)';
    }
  }

  if (!data || data.length === 0) {
    return null;
  }

  const MetricSelector = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorContainer}>
      <SegmentedButtons
        value={selectedMetric}
        onValueChange={value => setSelectedMetric(value as MetricType)}
        buttons={[
          { value: 'temperatura', label: 'Temp', icon: 'thermometer' },
          { value: 'humedad_aire', label: 'Aire', icon: 'cloud' },
          { value: 'ph', label: 'pH', icon: 'ph' },
          { value: 'humedad_suelo', label: 'Suelo', icon: 'earth' },
          { value: 'nivel_agua', label: 'Agua', icon: 'water-percent' },
        ]}
        style={styles.segmentedButton}
        density="small"
      />
    </ScrollView>
  );

  return (
    <>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Tendencias</Text>
            <IconButton 
              icon="fullscreen" 
              mode="contained-tonal" 
              size={20} 
              onPress={() => setIsFullscreen(true)} 
            />
          </View>
          
          <MetricSelector />

          {previewData && (
            <LineChart
              data={previewData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLines={false}
              yAxisInterval={1}
            />
          )}
        </Card.Content>
      </Card>

      <Modal 
        visible={isFullscreen} 
        onDismiss={() => setIsFullscreen(false)}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={[styles.fullscreenContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.fullscreenHeader}>
            <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Vista Detallada</Text>
            <IconButton icon="close" size={24} onPress={() => setIsFullscreen(false)} />
          </View>

          <MetricSelector />

          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            {fullscreenData && (
              <View style={styles.fullscreenChartContainer}>
                <LineChart
                  data={fullscreenData}
                  width={Math.max(screenWidth - 32, fullscreenData.labels.length * 40)} // Dynamic width
                  height={screenHeight * 0.6}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                  withInnerLines={true}
                  withOuterLines={true}
                  withVerticalLines={true}
                  yAxisInterval={1}
                />
              </View>
            )}
          </ScrollView>
          <Text style={{ textAlign: 'center', marginTop: 8, color: theme.colors.onSurfaceVariant }}>
            Mostrando últimos 50 registros
          </Text>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    marginHorizontal: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectorContainer: {
    marginBottom: 16,
  },
  segmentedButton: {
    minWidth: 400,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 40,
  },
  fullscreenContainer: {
    flex: 1,
    padding: 16,
  },
  fullscreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  fullscreenChartContainer: {
    flex: 1,
    justifyContent: 'center',
  }
});

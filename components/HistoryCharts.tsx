import { CultivoData } from '@/types/CultivoTypes';
import React, { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, SegmentedButtons, Text, useTheme } from 'react-native-paper';

interface HistoryChartsProps {
  data: CultivoData[];
}

type MetricType = 'temperatura' | 'ph' | 'humedad_aire' | 'humedad_suelo' | 'nivel_agua';

export default function HistoryCharts({ data }: HistoryChartsProps) {
  const theme = useTheme();
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('temperatura');
  const screenWidth = Dimensions.get("window").width;

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

  const chartData = useMemo(() => {
    const recentData = [...data].reverse().slice(-10);
    
    if (recentData.length === 0) return null;

    return {
      labels: ["1","2","3","4","5","6","7","8","9","10"],
      datasets: [
        {
          data: recentData.map(d => d[selectedMetric] || 0),
          color: (opacity = 1) => theme.colors.primary,
          strokeWidth: 2
        }
      ],
      legend: [getMetricLabel(selectedMetric)]
    };
  }, [data, selectedMetric, theme.colors.primary]);

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

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: 'bold' }}>Tendencias</Text>
        
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

        {chartData && (
            <LineChart
            data={chartData}
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
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    marginHorizontal:0,
  },
  selectorContainer: {
    marginBottom: 16,
  },
  segmentedButton: {
    minWidth: 400, // Ensure it scrolls
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 40, // Fix for labels being cut off
  }
});

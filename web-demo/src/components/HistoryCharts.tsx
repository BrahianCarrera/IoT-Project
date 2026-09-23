import { useMemo, useState } from "react";
import type { AnimationEvent } from "react";
import LineChart from "@/components/charts/LineChart";
import Card from "@/components/paper/Card";
import IconButton from "@/components/paper/IconButton";
import SegmentedButtons from "@/components/paper/SegmentedButtons";
import Text from "@/components/paper/Text";
import type { CultivoData } from "@/types/CultivoTypes";

interface HistoryChartsProps {
  data: CultivoData[];
}

type MetricType =
  | "temperatura"
  | "ph"
  | "humedad_aire"
  | "humedad_suelo"
  | "nivel_agua";

const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 844;

function getMetricLabel(metric: MetricType): string {
  switch (metric) {
    case "temperatura":
      return "Temperatura (°C)";
    case "ph":
      return "pH";
    case "humedad_aire":
      return "Humedad Aire (%)";
    case "humedad_suelo":
      return "Humedad Suelo (%)";
    case "nivel_agua":
      return "Nivel Agua (%)";
  }
}

export default function HistoryCharts({ data }: HistoryChartsProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("temperatura");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const getChartData = (limit: number): number[] | null => {
    const recentData = [...data].reverse().slice(-limit);
    if (recentData.length === 0) return null;
    return recentData.map((d) => d[selectedMetric] || 0);
  };

  const previewData = useMemo(
    () => getChartData(10),
    [data, selectedMetric],
  );
  const fullscreenData = useMemo(
    () => getChartData(50),
    [data, selectedMetric],
  );

  if (!data || data.length === 0) {
    return null;
  }

  const closeFullscreen = () => {
    setIsClosing(true);
  };

  const onModalAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (isClosing) {
      setIsClosing(false);
      setIsFullscreen(false);
    }
  };

  const previewWidth = SCREEN_WIDTH - 64; // listado (32) + contenido de tarjeta (32)
  const fullscreenWidth = Math.max(
    SCREEN_WIDTH - 32,
    (fullscreenData?.length ?? 0) * 40,
  );
  const fullscreenHeight = SCREEN_HEIGHT * 0.6;

  const metricSelector = (
    <div className="segmented-scroll">
      <SegmentedButtons
        value={selectedMetric}
        onValueChange={(value) => setSelectedMetric(value as MetricType)}
        buttons={[
          { value: "temperatura", label: "Temp", icon: "thermometer" },
          { value: "humedad_aire", label: "Aire", icon: "cloud" },
          { value: "ph", label: "pH", icon: "ph" },
          { value: "humedad_suelo", label: "Suelo", icon: "earth" },
          { value: "nivel_agua", label: "Agua", icon: "water-percent" },
        ]}
        density="small"
        style={{ minWidth: 400 }}
      />
    </div>
  );

  return (
    <>
      <Card className="charts-card">
        <Card.Content>
          <div className="charts-card__header">
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
              Tendencias
            </Text>
            <IconButton
              icon="fullscreen"
              mode="contained-tonal"
              size={20}
              ariaLabel="Vista detallada"
              onPress={() => setIsFullscreen(true)}
            />
          </div>

          {metricSelector}

          {previewData && (
            <div className="charts-card__plot">
              <Text
                variant="labelMedium"
                style={{ color: "var(--on-surface-variant)" }}
              >
                {getMetricLabel(selectedMetric)}
              </Text>
              <LineChart
                values={previewData}
                width={previewWidth}
                height={220}
                color="var(--primary)"
                decimalPlaces={1}
              />
            </div>
          )}
        </Card.Content>
      </Card>

      {(isFullscreen || isClosing) && (
        <div
          className={
            "chart-modal" + (isClosing ? " chart-modal--closing" : "")
          }
          onAnimationEnd={onModalAnimationEnd}
        >
          <div className="chart-modal__header">
            <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>
              Vista Detallada
            </Text>
            <IconButton icon="close" size={24} onPress={closeFullscreen} />
          </div>

          {metricSelector}

          <div className="chart-modal__scroll">
            {fullscreenData && (
              <div className="chart-modal__plot">
                <LineChart
                  values={fullscreenData}
                  width={fullscreenWidth}
                  height={fullscreenHeight}
                  color="var(--primary)"
                  decimalPlaces={1}
                  labelStep={Math.ceil(fullscreenData.length / 10)}
                  withOuterLines
                  withVerticalLines
                />
              </div>
            )}
          </div>

          <Text
            variant="bodySmall"
            style={{
              textAlign: "center",
              marginTop: 8,
              color: "var(--on-surface-variant)",
            }}
          >
            Mostrando últimos 50 registros
          </Text>
        </div>
      )}
    </>
  );
}

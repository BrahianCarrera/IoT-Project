import { useState, useEffect } from 'react';

export interface PlantMetrics {
  temperature: number;
  humidity: number;
  ph: number;
  ec: number;
  waterLevel: number;
  lightLevel: number;
  lastWatering: string;
}

export type MetricStatus = 'optimal' | 'warning' | 'critical';

export const usePlantMetrics = () => {
  const [metrics, setMetrics] = useState<PlantMetrics>({
    temperature: 24.5,
    humidity: 65,
    ph: 6.2,
    ec: 1.8,
    waterLevel: 75,
    lightLevel: 80,
    lastWatering: "Hace 2 horas",
  });

  const [isWatering, setIsWatering] = useState(false);
  const [isConnected] = useState(true);

  // Simular actualización de datos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 0.5,
        humidity: Math.max(
          0,
          Math.min(100, prev.humidity + (Math.random() - 0.5) * 2)
        ),
        ph: prev.ph + (Math.random() - 0.5) * 0.1,
        ec: prev.ec + (Math.random() - 0.5) * 0.1,
        waterLevel: Math.max(
          0,
          Math.min(100, prev.waterLevel + (Math.random() - 0.5) * 1)
        ),
        lightLevel: Math.max(
          0,
          Math.min(100, prev.lightLevel + (Math.random() - 0.5) * 3)
        ),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getMetricStatus = (value: number, min: number, max: number): MetricStatus => {
    if (value < min || value > max) return 'critical';
    if (value < min + (max - min) * 0.2 || value > max - (max - min) * 0.2) return 'warning';
    return 'optimal';
  };

  const handleWatering = () => {
    setIsWatering(true);
    // Simular proceso de riego
    setTimeout(() => {
      setIsWatering(false);
      setMetrics((prev) => ({
        ...prev,
        waterLevel: Math.min(100, prev.waterLevel + 10),
        lastWatering: "Ahora",
      }));
    }, 3000);
  };

  return {
    metrics,
    isWatering,
    isConnected,
    getMetricStatus,
    handleWatering,
  };
};

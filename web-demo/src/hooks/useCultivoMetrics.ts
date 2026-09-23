import { onValue, ref, set, database } from "@/mock/database";
import { useCallback, useEffect, useState } from "react";
import { CultivoData, MetricStatus } from "@/types/CultivoTypes";

const INITIAL_STATE: CultivoData = {
  bomba: false,
  humedad_aire: 0,
  humedad_suelo: 0,
  nivel_agua: 0,
  ph: 0,
  temperatura: 0,
  timestamp: "",
};

export const useCultivoMetrics = () => {
  const [metrics, setMetrics] = useState<CultivoData>(INITIAL_STATE);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [errorMetrics, setErrorMetrics] = useState<string | null>(null);
  const [isControlling, setIsControlling] = useState(false);

  useEffect(() => {
    const dataRef = ref(database, "cultivo/datos");

    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setMetrics(snapshot.val() as CultivoData);
          setErrorMetrics(null);
        } else {
          setMetrics(INITIAL_STATE);
        }
        setIsLoadingMetrics(false);
      },
      (dbError) => {
        console.error("Database Read Error:", dbError);
        setErrorMetrics("Fallo la conexión o lectura de la base de datos.");
        setIsLoadingMetrics(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const getMetricStatus = useCallback(
    (value: number, min: number, max: number): MetricStatus => {
      if (value < min || value > max) return "critical";
      else if (
        value < min + (max - min) * 0.2 ||
        value > max - (max - min) * 0.2
      )
        return "warning";
      return "optimal";
    },
    [],
  );

  const handleToggleBomba = async () => {
    if (isControlling) return;

    setIsControlling(true);

    const newState = !metrics.bomba;
    const bombaRef = ref(database, "cultivo/datos_actuales/bomba");

    try {
      await set(bombaRef, newState);
    } catch (e) {
      console.error("Error al controlar la bomba:", e);
    } finally {
      setTimeout(() => setIsControlling(false), 500);
    }
  };

  return {
    metrics,
    isLoadingMetrics,
    errorMetrics,
    isControlling,
    getMetricStatus,
    handleToggleBomba,
  };
};

import { onValue, ref, set } from 'firebase/database';
import { useCallback, useEffect, useState } from 'react';
import { CultivoData, MetricStatus } from '../types/CultivoTypes'; // Importa la nueva interfaz
import { database } from '../utils/firebaseConfig'; // Asegúrate de importar la DB

// Define los valores iniciales para evitar errores
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
  // Usamos CultivoData para tipar el estado que viene de Firebase
  const [metrics, setMetrics] = useState<CultivoData>(INITIAL_STATE);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [errorMetrics, setErrorMetrics] = useState<string | null>(null);

  // No necesitamos isConnected si la DB está escuchando activamente
  // Mantenemos la lógica de control separada para la interfaz
  const [isControlling, setIsControlling] = useState(false);

  // --- LÓGICA DE LECTURA DE DATOS (Reemplaza el `setInterval`) ---
  useEffect(() => {
    const dataRef = ref(database, 'cultivo/datos');

    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        // Mapea los datos directamente a tu estado
        setMetrics(snapshot.val() as CultivoData);
        setErrorMetrics(null);
      } else {
        // En caso de que el nodo esté vacío
        setMetrics(INITIAL_STATE);
      }
      setIsLoadingMetrics(false);
    }, (dbError) => {
      // Manejo de errores de Firebase
      console.error("Firebase Read Error:", dbError);
      setErrorMetrics("Fallo la conexión o lectura de la base de datos.");
      setIsLoadingMetrics(false);
    });

    return () => unsubscribe();
  }, []);

  // --- LÓGICA DE NEGOCIO (Mantenida de tu hook original) ---

  // Puedes dejar la función de estatus igual, solo adapta los nombres de los campos si es necesario
  const getMetricStatus = useCallback((value: number, min: number, max: number): MetricStatus => {
    if (value < min || value > max) return 'critical';
    else if (value < min + (max - min) * 0.2 || value > max - (max - min) * 0.2) return 'warning';
    return 'optimal';
  }, []);


  const handleToggleBomba = async () => {
    if (isControlling) return;

    setIsControlling(true);

    const newState = !metrics.bomba;
    const bombaRef = ref(database, 'cultivo/datos_actuales/bomba');

    try {
      // Escribe el nuevo estado de la bomba en Firebase
      await set(bombaRef, newState);
      // Opcional: El estado `metrics` se actualizará automáticamente por el oyente `onValue`
    } catch (e) {
      console.error("Error al controlar la bomba:", e);
      // Aquí podrías mostrar una notificación de error al usuario
    } finally {
      // Termina la simulación de espera después de la operación de DB
      // Podrías usar un pequeño timeout para simular latencia de red si es necesario
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
    // Aquí puedes añadir más funciones de control (handleToggleValvula, etc.)
  };
};
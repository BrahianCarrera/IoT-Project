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
  valvula: false,
  regando: false,
};

export const useCultivoMetrics = () => {
  // Usamos CultivoData para tipar el estado que viene de Firebase
  const [metrics, setMetrics] = useState<CultivoData>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // No necesitamos isConnected si la DB está escuchando activamente
  // Mantenemos la lógica de control separada para la interfaz
  const [isControlling, setIsControlling] = useState(false);

  // --- LÓGICA DE LECTURA DE DATOS (Reemplaza el `setInterval`) ---
  useEffect(() => {
    const dataRef = ref(database, 'cultivo/datos_actuales');

    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        // Mapea los datos directamente a tu estado
        setMetrics(snapshot.val() as CultivoData);
        setError(null);
      } else {
        // En caso de que el nodo esté vacío
        setMetrics(INITIAL_STATE);
      }
      setIsLoading(false);
    }, (dbError) => {
      // Manejo de errores de Firebase
      console.error("Firebase Read Error:", dbError);
      setError("Fallo la conexión o lectura de la base de datos.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []); // Se ejecuta solo al montar

  // --- LÓGICA DE NEGOCIO (Mantenida de tu hook original) ---

  // Puedes dejar la función de estatus igual, solo adapta los nombres de los campos si es necesario
  const getMetricStatus = useCallback((value: number, min: number, max: number): MetricStatus => {
    if (value < min || value > max) return 'critical';
    // Lógica para Warning...
    return 'optimal';
  }, []);

  // --- LÓGICA DE ESCRITURA DE CONTROL (Nueva) ---

  // Función para encender/apagar la bomba y actualizar la DB
  const handleToggleBomba = async () => {
    if (isControlling) return; // Evita doble click

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
    isLoading,
    error,
    isControlling,
    getMetricStatus,
    handleToggleBomba,
    // Aquí puedes añadir más funciones de control (handleToggleValvula, etc.)
  };
};
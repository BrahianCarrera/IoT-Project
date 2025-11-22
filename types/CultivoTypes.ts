export interface CultivoData {
    bomba: boolean;
    humedad_aire: number;
    humedad_suelo: number;
    nivel_agua: number;
    ph: number;
    temperatura: number;
    timestamp: string; // Fecha u hora del último registro
}

export type MetricStatus = 'optimal' | 'warning' | 'critical';
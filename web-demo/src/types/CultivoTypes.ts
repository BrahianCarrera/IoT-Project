export interface CultivoData {
  bomba: boolean;
  humedad_aire: number;
  humedad_suelo: number;
  nivel_agua: number;
  ph: number;
  temperatura: number;
  timestamp: string;
}

export type MetricStatus = "optimal" | "warning" | "critical";

export interface ControlState {
  bomba: boolean;
  valvula: boolean;
  medir_ph: boolean;
}

export interface HistoricoEntry extends CultivoData {
  id: string;
}

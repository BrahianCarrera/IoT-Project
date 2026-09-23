/**
 * mock/seed.ts
 *
 * Genera los datos iniciales que en la app original provienen de Firebase:
 *   - cultivo/datos       → última medición en vivo
 *   - cultivo/control     → estado de los actuadores
 *   - cultivo/historico   → últimas 50 lecturas históricas
 */
import { writeValue } from "./database";
import type { CultivoData, ControlState } from "@/types/CultivoTypes";

const HISTORY_SIZE = 50;
const HISTORY_INTERVAL_MS = 6 * 60 * 1000; // una lectura cada 6 minutos

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const rand = (amplitude: number): number =>
  (Math.random() * 2 - 1) * amplitude;

const round = (value: number, decimals: number): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

/**
 * formatDate() del proyecto original espera segundos desde epoch (number o
 * string numérico), así que el mock almacena el timestamp en ese formato.
 */
const toEpochSeconds = (date: Date): string =>
  String(Math.floor(date.getTime() / 1000));

export function historicoKey(entries: Record<string, unknown>): string {
  let max = 0;
  for (const key of Object.keys(entries)) {
    const match = /^h(\d+)$/.exec(key);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  return `h${String(max + 1).padStart(6, "0")}`;
}

/** Crea las ~50 lecturas históricas con valores realistas de un cultivo real. */
function buildHistory(): { historico: Record<string, CultivoData>; last: CultivoData } {
  const now = Date.now();
  const historico: Record<string, CultivoData> = {};

  // Estado inicial del día
  let temperatura = 22.5;
  let humedadAire = 58;
  let humedadSuelo = 70;
  let ph = 6.2;
  let nivelAgua = 93;

  for (let i = 0; i < HISTORY_SIZE; i++) {
    const timestamp = new Date(now - (HISTORY_SIZE - 1 - i) * HISTORY_INTERVAL_MS);
    const hour = timestamp.getHours() + timestamp.getMinutes() / 60;
    // Curva diurna: máx. ~14h, mín. ~3h
    const dayPhase = Math.sin(((hour - 8) / 24) * 2 * Math.PI);

    const tempTarget = 23 + dayPhase * 3.2;
    temperatura = clamp(temperatura + (tempTarget - temperatura) * 0.35 + rand(0.35), 17.5, 30);

    const aireTarget = 62 - dayPhase * 6;
    humedadAire = clamp(humedadAire + (aireTarget - humedadAire) * 0.3 + rand(1.4), 40, 82);

    // El suelo se seca poco a poco; cuando baja mucho, ocurrió un riego
    humedadSuelo -= 0.7 + Math.random() * 0.5;
    let bomba = false;
    if (humedadSuelo < 46) {
      humedadSuelo += 18 + Math.random() * 8;
      bomba = true;
    }
    humedadSuelo = clamp(humedadSuelo, 30, 88);

    ph = clamp(ph + rand(0.06) + (6.3 - ph) * 0.08, 5.7, 6.8);

    nivelAgua = clamp(nivelAgua - (0.25 + Math.random() * 0.2), 30, 100);

    const entry: CultivoData = {
      bomba,
      humedad_aire: round(humedadAire, 0),
      humedad_suelo: round(humedadSuelo, 0),
      nivel_agua: round(nivelAgua, 0),
      ph: round(ph, 2),
      temperatura: round(temperatura, 1),
      timestamp: toEpochSeconds(timestamp),
    };

    historico[`h${String(i + 1).padStart(6, "0")}`] = entry;
  }

  const last = { ...Object.values(historico)[HISTORY_SIZE - 1] };
  last.timestamp = new Date(now).toISOString();
  return { historico, last };
}

export function seedDatabase(): void {
  const { historico, last } = buildHistory();

  const control: ControlState = { bomba: false, valvula: false, medir_ph: false };

  const datos: CultivoData = {
    ...last,
    bomba: control.bomba,
    timestamp: toEpochSeconds(new Date()),
  };

  writeValue("cultivo/historico", historico);
  writeValue("cultivo/control", control);
  writeValue("cultivo/datos", datos);

  // La app original registra la sesión autenticada en logs/connection/{uid}
  writeValue("logs/connection/demo", {
    timestamp: toEpochSeconds(new Date()),
    status: "Authenticated and Ready",
  });
}

export const MOCK_HISTORY_SIZE = HISTORY_SIZE;

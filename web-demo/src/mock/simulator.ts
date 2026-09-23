/**
 * mock/simulator.ts
 *
 * Simula el ESP32/sistema IoT publicando en la base de datos:
 *  - actualiza `cultivo/datos` cada pocos segundos (sensores con deriva realista)
 *  - los actuadores de `cultivo/control` afectan las mediciones
 *    (bomba → sube la humedad del suelo y baja el nivel de agua,
 *     válvula → sube el nivel de agua)
 *  - `medir_ph` toma una lectura y se apaga solo, como haría el firmware
 *  - agrega una entrada a `cultivo/historico` periódicamente (máx. 50)
 */
import {
  getValue,
  notifyPath,
  writeValue,
} from "./database";
import { historicoKey, MOCK_HISTORY_SIZE } from "./seed";
import type { ControlState, CultivoData } from "@/types/CultivoTypes";

const TICK_MS = 4000;
const HISTORY_EVERY_TICKS = 4; // una entrada histórica cada ~16 s
const PH_READING_MS = 2200;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const rand = (amplitude: number): number =>
  (Math.random() * 2 - 1) * amplitude;

const round = (value: number, decimals: number): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

/** Igual que en el original: timestamps en segundos desde epoch. */
const nowSeconds = (): string => String(Math.floor(Date.now() / 1000));

const DEFAULT_CONTROL: ControlState = {
  bomba: false,
  valvula: false,
  medir_ph: false,
};

function readControl(): ControlState {
  const value = getValue("cultivo/control");
  if (value && typeof value === "object") {
    return { ...DEFAULT_CONTROL, ...(value as ControlState) };
  }
  return { ...DEFAULT_CONTROL };
}

function readDatos(): CultivoData {
  const value = getValue("cultivo/datos");
  if (value && typeof value === "object") {
    return value as CultivoData;
  }
  return {
    bomba: false,
    humedad_aire: 60,
    humedad_suelo: 55,
    nivel_agua: 75,
    ph: 6.2,
    temperatura: 23,
    timestamp: nowSeconds(),
  };
}

async function publishDatos(datos: CultivoData): Promise<void> {
  writeValue("cultivo/datos", datos);
  notifyPath("cultivo/datos");
}

async function appendHistorico(datos: CultivoData): Promise<void> {
  const current = (getValue("cultivo/historico") ?? {}) as Record<
    string,
    CultivoData
  >;
  current[historicoKey(current)] = { ...datos };

  const keys = Object.keys(current);
  if (keys.length > MOCK_HISTORY_SIZE) {
    for (const key of keys.slice(0, keys.length - MOCK_HISTORY_SIZE)) {
      delete current[key];
    }
  }

  writeValue("cultivo/historico", current);
  notifyPath("cultivo/historico");
}

function step(): void {
  const control = readControl();
  const datos = readDatos();

  const next: CultivoData = {
    ...datos,
    bomba: control.bomba,
    timestamp: nowSeconds(),
  };

  // Temperatura y humedad del aire: paseo aleatorio con tendencia suave
  next.temperatura = round(
    clamp(datos.temperatura + (23 - datos.temperatura) * 0.08 + rand(0.35), 17, 31),
    1,
  );
  next.humedad_aire = round(
    clamp(datos.humedad_aire + (60 - datos.humedad_aire) * 0.08 + rand(1.2), 35, 85),
    0,
  );

  // pH: deriva lenta alrededor del rango óptimo
  next.ph = round(
    clamp(datos.ph + (6.3 - datos.ph) * 0.1 + rand(0.05), 5.2, 7.4),
    2,
  );

  // Humedad del suelo: las plantas beben; la bomba la recarga
  let suelo = datos.humedad_suelo - (0.4 + Math.random() * 0.4);
  if (control.bomba) suelo += 3.5;
  next.humedad_suelo = round(clamp(suelo, 5, 95), 0);

  // Nivel de agua: consumo, relleno con válvula, consumo extra con bomba
  let nivel = datos.nivel_agua - 0.3;
  if (control.valvula) nivel += 4.5;
  if (control.bomba) nivel -= 0.8;
  next.nivel_agua = round(clamp(nivel, 0, 100), 0);

  void publishDatos(next);
}

let tickCount = 0;

function onTick(): void {
  step();
  tickCount += 1;
  if (tickCount % HISTORY_EVERY_TICKS === 0) {
    void appendHistorico(readDatos());
  }
}

/**
 * Activa la lectura de pH bajo demanda: tras unos segundos el "firmware"
 * publica el nuevo valor y apaga el flag, como en el dispositivo real.
 */
function watchPhRequest(previous: boolean): void {
  if (!previous) return;
  setTimeout(() => {
    const control = readControl();
    if (!control.medir_ph) return;

    const datos = readDatos();
    const measured = round(clamp(6.1 + Math.random() * 0.5, 5.5, 7.0), 2);
    void publishDatos({ ...datos, ph: measured, timestamp: nowSeconds() });

    writeValue("cultivo/control/medir_ph", false);
    notifyPath("cultivo/control");
  }, PH_READING_MS);
}

let started = false;
let intervalId: ReturnType<typeof setInterval> | null = null;
let lastMedirPh = false;

export function startSimulator(): void {
  if (started) return;
  started = true;

  lastMedirPh = readControl().medir_ph;

  intervalId = setInterval(onTick, TICK_MS);

  // Observa cambios de medir_ph para simular la respuesta del sensor
  const controlWatcher = setInterval(() => {
    const current = readControl().medir_ph;
    if (current !== lastMedirPh) {
      const rising = current;
      lastMedirPh = current;
      if (rising) watchPhRequest(true);
    }
  }, 250);

  // Limpieza en hot-reload
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      if (intervalId) clearInterval(intervalId);
      clearInterval(controlWatcher);
      started = false;
    });
  }
}

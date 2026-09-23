/**
 * mock/backend.ts
 *
 * Punto de entrada del backend simulado. Al iniciar la demo:
 *  1. siembra la "base de datos" con datos realistas
 *  2. arranca el simulador del sistema IoT
 *
 * Todo vive detrás de la API de `mock/database.ts`, que imita a
 * `firebase/database`, por lo que puede sustituirse por el SDK real
 * sin tocar los hooks ni las pantallas.
 */
import { seedDatabase } from "./seed";
import { startSimulator } from "./simulator";

let initialized = false;

export function initMockBackend(): void {
  if (initialized) return;
  initialized = true;
  seedDatabase();
  startSimulator();
}

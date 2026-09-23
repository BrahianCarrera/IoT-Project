/**
 * mock/database.ts
 *
 * Shim local de Firebase Realtime Database (subset del SDK web `firebase/database`).
 * Implementa exactamente la superficie que usa la app original:
 *   ref, query, limitToLast, onValue, set
 *
 * Para volver a un backend real basta con reemplazar este módulo por los
 * imports de `firebase/database` en los hooks — la API es compatible.
 */

export interface Snapshot {
  exists(): boolean;
  val(): unknown;
}

export interface DatabaseReference {
  path: string;
}

export interface QueryReference extends DatabaseReference {
  limitToLast?: number;
}

export type ValueListener = (snapshot: Snapshot) => void;
export type ErrorListener = (error: Error) => void;

interface InternalListener {
  path: string;
  limit?: number;
  cb: ValueListener;
  timer: ReturnType<typeof setTimeout> | null;
}

/** Placeholder equivalente a la instancia `Database` de Firebase. */
export const database = {} as object;

const root: Record<string, unknown> = {};
const listeners = new Set<InternalListener>();

/** La "conexión" se establece tras un breve delay para mostrar los estados de carga. */
const CONNECT_DELAY_MS = 650;
const bootTime = Date.now();
const readyAt = bootTime + CONNECT_DELAY_MS;

const normalizePath = (path: string): string =>
  path.replace(/^\/+|\/+$/g, "");

function segments(path: string): string[] {
  return path ? normalizePath(path).split("/") : [];
}

function getNode(path: string): unknown {
  let node: unknown = root;
  for (const key of segments(path)) {
    if (node == null || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[key];
  }
  return node;
}

function setNode(path: string, value: unknown): void {
  const parts = segments(path);
  if (parts.length === 0) return;
  let node: Record<string, unknown> = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = node[key];
    if (next == null || typeof next !== "object" || Array.isArray(next)) {
      node[key] = {};
    }
    node = node[key] as Record<string, unknown>;
  }
  if (value === undefined) {
    delete node[parts[parts.length - 1]];
  } else {
    node[parts[parts.length - 1]] = value;
  }
}

function cloneValue<T>(value: T): T {
  if (value == null || typeof value !== "object") return value;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

function relates(listenerPath: string, changedPath: string): boolean {
  const a = normalizePath(listenerPath);
  const b = normalizePath(changedPath);
  return a === b || b.startsWith(a + "/") || a.startsWith(b + "/");
}

function emit(listener: InternalListener): void {
  let value = getNode(listener.path);

  if (
    listener.limit !== undefined &&
    value != null &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    const entries = Object.entries(value as Record<string, unknown>);
    value = Object.fromEntries(entries.slice(-listener.limit));
  }

  const snapshotValue = cloneValue(value);
  const snapshot: Snapshot = {
    exists: () => snapshotValue !== undefined && snapshotValue !== null,
    val: () => snapshotValue,
  };
  listener.cb(snapshot);
}

function notify(changedPath: string): void {
  for (const listener of listeners) {
    if (relates(listener.path, changedPath)) {
      if (listener.timer !== null) {
        clearTimeout(listener.timer);
        listener.timer = null;
      }
      emit(listener);
    }
  }
}

/** Valor crudo en una ruta (uso interno del simulador/seed). */
export function getValue(path: string): unknown {
  return cloneValue(getNode(path));
}

/** Escritura directa sin pasar por la API tipo Firebase (uso interno). */
export function writeValue(path: string, value: unknown): void {
  setNode(path, cloneValue(value));
}

/** Fuerza la re-emisión de listeners activos (uso interno). */
export function notifyPath(path: string): void {
  notify(path);
}

// ---------------------------------------------------------------------------
// API compatible con firebase/database
// ---------------------------------------------------------------------------

export function ref(_database: unknown, path: string): DatabaseReference {
  return { path: normalizePath(path) };
}

export function limitToLast(count: number): { limitToLast: number } {
  return { limitToLast: count };
}

export function query(
  reference: DatabaseReference,
  ...constraints: Array<{ limitToLast?: number }>
): QueryReference {
  const result: QueryReference = { path: reference.path };
  for (const constraint of constraints) {
    if (typeof constraint?.limitToLast === "number") {
      result.limitToLast = constraint.limitToLast;
    }
  }
  return result;
}

export function onValue(
  reference: DatabaseReference | QueryReference,
  callback: ValueListener,
  _errorCallback?: ErrorListener,
): () => void {
  const listener: InternalListener = {
    path: reference.path,
    limit: (reference as QueryReference).limitToLast,
    cb: callback,
    timer: null,
  };

  const delay = Math.max(0, readyAt - Date.now());
  listener.timer = setTimeout(() => {
    listener.timer = null;
    if (listeners.has(listener)) emit(listener);
  }, delay);

  listeners.add(listener);

  return () => {
    if (listener.timer !== null) clearTimeout(listener.timer);
    listeners.delete(listener);
  };
}

export function set(reference: DatabaseReference, value: unknown): Promise<void> {
  setNode(reference.path, value);
  notify(reference.path);
  return Promise.resolve();
}

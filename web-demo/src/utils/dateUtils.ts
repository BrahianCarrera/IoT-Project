/**
 * utils/dateUtils.ts — idéntico al proyecto original.
 */

/**
 * Formatea un timestamp (string o number) a una cadena de fecha y hora localizada.
 * Acepta segundos (number o string) o una cadena de fecha ISO válida.
 */
export const formatDate = (timestamp: string | number): string => {
  if (!timestamp) return "Sin fecha";
  try {
    let date: Date;

    if (typeof timestamp === "number") {
      date = new Date(timestamp * 1000);
    } else {
      const parsed = parseFloat(timestamp);
      if (!isNaN(parsed)) {
        date = new Date(parsed * 1000);
      } else {
        date = new Date(timestamp);
      }
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "2-digit",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
    };

    return date.toLocaleString("es-ES", options);
  } catch {
    return String(timestamp);
  }
};

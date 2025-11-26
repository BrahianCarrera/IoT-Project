// utils/dateUtils.ts

/**
 * Formatea un timestamp (string o number) a una cadena de fecha y hora localizada.
 * Acepta segundos (number o string) o una cadena de fecha ISO válida.
 * @param timestamp - El valor del tiempo (segundos como number o string, o cadena ISO).
 * @returns La fecha y hora formateada o la cadena original si falla.
 */
export const formatDate = (timestamp: string | number): string => {
    if (!timestamp) return "Sin fecha";
    try {
        let date: Date;

        if (typeof timestamp === 'number') {

            date = new Date(timestamp * 1000);
        } else {
            // Intenta primero como un número (timestamp en segundos como string)
            const parsed = parseFloat(timestamp);
            if (!isNaN(parsed)) {
                date = new Date(parsed * 1000);
            } else {
                // Asume que es una cadena de fecha ISO u otro formato analizable
                date = new Date(timestamp);
            }
        }

        const options: Intl.DateTimeFormatOptions = {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'UTC'
        }

        return date.toLocaleString('es-ES', options);
    } catch (e) {
        // En caso de error de parseo, retorna el valor original como string
        return String(timestamp);
    }
};
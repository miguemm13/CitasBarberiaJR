const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

// La barbería opera en horario de Venezuela (UTC-4, sin horario de
// verano). El servidor (ej. Render) corre en UTC, así que sin esto
// "ahora" quedaba calculado en la hora del servidor y no en la hora
// real del local -causaba que se marcaran como "ya pasadas" horas que
// en Venezuela todavía no habían llegado-.
const ZONA_HORARIA_BARBERIA = 'America/Caracas';

/**
 * Devuelve la fecha/hora actual en la zona horaria de la barbería,
 * sin importar en qué zona horaria esté corriendo el servidor.
 */
function ahoraEnVenezuela() {
  return dayjs().tz(ZONA_HORARIA_BARBERIA);
}

module.exports = { ahoraEnVenezuela, ZONA_HORARIA_BARBERIA };

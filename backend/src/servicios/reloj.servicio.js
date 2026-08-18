const dayjs = require('dayjs');

/**
 * Fuente de verdad de "qué día es hoy". Se calcula en el servidor
 * (no en el dispositivo del cliente) para que el calendario del
 * Paso 2 siempre muestre la fecha exacta al abrir la aplicación,
 * sin depender del reloj o la zona horaria del navegador del
 * cliente (que puede estar mal configurado).
 */
function obtenerFechaActual() {
  const ahora = dayjs();
  return {
    fecha: ahora.format('YYYY-MM-DD'), // usada por el calendario y por /api/citas
    horaIso: ahora.toISOString(),
  };
}

module.exports = { obtenerFechaActual };

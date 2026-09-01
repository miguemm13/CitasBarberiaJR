const { ahoraEnVenezuela } = require('../utilidades/hora-venezuela');

/**
 * Fuente de verdad de "qué día es hoy". Se calcula en la hora de
 * Venezuela (zona horaria de la barbería), no en la del servidor
 * (que puede correr en UTC, ej. Render) ni en la del dispositivo del
 * cliente (que puede estar mal configurado).
 */
function obtenerFechaActual() {
  const ahora = ahoraEnVenezuela();
  return {
    fecha: ahora.format('YYYY-MM-DD'), // usada por el calendario y por /api/citas
    horaIso: ahora.toISOString(),
  };
}

module.exports = { obtenerFechaActual };

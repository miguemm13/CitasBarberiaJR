const secuelize = require('../config/base-datos');
const { sembrarDatosIniciales } = require('../semillas');

/**
 * Endpoint TEMPORAL de un solo uso: borra todas las tablas y las
 * vuelve a crear limpias (con el esquema actual de los modelos),
 * sembrando de nuevo servicios y barbero. Corre en el mismo servidor
 * que ya está conectado a la base -evita el problema de conectarse
 * desde una PC/red que bloquea el puerto de Postgres hacia afuera-.
 *
 * Protegido con una clave simple en la URL porque es destructivo.
 * BORRAR este archivo y su ruta (ver rutas/index.js) después de
 * usarlo una vez.
 */
const CLAVE_TEMPORAL = 'jrbarber-reset-2026';

async function resetearBase(peticion, respuesta) {
  if (peticion.query.clave !== CLAVE_TEMPORAL) {
    return respuesta.status(403).json({ mensaje: 'Clave incorrecta' });
  }

  await secuelize.query('DROP TABLE IF EXISTS citas_servicios CASCADE;');
  await secuelize.query('DROP TABLE IF EXISTS citas CASCADE;');
  await secuelize.query('DROP TABLE IF EXISTS clientes CASCADE;');
  await secuelize.query('DROP TABLE IF EXISTS servicios CASCADE;');
  await secuelize.query('DROP TABLE IF EXISTS barberos CASCADE;');

  await secuelize.sync();
  await sembrarDatosIniciales();

  respuesta.json({ mensaje: 'Base reiniciada: tablas recreadas desde cero y datos sembrados de nuevo.' });
}

module.exports = { resetearBase };

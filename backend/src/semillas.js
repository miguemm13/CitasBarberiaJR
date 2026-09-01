/**
 * Datos iniciales de la barbería. Se cargan automáticamente cada vez
 * que arranca el servidor (ver servidor.js), así que no hace falta
 * correr ningún comando aparte ni tocar la base de datos a mano.
 * Además, esta lista es la única fuente de verdad: cualquier barbero
 * o servicio que ya no esté aquí se elimina automáticamente, para que
 * no queden datos de pruebas anteriores.
 *
 * Para agregar, quitar o cambiar precios de servicios/barberos, edita
 * estas listas y reinicia el servidor.
 */

const SERVICIOS_INICIALES = [{ nombre: 'Corte de Cabello', duracionMinutos: 45, precio: 10, icono: '✂️' }];

// El campo telegramChatId es opcional: si un barbero no tiene uno propio,
// las notificaciones caen al chat/grupo general (TELEGRAM_CHAT_ID_BARBERIA en .env).
const BARBEROS_INICIALES = [{ nombreCompleto: 'Javier Revette', especialidad: '', telegramChatId: '' }];

async function sembrarDatosIniciales() {
  const { Op } = require('sequelize');
  const { Servicio, Barbero } = require('./modelos');

  for (const servicio of SERVICIOS_INICIALES) {
    const [registro] = await Servicio.findOrCreate({ where: { nombre: servicio.nombre }, defaults: servicio });
    // Si ya existía (de un arranque anterior), sincroniza precio/duración/ícono
    // con lo definido arriba, para que un cambio en esta lista siempre se refleje.
    await registro.update({
      duracionMinutos: servicio.duracionMinutos,
      precio: servicio.precio,
      icono: servicio.icono,
      activo: true,
    });
  }
  for (const barbero of BARBEROS_INICIALES) {
    const [registro] = await Barbero.findOrCreate({ where: { nombreCompleto: barbero.nombreCompleto }, defaults: barbero });
    // No se sobrescribe telegramChatId aquí para no perder uno ya
    // configurado a mano (vía PUT /api/barberos/:id).
    await registro.update({ especialidad: barbero.especialidad, disponible: true });
  }

  // Limpieza: borra cualquier servicio/barbero de pruebas anteriores
  // que ya no esté en las listas de arriba. Si algún registro viejo ya
  // tiene citas asociadas, Postgres/SQLite rechaza el borrado por la
  // llave foránea (ej. al quitar "Corte de Cabello con Barba" mientras
  // existan citas de prueba con ese servicio) -en vez de tumbar el
  // arranque del servidor por ese error, se marca como inactivo para
  // que igual desaparezca de /api/servicios-.
  const nombresServicios = SERVICIOS_INICIALES.map(s => s.nombre);
  const nombresBarberos = BARBEROS_INICIALES.map(b => b.nombreCompleto);
  try {
    await Servicio.destroy({ where: { nombre: { [Op.notIn]: nombresServicios } } });
  } catch (error) {
    console.warn('[Semillas] No se pudieron borrar servicios viejos (tienen citas asociadas), se marcan inactivos:', error.message);
    await Servicio.update({ activo: false }, { where: { nombre: { [Op.notIn]: nombresServicios } } });
  }
  try {
    await Barbero.destroy({ where: { nombreCompleto: { [Op.notIn]: nombresBarberos } } });
  } catch (error) {
    console.warn('[Semillas] No se pudieron borrar barberos viejos (tienen citas asociadas), se marcan no disponibles:', error.message);
    await Barbero.update({ disponible: false }, { where: { nombreCompleto: { [Op.notIn]: nombresBarberos } } });
  }
}

module.exports = { sembrarDatosIniciales, SERVICIOS_INICIALES, BARBEROS_INICIALES };

// Permite además correrlo manualmente con "npm run seed" si se necesita.
// Usa sync() sin alter por la misma razón que servidor.js: en SQLite,
// "alter" reconstruye la tabla por detrás y es fácil que falle a mitad
// de camino, dejando la base corrupta. Si cambiaste un modelo, borra
// backend/barberia_citas.sqlite antes de correr este comando.
if (require.main === module) {
  const secuelize = require('./config/base-datos');
  secuelize
    .sync()
    .then(sembrarDatosIniciales)
    .then(() => {
      console.log('Datos iniciales creados correctamente.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error al crear datos iniciales:', error);
      process.exit(1);
    });
}

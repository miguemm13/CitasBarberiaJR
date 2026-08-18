/**
 * Punto único de exportación de los modelos (capa Modelo del MVC).
 * Permite importar así: const { Cita, Servicio } = require('../modelos');
 */
module.exports = {
  Cita: require('./Cita'),
  Servicio: require('./Servicio'),
  Barbero: require('./Barbero'),
  Cliente: require('./Cliente'),
  CitaServicio: require('./CitaServicio'),
};

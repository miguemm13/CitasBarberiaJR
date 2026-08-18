const relojServicio = require('../servicios/reloj.servicio');

/**
 * Controlador: Sistema
 * Utilidades generales del backend que no pertenecen a un recurso
 * de negocio específico (servicios, barberos, citas).
 */
async function obtenerFechaActual(peticion, respuesta) {
  respuesta.json(relojServicio.obtenerFechaActual());
}

module.exports = { obtenerFechaActual };

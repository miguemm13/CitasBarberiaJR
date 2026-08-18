const { Servicio } = require('../modelos');

/**
 * Controlador: Servicios
 * Expone las operaciones CRUD básicas usadas por el Paso 1 del asistente.
 */
async function listar(peticion, respuesta) {
  const servicios = await Servicio.findAll({ where: { activo: true } });
  respuesta.json(servicios);
}

async function obtenerPorId(peticion, respuesta) {
  const servicio = await Servicio.findByPk(peticion.params.id);
  if (!servicio) return respuesta.status(404).json({ mensaje: 'Servicio no encontrado' });
  respuesta.json(servicio);
}

async function crear(peticion, respuesta) {
  const nuevoServicio = await Servicio.create(peticion.body);
  respuesta.status(201).json(nuevoServicio);
}

async function actualizar(peticion, respuesta) {
  const servicio = await Servicio.findByPk(peticion.params.id);
  if (!servicio) return respuesta.status(404).json({ mensaje: 'Servicio no encontrado' });
  await servicio.update(peticion.body);
  respuesta.json(servicio);
}

async function eliminar(peticion, respuesta) {
  const servicio = await Servicio.findByPk(peticion.params.id);
  if (!servicio) return respuesta.status(404).json({ mensaje: 'Servicio no encontrado' });
  await servicio.update({ activo: false }); // borrado lógico
  respuesta.status(204).send();
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };

const { Barbero } = require('../modelos');

/**
 * Controlador: Barberos
 * Usado por el Paso 2 (opcional) del asistente de agendamiento.
 */
async function listar(peticion, respuesta) {
  const barberos = await Barbero.findAll({ where: { disponible: true } });
  respuesta.json(barberos);
}

async function crear(peticion, respuesta) {
  const nuevoBarbero = await Barbero.create(peticion.body);
  respuesta.status(201).json(nuevoBarbero);
}

async function actualizar(peticion, respuesta) {
  const barbero = await Barbero.findByPk(peticion.params.id);
  if (!barbero) return respuesta.status(404).json({ mensaje: 'Barbero no encontrado' });
  await barbero.update(peticion.body);
  respuesta.json(barbero);
}

module.exports = { listar, crear, actualizar };

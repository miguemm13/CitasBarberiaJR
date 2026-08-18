/**
 * Middleware: valida el cuerpo de la petición al crear una cita
 * (Paso 5 del asistente) antes de llegar al controlador.
 */
function validarCita(peticion, respuesta, siguiente) {
  const { serviciosIds, fecha, hora, cliente } = peticion.body;

  const errores = [];
  if (!Array.isArray(serviciosIds) || serviciosIds.length === 0) {
    errores.push('Debes seleccionar al menos un servicio');
  }
  if (!fecha) errores.push('La fecha es requerida');
  if (!hora) errores.push('La hora es requerida');
  if (!cliente?.nombreCompleto) errores.push('El nombre y apellido son requeridos');

  if (errores.length > 0) {
    return respuesta.status(400).json({ mensaje: 'Datos inválidos', errores });
  }
  siguiente();
}

module.exports = validarCita;

/**
 * Middleware global de errores. Debe registrarse al final de la
 * cadena de middlewares en app.js.
 */
function manejadorErrores(error, peticion, respuesta, siguiente) {
  console.error('[Error no controlado]', error);
  respuesta.status(error.status || 500).json({
    mensaje: error.message || 'Ocurrió un error inesperado en el servidor',
  });
}

module.exports = manejadorErrores;

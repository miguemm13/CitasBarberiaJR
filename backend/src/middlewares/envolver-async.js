/**
 * Envuelve un controlador async para que cualquier error (rechazo de
 * promesa) se pase al middleware global de errores (manejador-errores.js)
 * en vez de tumbar todo el proceso de Node como una excepción no
 * controlada. Express 4 NO atrapa automáticamente los rechazos de
 * funciones async en las rutas (a diferencia de Express 5), así que sin
 * este envoltorio un error inesperado en cualquier controlador -por
 * ejemplo, un problema de la base de datos- crashea el servidor entero
 * en vez de devolver un simple 500 al cliente que hizo la petición.
 */
function envolverAsync(fn) {
  return (peticion, respuesta, siguiente) => {
    Promise.resolve(fn(peticion, respuesta, siguiente)).catch(siguiente);
  };
}

/**
 * Envuelve de una sola vez todas las funciones de un controlador
 * (el objeto exportado por cada archivo en controladores/*.js).
 */
function envolverControlador(controlador) {
  const envuelto = {};
  for (const [nombre, fn] of Object.entries(controlador)) {
    envuelto[nombre] = typeof fn === 'function' ? envolverAsync(fn) : fn;
  }
  return envuelto;
}

module.exports = { envolverAsync, envolverControlador };

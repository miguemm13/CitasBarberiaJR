const express = require('express');
const cors = require('cors');
const rutasApi = require('./rutas');
const manejadorErrores = require('./middlewares/manejador-errores');
const variablesEntorno = require('./config/variables-entorno');

/**
 * Configuración de la aplicación Express (capa de entrada HTTP).
 * No inicia el servidor aquí: eso ocurre en servidor.js.
 */
const app = express();

// Si CORS_ORIGEN está definida (ver config/variables-entorno.js), solo
// se aceptan peticiones desde esos dominios. Si no, se permite
// cualquier origen (por defecto en desarrollo).
app.use(cors(variablesEntorno.corsOrigen ? { origin: variablesEntorno.corsOrigen } : undefined));
app.use(express.json());

app.get('/salud', (peticion, respuesta) => respuesta.json({ estado: 'ok' }));
app.use('/api', rutasApi);

app.use(manejadorErrores);

module.exports = app;

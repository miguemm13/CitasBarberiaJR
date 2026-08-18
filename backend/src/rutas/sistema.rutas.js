const express = require('express');
const { envolverControlador } = require('../middlewares/envolver-async');
const controlador = envolverControlador(require('../controladores/sistema.controlador'));

const enrutador = express.Router();

// GET /api/sistema/fecha-actual -> { fecha: 'YYYY-MM-DD', horaIso: '...' }
enrutador.get('/fecha-actual', controlador.obtenerFechaActual);

module.exports = enrutador;

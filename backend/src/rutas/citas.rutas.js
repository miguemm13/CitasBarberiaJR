const express = require('express');
const { envolverControlador } = require('../middlewares/envolver-async');
const controlador = envolverControlador(require('../controladores/citas.controlador'));
const validarCita = require('../middlewares/validar-cita');

const enrutador = express.Router();

enrutador.get('/disponibilidad', controlador.obtenerDisponibilidad);
enrutador.get('/agenda', controlador.obtenerAgendaDelDia);
enrutador.post('/', validarCita, controlador.crear);
enrutador.patch('/:id/estado', controlador.actualizarEstado);

module.exports = enrutador;

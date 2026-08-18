const express = require('express');
const { envolverControlador } = require('../middlewares/envolver-async');
const controlador = envolverControlador(require('../controladores/barberos.controlador'));

const enrutador = express.Router();

enrutador.get('/', controlador.listar);
enrutador.post('/', controlador.crear);
enrutador.put('/:id', controlador.actualizar);

module.exports = enrutador;

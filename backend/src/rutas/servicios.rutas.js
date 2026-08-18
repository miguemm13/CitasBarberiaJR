const express = require('express');
const { envolverControlador } = require('../middlewares/envolver-async');
const controlador = envolverControlador(require('../controladores/servicios.controlador'));

const enrutador = express.Router();

enrutador.get('/', controlador.listar);
enrutador.get('/:id', controlador.obtenerPorId);
enrutador.post('/', controlador.crear);
enrutador.put('/:id', controlador.actualizar);
enrutador.delete('/:id', controlador.eliminar);

module.exports = enrutador;

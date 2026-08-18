const express = require('express');

const enrutador = express.Router();

enrutador.use('/servicios', require('./servicios.rutas'));
enrutador.use('/barberos', require('./barberos.rutas'));
enrutador.use('/citas', require('./citas.rutas'));
enrutador.use('/sistema', require('./sistema.rutas'));

module.exports = enrutador;

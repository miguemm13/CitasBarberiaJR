const express = require('express');

const enrutador = express.Router();

// GET /api/ping -> ruta ultraligera (sin base de datos, sin lógica de
// negocio) usada por un servicio externo (ej. UptimeRobot, cron-job.org)
// que la visita cada ~14 minutos para simular tráfico real y evitar que
// Render "duerma" el backend por inactividad en el plan gratuito (se
// duerme a partir de los 15 minutos sin peticiones).
enrutador.get('/ping', (peticion, respuesta) => {
  respuesta.status(200).json({ status: 'ok' });
});

enrutador.use('/servicios', require('./servicios.rutas'));
enrutador.use('/barberos', require('./barberos.rutas'));
enrutador.use('/citas', require('./citas.rutas'));
enrutador.use('/sistema', require('./sistema.rutas'));

// Ruta temporal para resetear la base en producción (ver admin.controlador.js).
// BORRAR esta línea junto con el controlador cuando ya no haga falta.
enrutador.get('/admin/resetear-base', require('../controladores/admin.controlador').resetearBase);

module.exports = enrutador;

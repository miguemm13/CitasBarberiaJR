const { Cita } = require('../modelos');
const { Op } = require('sequelize');
const { ahoraEnVenezuela } = require('../utilidades/hora-venezuela');

// Horario de atención: 10:00 a 20:00 (10am a 8pm), por ahora fijo.
// Un turno por hora (antes eran bloques de 30 min): cada corte dura
// aprox. 45 min, así que se deja una hora completa por cita.
const HORA_APERTURA = 10;
const HORA_CIERRE = 20;
const INTERVALO_MINUTOS = 60;

/**
 * Servicio de negocio: calcula los bloques horarios de un día,
 * marcando como no disponibles los que ya tienen una cita
 * pendiente o completada para el barbero solicitado. Si la fecha
 * consultada es el día de hoy, además marca como no disponibles
 * (tachadas) las horas que ya pasaron, usando la hora exacta de
 * Venezuela -no la del servidor ni la del dispositivo del cliente-,
 * para que se vean en tiempo real a medida que avanza el reloj.
 */
async function obtenerHorariosDisponibles(fecha, barberoId) {
  const filtro = { fecha, estado: { [Op.ne]: 'cancelada' } };
  if (barberoId && barberoId !== 'cualquiera') filtro.barberoId = barberoId;

  const citasDelDia = await Cita.findAll({ where: filtro, attributes: ['hora'] });
  const horasOcupadas = new Set(citasDelDia.map(cita => cita.hora));

  const ahora = ahoraEnVenezuela();
  const esHoy = fecha === ahora.format('YYYY-MM-DD');
  const minutosActuales = ahora.hour() * 60 + ahora.minute();

  const bloques = [];
  for (let minutos = HORA_APERTURA * 60; minutos < HORA_CIERRE * 60; minutos += INTERVALO_MINUTOS) {
    const hora = formatearHora(Math.floor(minutos / 60), minutos % 60);
    const yaPaso = esHoy && minutos <= minutosActuales;
    bloques.push({ hora, disponible: !horasOcupadas.has(hora) && !yaPaso });
  }
  return bloques;
}

/**
 * Formatea la hora en 12 horas sin am/pm (ej. 13:00 -> "1:00").
 * Por ahora no genera ambigüedad porque el horario de atención
 * (10am-8pm) nunca repite el mismo número entre mañana y tarde.
 */
function formatearHora(horaMilitar, minuto) {
  const hora12 = horaMilitar > 12 ? horaMilitar - 12 : horaMilitar;
  return `${hora12}:${String(minuto).padStart(2, '0')}`;
}

module.exports = { obtenerHorariosDisponibles };

const { Cita } = require('../modelos');
const { Op } = require('sequelize');
const { ahoraEnVenezuela } = require('../utilidades/hora-venezuela');
const {
  HORA_APERTURA,
  HORA_CIERRE,
  INTERVALO_MINUTOS,
  formatearHora,
  horaMilitarDesdeTexto,
} = require('../utilidades/horario-atencion');

/**
 * Trae las citas del día (pendientes/completadas, no canceladas) y
 * devuelve el set de "minutos de inicio de bloque" que quedan
 * ocupados. Un servicio largo (ej. Mechas tradicionales, 3 horas)
 * ocupa varios bloques de 1 hora consecutivos, no solo el bloque en
 * el que empieza.
 */
async function calcularMinutosOcupados(fecha, barberoId) {
  const filtro = { fecha, estado: { [Op.ne]: 'cancelada' } };
  if (barberoId && barberoId !== 'cualquiera') filtro.barberoId = barberoId;

  const citasDelDia = await Cita.findAll({ where: filtro, include: ['servicios'] });

  const minutosOcupados = new Set();
  for (const cita of citasDelDia) {
    const { horaMilitar, minuto } = horaMilitarDesdeTexto(cita.hora);
    const inicioMin = horaMilitar * 60 + minuto;
    const duracionCita = cita.servicios.reduce((suma, s) => suma + s.duracionMinutos, 0) || INTERVALO_MINUTOS;
    const bloquesOcupados = Math.ceil(duracionCita / INTERVALO_MINUTOS);
    for (let i = 0; i < bloquesOcupados; i++) {
      minutosOcupados.add(inicioMin + i * INTERVALO_MINUTOS);
    }
  }
  return minutosOcupados;
}

/**
 * Verifica que un servicio de "duracionMinutos" que arranca a las
 * "horaTexto" (ej. "3:00") quepa completo: que ninguno de los bloques
 * que ocuparía esté ya tomado por otra cita, y que no se pase de la
 * hora de cierre.
 */
function cabeCompleto(minutosOcupados, horaTexto, duracionMinutos) {
  const { horaMilitar, minuto } = horaMilitarDesdeTexto(horaTexto);
  const inicioMin = horaMilitar * 60 + minuto;
  const bloquesNecesarios = Math.ceil(duracionMinutos / INTERVALO_MINUTOS);

  for (let i = 0; i < bloquesNecesarios; i++) {
    const bloque = inicioMin + i * INTERVALO_MINUTOS;
    if (bloque >= HORA_CIERRE * 60 || minutosOcupados.has(bloque)) return false;
  }
  return true;
}

/**
 * Servicio de negocio: calcula los bloques horarios de un día para un
 * servicio de cierta duración, marcando como no disponibles los que
 * chocarían con otra cita (total o parcialmente) o que se saldrían
 * del horario de cierre. Si la fecha consultada es hoy, además marca
 * como no disponibles (tachadas) las horas que ya pasaron, usando la
 * hora exacta de Venezuela -no la del servidor ni la del dispositivo
 * del cliente-, para que se vean en tiempo real a medida que avanza
 * el reloj.
 */
async function obtenerHorariosDisponibles(fecha, barberoId, duracionMinutosSolicitada = INTERVALO_MINUTOS) {
  const minutosOcupados = await calcularMinutosOcupados(fecha, barberoId);

  const ahora = ahoraEnVenezuela();
  const esHoy = fecha === ahora.format('YYYY-MM-DD');
  const minutosActuales = ahora.hour() * 60 + ahora.minute();

  const bloques = [];
  for (let minutos = HORA_APERTURA * 60; minutos < HORA_CIERRE * 60; minutos += INTERVALO_MINUTOS) {
    const hora = formatearHora(Math.floor(minutos / 60), minutos % 60);
    const yaPaso = esHoy && minutos <= minutosActuales;
    const disponible = !yaPaso && cabeCompleto(minutosOcupados, hora, duracionMinutosSolicitada);
    bloques.push({ hora, disponible });
  }
  return bloques;
}

/**
 * Segundo chequeo, del lado del servidor, justo antes de crear la
 * cita (ver citas.controlador.js). El grid de arriba es solo una guía
 * visual para el cliente; sin este chequeo, dos personas podrían
 * mandar la petición de crear cita casi al mismo tiempo para el mismo
 * bloque y ambas pasarían.
 */
async function horarioDisponible(fecha, barberoId, horaTexto, duracionMinutos) {
  const minutosOcupados = await calcularMinutosOcupados(fecha, barberoId);
  return cabeCompleto(minutosOcupados, horaTexto, duracionMinutos);
}

module.exports = { obtenerHorariosDisponibles, horarioDisponible };

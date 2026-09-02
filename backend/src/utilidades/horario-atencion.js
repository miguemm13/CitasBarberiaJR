/**
 * Constantes y helpers del horario de atención, compartidos entre
 * disponibilidad.servicio.js (arma los bloques del día) y
 * recordatorio.servicio.js (necesita convertir "3:00" de vuelta a
 * hora militar para saber cuánto falta para la cita).
 */

// Horario de atención: 10:00 a 20:00 (10am a 8pm). Los bloques son de
// 1 hora; un servicio largo (ej. Mechas tradicionales, 3h) ocupa
// varios bloques consecutivos (ver disponibilidad.servicio.js).
const HORA_APERTURA = 10;
const HORA_CIERRE = 20;
const INTERVALO_MINUTOS = 60;

/**
 * Formatea la hora en 12 horas sin am/pm (ej. 13:00 -> "1:00"). Por
 * ahora no genera ambigüedad porque el horario de atención (10am-8pm)
 * nunca repite el mismo número entre mañana y tarde.
 */
function formatearHora(horaMilitar, minuto) {
  const hora12 = horaMilitar > 12 ? horaMilitar - 12 : horaMilitar;
  return `${hora12}:${String(minuto).padStart(2, '0')}`;
}

/**
 * Inversa de formatearHora(): convierte el texto guardado en
 * Cita.hora (ej. "3:00") de vuelta a hora militar (ej. 15), usando la
 * misma regla (10, 11, 12 son de la mañana/mediodía; 1-7 son de la
 * tarde).
 */
function horaMilitarDesdeTexto(horaTexto) {
  const [horaStr, minutoStr] = horaTexto.split(':');
  const hora12 = Number(horaStr);
  const minuto = Number(minutoStr);
  const horaMilitar = hora12 >= HORA_APERTURA ? hora12 : hora12 + 12;
  return { horaMilitar, minuto };
}

/**
 * Formatea una hora militar con sufijo am/pm (ej. 15, 0 -> "3:00 PM"),
 * para mensajes al cliente/barbero donde sí conviene ser explícito
 * (a diferencia de la grilla de horarios de la app, que lo omite).
 */
function formatearHora12ConSufijo(horaMilitar, minuto) {
  const sufijo = horaMilitar >= 12 ? 'PM' : 'AM';
  const hora12 = horaMilitar > 12 ? horaMilitar - 12 : horaMilitar;
  return `${hora12}:${String(minuto).padStart(2, '0')} ${sufijo}`;
}

module.exports = {
  HORA_APERTURA,
  HORA_CIERRE,
  INTERVALO_MINUTOS,
  formatearHora,
  horaMilitarDesdeTexto,
  formatearHora12ConSufijo,
};

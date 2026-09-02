const { Cita } = require('../modelos');
const { ahoraEnVenezuela } = require('../utilidades/hora-venezuela');
const { horaMilitarDesdeTexto } = require('../utilidades/horario-atencion');
const telegramServicio = require('./telegram.servicio');

// Cada cuánto se revisa si hay citas a las que avisarle al barbero.
const INTERVALO_REVISION_MS = 5 * 60 * 1000; // 5 minutos

// Ventana alrededor de "faltan 60 minutos" en la que se dispara el
// aviso. Como la revisión corre cada 5 minutos (no exactamente al
// minuto de cada cita), se usa un rango de +/-5 min para no saltarse
// ninguna cita entre una revisión y la siguiente.
const VENTANA_AVISO_MINUTOS = 60;
const MARGEN_VENTANA_MINUTOS = 5;

/**
 * Servicio de negocio: revisa las citas pendientes de hoy y, a la que
 * le falte aproximadamente 1 hora para empezar y todavía no se le
 * haya avisado al barbero, le manda el recordatorio por Telegram (con
 * el botón de WhatsApp incluido).
 */
async function revisarYEnviarRecordatorios() {
  const ahora = ahoraEnVenezuela();
  const fechaHoy = ahora.format('YYYY-MM-DD');
  const minutosAhora = ahora.hour() * 60 + ahora.minute();

  const citasDeHoy = await Cita.findAll({
    where: { fecha: fechaHoy, estado: 'pendiente', recordatorioEnviado: false },
    include: ['servicios', 'barbero', 'cliente'],
  });

  for (const cita of citasDeHoy) {
    const { horaMilitar, minuto } = horaMilitarDesdeTexto(cita.hora);
    const minutosCita = horaMilitar * 60 + minuto;
    const faltan = minutosCita - minutosAhora;

    const dentroDeLaVentana =
      faltan >= VENTANA_AVISO_MINUTOS - MARGEN_VENTANA_MINUTOS &&
      faltan <= VENTANA_AVISO_MINUTOS + MARGEN_VENTANA_MINUTOS;

    if (!dentroDeLaVentana) continue;

    const resultado = await telegramServicio.enviarRecordatorioAlBarbero(cita);
    // Se marca como enviado igual si Telegram falló (ej. no
    // configurado): así no se reintenta cada 5 minutos indefinidamente
    // para la misma cita. El error ya queda registrado en consola por
    // telegram.servicio.js.
    await cita.update({ recordatorioEnviado: true });
    if (!resultado.enviado) {
      console.warn(`[Recordatorios] No se pudo avisar de la cita ${cita.id}:`, resultado.motivo);
    }
  }
}

/**
 * Arranca el revisor periódico. Se llama una vez desde servidor.js al
 * iniciar el servidor.
 */
function iniciarRecordatorios() {
  const revisar = () => {
    revisarYEnviarRecordatorios().catch(error => {
      console.error('[Recordatorios] Error al revisar citas:', error);
    });
  };

  revisar(); // primera revisión inmediata al arrancar
  setInterval(revisar, INTERVALO_REVISION_MS);
}

module.exports = { iniciarRecordatorios, revisarYEnviarRecordatorios };

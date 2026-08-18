const variablesEntorno = require('../config/variables-entorno');

/**
 * Servicio de negocio: notifica al barbero por Telegram cuando se
 * confirma una nueva cita (Paso 5 del asistente del cliente).
 * Usa la Bot API de Telegram vía HTTP, sin dependencias externas
 * (Node 18+ trae fetch nativo).
 * Documentación: https://core.telegram.org/bots/api#sendmessage
 */
async function notificarNuevaCitaAlBarbero(cita) {
  const { tokenBot, chatIdGeneral } = variablesEntorno.telegram;
  const chatDestino = cita.barbero.telegramChatId || chatIdGeneral;

  if (!tokenBot || !chatDestino) {
    console.warn(
      '[Telegram] Falta TELEGRAM_BOT_TOKEN o un chat id (del barbero o TELEGRAM_CHAT_ID_BARBERIA). No se envió la notificación.'
    );
    return { enviado: false, motivo: 'configuracion_incompleta' };
  }

  const url = `https://api.telegram.org/bot${tokenBot}/sendMessage`;
  const mensaje = construirMensaje(cita);

  try {
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatDestino,
        text: mensaje,
        parse_mode: 'HTML',
      }),
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      console.error('[Telegram] La API respondió con error:', detalle);
      return { enviado: false, motivo: 'error_api' };
    }

    return { enviado: true };
  } catch (error) {
    console.error('[Telegram] No se pudo enviar la notificación:', error);
    return { enviado: false, motivo: 'error_red' };
  }
}

function construirMensaje(cita) {
  const nombresServicios = cita.servicios.map(servicio => servicio.nombre).join(', ');
  let mensaje =
    `🪒 <b>Nueva cita pendiente</b>\n\n` +
    `👤 Cliente: ${cita.cliente.nombreCompleto}\n` +
    `✂️ Servicio(s): ${nombresServicios}\n` +
    `💈 Barbero: ${cita.barbero.nombreCompleto}\n` +
    `📅 Fecha: ${cita.fecha} · 🕐 ${cita.hora}\n` +
    `💰 Total: $${cita.precioTotal}`;

  if (cita.notaAdicional) {
    mensaje += `\n📝 Nota: ${cita.notaAdicional}`;
  }

  return mensaje;
}

module.exports = { notificarNuevaCitaAlBarbero };

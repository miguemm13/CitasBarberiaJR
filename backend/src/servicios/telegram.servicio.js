const variablesEntorno = require('../config/variables-entorno');
const { aFormatoWhatsapp } = require('../utilidades/telefono-venezuela');
const { horaMilitarDesdeTexto, formatearHora12ConSufijo } = require('../utilidades/horario-atencion');

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
      // Si Telegram no responde, no dejar la petición colgada para
      // siempre: eso hacía que "Confirmar Cita" se quedara pensando
      // sin terminar nunca. A los 8s se corta y sigue como error de red.
      signal: AbortSignal.timeout(8000),
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

/**
 * Recordatorio que se envía al barbero ~1 hora antes de una cita (ver
 * servicios/recordatorio.servicio.js). A diferencia de la notificación
 * de "nueva cita", este mensaje incluye un botón que abre WhatsApp con
 * el chat del cliente y un mensaje ya escrito, listo para enviar.
 */
async function enviarRecordatorioAlBarbero(cita) {
  const { tokenBot, chatIdGeneral } = variablesEntorno.telegram;
  const chatDestino = cita.barbero.telegramChatId || chatIdGeneral;

  if (!tokenBot || !chatDestino) {
    console.warn('[Telegram] Falta TELEGRAM_BOT_TOKEN o un chat id. No se envió el recordatorio.');
    return { enviado: false, motivo: 'configuracion_incompleta' };
  }

  const url = `https://api.telegram.org/bot${tokenBot}/sendMessage`;
  const mensaje = construirMensajeRecordatorio(cita);

  // El botón de WhatsApp solo se agrega si el cliente tiene teléfono
  // válido (siempre debería tenerlo, ya que es obligatorio al agendar,
  // pero por si acaso una cita vieja no lo tiene).
  const botones = [];
  if (cita.cliente?.telefono) {
    botones.push([{ text: '📲 Recordar por WhatsApp', url: construirEnlaceWhatsapp(cita) }]);
  }

  try {
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatDestino,
        text: mensaje,
        parse_mode: 'HTML',
        reply_markup: botones.length > 0 ? { inline_keyboard: botones } : undefined,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      console.error('[Telegram] La API respondió con error (recordatorio):', detalle);
      return { enviado: false, motivo: 'error_api' };
    }

    return { enviado: true };
  } catch (error) {
    console.error('[Telegram] No se pudo enviar el recordatorio:', error);
    return { enviado: false, motivo: 'error_red' };
  }
}

function construirMensajeRecordatorio(cita) {
  const nombresServicios = cita.servicios.map(servicio => servicio.nombre).join(', ');
  const { horaMilitar, minuto } = horaMilitarDesdeTexto(cita.hora);
  const horaConSufijo = formatearHora12ConSufijo(horaMilitar, minuto);

  let mensaje =
    `⏰ <b>Cita en 1 hora</b>\n\n` +
    `👤 Cliente: ${cita.cliente.nombreCompleto}\n` +
    `✂️ Servicio(s): ${nombresServicios}\n` +
    `🕐 Hora: ${horaConSufijo}`;

  if (cita.cliente.telefono) {
    mensaje += `\n📱 Teléfono: ${cita.cliente.telefono}\n\nUsa el botón de abajo para avisarle por WhatsApp.`;
  }

  return mensaje;
}

/**
 * Arma el link "click to chat" de WhatsApp (wa.me): al abrirlo desde
 * el teléfono, abre WhatsApp directo en el chat de ese número con el
 * mensaje ya escrito -el barbero solo tiene que darle Enviar-. No usa
 * la API oficial de WhatsApp Business, así que no requiere ninguna
 * cuenta ni configuración aparte.
 */
function construirEnlaceWhatsapp(cita) {
  const numero = aFormatoWhatsapp(cita.cliente.telefono);
  const { horaMilitar, minuto } = horaMilitarDesdeTexto(cita.hora);
  const horaConSufijo = formatearHora12ConSufijo(horaMilitar, minuto);
  const primerNombre = cita.cliente.nombreCompleto.split(' ')[0];

  const mensaje =
    `¡Hola ${primerNombre}! 👋 Te escribo de JR Barber para recordarte tu cita hoy a las ${horaConSufijo} (Tel: ${cita.cliente.telefono}). ¡Te esperamos!`;

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

function construirMensaje(cita) {
  const nombresServicios = cita.servicios.map(servicio => servicio.nombre).join(', ');
  let mensaje =
    `🪒 <b>Nueva cita pendiente</b>\n\n` +
    `👤 Cliente: ${cita.cliente.nombreCompleto}\n` +
    `📱 Teléfono: ${cita.cliente.telefono}\n` +
    `✂️ Servicio(s): ${nombresServicios}\n` +
    `💈 Barbero: ${cita.barbero.nombreCompleto}\n` +
    `📅 Fecha: ${cita.fecha} · 🕐 ${cita.hora}\n` +
    `💰 Total: $${cita.precioTotal}`;

  if (cita.notaAdicional) {
    mensaje += `\n📝 Nota: ${cita.notaAdicional}`;
  }

  return mensaje;
}

module.exports = { notificarNuevaCitaAlBarbero, enviarRecordatorioAlBarbero };

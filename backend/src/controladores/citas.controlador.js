const { Cita, Servicio, Barbero, Cliente } = require('../modelos');
const disponibilidadServicio = require('../servicios/disponibilidad.servicio');
const telegramServicio = require('../servicios/telegram.servicio');

/**
 * Controlador: Citas
 * Cubre el flujo completo del cliente (pasos 3-5) y el panel del
 * barbero (agenda diaria + cambio de estado).
 */

async function obtenerDisponibilidad(peticion, respuesta) {
  const { fecha, barberoId, duracionMinutos } = peticion.query;
  if (!fecha) return respuesta.status(400).json({ mensaje: 'El parámetro fecha es requerido' });

  const duracion = duracionMinutos ? Number(duracionMinutos) : undefined;
  const horarios = await disponibilidadServicio.obtenerHorariosDisponibles(fecha, barberoId, duracion);
  respuesta.json(horarios);
}

async function crear(peticion, respuesta) {
  const { serviciosIds, barberoId, fecha, hora, cliente } = peticion.body;

  const servicios = await Servicio.findAll({ where: { id: serviciosIds } });
  if (servicios.length === 0) {
    return respuesta.status(400).json({ mensaje: 'Debes seleccionar al menos un servicio' });
  }

  const barbero =
    barberoId && barberoId !== 'cualquiera'
      ? await Barbero.findByPk(barberoId)
      : await Barbero.findOne({ where: { disponible: true } });
  if (!barbero) return respuesta.status(400).json({ mensaje: 'Barbero no disponible' });

  // Segundo chequeo de disponibilidad, ya del lado del servidor:
  // evita que dos clientes agenden el mismo bloque si mandan la
  // petición casi al mismo tiempo, y garantiza que un servicio largo
  // (ej. Mechas tradicionales, 3h) realmente bloquee esas 3 horas.
  const duracionTotal = servicios.reduce((suma, servicio) => suma + servicio.duracionMinutos, 0);
  const disponible = await disponibilidadServicio.horarioDisponible(fecha, barbero.id, hora, duracionTotal);
  if (!disponible) {
    return respuesta.status(409).json({ mensaje: 'Ese horario ya no está disponible, elige otro.' });
  }

  const registroCliente = await Cliente.create({
    nombreCompleto: cliente.nombreCompleto,
    telefono: cliente.telefono, // ya viene normalizado desde validar-cita.js
  });

  const precioTotal = servicios.reduce((suma, servicio) => suma + Number(servicio.precio), 0);

  const nuevaCita = await Cita.create({
    fecha,
    hora,
    precioTotal,
    notaAdicional: cliente.notaAdicional,
    barberoId: barbero.id,
    clienteId: registroCliente.id,
  });
  await nuevaCita.setServicios(servicios);

  const citaCompleta = await Cita.findByPk(nuevaCita.id, {
    include: ['servicios', 'barbero', 'cliente'],
  });

  // Notificación al barbero por Telegram. Si falla (ej. no está
  // configurada), no bloquea la creación de la cita.
  await telegramServicio.notificarNuevaCitaAlBarbero(citaCompleta);

  respuesta.status(201).json(citaCompleta);
}

async function obtenerAgendaDelDia(peticion, respuesta) {
  const { fecha } = peticion.query;
  const citas = await Cita.findAll({
    where: { fecha },
    include: ['servicios', 'barbero', 'cliente'],
    order: [['hora', 'ASC']],
  });
  respuesta.json(citas);
}

async function actualizarEstado(peticion, respuesta) {
  const cita = await Cita.findByPk(peticion.params.id);
  if (!cita) return respuesta.status(404).json({ mensaje: 'Cita no encontrada' });

  await cita.update({ estado: peticion.body.estado });
  respuesta.json(cita);
}

module.exports = { obtenerDisponibilidad, crear, obtenerAgendaDelDia, actualizarEstado };

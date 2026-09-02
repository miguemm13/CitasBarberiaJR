/**
 * Datos del cliente que agenda la cita
 */
export interface Cliente {
  nombreCompleto: string;
  // Teléfono venezolano en formato local, ej. "0412-1234567". Se usa
  // para el recordatorio por WhatsApp que se le envía al barbero 1h
  // antes de la cita.
  telefono: string;
  notaAdicional?: string;
}

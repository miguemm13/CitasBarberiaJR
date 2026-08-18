import { Servicio } from './servicio.model';
import { Barbero } from './barbero.model';
import { Cliente } from './cliente.model';

export type EstadoCita = 'pendiente' | 'completada' | 'cancelada';

/**
 * Entidad principal del dominio: una cita agendada en la barbería
 */
export interface Cita {
  id?: string;
  servicios: Servicio[];
  barbero: Barbero;
  fecha: string; // ISO yyyy-MM-dd
  hora: string; // HH:mm
  cliente: Cliente;
  estado: EstadoCita;
  precioTotal: number;
  creadaEn?: string;
}

/** DTO enviado al backend al confirmar el paso 5 del asistente */
export interface NuevaCitaPeticion {
  serviciosIds: string[];
  barberoId: string;
  fecha: string;
  hora: string;
  cliente: Cliente;
}

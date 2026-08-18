/**
 * Representa un bloque horario para un día específico
 */
export interface HorarioDisponible {
  hora: string; // formato HH:mm
  disponible: boolean;
}

export interface DiaCalendario {
  fecha: string; // formato ISO yyyy-MM-dd
  etiquetaCorta: string; // Ej: "Jue 13"
  habilitado: boolean;
}

/**
 * Representa a un barbero/profesional del local
 */
export interface Barbero {
  id: string;
  nombreCompleto: string;
  especialidad?: string;
  avatarUrl?: string;
  disponible: boolean;
}

/** Opción especial usada en el paso 2 del asistente */
export const CUALQUIER_BARBERO: Barbero = {
  id: 'cualquiera',
  nombreCompleto: 'Cualquier barbero disponible',
  especialidad: 'Asignación más rápida',
  disponible: true,
};

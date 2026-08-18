/**
 * Representa un servicio ofrecido por la barbería
 * (Corte de Cabello, Barba Premium, Combo, etc.)
 */
export interface Servicio {
  id: string;
  nombre: string;
  descripcion?: string;
  duracionMinutos: number;
  precio: number;
  icono?: string;
  activo: boolean;
}

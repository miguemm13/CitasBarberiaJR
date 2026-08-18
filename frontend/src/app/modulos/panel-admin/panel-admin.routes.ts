import { Routes } from '@angular/router';

/**
 * Rutas del panel de administración (vista del barbero).
 * En una siguiente iteración se protege con un guard de autenticación.
 */
export const RUTAS_PANEL_ADMIN: Routes = [
  {
    path: 'agenda',
    loadComponent: () =>
      import('./paginas/agenda-diaria/agenda-diaria.component').then(m => m.AgendaDiariaComponent),
  },
  { path: '', redirectTo: 'agenda', pathMatch: 'full' },
];

import { Routes } from '@angular/router';

/**
 * Rutas raíz de la aplicación. Cada módulo (agendamiento, panel-admin)
 * define sus propias sub-rutas de forma independiente y escalable.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modulos/agendamiento/paginas/inicio/inicio.component').then(m => m.InicioComponent),
  },
  {
    path: 'agendar',
    loadChildren: () => import('./modulos/agendamiento/agendamiento.routes').then(m => m.RUTAS_AGENDAMIENTO),
  },
  {
    path: 'admin',
    loadChildren: () => import('./modulos/panel-admin/panel-admin.routes').then(m => m.RUTAS_PANEL_ADMIN),
  },
  { path: '**', redirectTo: '' },
];

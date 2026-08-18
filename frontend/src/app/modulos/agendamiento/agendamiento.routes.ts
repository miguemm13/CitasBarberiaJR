import { Routes } from '@angular/router';

/**
 * Rutas del asistente de agendamiento (flujo del cliente, pasos 1-4).
 * No hay paso de selección de barbero: por ahora la barbería solo
 * tiene un barbero, así que se asigna automáticamente en el backend.
 * Se cargan de forma perezosa (lazy) desde app.routes.ts.
 */
export const RUTAS_AGENDAMIENTO: Routes = [
  {
    path: 'servicio',
    loadComponent: () =>
      import('./paginas/seleccion-servicio/seleccion-servicio.component').then(m => m.SeleccionServicioComponent),
  },
  {
    path: 'fecha-hora',
    loadComponent: () =>
      import('./paginas/seleccion-fecha-hora/seleccion-fecha-hora.component').then(m => m.SeleccionFechaHoraComponent),
  },
  {
    path: 'datos-cliente',
    loadComponent: () =>
      import('./paginas/datos-cliente/datos-cliente.component').then(m => m.DatosClienteComponent),
  },
  {
    path: 'confirmacion',
    loadComponent: () =>
      import('./paginas/confirmacion/confirmacion.component').then(m => m.ConfirmacionComponent),
  },
  {
    path: 'exito',
    loadComponent: () => import('./paginas/exito/exito.component').then(m => m.ExitoComponent),
  },
  { path: '', redirectTo: 'servicio', pathMatch: 'full' },
];

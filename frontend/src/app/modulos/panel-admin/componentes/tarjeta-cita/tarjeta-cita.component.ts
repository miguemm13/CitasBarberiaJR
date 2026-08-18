import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cita, EstadoCita } from '../../../../modelos/cita.model';

/**
 * Tarjeta de cita usada en la agenda diaria del barbero (admin).
 * Permite cambiar el estado: Pendiente → Completada / Cancelada.
 */
@Component({
  selector: 'app-tarjeta-cita',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta-cita.component.html',
})
export class TarjetaCitaComponent {
  @Input({ required: true }) cita!: Cita;
  @Output() alCambiarEstado = new EventEmitter<EstadoCita>();

  readonly claseEstado: Record<EstadoCita, string> = {
    pendiente: 'bg-dorado/15 text-dorado',
    completada: 'bg-green-500/15 text-green-400',
    cancelada: 'bg-red-500/15 text-red-400',
  };

  readonly etiquetaEstado: Record<EstadoCita, string> = {
    pendiente: 'Pendiente',
    completada: 'Completada',
    cancelada: 'Cancelada',
  };

  obtenerNombrePrimerServicio(cita: Cita): string {
    return cita.servicios.length > 0 ? cita.servicios[0].nombre : '';
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Servicio } from '../../../../modelos/servicio.model';
import { MonedaClpPipe } from '../../../../compartido/pipes/moneda-clp.pipe';

/**
 * Tarjeta interactiva de servicio (Paso 1).
 * Muestra nombre, duración, precio y estado de selección.
 */
@Component({
  selector: 'app-tarjeta-servicio',
  standalone: true,
  imports: [CommonModule, MonedaClpPipe],
  template: `
    <button
      type="button"
      (click)="alSeleccionar.emit(servicio)"
      class="w-full text-left bg-gris-carbon rounded-xl p-4 flex items-center gap-4 transition-colors"
      [ngClass]="seleccionado ? 'border-2 border-dorado' : 'border border-white/10'"
    >
      <div class="w-12 h-12 rounded-lg bg-negro-mate flex items-center justify-center text-xl shrink-0">
        {{ servicio.icono || '✂️' }}
      </div>
      <div class="flex-1">
        <p class="font-semibold">{{ servicio.nombre }}</p>
        <p class="text-crema/40 text-xs mt-0.5">⏱ {{ servicio.duracionMinutos }} min</p>
      </div>
      <div class="text-right">
        <p class="text-dorado font-bold">{{ servicio.precio | monedaClp }}</p>
      </div>
    </button>
  `,
})
export class TarjetaServicioComponent {
  @Input({ required: true }) servicio!: Servicio;
  @Input() seleccionado = false;
  @Output() alSeleccionar = new EventEmitter<Servicio>();
}

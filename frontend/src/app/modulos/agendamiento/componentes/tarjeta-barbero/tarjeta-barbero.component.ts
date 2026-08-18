import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Barbero } from '../../../../modelos/barbero.model';

/**
 * Tarjeta interactiva de barbero (Paso 2, opcional).
 */
@Component({
  selector: 'app-tarjeta-barbero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="alSeleccionar.emit(barbero)"
      class="w-full text-left bg-gris-carbon rounded-xl p-4 flex items-center gap-4"
      [ngClass]="seleccionado ? 'border-2 border-dorado' : 'border border-white/10'"
    >
      <div class="w-12 h-12 rounded-full bg-gris-carbon-claro flex items-center justify-center text-lg font-bold shrink-0">
        {{ obtenerIniciales(barbero.nombreCompleto) }}
      </div>
      <div class="flex-1">
        <p class="font-semibold">{{ barbero.nombreCompleto }}</p>
        <p class="text-crema/40 text-xs mt-0.5">{{ barbero.especialidad }}</p>
      </div>
    </button>
  `,
})
export class TarjetaBarberoComponent {
  @Input({ required: true }) barbero!: Barbero;
  @Input() seleccionado = false;
  @Output() alSeleccionar = new EventEmitter<Barbero>();

  obtenerIniciales(nombreCompleto: string): string {
    return nombreCompleto
      .split(' ')
      .slice(0, 2)
      .map(parte => parte[0])
      .join('')
      .toUpperCase();
  }
}

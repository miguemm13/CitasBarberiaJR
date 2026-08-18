import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorarioDisponible } from '../../../../modelos/horario-disponible.model';

/**
 * Grid de horarios disponibles (Paso 3). Los bloques ocupados
 * llegan desde el backend con disponible=false y se muestran
 * tachados y deshabilitados.
 */
@Component({
  selector: 'app-selector-horario',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-3 gap-2 mb-4">
      <button
        *ngFor="let bloque of horarios"
        type="button"
        [disabled]="!bloque.disponible"
        (click)="alSeleccionar.emit(bloque.hora)"
        class="py-3 rounded-lg text-sm font-medium border"
        [ngClass]="{
          'bg-dorado text-negro-mate border-dorado': bloque.hora === horaSeleccionada,
          'bg-gris-carbon border-white/10': bloque.hora !== horaSeleccionada && bloque.disponible,
          'opacity-30 line-through': !bloque.disponible
        }"
      >
        {{ bloque.hora }}
      </button>
    </div>
  `,
})
export class SelectorHorarioComponent {
  @Input({ required: true }) horarios: HorarioDisponible[] = [];
  @Input() horaSeleccionada: string | null = null;
  @Output() alSeleccionar = new EventEmitter<string>();
}

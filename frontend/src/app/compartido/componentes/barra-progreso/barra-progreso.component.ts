import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

/**
 * Barra de progreso superior del asistente de agendamiento.
 * Muestra "Paso X de N" y una barra dorada de avance.
 */
@Component({
  selector: 'app-barra-progreso',
  standalone: true,
  template: `
    <div class="sticky top-0 z-30 bg-negro-mate/95 backdrop-blur border-b border-white/5 px-5 pt-4 pb-3">
      <div class="flex items-center justify-between mb-2">
        <button type="button" (click)="salir()" class="text-crema/60 text-sm flex items-center gap-1">
          <span aria-hidden="true">←</span> Salir
        </button>
        <span class="text-xs uppercase tracking-widest text-dorado font-semibold">
          Paso {{ pasoActual }} de {{ totalPasos }}
        </span>
      </div>
      <div class="h-1 w-full bg-gris-carbon-claro rounded-full overflow-hidden">
        <div
          class="h-full bg-dorado rounded-full transition-all duration-300"
          [style.width.%]="(pasoActual / totalPasos) * 100"
        ></div>
      </div>
    </div>
  `,
})
export class BarraProgresoComponent {
  @Input() pasoActual = 1;
  @Input() totalPasos = 5;

  constructor(private readonly ubicacion: Location) {}

  salir(): void {
    this.ubicacion.back();
  }
}

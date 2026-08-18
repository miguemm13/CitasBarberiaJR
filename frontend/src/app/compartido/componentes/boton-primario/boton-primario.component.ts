import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Botón de acción principal reutilizado en todos los pasos del
 * asistente (fondo dorado, texto negro, ancho completo, fijo abajo).
 */
@Component({
  selector: 'app-boton-primario',
  standalone: true,
  template: `
    <div class="sticky bottom-0 w-full px-5 pb-6 pt-3 bg-gradient-to-t from-negro-mate via-negro-mate to-transparent">
      <button
        type="button"
        [disabled]="deshabilitado"
        (click)="alPresionar.emit()"
        class="w-full bg-dorado hover:bg-dorado-suave text-negro-mate font-bold py-4 rounded-xl active:scale-[0.98] transition-transform disabled:opacity-40 disabled:pointer-events-none"
      >
        {{ etiqueta }}
      </button>
    </div>
  `,
})
export class BotonPrimarioComponent {
  @Input() etiqueta = 'Continuar';
  @Input() deshabilitado = false;
  @Output() alPresionar = new EventEmitter<void>();
}

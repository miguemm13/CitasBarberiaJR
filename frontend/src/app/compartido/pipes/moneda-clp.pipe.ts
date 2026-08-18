import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formatea números como precio en pesos: 18000 -> "$18.000"
 * Uso en plantillas: {{ servicio.precio | monedaClp }}
 */
@Pipe({ name: 'monedaClp', standalone: true })
export class MonedaClpPipe implements PipeTransform {
  transform(valor: number): string {
    return '$' + Math.round(valor).toLocaleString('es-CL');
  }
}

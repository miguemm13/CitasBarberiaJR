import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Header / Hero: nombre de la barbería, eslogan, ubicación
 * y CTA principal "Agendar Cita".
 */
@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.component.html',
})
export class InicioComponent {
  readonly nombreBarberia = 'Barbería Nº7';
  readonly eslogan = 'Tradición, precisión y estilo en cada corte.';
  readonly direccion = 'Av. Principal de la hacienda Ud6';

  constructor(private readonly router: Router) {}

  irAAgendar(): void {
    this.router.navigate(['/agendar/servicio']);
  }
}

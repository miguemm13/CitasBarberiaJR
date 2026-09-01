import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Header / Hero: nombre de la barbería, ubicación y CTA
 * principal "Agendar Cita".
 */
@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.component.html',
})
export class InicioComponent {
  readonly nombreBarberia = 'JR Barber';
  readonly direccion = 'Av. Principal de la hacienda Ud6';

  constructor(private readonly router: Router) {}

  irAAgendar(): void {
    this.router.navigate(['/agendar/servicio']);
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Pantalla final del asistente: confirma visualmente que la cita
 * quedó agendada y que el barbero ya fue notificado por Telegram.
 */
@Component({
  selector: 'app-exito',
  standalone: true,
  templateUrl: './exito.component.html',
})
export class ExitoComponent {
  constructor(private readonly router: Router) {}

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
}

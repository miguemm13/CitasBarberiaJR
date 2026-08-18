import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CitasService } from '../../../../nucleo/servicios/citas.service';
import { AgendamientoEstadoService } from '../../../../nucleo/servicios/agendamiento-estado.service';
import { NuevaCitaPeticion } from '../../../../modelos/cita.model';
import { MonedaClpPipe } from '../../../../compartido/pipes/moneda-clp.pipe';
import { BarraProgresoComponent } from '../../../../compartido/componentes/barra-progreso/barra-progreso.component';

/**
 * Paso 5: resumen visual + CTA "Confirmar Cita".
 * Al confirmar, crea la cita en el backend, el cual notifica al
 * barbero por Telegram (ver servicios/telegram.servicio.js).
 */
@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule, MonedaClpPipe, BarraProgresoComponent],
  templateUrl: './confirmacion.component.html',
})
export class ConfirmacionComponent {
  private readonly citasApi = inject(CitasService);
  readonly estado = inject(AgendamientoEstadoService);
  private readonly router = inject(Router);

  enviando = false;

  confirmarCita(): void {
    const cliente = this.estado.cliente();
    const fecha = this.estado.fechaSeleccionada();
    const hora = this.estado.horaSeleccionada();
    if (!cliente || !fecha || !hora) return;

    const peticion: NuevaCitaPeticion = {
      serviciosIds: this.estado.serviciosSeleccionados().map(s => s.id),
      barberoId: this.estado.barberoSeleccionado().id,
      fecha,
      hora,
      cliente,
    };

    this.enviando = true;
    this.citasApi.crear(peticion).subscribe({
      next: () => {
        this.enviando = false;
        this.estado.reiniciar();
        this.router.navigate(['/agendar/exito']);
      },
      error: () => (this.enviando = false),
    });
  }
}

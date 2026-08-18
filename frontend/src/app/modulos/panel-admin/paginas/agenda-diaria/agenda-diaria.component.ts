import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitasService } from '../../../../nucleo/servicios/citas.service';
import { Cita, EstadoCita } from '../../../../modelos/cita.model';
import { TarjetaCitaComponent } from '../../componentes/tarjeta-cita/tarjeta-cita.component';

/**
 * Panel del barbero: agenda diaria con listado de citas,
 * conteo por estado y acciones para actualizar el estado de cada una.
 */
@Component({
  selector: 'app-agenda-diaria',
  standalone: true,
  imports: [CommonModule, TarjetaCitaComponent],
  templateUrl: './agenda-diaria.component.html',
})
export class AgendaDiariaComponent implements OnInit {
  private readonly citasApi = inject(CitasService);

  citas: Cita[] = [];
  fechaSeleccionada = new Date().toISOString().slice(0, 10);

  ngOnInit(): void {
    this.cargarAgenda();
  }

  cargarAgenda(): void {
    this.citasApi.obtenerAgendaDelDia(this.fechaSeleccionada).subscribe(citas => (this.citas = citas));
  }

  contarPorEstado(estado: EstadoCita): number {
    return this.citas.filter(c => c.estado === estado).length;
  }

  actualizarEstado(cita: Cita, estado: EstadoCita): void {
    if (!cita.id) return;
    this.citasApi.actualizarEstado(cita.id, estado).subscribe(citaActualizada => {
      cita.estado = citaActualizada.estado;
    });
  }
}

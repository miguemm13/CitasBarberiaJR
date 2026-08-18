import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServiciosService } from '../../../../nucleo/servicios/servicios.service';
import { AgendamientoEstadoService } from '../../../../nucleo/servicios/agendamiento-estado.service';
import { Servicio } from '../../../../modelos/servicio.model';
import { TarjetaServicioComponent } from '../../componentes/tarjeta-servicio/tarjeta-servicio.component';
import { BarraProgresoComponent } from '../../../../compartido/componentes/barra-progreso/barra-progreso.component';
import { BotonPrimarioComponent } from '../../../../compartido/componentes/boton-primario/boton-primario.component';

/**
 * Paso 1: selección de un único servicio.
 */
@Component({
  selector: 'app-seleccion-servicio',
  standalone: true,
  imports: [CommonModule, TarjetaServicioComponent, BarraProgresoComponent, BotonPrimarioComponent],
  templateUrl: './seleccion-servicio.component.html',
})
export class SeleccionServicioComponent implements OnInit {
  private readonly serviciosApi = inject(ServiciosService);
  readonly estado = inject(AgendamientoEstadoService);
  private readonly router = inject(Router);

  servicios: Servicio[] = [];

  ngOnInit(): void {
    this.serviciosApi.obtenerTodos().subscribe(servicios => (this.servicios = servicios));
  }

  estaSeleccionado(servicio: Servicio): boolean {
    return this.estado.serviciosSeleccionados().some(s => s.id === servicio.id);
  }

  continuar(): void {
    this.router.navigate(['/agendar/fecha-hora']);
  }
}

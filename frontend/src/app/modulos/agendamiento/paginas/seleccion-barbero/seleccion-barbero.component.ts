import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BarberosService } from '../../../../nucleo/servicios/barberos.service';
import { AgendamientoEstadoService } from '../../../../nucleo/servicios/agendamiento-estado.service';
import { Barbero, CUALQUIER_BARBERO } from '../../../../modelos/barbero.model';
import { TarjetaBarberoComponent } from '../../componentes/tarjeta-barbero/tarjeta-barbero.component';
import { BarraProgresoComponent } from '../../../../compartido/componentes/barra-progreso/barra-progreso.component';
import { BotonPrimarioComponent } from '../../../../compartido/componentes/boton-primario/boton-primario.component';

/**
 * Paso 2 (opcional): selección de barbero o "cualquiera disponible".
 */
@Component({
  selector: 'app-seleccion-barbero',
  standalone: true,
  imports: [CommonModule, TarjetaBarberoComponent, BarraProgresoComponent, BotonPrimarioComponent],
  templateUrl: './seleccion-barbero.component.html',
})
export class SeleccionBarberoComponent implements OnInit {
  private readonly barberosApi = inject(BarberosService);
  readonly estado = inject(AgendamientoEstadoService);
  private readonly router = inject(Router);

  barberos: Barbero[] = [CUALQUIER_BARBERO];

  ngOnInit(): void {
    this.barberosApi.obtenerTodos().subscribe(barberos => {
      this.barberos = [CUALQUIER_BARBERO, ...barberos];
    });
  }

  seleccionar(barbero: Barbero): void {
    this.estado.barberoSeleccionado.set(barbero);
  }

  continuar(): void {
    this.router.navigate(['/agendar/fecha-hora']);
  }
}

import { Injectable, signal, computed } from '@angular/core';
import { Servicio } from '../../modelos/servicio.model';
import { Barbero, CUALQUIER_BARBERO } from '../../modelos/barbero.model';
import { Cliente } from '../../modelos/cliente.model';

/**
 * Guarda el estado del asistente de agendamiento (wizard) mientras
 * el cliente navega entre los pasos 1-5. Vive en memoria (signals),
 * se limpia al confirmar o al abandonar el flujo.
 */
@Injectable({ providedIn: 'root' })
export class AgendamientoEstadoService {
  readonly serviciosSeleccionados = signal<Servicio[]>([]);
  readonly barberoSeleccionado = signal<Barbero>(CUALQUIER_BARBERO);
  readonly fechaSeleccionada = signal<string | null>(null);
  readonly horaSeleccionada = signal<string | null>(null);
  readonly cliente = signal<Cliente | null>(null);

  readonly precioTotal = computed(() =>
    this.serviciosSeleccionados().reduce((suma, servicio) => suma + servicio.precio, 0)
  );

  readonly duracionTotalMinutos = computed(() =>
    this.serviciosSeleccionados().reduce((suma, servicio) => suma + servicio.duracionMinutos, 0)
  );

  seleccionarServicio(servicio: Servicio): void {
    // Selección única: el servicio elegido reemplaza cualquier selección previa.
    this.serviciosSeleccionados.set([servicio]);
  }

  reiniciar(): void {
    this.serviciosSeleccionados.set([]);
    this.barberoSeleccionado.set(CUALQUIER_BARBERO);
    this.fechaSeleccionada.set(null);
    this.horaSeleccionada.set(null);
    this.cliente.set(null);
  }
}

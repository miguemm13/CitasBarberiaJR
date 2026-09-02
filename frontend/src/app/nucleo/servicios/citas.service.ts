import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cita, NuevaCitaPeticion } from '../../modelos/cita.model';
import { HorarioDisponible } from '../../modelos/horario-disponible.model';

/**
 * Servicio Angular encargado de comunicarse con el endpoint
 * /api/citas del backend (controlador de citas en Node.js).
 * Cubre tanto el flujo del cliente (crear cita) como el panel
 * del barbero (listar agenda, cambiar estado).
 */
@Injectable({ providedIn: 'root' })
export class CitasService {
  private readonly http = inject(HttpClient);
  private readonly urlBase = `${environment.apiUrl}/citas`;

  obtenerHorariosDisponibles(fecha: string, duracionMinutos?: number, barberoId?: string): Observable<HorarioDisponible[]> {
    const parametroBarbero = barberoId ? `&barberoId=${barberoId}` : '';
    const parametroDuracion = duracionMinutos ? `&duracionMinutos=${duracionMinutos}` : '';
    return this.http.get<HorarioDisponible[]>(
      `${this.urlBase}/disponibilidad?fecha=${fecha}${parametroDuracion}${parametroBarbero}`
    );
  }

  crear(peticion: NuevaCitaPeticion): Observable<Cita> {
    return this.http.post<Cita>(this.urlBase, peticion);
  }

  obtenerAgendaDelDia(fecha: string): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.urlBase}/agenda?fecha=${fecha}`);
  }

  actualizarEstado(citaId: string, estado: Cita['estado']): Observable<Cita> {
    return this.http.patch<Cita>(`${this.urlBase}/${citaId}/estado`, { estado });
  }
}

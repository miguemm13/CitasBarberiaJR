import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Servicio } from '../../modelos/servicio.model';

/**
 * Servicio Angular encargado de comunicarse con el endpoint
 * /api/servicios del backend (controlador de servicios en Node.js)
 */
@Injectable({ providedIn: 'root' })
export class ServiciosService {
  private readonly http = inject(HttpClient);
  private readonly urlBase = `${environment.apiUrl}/servicios`;

  obtenerTodos(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.urlBase);
  }

  obtenerPorId(id: string): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.urlBase}/${id}`);
  }
}

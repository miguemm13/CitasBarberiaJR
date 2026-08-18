import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Barbero } from '../../modelos/barbero.model';

/**
 * Servicio Angular encargado de comunicarse con el endpoint
 * /api/barberos del backend (controlador de barberos en Node.js)
 */
@Injectable({ providedIn: 'root' })
export class BarberosService {
  private readonly http = inject(HttpClient);
  private readonly urlBase = `${environment.apiUrl}/barberos`;

  obtenerTodos(): Observable<Barbero[]> {
    return this.http.get<Barbero[]>(this.urlBase);
  }
}

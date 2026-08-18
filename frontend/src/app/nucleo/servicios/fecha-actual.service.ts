import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FechaActualRespuesta {
  fecha: string; // 'YYYY-MM-DD', calculada en el servidor (no en el dispositivo)
  horaIso: string;
}

/**
 * Servicio Angular que consulta /api/sistema/fecha-actual.
 * Se usa como fuente de verdad de "qué día es hoy" en el calendario
 * del Paso 2, en vez de confiar en el reloj/zona horaria del
 * dispositivo del cliente (que puede estar mal configurado).
 */
@Injectable({ providedIn: 'root' })
export class FechaActualService {
  private readonly http = inject(HttpClient);
  private readonly urlBase = `${environment.apiUrl}/sistema`;

  obtenerFechaActual(): Observable<FechaActualRespuesta> {
    return this.http.get<FechaActualRespuesta>(`${this.urlBase}/fecha-actual`);
  }
}

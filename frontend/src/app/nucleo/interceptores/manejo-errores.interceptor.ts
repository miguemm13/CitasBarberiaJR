import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor global: centraliza el manejo de errores HTTP
 * provenientes del backend (Node.js/Express).
 */
export const manejoErroresInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  return siguiente(peticion).pipe(
    catchError((error) => {
      console.error('[Error API]', peticion.url, error);
      return throwError(() => error);
    })
  );
};

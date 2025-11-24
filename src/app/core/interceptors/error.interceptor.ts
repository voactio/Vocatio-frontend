import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { ErrorResponse } from '../models/error.model';

// posee un capturador de errores
// se puede manejar cada codigo de error
// se puede colocar enrutamiento a paginas de error
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  // RUTAS QUE NO DEBEN PASAR POR EL INTERCEPTOR
  const ignoredUrls = [
    '/login',
    '/register',
    '/recuperacion',
    '/perfil',
    '/updPerfil',
  ];
  const shouldIgnore = ignoredUrls.some(url => req.url.includes(url));

  if (shouldIgnore) {
    return next(req);  // NO ejecuta notificaciones ni manejo de errores
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error';

      if (error.error instanceof ErrorEvent) {
        // Error del cliente
        errorMessage = `Error: ${error.error.message}`;
        notificationService.error('Error de conexión', 'No se pudo conectar con el servidor. Verifica tu conexión a internet.');

      } else {
        // Error del servidor - extraer mensaje del formato ErrorResponse del backend
        // El backend devuelve: { message: string, status: number, timestamp: string }
        const errorResponse = error.error as ErrorResponse;
        const backendMessage = errorResponse?.message || error.statusText || 'Error desconocido';
        errorMessage = `Error ${error.status}: ${backendMessage}`;

        // Mostrar notificación toast amigable
        notificationService.showHttpError(error.status, backendMessage);

        // Si el error es 401 (Unauthorized), hacer logout
        if (error.status === 401) {
          authService.logout();
          router.navigate(['/login']);
        }

        // Si el error es 403 (Forbidden), redirigir
        if (error.status === 403) {
          router.navigate(['/']);
        }
      }

      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};

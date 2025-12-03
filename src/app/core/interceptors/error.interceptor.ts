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

  // RUTAS QUE NO DEBEN HACER LOGOUT AUTOMÁTICO EN 401 O ERRORES
  const noLogoutOn401Urls = [
    '/testimonios',
    '/recursos',
    '/universidades',
    '/tests',
    '/sessions',
    '/iniciar',
    '/answers',
    '/results',
    '/comparar',
    '/carreras/comparar'
  ];
  const shouldNotLogoutOn401 = noLogoutOn401Urls.some(url => req.url.includes(url));

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

        // Mostrar notificación toast amigable solo si no es un error de las rutas del test
        if (!shouldNotLogoutOn401) {
          notificationService.showHttpError(error.status, backendMessage);
        }

        // Si el error es 401 (Unauthorized), hacer logout solo si NO está en la lista de exclusión
        if (error.status === 401 && !shouldNotLogoutOn401) {
          authService.logout();
          router.navigate(['/login']);
        }

        // Si el error es 403 (Forbidden), NO hacer logout si es de comparación
        if (error.status === 403 && !shouldNotLogoutOn401) {
          // No hacer nada, dejar que el componente maneje el error
          console.warn('Error 403 en ruta permitida:', req.url);
        } else if (error.status === 403) {
          router.navigate(['/']);
        }
      }

      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};

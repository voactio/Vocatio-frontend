import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// revisa la peticion
// debe haber un token en la salida de la peticion, si no lo asigna
// lanza la peticion clonada al siguiente interceptor si existe
// es como POSTMAN
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si hay token, agregar Authorization header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer token`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
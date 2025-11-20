import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guardian maneja estados sobre route
// se verifica los datos sobre esa ruta
// el candado devuelve true si ya paso por autenticacion
// si no eres admin, no pasas
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Falta habilitar una opcion de admin
  // Prioridad baja en la funcionalidad

  //if (authService.isAuthenticated() && authService.isAdmin()) {
  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirigir si no es admin
  router.navigate(['/']);
  return false;
};

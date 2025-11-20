import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { landingLayoutComponent } from './shared/layouts/landing-layout';
import { authLayoutComponent } from './shared/layouts/auth-layout';

export const routes: Routes = [

  // ============================
  // Landing layout (público)
  // ============================
  {
    path: '',
    component: landingLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('./features/login/login.routes').then(m => m.LOGIN_ROUTES)
      },
      {
        path: 'register',
        loadChildren: () =>
          import('./features/register/register.routes').then(m => m.REGISTER_ROUTES)
      }
    ]
  },

  // ============================
  // Auth layout (privado)
  // ============================
  {
    path: '',
    component: authLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'perfil',
        loadChildren: () =>
          import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES)
      }
    ]
  },

  // DEFAULT & 404
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

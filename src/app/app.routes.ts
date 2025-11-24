import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { landingLayoutComponent } from './shared/layouts/landing-layout';
import { authLayoutComponent } from './shared/layouts/auth-layout';
import { TestVocacionalComponent } from './shared/components/test-vocacional/test-vocacional';

export const routes: Routes = [

  // ============================
  // Landing layout (público)
  // ============================
  {
    path: '',
    component: landingLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./features/login/login.routes').then(m => m.LOGIN_ROUTES)
      },
      {
        path: 'register',
        loadChildren: () =>
          import('./features/register/register.routes').then(m => m.REGISTER_ROUTES)
      },
      {
        path: 'recuperacion',
        loadChildren: () =>
          import('./features/recuperacion/recuperacion.routes').then(m => m.RECUPERACION_ROUTES)
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
  {
    path: 'test-vocacional',
    component: TestVocacionalComponent,
    canActivate: [authGuard]
  },

  // DEFAULT & 404
  { path: '**', redirectTo: 'login' }
];


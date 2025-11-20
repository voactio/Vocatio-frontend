import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login';
import { RegisterComponent } from './shared/components/register/register';
import { PerfilComponent } from './shared/components/perfil/perfil';
import { TestVocacionalComponent } from './shared/components/test-vocacional/test-vocacional';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  { 
    path: 'perfil', 
    component: PerfilComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'test-vocacional', 
    component: TestVocacionalComponent,
    canActivate: [authGuard] 
  }
];
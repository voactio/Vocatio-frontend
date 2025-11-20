import { Component, signal } from '@angular/core';
import { LoginComponent } from './shared/components/login/login';
import { RegisterComponent } from './shared/components/register/register';
import { PerfilComponent } from './shared/components/perfil/perfil';

@Component({
  selector: 'app-root',
  imports: [LoginComponent, RegisterComponent, PerfilComponent],
  template: `
    <app-login/>
    <app-register/>
    <app-perfil/>
  `
  ,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('vocatio-app');
}

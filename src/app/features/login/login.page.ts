import { Component } from '@angular/core';
import { LoginComponent } from '../../shared/components/login/login';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginComponent],
  template: `<app-login></app-login>`
})
export class LoginPage {}

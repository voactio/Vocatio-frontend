import { Component } from '@angular/core';
import { RegisterComponent } from '../../shared/components/register/register';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RegisterComponent],
  template: `<app-register></app-register>`
})
export class RegisterPage {}

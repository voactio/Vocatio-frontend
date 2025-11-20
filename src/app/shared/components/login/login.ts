import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/user.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">

        <div class="login-header">
          <div class="logo-icon">💼</div>
          <h1 class="app-title">VOCATIO</h1>
          <h2>Iniciar Sesión</h2>
          <p>Bienvenido a tu cuenta</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">

          <div class="form-group full-width">
            <label>Correo electrónico</label>
            <input type="email" formControlName="correo" placeholder="correo@ejemplo.com" class="full-width">
          </div>

          <div class="form-group full-width">
            <label>Contraseña</label>
            <input type="password" formControlName="contrasena" placeholder="********" class="full-width">
          </div>

          <button type="submit" [disabled]="loginForm.invalid" class="btn-primary full-width">
            Ingresar
          </button>

          <button
            type="button"
            class="btn-secondary full-width"
            (click)="goToRegister()">
            Registrarme
          </button>

        </form>

      </div>
    </div>
  `,
  /*template: `
    <div class="login-container">
      <h2>Iniciar Sesión</h2>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">

        <label>Correo electrónico</label>
        <input type="email" formControlName="correo" placeholder="correo@ejemplo.com"/>

        <label>Contraseña</label>
        <input type="password" formControlName="contrasena" placeholder="********"/>

        <button type="submit" [disabled]="loginForm.invalid">
          Ingresar
        </button>

        <button
          type="button"
          class="btn btn-primary w-100 mt-3"
          (click)="goToRegister()">
          Registrarme
        </button>

      </form>
    </div>
  `*/
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    const req: LoginRequest = {
      correo: this.loginForm.value.correo ?? '',
      contrasena: this.loginForm.value.contrasena ?? ''
    };

    this.authService.loginUser(req).subscribe({
      next: resp =>
        {
          console.log("LOGIN OK", resp);
          this.router.navigate(['/perfil']);
        },

      error: err => console.error("ERROR LOGIN", err)
    });
  }

  goToRegister(){
    this.router.navigate(['/register']);
  }
}

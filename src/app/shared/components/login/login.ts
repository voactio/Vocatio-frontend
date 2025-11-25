import { NotificationService } from './../../../core/services/notification.service';
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
    <div class="page-bg">
      <div class="login-wrapper">
        <div class="login-left">
          <img src="img/vocatio-logo.png" alt="Logo Vocatio" class="vocatio-logo" />
          <h1 class="vocatio-title">VOCATIO</h1>
        </div>

        <div class="login-right">
          <div class="login-form-container">
            <h2>Inicio de sesión</h2>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label for="correo">Correo electrónico</label>
                <input type="email" id="correo" formControlName="correo" placeholder="Ingresar correo" />
              </div>

              <div class="form-group">
                <label for="contrasena">Contraseña</label>
                <input type="password" id="contrasena" formControlName="contrasena" placeholder="Ingresar contraseña" />
              </div>

              <div class="form-links">
                <a (click)="goToRecuperar()">¿Se te olvidó tu contraseña?</a>
              </div>

              <button type="submit" [disabled]="loginForm.invalid" class="btn-primary">Acceder</button>

              <div class="form-links">
                <a (click)="goToRegister()">Crear cuenta</a>
              </div>
            </form>
          </div>
        </div>
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
  private notificationService = inject(NotificationService);

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
          this.notificationService.success(
            '¡Bienvenido!',
            'Inicio de sesión exitoso'
          );
          console.log("LOGIN OK", resp);
          this.router.navigate(['/home']);
        },

      error: err => {
        console.error("ERROR LOGIN", err);
        this.notificationService.showHttpError(403, 'Correo y/o contraseña incorrectos.');
      }
    });
  }

  goToRegister(){
    this.router.navigate(['/register']);
  }

  goToRecuperar(){
    this.router.navigate(['recuperacion/olvido'])
  }
}

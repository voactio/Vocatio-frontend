import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/user.model';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  template: `
    <div class="register-container">

      <div class="register-card">

        <div class="register-header">
          <div class="logo-icon">🧳</div>
          <h1 class="app-title">VOCATIO</h1>
          <h2>Crear Cuenta</h2>
          <p>Completa los datos para registrarte</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">

          <div class="form-group">
            <label>Nombre</label>
            <input type="text" formControlName="nombre" placeholder="Tu nombre" />
          </div>

          <div class="form-group">
            <label>Correo</label>
            <input type="email" formControlName="correo" placeholder="correo@ejemplo.com" />
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" formControlName="contrasena" placeholder="********" />
          </div>

          <div class="form-group">
            <label>Nivel Educativo</label>
            <input type="text" formControlName="nivelEducativo" placeholder="Ej: Universitario" />
          </div>

          <div class="form-group">
            <label>URL Imagen Perfil (opcional)</label>
            <input type="text" formControlName="urlImagenPerfil" placeholder="https://..." />
          </div>

          <div class="form-group">
            <label>ID Carrera (opcional)</label>
            <input type="number" formControlName="carreraId" placeholder="3" />
          </div>

          <button class="btn-primary" type="submit" [disabled]="registerForm.invalid">
            Registrarme
          </button>

          <button class="btn-secondary" (click)="goToLogin()">
            Ya tengo una cuenta
          </button>
        </form>
      </div>
    </div>
  `,
  /*template: `
    <div class="register-container">
      <h2>Crear Cuenta</h2>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">

        <label>Nombre</label>
        <input type="text" formControlName="nombre" placeholder="Tu nombre"/>

        <label>Correo</label>
        <input type="email" formControlName="correo" placeholder="correo@ejemplo.com"/>

        <label>Contraseña</label>
        <input type="password" formControlName="contrasena" placeholder="********"/>

        <label>Nivel educativo</label>
        <input type="text" formControlName="nivelEducativo"/>

        <label>URL Imagen Perfil (opcional)</label>
        <input type="text" formControlName="urlImagenPerfil"/>

        <label>ID Carrera (opcional)</label>
        <input type="number" formControlName="carreraId"/>

        <button type="submit" [disabled]="registerForm.invalid">
          Registrarme
        </button>

      </form>
    </div>
  `,*/
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);


  registerForm = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(8)]],
    nivelEducativo: ['', Validators.required],
    urlImagenPerfil: [''],
    carreraId: [null]
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    const req: RegisterRequest = {
      nombre: this.registerForm.value.nombre ?? '',
      correo: this.registerForm.value.correo ?? '',
      contrasena: this.registerForm.value.contrasena ?? '',
      nivelEducativo: this.registerForm.value.nivelEducativo ?? '',
      // opcionales
      urlImagenPerfil: (this.registerForm.value.urlImagenPerfil &&
        this.registerForm.value.urlImagenPerfil !== '') ?
        this.registerForm.value.urlImagenPerfil : undefined,
        carreraId: this.registerForm.value.carreraId ?? undefined
    };

    this.authService.register(req).subscribe({
      next: resp => {
        console.log("REGISTRO OK", resp);
        this.notificationService.success(
          'Éxito',
          'Usuario registrado correctamente.'
        );
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error("ERROR REGISTRO", err)
        this.notificationService.showHttpError(
          400,
          "La contraseña debe tener almenos 8 caracteres e incluir letras y números");
        }
    });
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }
}

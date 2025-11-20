import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  template: `
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
  `,
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

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
    next: resp => console.log("REGISTRO OK", resp),
    error: err => console.error("ERROR REGISTRO", err)
  });
}
}

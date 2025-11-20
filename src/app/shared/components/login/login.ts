import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
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

      </form>
    </div>
  `,
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
      next: resp => {
        console.log("LOGIN OK", resp);
        this.router.navigate(['/test-vocacional']); 
      },
      error: err => console.error("ERROR LOGIN", err)
    });
  }
}

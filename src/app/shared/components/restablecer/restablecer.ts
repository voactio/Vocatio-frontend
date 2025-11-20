import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RecuperacionService } from '../../../core/services/recuperacion.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restablecer',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <h2>Restablecer contraseña</h2>

    <div *ngIf="error" style="color: red;">{{ error }}</div>

    <div *ngIf="tokenValido">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">

        <label>Nueva contraseña:</label>
        <input type="password" formControlName="nuevaContrasena">

        <label>Confirmar contraseña:</label>
        <input type="password" formControlName="confirmarContrasena">

        <button type="submit" [disabled]="form.invalid">Guardar</button>
      </form>

      <div *ngIf="mensaje" style="color: green;">{{ mensaje }}</div>
    </div>
  `,
  styleUrl: './restablecer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestablecerComponent {
  token!: string;
  tokenValido = false;
  mensaje: string | null = null;
  error: string | null = null;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private recuperacionService: RecuperacionService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasena: ['', Validators.required]
    });

    this.token = this.route.snapshot.queryParamMap.get('token')!;
    if (!this.token) {
      this.error = "Token no proporcionado";
      return;
    }

    this.validarToken();
  }

  validarToken() {
    this.recuperacionService.validarToken(this.token).subscribe({
      next: resp => {
        this.tokenValido = true;
      },
      error: err => {
        this.error = err.error?.mensaje || "Token inválido o expirado";
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const nueva = this.form.value.nuevaContrasena!;
    const confirmar = this.form.value.confirmarContrasena!;

    this.recuperacionService.restablecerContrasena(this.token, nueva, confirmar)
      .subscribe({
        next: resp => {
          this.mensaje = resp.mensaje;
          this.error = null;
        },
        error: err => {
          this.error = err.error?.mensaje || "Error al restablecer";
          this.mensaje = null;
        }
      });
  }
}

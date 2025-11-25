/*import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecuperacionService } from '../../../core/services/recuperacion.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recuperar',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <h2>Recuperar contraseña</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Correo electrónico:</label>
      <input type="email" formControlName="correo">

      <button type="submit" [disabled]="form.invalid">Enviar enlace</button>
    </form>

    <div *ngIf="mensaje" style="color: green;">{{ mensaje }}</div>
    <div *ngIf="error" style="color: red;">{{ error }}</div>
  `,
  styleUrl: './recuperar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecuperarComponent {

  private fb = inject(FormBuilder);
  private recuperacionService = inject(RecuperacionService);

  mensaje: string | null = null;
  error: string | null = null;

  // ya podemos usar this.fb aquí sin errores
  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.form.invalid) return;

    const correo = this.form.value.correo!;

    this.recuperacionService.solicitarRecuperacion(correo).subscribe({
      next: resp => {
        this.mensaje = resp.mensaje;
        this.error = null;
      },
      error: err => {
        this.mensaje = null;
        this.error = err.error?.mensaje || 'Error inesperado';
      }
    });
  }
}
*/

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecuperacionService } from '../../../core/services/recuperacion.service';
import { OlvidoRequest } from '../../../core/models/recuperacion.mode';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-olvido',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="page-bg">
      <div class="rec-wrapper">
        <div class="rec-left">
          <h2 class="rec-title">Recuperar contraseña</h2>
          <p class="rec-description">
            Se enviará un enlace de recuperación de contraseña al correo electrónico ingresado.
          </p>

          <form [formGroup]="Olvidoform" (ngSubmit)="enviarCorreo()" class="rec-form">
            <div class="form-group">
              <label for="correo">Correo electrónico</label>
              <input type="email" id="correo" formControlName="correo" placeholder="tuemail@dominio.com" />
            </div>

            <button type="submit" class="btn-primary" [disabled]="Olvidoform.invalid">
              Enviar enlace
            </button>

            <div class="form-links">
              <a (click)="irAlInicio()">&lt; Regresar</a>
            </div>
          </form>
        </div>

        <div class="rec-right">
          <img src="img/vocatio-logo.png" alt="Logo VOCATIO" class="vocatio-logo" />
          <h1 class="vocatio-title">VOCATIO</h1>
        </div>
      </div>
    </div>
  `,
  styleUrl: './olvido.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OlvidoPageComponent {

  mensaje: string | null = null;
  error: string | null = null;
  private fb = inject(FormBuilder);
  private recuperacionService = inject(RecuperacionService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);


  Olvidoform = this.fb.group({
    correo: ['', [Validators.required, Validators.email]]
  });

  enviarCorreo() {
    this.mensaje = null;
    this.error = null;

    if (this.Olvidoform.invalid) {
      this.error = 'Ingrese un correo válido';
      return;
    }

    const req: OlvidoRequest = {
      correo: this.Olvidoform.value.correo ?? ''
    }

    this.recuperacionService.solicitarRecuperacion(req).subscribe({
      next: (resp) => {
        this.mensaje = resp.mensaje || 'Se envió un correo para recuperar tu contraseña';
        console.log("TOKEN OK", resp.token);
        this.notificationService.success(
          'Éxito',
          'Se envió un código de recuperación al correo ingresado.'
        );
        setTimeout(() => {
          this.router.navigate(['/recuperacion/recontra']);
        }, 800);
      },
      error: (err) => {
        this.notificationService.showHttpError(404,
          'El correo electrónico no está registrado.'
        );
      }
    });
  }

  irAlInicio() {
    this.router.navigate(['/login']);
  }

}

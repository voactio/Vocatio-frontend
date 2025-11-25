import { ReContrasenaRequest } from './../../../core/models/recuperacion.mode';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecuperacionService } from '../../../core/services/recuperacion.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-recontrasena',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="page-bg">
      <div class="rec-wrapper">
        <div class="rec-left">
          <h2 class="rec-title">Cambiar contraseña</h2>

          <form [formGroup]="form" (ngSubmit)="validarYRestablecer()" class="rec-form">
            <div class="form-group">
              <label for="token">Código de recuperación</label>
              <input type="text" id="token" formControlName="token" placeholder="Ingresa el código recibido" />
            </div>

            <div class="form-group">
              <label for="nueva">Contraseña</label>
              <input type="password" id="nueva" formControlName="nueva" placeholder="Ingresar contraseña" />
            </div>

            <div class="form-group">
              <label for="repetir">Confirmar contraseña</label>
              <input type="password" id="repetir" formControlName="repetir" placeholder="Repetir contraseña" />
            </div>

            <button type="submit" class="btn-primary" [disabled]="form.invalid">
              Confirmar
            </button>

            <div class="form-links">
              <a (click)="irAlInicio()">&lt; Cancelar</a>
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
  styleUrl: './recontrasena.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReContraPageComponent {

  mensaje: string | null = null;
  error: string | null = null;
  private fb = inject(FormBuilder);
  private recuperacionService = inject(RecuperacionService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);


  form = this.fb.group({
    token: [''],
    nueva: [''],
    repetir: ['']
  });

  validarYRestablecer() {
    this.mensaje = null;
    this.error = null;

    const { token, nueva, repetir } = this.form.value;
    const req: ReContrasenaRequest = {
      token: this.form.value.token ?? '',
      nuevaContrasena: this.form.value.nueva ?? '',
      confirmarContrasena: this.form.value.repetir ?? '',
    }

    if (nueva !== repetir) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.recuperacionService.validarToken(token!).subscribe({
      next: (resp) => {
        this.mensaje = 'Token válido. Ahora se puede registrar la nueva contraseña (implementa tu endpoint).';
        //console.log('se valida token')
        this.recuperacionService.restablecerContrasena(req).subscribe({
          next: (resp2) => {
            this.notificationService.success(
              'Éxito',
              'Se actualizó la contraseña correctamente.'
            );
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1600);
          },
          error: (err2) =>{
            this.notificationService.showHttpError(
              400,
              "La nueva contraseña debe tener almenos 8 caracteres e incluir letras y números"
            );
            //console.log('Error')
          }

        })
      },
      error: (err) => {
        //console.log('token incorrecton')
        this.notificationService.showHttpError(403,
          'El token ingresado es incorrecto.'
        );
      }
    });
  }

  irAlInicio() {
    this.router.navigate(['/login']);
  }

}

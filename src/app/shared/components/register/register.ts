import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/user.model';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { CarreraOptionService } from '../../../core/services/carreraoption.service';
import { CarreraOption } from '../../../core/models/carreraoption.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="page-bg">
      <div class="register-wrapper">
        <div class="register-card">
          <h2 class="register-title">Registro</h2>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <div class="form-columns">
              <div class="form-column">
                <div class="form-group">
                  <label for="correo">Correo electrónico</label>
                  <input type="email" id="correo" formControlName="correo" placeholder="Ingresar correo" />
                </div>

                <div class="form-group">
                  <label for="contrasena">Contraseña</label>
                  <input type="password" id="contrasena" formControlName="contrasena" placeholder="Ingresar contraseña" />
                </div>

                <div class="form-group">
                  <label for="urlImagenPerfil">URL Imagen Perfil (opcional)</label>
                  <input type="text" id="urlImagenPerfil" formControlName="urlImagenPerfil" placeholder="https://..." />
                </div>

              </div>

              <div class="form-column">
                <div class="form-group">
                  <label for="nombre">Nombre</label>
                  <input type="text" id="nombre" formControlName="nombre" placeholder="Nombre del usuario" />
                </div>

                <div class="form-group">
                  <label for="nivelEducativo">Nivel educativo</label>
                  <input type="text" id="nivelEducativo" formControlName="nivelEducativo" placeholder="Seleccionar nivel" />
                </div>

                <div class="form-group">
                  <label for="carreraId">Carrera actual (opcional)</label>
                  <select id="carreraId" formControlName="carreraId">
                    <option [ngValue]="null">Seleccionar carrera</option>
                    <option *ngFor="let c of carreras" [ngValue]="c.id">{{ c.nombre }}</option>
                  </select>
                  <div *ngIf="cargandoCarreras" class="small-muted">Cargando carreras...</div>
                </div>
              </div>
            </div>

            <button class="btn-primary" type="submit" [disabled]="registerForm.invalid">Registrarse</button>
            <div class="form-links">
              <a (click)="goToLogin()">Ya tengo una cuenta</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private carreraOptService = inject(CarreraOptionService);

  carreras: CarreraOption[] = [];
  cargandoCarreras = false;
  submitting = false;


  registerForm = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]],
    nivelEducativo: ['', Validators.required],
    urlImagenPerfil: [''],
    carreraId: [null]
  });

  ngOnInit() {
    this.loadCarreras();
  }

  private loadCarreras(){
    this.cargandoCarreras = true;
    this.carreraOptService.getOpciones()
    .pipe(finalize(()=>this.cargandoCarreras = false))
    .subscribe({
      next: data=> this.carreras = data,
      error: err=> {
        console.error('Error cargando las carreras', err);
        this.notificationService.showHttpError(
          503,
          'No se pudieron cargar las carreras. Intenta más tarde.'
        );
      }
    })
  }

  onSubmit() {
    console.log('Formulario válido:', this.registerForm.valid);
    console.log('Valores:', this.registerForm.value);
    if (this.registerForm.invalid) return;

    this.submitting = true;

    const carreraIdValue = this.registerForm.value.carreraId;
    const carreraIdNumber = carreraIdValue ? Number(carreraIdValue) : undefined;

    let req: RegisterRequest = {
      nombre: this.registerForm.value.nombre ?? '',
      correo: this.registerForm.value.correo ?? '',
      contrasena: this.registerForm.value.contrasena ?? '',
      nivelEducativo: this.registerForm.value.nivelEducativo ?? '',
    };

    // opcionales
    if (this.registerForm.value.urlImagenPerfil && this.registerForm.value.urlImagenPerfil.trim() !== '') {
      req.urlImagenPerfil = this.registerForm.value.urlImagenPerfil;
    }
    if (carreraIdNumber !== undefined) {
      req.carreraId = carreraIdNumber;
    }

    Object.keys(req).forEach(key => {
      if (req[key as keyof RegisterRequest] === null || req[key as keyof RegisterRequest] === '') {
        delete req[key as keyof RegisterRequest];
      }
    });

    console.log('Payload final:', req);



    this.authService.register(req)
      .pipe(finalize(()=>this.submitting = false))
      .subscribe({
        next: resp => {
          console.log("REGISTRO OK", resp);
          this.notificationService.success(
            'Éxito',
            'Usuario registrado correctamente.'
          );
          this.router.navigate(['/home']);
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

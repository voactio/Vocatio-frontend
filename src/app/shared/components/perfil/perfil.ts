import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { CarreraOptionService } from '../../../core/services/carreraoption.service';
import { CarreraOption } from '../../../core/models/carreraoption.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="perfil-container">

    <div class="perfil-card">

      <div class="perfil-header">
        <div class="logo-icon">🧳</div>
        <h1 class="app-title">VOCATIO</h1>
        <h2>Mi Perfil</h2>

        <!-- Foto de perfil circular -->
        <div class="profile-image" *ngIf="perfilForm.value.urlImagenPerfil">
          <img [src]="perfilForm.value.urlImagenPerfil" alt="Foto de perfil">
        </div>
      </div>

      <form [formGroup]="perfilForm" (ngSubmit)="onSubmit()" class="perfil-form">

        <div class="form-group">
          <label>Nombre</label>
          <input type="text" formControlName="nombre" />
        </div>

        <div class="form-group">
          <label>Nivel Educativo</label>
          <input type="text" formControlName="nivelEducativo" />
        </div>

        <div class="form-group">
          <label>Contraseña (opcional)</label>
          <input type="password" formControlName="contrasena" placeholder="********" />
        </div>

        <div class="form-group">
          <label>Carrera (opcional)</label>
            <select formControlName="carreraId">
              <option [ngValue]="null">-- Seleccionar carrera (opcional) --</option>
              <option *ngFor="let c of carreras" [ngValue]="c.id">{{ c.nombre }}</option>
            </select>

            <div *ngIf="cargandoCarreras" class="small-muted">Cargando carreras...</div>
          </div>

        <div class="form-group">
          <label>URL Imagen Perfil</label>
          <input type="text" formControlName="urlImagenPerfil" />
        </div>

        <button class="btn-primary" type="submit" [disabled]="perfilForm.invalid">
          Guardar Cambios
        </button>

      </form>

      <hr class="divider">

      <button class="btn-test" (click)="irAlTestVocacional()">
        Ir al Test Vocacional
      </button>

      <button class="btn-logout" (click)="cerrarSesion()">
        Cerrar Sesión
      </button>

    </div>

  </div>
`,
  /*template: `
    <h2>Mi Perfil</h2>

    <form [formGroup]="perfilForm" (ngSubmit)="onSubmit()">

      <label>Nombre</label>
      <input type="text" formControlName="nombre">

      <label>Nivel Educativo</label>
      <input type="text" formControlName="nivelEducativo">

      <label>Contraseña (opcional)</label>
      <input type="password" formControlName="contrasena">

      <label>Carrera ID</label>
      <input type="number" formControlName="carreraId">

      <label>URL Imagen Perfil</label>
      <input type="text" formControlName="urlImagenPerfil">

      <button type="submit" [disabled]="perfilForm.invalid">Guardar Cambios</button>
    </form>

    <div *ngIf="mensaje" style="color: green;">{{ mensaje }}</div>
    <div *ngIf="error" style="color: red;">{{ error }}</div>

    <hr>

    <!-- BOTÓN PARA IR AL TEST VOCACIONAL -->
    <button (click)="irAlTestVocacional()" class="btn-test">
      Ir al Test Vocacional
    </button>
    <!-- BOTÓN PARA CERRAR SESION -->
    <button (click)="cerrarSesion()" class="btn-logout">
      Cerrar sesión
    </button>
  `,*/
  styleUrl: './perfil.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilComponent {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private carreraOptService = inject(CarreraOptionService);

  carreras: CarreraOption[] = [];
  cargandoCarreras = false;
  submitting = false;
  mensaje = '';
  error = '';
  usuarioId!: string;
  userData: any;

  perfilForm = this.fb.group({
    nombre: ['', Validators.required],
    nivelEducativo: ['', Validators.required],
    contrasena: [''],
    carreraId: [null as number | null],
    urlImagenPerfil: ['']
  });

  ngOnInit() {

    const user = this.authService.currentUser();
    this.userData = user;

    if (!user || !user.id) {
      this.error = "No se pudo cargar el perfil: usuario no autenticado.";
      this.notificationService.showHttpError(404, this.error);
      return;
    }

    this.usuarioId = user.id;

    this.perfilForm.patchValue({
      nombre: user.nombre,
      nivelEducativo: user.nivelEducativo,
      urlImagenPerfil: user.urlImagenPerfil
    })

    this.loadCarreras();

  }

  private loadCarreras(){
    this.cargandoCarreras = true;
    this.carreraOptService.getOpciones()
    .pipe(finalize(()=>this.cargandoCarreras = false))
    .subscribe({
      next: data=> {
        this.carreras = data;
        if(this.userData?.carreraId){
          const carreraUsuario = this.carreras.find(c => c.id === this.userData.carreraId);
          if(carreraUsuario){
            this.perfilForm.patchValue({
              carreraId: carreraUsuario.id
            });
          }
        }
      },
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
    if (this.perfilForm.invalid) return;

    this.submitting = true;
    const carreraIdValue = this.perfilForm.value.carreraId;
    const carreraIdNumber = carreraIdValue === null ? undefined : Number(carreraIdValue);

    const req = {
      nombre: this.perfilForm.value.nombre!,
      nivelEducativo: this.perfilForm.value.nivelEducativo!,
      contrasena: this.perfilForm.value.contrasena || ' ',
      carreraId: carreraIdNumber,
      urlImagenPerfil: this.perfilForm.value.urlImagenPerfil || undefined
    };

    this.usuarioService.updateUsuario(this.usuarioId, req).subscribe({
      next: resp => {
        this.mensaje = "Perfil actualizado correctamente";
        this.error = "";
        this.notificationService.success(
            'Éxito',
            'Perfil actualizado correctamente.'
          );
      },
      error: err => {
        this.error = err.error?.mensaje || "Error al actualizar perfil";
        this.mensaje = "";
        this.notificationService.showHttpError(400, this.error);

      }
    });
  }

  irAlTestVocacional() {
    this.router.navigate(['/test-vocacional']);
  }

  cerrarSesion() {
    this.authService.logout();
    this.notificationService.success(
            '¡Hasta pronto!',
            'Sesión cerrada correctamente.'
          );
    this.router.navigate(['/login']);
  }

}

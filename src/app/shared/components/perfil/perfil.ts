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
    <div class="perfil-wrapper">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="navbar-content">
          <div class="logo">Vocatio</div>
          <ul class="nav-links">
            <li><a href="/home">Inicio</a></li>
            <li><a href="/carreras">Carreras</a></li>
            <li><a href="/test-vocacional">Test Vocacional</a></li>
            <li><a href="/perfil" class="active">Mi Perfil</a></li>
          </ul>
        </div>
      </nav>

      <div class="perfil-container">
        <!-- Sidebar Izquierdo -->
        <aside class="sidebar">
          <div class="user-card">
            <div class="user-avatar">
              @if (perfilForm.value.urlImagenPerfil) {
                <img [src]="perfilForm.value.urlImagenPerfil" alt="Foto de perfil">
              } @else {
                <div class="avatar-placeholder">👤</div>
              }
            </div>
            <h3 class="user-name">{{ perfilForm.value.nombre || 'Usuario' }}</h3>
            <p class="user-date">Miembro desde enero 2024</p>
          </div>

          <div class="sidebar-menu">
            <button class="menu-btn" (click)="mostrarSeccion('editar')">
              ✏️ Editar Perfil
            </button>
            <button class="menu-btn" (click)="mostrarSeccion('historial')">
              📋 Historial de Tests
            </button>
            <button class="menu-btn" (click)="mostrarSeccion('favoritas')">
              ⭐ Carreras Favoritas
            </button>
            <button class="menu-btn" (click)="mostrarSeccion('resumen')">
              📊 Resumen
            </button>
          </div>

          <button class="btn-logout" (click)="cerrarSesion()">
             Cerrar Sesión
          </button>
        </aside>

        <!-- Contenido Principal -->
        <main class="main-content">
          @if (seccionActiva === 'resumen') {
            <!-- Resumen del Perfil -->
            <div class="section-header">
              <h2>📊 Resumen del Perfil</h2>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">1</div>
                <div class="stat-label">Tests Realizados</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">1</div>
                <div class="stat-label">Carreras Favoritas</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">0</div>
                <div class="stat-label">Carreras Descartadas</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-number">17</div>
                <div class="stat-label">Último Test</div>
                <div class="stat-date">23 de septiembre de 2025</div>
              </div>
            </div>

            <!-- Últimos Resultados -->
            <div class="section">
              <h3>🎯 Últimos Resultados</h3>
              <p class="section-subtitle">Top 3 carreras recomendadas:</p>
              <div class="badges-container">
                <span class="badge-carrera">#1 Ingeniería Industrial (64%)</span>
                <span class="badge-carrera">#2 Ingeniería en Ciberseguridad (61%)</span>
                <span class="badge-carrera">#3 Ingeniería de Datos (51%)</span>
              </div>
              <button class="btn-link" (click)="verResultadosCompletos()">Ver Resultados Completos</button>
            </div>

            <!-- Carreras Favoritas -->
            <div class="section">
              <h3>⭐ Carreras Favoritas</h3>
              <div class="carrera-favorita-card">
                <h4 class="carrera-nombre">Ingeniería de Sistemas</h4>
                <span class="carrera-area">DESARROLLO DE SOFTWARE</span>
              </div>
            </div>

            <!-- Recomendaciones -->
            <div class="section recomendaciones">
              <h3>💡 Recomendaciones</h3>
              <div class="recomendacion-card">
                <div class="recomendacion-icon">🎓</div>
                <div class="recomendacion-content">
                  <h4>Actualiza tu test vocacional</h4>
                  <p>Tus intereses pueden cambiar con el tiempo</p>
                  <button class="btn-accion" (click)="irAlTestVocacional()">Nuevo Test</button>
                </div>
              </div>
            </div>
          }

          @if (seccionActiva === 'editar') {
            <!-- Editar Perfil -->
            <div class="section-header">
              <h2>✏️ Editar Perfil</h2>
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
                <label>Carrera ID</label>
                <input type="number" formControlName="carreraId" />
              </div>

              <div class="form-group">
                <label>URL Imagen Perfil</label>
                <input type="text" formControlName="urlImagenPerfil" />
              </div>

              <button class="btn-primary" type="submit" [disabled]="perfilForm.invalid">
                Guardar Cambios
              </button>
            </form>
          }

          @if (seccionActiva === 'historial') {
            <div class="section-header">
              <h2>📋 Historial de Tests</h2>
            </div>
            <p class="empty-state">No hay historial disponible aún.</p>
          }

          @if (seccionActiva === 'favoritas') {
            <div class="section-header">
              <h2>⭐ Carreras Favoritas</h2>
            </div>
            <div class="carrera-favorita-card">
              <h4 class="carrera-nombre">Ingeniería de Sistemas</h4>
              <span class="carrera-area">DESARROLLO DE SOFTWARE</span>
            </div>
          }
        </main>
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
  seccionActiva: 'resumen' | 'editar' | 'historial' | 'favoritas' = 'resumen';
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

  mostrarSeccion(seccion: 'resumen' | 'editar' | 'historial' | 'favoritas') {
    this.seccionActiva = seccion;
  }

  verResultadosCompletos() {
    this.router.navigate(['/test-vocacional']);
  }

}

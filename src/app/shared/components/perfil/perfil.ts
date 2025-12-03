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
import { TestService } from '../../../core/services/test.service'; // IMPORTAR
import { TestHistoryItem } from '../../../core/models/test-vocacional.model'; // IMPORTAR
import { DatePipe } from '@angular/common';
import { signal } from '@angular/core';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, CommonModule, DatePipe],
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
            <div class="section-header">
              <h2>📊 Resumen del Perfil</h2>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">{{ historial().length }}</div>
                <div class="stat-label">Tests Realizados</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📅</div>
                @if (ultimoTest()) {
                    <div class="stat-date">{{ ultimoTest()?.fecha | date:'mediumDate' }}</div>
                    <div class="stat-label">Último Test</div>
                } @else {
                    <div class="stat-label">Sin actividad reciente</div>
                }
              </div>
            </div>

            <div class="section">
              <h3>🎯 Resultados del Último Test</h3>

              @if (ultimoTest(); as test) {
                  <p class="section-subtitle">Intento #{{ test.intento }} - {{ test.fecha | date:'short' }}</p>
                  <div class="badges-container">
                    @for (carrera of test.topCarreras.slice(0, 3); track carrera.id; let i = $index) {
                        <span class="badge-carrera" [class.gold]="i===0">
                            #{{i+1}} {{ carrera.nombre }} ({{ carrera.porcentajeCompatibilidad }}%)
                        </span>
                    }
                  </div>
                  <button class="btn-link" (click)="mostrarSeccion('historial')">Ver Historial Completo</button>
              } @else {
                  <div class="empty-state-small">
                    <p>Aún no has realizado ningún test vocacional.</p>
                    <button class="btn-accion" (click)="irAlTestVocacional()">Comenzar Test</button>
                  </div>
              }
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
          }

          @if (seccionActiva === 'historial') {
            <div class="section-header">
              <h2>📋 Historial de Tests</h2>
            </div>

            @if (historial().length > 0) {
                <div class="historial-list">
                    @for (test of historial(); track test.idResultado) {
                        <div class="historial-card">
                            <div class="historial-header">
                                <span class="historial-date">📅 {{ test.fecha | date:'longDate' }}</span>
                                <span class="historial-badge">Intento #{{ test.intento }}</span>
                            </div>
                            <div class="historial-body">
                                <h4>Top Carreras:</h4>
                                <ul>
                                    @for (carrera of test.topCarreras; track carrera.id) {
                                        <li>
                                            <strong>{{ Math.round(carrera.porcentajeCompatibilidad) }}%</strong> - {{ carrera.nombre }}
                                        </li>
                                    }
                                </ul>
                                <button class="btn-ver-resultados" (click)="verResultadosCompletos(test.idResultado)">Ver Resultados Completos</button>
                            </div>
                        </div>
                    }
                </div>
            } @else {
                <div class="empty-state">
                    <p>No hay historial disponible aún.</p>
                    <button class="btn-primary" (click)="irAlTestVocacional()">Realizar mi primer test</button>
                </div>
            }
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
  private testService = inject(TestService);

  historial = signal<TestHistoryItem[]>([]);
  ultimoTest = signal<TestHistoryItem | null>(null);

  // Exponer Math para el template
  Math = Math;

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
    this.cargarHistorial();

  }

  cargarHistorial() {
    this.testService.getHistorial().subscribe({
        next: (data) => {
            this.historial.set(data);
            if (data.length > 0) {
                this.ultimoTest.set(data[0]);
            }
        },
        error: (err) => console.error("Error cargando historial", err)
    });
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

  verResultadosCompletos(idResultado: number) {
    // Navegar al test-vocacional con el ID del resultado para mostrar la vista completa
    this.router.navigate(['/test-vocacional'], {
      queryParams: { resultadoId: idResultado }
    });
  }

}

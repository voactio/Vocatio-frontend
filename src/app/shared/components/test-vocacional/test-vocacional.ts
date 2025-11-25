import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestService } from '../../../core/services/test.service';
import { Pregunta, ResultadoTest } from '../../../core/models/test-vocacional.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-vocacional',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-wrapper">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="navbar-content">
          <div class="logo">Vocatio</div>
          <ul class="nav-links">
            <li><a href="/home">Inicio</a></li>
            <li><a href="/carreras">Carreras</a></li>
            <li><a href="/test-vocacional" class="active">Test Vocacional</a></li>
            <li><a href="/perfil">Mi Perfil</a></li>
          </ul>
        </div>
      </nav>

      <div class="test-container">

        @if (estado() === 'INICIO') {
          <div class="inicio-section">
          <div class="inicio-header">
            <h1 class="inicio-title">Test Vocacional Vocatio</h1>
            <p class="inicio-subtitle">Descubre tu vocación profesional respondiendo a estas pregunas</p>
          </div>

          <div class="instrucciones-card">
            <h3 class="instrucciones-title">Instrucciones:</h3>
            <ul class="instrucciones-lista">
              <li>Responde honestamente a cada pregunta</li>
              <li>No hay respuestas correctas o incorrectas</li>
              <li>El test dura aproximadamente 10 minutos</li>
              <li>Puedes pausar y continuar más tarde</li>
            </ul>
          </div>

          <button (click)="iniciarTest()" class="btn-comenzar">
            🚀 Comenzar Test
          </button>
        </div>
      }

      @if (estado() === 'EN_PROGRESO' && preguntaActual()) {
        <div class="card pregunta">
          <div class="progreso-header">
            <span class="progreso-texto">{{ preguntaActual()!.progreso }}</span>
            <div class="barra-progreso">
               <div class="relleno" [style.width]="calcularPorcentaje()"></div>
            </div>
          </div>
          <h3 class="texto-pregunta">{{ preguntaActual()!.textoPregunta }}</h3>
          <div class="opciones-lista">
            @for (opcion of preguntaActual()!.opciones; track opcion.id) {
              <button (click)="seleccionarOpcion(opcion.id)" class="btn-opcion">
                <span class="radio-circle"></span> {{ opcion.textoOpcion }}
              </button>
            }
          </div>
        </div>
      }

      @if (estado() === 'FINALIZADO') {
        <div class="card final">
          <h2>¡Excelente Trabajo!</h2>
          <p>Has completado todas las preguntas del test.</p>
          <button (click)="verResultados()" class="btn-primary">Ver mis Resultados</button>
        </div>
      }

      @if (estado() === 'RESULTADOS' && resultadosActuales()) {
        <div class="resultados-wrapper">
          <!-- Header -->
          <div class="resultados-header">
            <h1 class="resultados-title">🎉 ¡Resultados de tu Test Vocacional!</h1>
            <p class="resultados-subtitle">Descubre las carreras que mejor se adaptan a tu perfil</p>
          </div>

          <!-- Contenedor de dos columnas -->
          <div class="resultados-content">
            <!-- Columna Izquierda: Gráfico -->
            <div class="grafico-section">
              <h2 class="section-title">Gráfico de Intereses</h2>
              <div class="grafico-container">
                <div class="grafico-placeholder">
                  <div class="radar-chart">
                    <!-- Aquí iría el gráfico radar RIASEC -->
                    <p style="text-align: center; color: #2a63d3; font-weight: 600; margin-top: 100px;">
                      Gráfico RIASEC (Radar Chart)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Columna Derecha: Ranking -->
            <div class="ranking-section">
              <h2 class="section-title">Ranking de Carreras</h2>
              <div class="carreras-lista">
                @for (carrera of resultadosActuales()!.rankingCarreras; track carrera.nombre; let i = $index) {
                  <div class="carrera-resultado-card">
                    <div class="carrera-icon">
                      <span class="icon-numero">{{ i + 1 }}</span>
                    </div>
                    <div class="carrera-contenido">
                      <h3 class="carrera-nombre">{{ carrera.nombre }}</h3>
                      <p class="carrera-descripcion">{{ carrera.descripcion }}</p>
                      <span class="carrera-badge">{{ carrera.areaInteres }}</span>
                    </div>
                    <div class="carrera-match">
                      <div class="match-porcentaje">{{ carrera.porcentajeCompatibilidad }}%</div>
                      <div class="match-label">Compatibilidad</div>
                      <button class="btn-ver-detalle" (click)="verDetalleCarrera(carrera.id)">Ver Detalle</button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="acciones-footer">
            <button class="btn-descargar">
              📄 Descargar Resultados PDF
            </button>
            <button class="btn-comparar">
              ➕ Comparar Carreras
            </button>
            <button class="btn-nuevo-test" (click)="reiniciarTest()">
              🔄 Realizar Nuevo Test
            </button>
          </div>
        </div>
      }

    </div>
    </div>
  `,
  styleUrl: './test-vocacional.css'
})
export class TestVocacionalComponent {
  private testService = inject(TestService);
  private router = inject(Router);

  estado = signal<'INICIO' | 'EN_PROGRESO' | 'FINALIZADO' | 'RESULTADOS'>('INICIO');

  preguntaActual = signal<Pregunta | null>(null);
  resultadosActuales = signal<ResultadoTest | null>(null);

  // Guardamos el ID de la sesión actual que nos da el backend
  sessionId = signal<number | null>(null);

  // ID del test (Esto podría venir de una ruta, por ahora hardcodeamos el Test 1)
  readonly TEST_ID = 1;

  iniciarTest() {
    this.testService.iniciarTest(this.TEST_ID).subscribe({
      next: (response) => {
        console.log('Test Iniciado:', response);
        this.sessionId.set(response.sessionId);
        this.preguntaActual.set(response.primeraPregunta);
        this.estado.set('EN_PROGRESO');
      },
      error: (err) => {
        console.error('Error iniciando test', err);
        alert('Error al iniciar el test. Asegúrate de haber iniciado sesión.');
      }
    });
  }

  seleccionarOpcion(opcionId: number) {
    const currentSession = this.sessionId();
    const currentPregunta = this.preguntaActual();

    if (!currentSession || !currentPregunta) return;

    this.testService.enviarRespuesta(currentSession, currentPregunta.id, opcionId)
      .subscribe({
        next: (siguientePregunta) => {
          if (siguientePregunta) {
            // Si el backend devuelve pregunta, seguimos
            this.preguntaActual.set(siguientePregunta);
          } else {
            // Si el backend devuelve null (o vacío), el test terminó
            this.estado.set('FINALIZADO');
          }
        },
        error: (err) => console.error('Error enviando respuesta', err)
      });
  }

  verResultados() {
    const currentSession = this.sessionId();
    if (!currentSession) return;

    this.testService.obtenerResultados(currentSession).subscribe({
      next: (resultados) => {
        console.log('Resultados:', resultados);
        this.resultadosActuales.set(resultados);
        this.estado.set('RESULTADOS');
      },
      error: (err) => console.error('Error obteniendo resultados', err)
    });
  }

  reiniciarTest() {
    this.estado.set('INICIO');
    this.sessionId.set(null);
    this.preguntaActual.set(null);
    this.resultadosActuales.set(null);
  }

  verDetalleCarrera(carreraId: number) {
    this.router.navigate(['/carreras', carreraId]);
  }

  calcularPorcentaje() {
    if (!this.preguntaActual()) return '0%';
    // El backend nos manda "Pregunta X de Y". Parseamos eso.
    try {
      const texto = this.preguntaActual()!.progreso;
      const partes = texto.split(' '); // ["Pregunta", "1", "de", "5"]
      const actual = parseInt(partes[1]);
      const total = parseInt(partes[3]);
      return (actual / total * 100) + '%';
    } catch (e) {
      return '0%';
    }
  }
}

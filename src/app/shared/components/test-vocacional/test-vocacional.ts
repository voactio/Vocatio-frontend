import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestService } from '../../../core/services/test.service';
import { Pregunta, ResultadoTest, ComparacionCarreras } from '../../../core/models/test-vocacional.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CarreraService } from '../../../core/services/carrera.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-test-vocacional',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

      @if (estado() === 'RESULTADOS' && resultadosActuales()) {
        <div class="resultados-wrapper">
          <!-- Header -->
          <div class="resultados-header">
            <h1 class="resultados-title">🎉 ¡Resultados de tu Test Vocacional!</h1>
            <p class="resultados-subtitle">Descubre las carreras que mejor se adaptan a tu perfil</p>
          </div>

          <div class="resultados-content">
              <div class="grafico-section">
              <h2 class="section-title">Áreas de Interés</h2>
              <div class="grafico-card">
                <div class="radar-chart-container">
                  <svg class="radar-chart" [attr.viewBox]="'0 0 600 500'" xmlns="http://www.w3.org/2000/svg">
                    <!-- Círculos concéntricos (background) -->
                    <g class="grid-circles">
                      <circle cx="300" cy="250" r="160" fill="none" stroke="#d1d5db" stroke-width="1.5" opacity="0.8"/>
                      <circle cx="300" cy="250" r="120" fill="none" stroke="#d1d5db" stroke-width="1.5" opacity="0.8"/>
                      <circle cx="300" cy="250" r="80" fill="none" stroke="#d1d5db" stroke-width="1.5" opacity="0.8"/>
                      <circle cx="300" cy="250" r="40" fill="none" stroke="#d1d5db" stroke-width="1.5" opacity="0.8"/>
                    </g>

                    <!-- Líneas radiales -->
                    <g class="grid-lines">
                      @for (item of obtenerTop5Areas(); track item.key; let i = $index) {
                        <line
                          [attr.x1]="300"
                          [attr.y1]="250"
                          [attr.x2]="300 + 160 * Math.cos((i * 2 * Math.PI / obtenerTop5Areas().length) - Math.PI / 2)"
                          [attr.y2]="250 + 160 * Math.sin((i * 2 * Math.PI / obtenerTop5Areas().length) - Math.PI / 2)"
                          stroke="#d1d5db"
                          stroke-width="1.5"
                          opacity="0.8"/>
                      }
                    </g>

                    <!-- Polígono de datos -->
                    <polygon
                      [attr.points]="obtenerPuntosRadar()"
                      fill="rgba(59, 130, 246, 0.5)"
                      stroke="rgb(59, 130, 246)"
                      stroke-width="3"/>

                    <!-- Puntos en el polígono -->
                    @for (item of obtenerTop5Areas(); track item.key; let i = $index) {
                      <circle
                        [attr.cx]="300 + (item.value * 16) * Math.cos((i * 2 * Math.PI / obtenerTop5Areas().length) - Math.PI / 2)"
                        [attr.cy]="250 + (item.value * 16) * Math.sin((i * 2 * Math.PI / obtenerTop5Areas().length) - Math.PI / 2)"
                        r="6"
                        fill="rgb(59, 130, 246)"/>
                    }

                    <!-- Labels -->
                    @for (item of obtenerTop5Areas(); track item.key; let i = $index) {
                      <text
                        [attr.x]="300 + 220 * Math.cos((i * 2 * Math.PI / obtenerTop5Areas().length) - Math.PI / 2)"
                        [attr.y]="250 + 220 * Math.sin((i * 2 * Math.PI / obtenerTop5Areas().length) - Math.PI / 2)"
                        text-anchor="middle"
                        dominant-baseline="middle"
                        fill="#2563eb"
                        font-size="16"
                        font-weight="600"
                        class="radar-label">
                        {{ item.key }}
                      </text>
                    }
                  </svg>

                  <!-- Leyenda -->
                  <div class="radar-legend">
                    <span class="legend-item">
                      <span class="legend-icon"></span>
                      Nivel de Interés (%)
                    </span>
                  </div>
                </div>
              </div>
              </div>

            <!-- Columna Derecha: Ranking -->
            <div class="ranking-section">
              <h2 class="section-title">Ranking de Carreras</h2>
              <div class="carreras-lista">
                @for (carrera of obtenerTop5Carreras(); track carrera.nombre; let i = $index) {
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
                      <div class="match-porcentaje">{{ redondearPorcentaje(carrera.porcentajeCompatibilidad) }}%</div>
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
            <button class="btn-descargar" (click)="descargarPDF()">
              📄 Descargar Resultados PDF
            </button>
            <button class="btn-comparar" (click)="abrirModalComparar()">
              ➕ Comparar Carreras
            </button>
            <button class="btn-nuevo-test" (click)="reiniciarTest()">
              🔄 Realizar Nuevo Test
            </button>
          </div>
        </div>
      }

      <!-- Modal de Comparación -->
      @if (mostrarModalComparar()) {
        <div class="modal-overlay" (click)="cerrarModalComparar()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2 class="modal-title">⚖️ Comparar Carreras</h2>
              <button class="btn-cerrar-modal" (click)="cerrarModalComparar()">✕</button>
            </div>

            <div class="modal-body">
              <div class="comparar-form">
                <div class="form-group">
                  <label for="carrera1">Primera Carrera</label>
                  <select id="carrera1" [(ngModel)]="carrera1Seleccionada" class="select-carrera">
                    <option [value]="null">Selecciona una carrera</option>
                    @for (carrera of obtenerTop5Carreras(); track carrera.id) {
                      <option [value]="carrera.id">{{ carrera.nombre }}</option>
                    }
                  </select>
                </div>

                <div class="form-group">
                  <label for="carrera2">Segunda Carrera</label>
                  <select id="carrera2" [(ngModel)]="carrera2Seleccionada" class="select-carrera">
                    <option [value]="null">Selecciona una carrera</option>
                    @for (carrera of obtenerTop5Carreras(); track carrera.id) {
                      <option [value]="carrera.id">{{ carrera.nombre }}</option>
                    }
                  </select>
                </div>

                <button
                  class="btn-comparar-action"
                  (click)="compararCarreras()"
                  [disabled]="!carrera1Seleccionada || !carrera2Seleccionada || carrera1Seleccionada === carrera2Seleccionada">
                  Comparar Carreras
                </button>
              </div>

              @if (comparacionResultado()) {
                <div class="comparacion-resultado">
                  <h3 class="resultado-title">Comparación de Carreras</h3>

                  <div class="tabla-comparacion">
                    <div class="tabla-header">
                      <div class="col-aspecto">Aspecto</div>
                      <div class="col-carrera">{{ comparacionResultado()!.carrera1.nombre }}</div>
                      <div class="col-carrera">{{ comparacionResultado()!.carrera2.nombre }}</div>
                    </div>

                    <div class="tabla-row">
                      <div class="col-aspecto">Descripción</div>
                      <div class="col-carrera">{{ comparacionResultado()!.carrera1.descripcion }}</div>
                      <div class="col-carrera">{{ comparacionResultado()!.carrera2.descripcion }}</div>
                    </div>

                    <div class="tabla-row">
                      <div class="col-aspecto">Duración</div>
                      <div class="col-carrera">{{ comparacionResultado()!.carrera1.duracionAnios }} años</div>
                      <div class="col-carrera">{{ comparacionResultado()!.carrera2.duracionAnios }} años</div>
                    </div>

                    <div class="tabla-row">
                      <div class="col-aspecto">Modalidad</div>
                      <div class="col-carrera">{{ comparacionResultado()!.carrera1.modalidad }}</div>
                      <div class="col-carrera">{{ comparacionResultado()!.carrera2.modalidad }}</div>
                    </div>

                    <div class="tabla-row">
                      <div class="col-aspecto">Salario Promedio</div>
                      <div class="col-carrera">{{ comparacionResultado()!.carrera1.rangoSalarioPromedio }}</div>
                      <div class="col-carrera">{{ comparacionResultado()!.carrera2.rangoSalarioPromedio }}</div>
                    </div>

                    <div class="tabla-row">
                      <div class="col-aspecto">Área de Interés</div>
                      <div class="col-carrera">{{ comparacionResultado()!.carrera1.areaInteres }}</div>
                      <div class="col-carrera">{{ comparacionResultado()!.carrera2.areaInteres }}</div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

    </div>
    </div>
  `,
  styleUrl: './test-vocacional.css'
})
export class TestVocacionalComponent implements OnInit {
  private testService = inject(TestService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private carreraService = inject(CarreraService);
  private authService = inject(AuthService);

  estado = signal<'INICIO' | 'EN_PROGRESO' | 'FINALIZADO' | 'RESULTADOS'>('INICIO');

  preguntaActual = signal<Pregunta | null>(null);
  resultadosActuales = signal<ResultadoTest | null>(null);

  // Guardamos el ID de la sesión actual que nos da el backend
  sessionId = signal<number | null>(null);

  // ID del resultado actual (para comparación)
  idResultadoActual = signal<number | null>(null);

  // ID del test (Esto podría venir de una ruta, por ahora hardcodeamos el Test 1)
  readonly TEST_ID = 1;

  // Exponer Math para usar en el template
  readonly Math = Math;

  // Comparación de carreras
  mostrarModalComparar = signal<boolean>(false);
  carrera1Seleccionada: number | null = null;
  carrera2Seleccionada: number | null = null;
  comparacionResultado = signal<ComparacionCarreras | null>(null);

  ngOnInit() {
    // Verificar si viene un resultadoId de los query params
    this.route.queryParams.subscribe(params => {
      const resultadoId = params['resultadoId'];
      if (resultadoId) {
        // Guardar el idResultado
        this.idResultadoActual.set(Number(resultadoId));
        // Cargar resultados históricos
        this.cargarResultadosHistoricos(Number(resultadoId));
      }
    });
  }

  cargarResultadosHistoricos(resultadoId: number) {
    this.testService.obtenerResultadosHistoricos(resultadoId).subscribe({
      next: (resultados) => {
        console.log('Resultados históricos cargados:', resultados);
        // Agregar el idResultado al objeto
        resultados.idResultado = resultadoId;
        this.resultadosActuales.set(resultados);
        this.estado.set('RESULTADOS');
      },
      error: (err) => {
        console.error('Error cargando resultados históricos:', err);
        alert('⚠️ Error al cargar los resultados del test.\n\nPor favor, intenta nuevamente.');
      }
    });
  }

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
            // Cargar y mostrar resultados directamente
            console.log('Test completado, cargando resultados...');
            this.cargarResultados();
          }
        },
        error: (err) => {
          console.error('Error enviando respuesta:', err);
          // Si hay un error al finalizar el test, intentar cargar los resultados de todas formas
          console.warn('Detectado error al finalizar test, intentando cargar resultados...');
          this.cargarResultados();
        }
      });
  }

  cargarResultados() {
    const currentSession = this.sessionId();
    if (!currentSession) return;

    this.testService.obtenerResultados(currentSession).subscribe({
      next: (resultados) => {
        console.log('Resultados obtenidos:', resultados);
        this.resultadosActuales.set(resultados);
        this.estado.set('RESULTADOS');

        // Cargar el historial para obtener el idResultado más reciente
        this.testService.getHistorial().subscribe({
          next: (historial) => {
            if (historial && historial.length > 0) {
              // El más reciente es el primero
              const ultimoResultado = historial[0];
              this.idResultadoActual.set(ultimoResultado.idResultado);
              console.log('ID Resultado guardado:', ultimoResultado.idResultado);
            }
          },
          error: (err) => {
            console.error('Error al obtener historial para idResultado:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error obteniendo resultados:', err);
        alert('⚠️ Error al obtener los resultados del test.\n\n' +
              'Esto puede deberse a un problema en el servidor al guardar los datos.\n' +
              'Por favor, contacta al administrador o intenta realizar el test nuevamente.');
      }
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

  abrirModalComparar() {
    this.mostrarModalComparar.set(true);
    this.carrera1Seleccionada = null;
    this.carrera2Seleccionada = null;
    this.comparacionResultado.set(null);
  }

  cerrarModalComparar() {
    this.mostrarModalComparar.set(false);
    this.carrera1Seleccionada = null;
    this.carrera2Seleccionada = null;
    this.comparacionResultado.set(null);
  }

  compararCarreras() {
    if (!this.carrera1Seleccionada || !this.carrera2Seleccionada) {
      alert('⚠️ Por favor selecciona dos carreras para comparar.');
      return;
    }

    if (this.carrera1Seleccionada === this.carrera2Seleccionada) {
      alert('⚠️ Por favor selecciona dos carreras diferentes.');
      return;
    }

    // Obtener el ID de usuario
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      console.error('No hay usuario autenticado');
      alert('⚠️ Debes iniciar sesión para comparar carreras.');
      return;
    }

    // Verificar que el usuario tenga un ID válido
    if (!currentUser.id) {
      console.error('El usuario no tiene ID:', currentUser);
      alert('⚠️ Error: Usuario sin ID. Por favor, cierra sesión e inicia sesión nuevamente.');
      return;
    }

    // Obtener el ID del resultado actual
    const idResultado = this.idResultadoActual();
    if (!idResultado) {
      console.error('No hay idResultado disponible');
      alert('⚠️ No se pudo obtener el resultado del test. Por favor, recarga la página e intenta nuevamente.');
      return;
    }

    // Verificar token de autenticación
    const token = this.authService.getToken();
    if (!token) {
      console.error('No hay token de autenticación');
      alert('⚠️ Sesión expirada. Por favor, inicia sesión nuevamente.');
      return;
    }

    console.log('Comparando carreras con:', {
      idUsuario: currentUser.id,
      idResultado,
      idCarrera1: this.carrera1Seleccionada,
      idCarrera2: this.carrera2Seleccionada,
      hasToken: !!token
    });

    this.carreraService.compararCarreras(
      currentUser.id,
      idResultado,
      this.carrera1Seleccionada,
      this.carrera2Seleccionada
    ).subscribe({
      next: (resultado) => {
        console.log('Comparación obtenida:', resultado);
        this.comparacionResultado.set(resultado);
      },
      error: (err) => {
        console.error('Error al comparar carreras:', err);
        console.error('Detalles del error:', {
          status: err.status,
          statusText: err.statusText,
          message: err.error?.message || err.message
        });

        let mensaje = '⚠️ Error al comparar las carreras.\n\n';
        if (err.error?.message) {
          mensaje += `Detalle: ${err.error.message}\n\n`;
        }
        mensaje += 'Por favor, intenta nuevamente.';

        alert(mensaje);
      }
    });
  }

  // Método para obtener los puntajes RIASEC ordenados de mayor a menor
  obtenerPuntajesOrdenados(): Array<{key: string, value: number}> {
    const resultados = this.resultadosActuales();
    if (!resultados || !resultados.graficoIntereses || !resultados.graficoIntereses.puntajes) {
      return [];
    }

    // Convertir el objeto a array de {key, value} y ordenar por valor descendente
    return Object.entries(resultados.graficoIntereses.puntajes)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value);
  }

  // Método para obtener solo las top 5 áreas de interés
  obtenerTop5Areas(): Array<{key: string, value: number}> {
    return this.obtenerPuntajesOrdenados().slice(0, 5);
  }

  // Método para obtener solo las 5 mejores carreras
  obtenerTop5Carreras() {
    const resultados = this.resultadosActuales();
    if (!resultados || !resultados.rankingCarreras) {
      return [];
    }
    return resultados.rankingCarreras.slice(0, 5);
  }

  // Método para redondear porcentaje a número entero
  redondearPorcentaje(porcentaje: number): number {
    return Math.round(porcentaje);
  }

  // Método para calcular los puntos del polígono del radar
  obtenerPuntosRadar(): string {
    const puntajes = this.obtenerTop5Areas();
    if (puntajes.length === 0) return '';

    const centerX = 300;
    const centerY = 250;
    const maxRadius = 160; // Radio máximo del gráfico
    const numPoints = puntajes.length;

    return puntajes.map((item, i) => {
      // Normalizar puntaje a un radio (asumiendo que el máximo es 10)
      const radius = (item.value / 10) * maxRadius;

      // Calcular ángulo para este punto (empezando desde arriba, -90°)
      const angle = (i * 2 * Math.PI / numPoints) - (Math.PI / 2);

      // Calcular coordenadas X, Y
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return `${x},${y}`;
    }).join(' ');
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

  descargarPDF() {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      alert('⚠️ Debes iniciar sesión para descargar el PDF.');
      return;
    }

    const resultados = this.resultadosActuales();
    const idResultado = resultados?.idResultado || this.idResultadoActual();

    if (!idResultado) {
      alert('⚠️ No hay resultados para descargar.');
      return;
    }

    console.log('Descargando PDF del resultado:', idResultado);

    // Llamar al servicio para descargar el PDF
    this.testService.descargarPDF(idResultado, currentUser.id).subscribe({
      next: (blob) => {
        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resultado-test-${idResultado}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log('PDF descargado exitosamente');
      },
      error: (err) => {
        console.error('Error al descargar PDF:', err);
        alert('⚠️ Error al descargar el PDF. Por favor, intenta nuevamente.');
      }
    });
  }
}

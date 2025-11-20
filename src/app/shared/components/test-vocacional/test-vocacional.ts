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
    <div class="test-container">
      
      <div *ngIf="estado() === 'INICIO'" class="card inicio">
        <h2>Test Vocacional Vocatio</h2>
        <p>Descubre tu vocación profesional respondiendo a estas preguntas.</p>
        <div class="instrucciones">
          <h4>Instrucciones:</h4>
          <ul>
            <li>Responde honestamente a cada pregunta.</li>
            <li>No hay respuestas correctas o incorrectas.</li>
            <li>El test dura aproximadamente 5 minutos.</li>
          </ul>
        </div>
        <button (click)="iniciarTest()" class="btn-primary">Comenzar Test</button>
      </div>

      <div *ngIf="estado() === 'EN_PROGRESO' && preguntaActual()" class="card pregunta">
        <div class="progreso-header">
          <span class="progreso-texto">{{ preguntaActual()!.progreso }}</span>
          <div class="barra-progreso">
             <div class="relleno" [style.width]="calcularPorcentaje()"></div>
          </div>
        </div>
        <h3 class="texto-pregunta">{{ preguntaActual()!.textoPregunta }}</h3>
        <div class="opciones-lista">
          <button *ngFor="let opcion of preguntaActual()!.opciones" 
            (click)="seleccionarOpcion(opcion.id)" class="btn-opcion">
            <span class="radio-circle"></span> {{ opcion.textoOpcion }}
          </button>
        </div>
      </div>

      <div *ngIf="estado() === 'FINALIZADO'" class="card final">
        <h2>¡Excelente Trabajo!</h2>
        <p>Has completado todas las preguntas del test.</p>
        <button class="btn-primary">Ver mis Resultados</button>
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
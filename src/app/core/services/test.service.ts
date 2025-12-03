import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // Asegúrate de tener esto
import { Observable, catchError, map, of } from 'rxjs';
import { StartTestResponse, Pregunta, ResultadoTest } from '../models/test-vocacional.model';
import { TestHistoryItem } from '../models/test-vocacional.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private http = inject(HttpClient);
  // Ajusta esto si tu environment.apiUrl es solo 'http://localhost:8080/api/v1'
  private apiUrl = `${environment.apiUrl}/tests`;

  // 1. Iniciar el Test (Backend espera POST /tests/{id}/iniciar)
  // Nota: El userId lo saca el backend del Token, no hace falta enviarlo aquí
  iniciarTest(testId: number): Observable<StartTestResponse> {
    return this.http.post<StartTestResponse>(`${this.apiUrl}/${testId}/iniciar`, {});
  }

  // 2. Enviar Respuesta (Backend espera POST /sessions/{sessionId}/answers)
  enviarRespuesta(sessionId: number, preguntaId: number, opcionId: number): Observable<Pregunta | null> {
    const body = { preguntaId, opcionId };
    // Si el backend devuelve 200 OK sin cuerpo (fin del test), Angular puede devolver null
    return this.http.post<Pregunta>(`${this.apiUrl}/sessions/${sessionId}/answers`, body, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<Pregunta>) => {
          // Si el body está vacío o es null, significa que el test terminó
          return response.body || null;
        }),
        catchError((error) => {
          console.error('Error enviando respuesta:', error);
          // En caso de error, devolvemos null para que el componente maneje la finalización
          return of(null);
        })
      );
  }

  // 3. Obtener Resultados (Backend espera GET /sessions/{sessionId}/results)
  obtenerResultados(sessionId: number): Observable<ResultadoTest> {
    return this.http.get<ResultadoTest>(`${this.apiUrl}/sessions/${sessionId}/results`);
  }

  // 4. Obtener Resultados Históricos por ID de resultado
  obtenerResultadosHistoricos(resultadoId: number): Observable<ResultadoTest> {
    return this.http.get<ResultadoTest>(`${this.apiUrl}/resultados/${resultadoId}`);
  }

  // GET /tests/historial
  getHistorial(): Observable<TestHistoryItem[]> {
    return this.http.get<TestHistoryItem[]>(`${this.apiUrl}/historial`);
  }

  // Descargar PDF de resultados
  descargarPDF(idResultado: number, idUsuario: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/resultados/${idResultado}/pdf?usuario=${idUsuario}`, {
      responseType: 'blob'
    });
  }
}

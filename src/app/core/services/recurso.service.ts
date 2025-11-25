import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Recurso } from '../models/recurso.model';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Signals para manejo de estado
  private _recursos = signal<Recurso[] | null>(null);
  private _loading = signal<boolean>(false);

  // Exposición de signals como readonly
  recursos = this._recursos.asReadonly();
  loading = this._loading.asReadonly();

  getRecursosPorCarrera(idCarrera: number): Observable<Recurso[]> {
    this._loading.set(true);
    console.log('RecursoService: Llamando API para carrera', idCarrera);
    const url = `${this.apiUrl}/carreras/${idCarrera}/recursos`;
    console.log('RecursoService: URL completa:', url);

    return this.http.get<Recurso[]>(url).pipe(
      tap(recursos => {
        console.log('RecursoService: Respuesta recibida:', recursos);
        this._recursos.set(recursos);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  // Método para agrupar recursos por tipo
  agruparPorTipo(recursos: Recurso[]): Map<string, Recurso[]> {
    const grupos = new Map<string, Recurso[]>();

    recursos.forEach(recurso => {
      const tipo = recurso.tipoRecurso;
      if (!grupos.has(tipo)) {
        grupos.set(tipo, []);
      }
      grupos.get(tipo)?.push(recurso);
    });

    return grupos;
  }

  // Resetear estado
  reset(): void {
    this._recursos.set(null);
    this._loading.set(false);
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { UniversidadesPorCarrera } from '../models/universidad.model';

@Injectable({
  providedIn: 'root'
})
export class UniversidadService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/carreras`;

  // Signals
  private _universidades = signal<UniversidadesPorCarrera | null>(null);
  private _loading = signal<boolean>(false);

  universidades = this._universidades.asReadonly();
  loading = this._loading.asReadonly();

  /**
   * Obtener universidades que ofrecen una carrera específica
   */
  getUniversidadesPorCarrera(idCarrera: number): Observable<UniversidadesPorCarrera> {
    this._loading.set(true);
    return this.http.post<UniversidadesPorCarrera>(
      `${this.apiUrl}/${idCarrera}/universidades`,
      {}
    ).pipe(
      tap(data => {
        this._universidades.set(data);
        this._loading.set(false);
      })
    );
  }

  /**
   * Limpiar datos de universidades
   */
  clear(): void {
    this._universidades.set(null);
  }

  /**
   * Resetear estado
   */
  reset(): void {
    this._universidades.set(null);
    this._loading.set(false);
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { CarreraCard, CarreraDetail, CarreraFilters } from '../models/carrera.model';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/carreras`;

  // Signals para gestión de estado
  private _carreras = signal<CarreraCard[]>([]);
  private _carreraDetail = signal<CarreraDetail | null>(null);
  private _loading = signal<boolean>(false);

  carreras = this._carreras.asReadonly();
  carreraDetail = this._carreraDetail.asReadonly();
  loading = this._loading.asReadonly();

  /**
   * Obtener listado inicial de carreras (paginado)
   */
  getListadoInicial(page: number = 0, size: number = 12): Observable<CarreraCard[]> {
    this._loading.set(true);
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<CarreraCard[]>(`${this.apiUrl}/listado`, { params }).pipe(
      tap(carreras => {
        this._carreras.set(carreras);
        this._loading.set(false);
      })
    );
  }

  /**
   * Obtener detalle de una carrera específica
   */
  getCarreraDetail(id: number): Observable<CarreraDetail> {
    this._loading.set(true);
    return this.http.get<CarreraDetail>(`${this.apiUrl}/${id}`).pipe(
      tap(detalle => {
        this._carreraDetail.set(detalle);
        this._loading.set(false);
      })
    );
  }

  /**
   * Buscar carreras con filtros
   */
  buscarCarreras(filters: CarreraFilters): Observable<CarreraCard[]> {
    this._loading.set(true);
    let params = new HttpParams()
      .set('page', (filters.page || 0).toString())
      .set('size', (filters.size || 12).toString())
      .set('sort', filters.sort || 'nombre,asc');

    if (filters.nombre) {
      params = params.set('nombre', filters.nombre);
    }
    if (filters.modalidad) {
      params = params.set('modalidad', filters.modalidad);
    }
    if (filters.perfilRiasec) {
      params = params.set('perfilRiasec', filters.perfilRiasec);
    }

    return this.http.get<CarreraCard[]>(this.apiUrl, { params }).pipe(
      tap(carreras => {
        this._carreras.set(carreras);
        this._loading.set(false);
      })
    );
  }

  /**
   * Comparar dos carreras
   */
  compararCarreras(idUsuario: string, idResultado: number, idCarrera1: number, idCarrera2: number): Observable<any> {
    const body = {
      idUsuario,
      idResultado,
      idCarrera1,
      idCarrera2
    };

    // Ruta correcta: /api/v1/comparar-carreras (context-path + @RequestMapping)
    return this.http.post(`${environment.apiUrl}/comparar-carreras`, body);
  }

  /**
   * Limpiar el detalle de carrera
   */
  clearDetail(): void {
    this._carreraDetail.set(null);
  }
}

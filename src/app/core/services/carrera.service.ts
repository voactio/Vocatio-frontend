import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CarreraCardResponse, CarreraDetailResponse, TestimonioResponse } from '../models/carrera.model';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/carreras`;

  // Funcionalidad 1 y 4: Listado, Paginación y Filtrado
  buscar(
    nombre?: string,
    modalidad?: string,
    perfilRiasec?: string,
    page: number = 0,
    size: number = 12,
    sort: string = 'nombre,asc'
  ): Observable<CarreraCardResponse[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    if (nombre) params = params.set('nombre', nombre);
    if (modalidad) params = params.set('modalidad', modalidad);
    if (perfilRiasec) params = params.set('perfilRiasec', perfilRiasec);

    return this.http.get<CarreraCardResponse[]>(this.apiUrl, { params });
  }

  // Funcionalidad 2: Obtener Detalle
  getDetalle(id: number): Observable<CarreraDetailResponse> {
    return this.http.get<CarreraDetailResponse>(`${this.apiUrl}/${id}`);
  }

  // Funcionalidad 3: Ver Testimonios
  getTestimonios(idCarrera: number): Observable<TestimonioResponse[]> {
    return this.http.get<TestimonioResponse[]>(`${this.apiUrl}/${idCarrera}/testimonios`);
  }
}

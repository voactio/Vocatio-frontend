import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Testimonio, CrearTestimonioRequest } from '../models/testimonio.model';

@Injectable({
  providedIn: 'root'
})
export class TestimonioService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Signals para manejo de estado
  private _testimonios = signal<Testimonio[] | null>(null);
  private _loading = signal<boolean>(false);

  // Exposición de signals como readonly
  testimonios = this._testimonios.asReadonly();
  loading = this._loading.asReadonly();

  getTestimoniosPorCarrera(idCarrera: number): Observable<Testimonio[]> {
    this._loading.set(true);
    console.log('TestimonioService: Llamando API para carrera', idCarrera);
    const url = `${this.apiUrl}/carreras/${idCarrera}/testimonios`;
    console.log('TestimonioService: URL completa:', url);

    return this.http.get<Testimonio[]>(url).pipe(
      tap(testimonios => {
        console.log('TestimonioService: Respuesta recibida:', testimonios);
        // Procesar testimonios para agregar iniciales
        const testimoniosConIniciales = testimonios.map(t => ({
          ...t,
          iniciales: this.getIniciales(t.nombreUsuario)
        }));
        this._testimonios.set(testimoniosConIniciales);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  // Obtener iniciales del nombre
  private getIniciales(nombre?: string): string {
    if (!nombre) return '??';
    const palabras = nombre.trim().split(' ');
    if (palabras.length === 1) {
      return palabras[0].substring(0, 2).toUpperCase();
    }
    return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase();
  }

  // Crear nuevo testimonio
  crearTestimonio(idCarrera: number, request: CrearTestimonioRequest): Observable<Testimonio> {
    console.log('TestimonioService: Creando testimonio para carrera', idCarrera);
    const url = `${this.apiUrl}/carreras/${idCarrera}/testimonios`;
    console.log('TestimonioService: URL POST:', url);
    console.log('TestimonioService: Request:', request);

    return this.http.post<Testimonio>(url, request).pipe(
      tap(nuevoTestimonio => {
        console.log('TestimonioService: Testimonio creado:', nuevoTestimonio);
        // Recargar la lista de testimonios
        this.getTestimoniosPorCarrera(idCarrera).subscribe();
      })
    );
  }

  // Resetear estado
  reset(): void {
    this._testimonios.set(null);
    this._loading.set(false);
  }
}

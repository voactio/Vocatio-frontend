// carrera.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CarreraOption } from '../models/carreraoption.model';

@Injectable({
  providedIn: 'root'
})
export class CarreraOptionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/carreras`;

  /*
    GET /carreras/opciones
    Devuelve lista simple { id, nombre }
  */
  getOpciones(): Observable<CarreraOption[]> {
    return this.http.get<CarreraOption[]>(`${this.apiUrl}/opciones`);
  }
}

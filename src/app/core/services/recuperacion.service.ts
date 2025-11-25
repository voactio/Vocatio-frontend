import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OlvidoRequest, OlvidoResponse, ReContrasenaRequest, ReContrasenaResponse, ValidarTokenResponse } from '../models/recuperacion.mode';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecuperacionService {

  //private baseUrl = 'http://localhost:8080/recuperacion';
  private apiUrl = `${environment.apiUrl}/recuperacion`;

  constructor(private http: HttpClient) {}

  // 1. Enviar correo para recuperar contraseña
  solicitarRecuperacion(recuperar: OlvidoRequest): Observable<OlvidoResponse> {
    return this.http.post<OlvidoResponse>(`${this.apiUrl}/olvidoContra`, recuperar);
  }

  // 2. Validar token de recuperación
  validarToken(token: string): Observable<ValidarTokenResponse> {
    return this.http.get<ValidarTokenResponse>(`${this.apiUrl}/reestablecerContra`, {
      params: { token }
    });
  }

  // 3. Enviar nueva contraseña
  restablecerContrasena(reContra: ReContrasenaRequest): Observable<ReContrasenaResponse> {
    return this.http.post<ReContrasenaResponse>(`${this.apiUrl}/reestablecerContra`, reContra);
  }

}

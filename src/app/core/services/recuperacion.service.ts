import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecuperacionService {

  private baseUrl = 'http://localhost:8080/recuperacion'; // ajusta si usas /api o gateway

  constructor(private http: HttpClient) {}

  // 1. Enviar correo para recuperar contraseña
  solicitarRecuperacion(correo: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/olvidoContra`, { correo });
  }

  // 2. Validar token de recuperación
  validarToken(token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/reestablecerContra`, {
      params: { token }
    });
  }

  // 3. Enviar nueva contraseña
  restablecerContrasena(token: string, nuevaContrasena: string, confirmarContrasena: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reestablecerContra`, {
      token,
      nuevaContrasena,
      confirmarContrasena
    });
  }

}

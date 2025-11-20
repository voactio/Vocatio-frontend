import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UserRequest, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: token ?? ''
    });
  }

  // GET /usuarios/{id}
  getUsuarioById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // PATCH /usuarios/updPerfil/{id}
  updateUsuario(id: string, data: UserRequest): Observable<UserResponse> {
    return this.http.patch<UserResponse>(
      `${this.apiUrl}/updPerfil/${id}`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

/*
  updateUsuario(id: string, data: UpdateUsuarioRequest): Observable<UpdateUsuarioResponse> {
    return this.http.patch<UpdateUsuarioResponse>(
      `${this.apiUrl}/updPerfil/${id}`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }
*/
}

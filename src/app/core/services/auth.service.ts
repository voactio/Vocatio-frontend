import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, RoleType, UserResponse } from '../models/user.model';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;
  private storage = inject(StorageService);
  private router = inject(Router);

  // Signals
  private _currentUser = signal<UserResponse | null>(null);
  private _isAuthenticated = signal<boolean>(false);
  private _token = signal<string | null>(null);

  currentUser = this._currentUser.asReadonly();
  isAuthenticated = this._isAuthenticated.asReadonly();
  token = this._token.asReadonly();


  constructor() {
    this.loadAuthData();
  }
/*
  constructor() {
    // Si existe token en localStorage, cargar usuario
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      this._currentUser.set(JSON.parse(savedUser));
    }
  }

*/

  // POST - LOGIN
  loginUser(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        this.saveAuthData(response);
      })
    );
  }

  // POST - Register
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        this.saveAuthData(response);
      })
    );
  }

/*loadProfile() {
    return this.getUserProfile().pipe(
      tap(profile => this._profile.set(profile))
    );
  }

  // Signals para histórico
  // EN PRUEBA - BORRAR SI ES NECESARIO
  private _login = signal<LoginRequest[]>([]);
  login = this._login.asReadonly();
  private _register = signal<RegisterRequest[]>([]);
  register = this._register.asReadonly();
*/

/*
  // ============================
  // POST - REGISTER
  // ============================
  registerUser(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        // Guardar en signal de registro - EN PRUEBA
        this._register.update(current => [...current, data]);

        // Guardar usuario autenticado
        this._currentUser.set(response);

        // Guardar token/localStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('authUser', JSON.stringify(response));
      })
    );
  }*/

  // LOGOUT
  logout(): void {
    this.storage.removeItem('token');
    this.storage.removeItem('user');
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this._token.set(null);
    this.router.navigate(['/login']);
  }
  /*
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    this._currentUser.set(null);
  }
  */

  // Guardar data de autenticacion
  private saveAuthData(response: AuthResponse): void {
    this.storage.setItem('token', response.token);
    this._token.set(response.token);

    // AuthResponse incluye role si viene del backend
    const user: UserResponse = {
      id: response.id,
      correo: response.correo,
      nombre: response.nombre,
      role: response.role || RoleType.ROLE_USER, // Usar el role del response o ROLE_USER por defecto
      active: true,
      nivelEducativo: response.nivelEducativo,
      carreraId: response.carreraId,
      urlImagenPerfil: response.urlImagenPerfil
    };

    this.storage.setItem('user', user);
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
  }
  // Cargar data de autenticacion
  private loadAuthData(): void {
    const token = this.storage.getItem<string>('token');
    const user = this.storage.getItem<UserResponse>('user');

    if (token && user) {
      this._token.set(token);
      this._currentUser.set(user);
      this._isAuthenticated.set(true);
    }
  }


  // GETTERS y VALIDADORES SIMPLES
  isAdmin(): boolean {
    return this._currentUser()?.role === RoleType.ROLE_ADMIN;
  }

  get currentUserValue(): UserResponse | null {
    return this._currentUser();
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

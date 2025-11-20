// ===== ROL =====
export enum RoleType {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

// ===== REQUESTS =====
export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  correo: string;
  contrasena: string;
  nombre: string;
  nivelEducativo: string;
  urlImagenPerfil?: string;
  carreraId?: number;
}

export interface UserRequest {
  nombre: string;
  contrasena: string;
  nivelEducativo: string;
  carreraId?: number;
  urlImagenPerfil?: string;
}

// ===== RESPONSES =====
export interface AuthResponse {
  token: string;
  type: string;
  correo: string;
  nombre: string;
  role?: RoleType;
  id: string;
  nivelEducativo: string;
  carreraId: number;
  urlImagenPerfil: string;
}

export interface UserResponse {
  id: string;
  correo: string;
  nombre: string;
  role?: RoleType;
  active?: boolean;
  nivelEducativo: string;
  carreraId: number;
  urlImagenPerfil: string;
}

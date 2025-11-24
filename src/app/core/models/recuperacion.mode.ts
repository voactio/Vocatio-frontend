// REQUEST

export interface OlvidoRequest {
  correo: string;
}

export interface ReContrasenaRequest {
  token: string,
  nuevaContrasena: string,
  confirmarContrasena: string,
}


// RESPONSE

export interface OlvidoResponse {
  mensaje: string;
  token: string;
}

export interface ValidarTokenResponse {
  mensaje: string;
}

export interface ReContrasenaResponse{
  mensaje: string;
}

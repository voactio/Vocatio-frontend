export interface CarreraCardResponse {
  id: number;
  nombre: string;
  descripcionCorta: string;
}

export interface CarreraDetailResponse {
  id: number;
  nombre: string;
  descripcion: string;
  duracionAnios: number;
  modalidad: string;
  rangoSalarioPromedio: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface TestimonioResponse {
  id: string;
  idUsuario: string; // UUID
  idCarrera: number;
  textoTestimonio: string;
  aprobado: boolean;
  creadoEn: string;
}

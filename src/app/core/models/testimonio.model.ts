export interface Testimonio {
  id: string;
  idUsuario: string;
  idCarrera: number;
  textoTestimonio: string;
  aprobado: boolean;
  creadoEn: string;

  // Campos adicionales para mostrar (pueden venir del backend o ser calculados)
  nombreUsuario?: string;
  universidad?: string;
  promocion?: string;
  iniciales?: string;
}

export interface CrearTestimonioRequest {
  idUsuario: string;
  textoTestimonio: string;
}

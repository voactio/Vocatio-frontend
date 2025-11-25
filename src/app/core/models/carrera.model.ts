// Modelos para Carreras

export interface CarreraCard {
  id: number;
  nombre: string;
  descripcionCorta: string;
  duracionAnios?: number;
  rangoSalarioPromedio?: string;
  especializacion?: string;
  modalidad?: string;
  perfilRiasec?: string;
  tags?: string[];
}

export interface CarreraDetail {
  id: number;
  nombre: string;
  descripcion: string;
  duracionAnios: number;
  modalidad: string;
  rangoSalarioPromedio: string;
  especializacion?: string;
  habilidades?: string[];
  camposTrabajo?: string[];
  cursosImportantes?: string[];
  videoUrl?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CarreraFilters {
  nombre?: string;
  modalidad?: string;
  perfilRiasec?: string;
  page?: number;
  size?: number;
  sort?: string;
}

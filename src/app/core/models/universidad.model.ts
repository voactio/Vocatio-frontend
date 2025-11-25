// Modelos para Universidades

export interface Universidad {
  idUniversidad: number;
  nombreUniversidad: string;
  ubicacion: string;
  duracionAnios: number;
  costoPorAnio: string;
  urlUniversidad?: string;
  urlPlanEspecifico?: string;
}

export interface UniversidadesPorCarrera {
  idCarrera: number;
  nombreCarrera: string;
  universidades: Universidad[];
}

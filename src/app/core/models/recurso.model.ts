export interface Recurso {
  titulo: string;
  tipoRecurso: string; // "INFOGRAFIA", "VIDEO", "CURSO", "DOCUMENTO"
  autor: string;
  url: string;
}

export interface RecursosResponse {
  recursos: Recurso[];
}

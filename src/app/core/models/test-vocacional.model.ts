export interface Opcion {
  id: number;
  textoOpcion: string;
}

export interface Pregunta {
  id: number;
  textoPregunta: string;
  progreso: string; // Ej: "Pregunta 1 de 5"
  opciones: Opcion[];
}

export interface StartTestResponse {
  sessionId: number;
  primeraPregunta: Pregunta;
}

export interface CarreraAfin {
  id: number;
  nombre: string;
  descripcion: string;
  areaInteres: string; // Antes tagPrincipal
  porcentajeCompatibilidad: number;
}

export interface GraficoInteres {
  puntajes: { [key: string]: number }; // Mapa dinámico ej: {"Realista": 10}
}

export interface ResultadoTest {
  graficoIntereses: GraficoInteres;
  rankingCarreras: CarreraAfin[];
}
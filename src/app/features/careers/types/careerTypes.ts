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
    // Add other fields as needed based on "..." in requirements
}

export interface UniversitiesByCareerRequest {
    idCarrera: number;
}

export interface UniversitiesByCareerResponse {
    id: number;
    nombre: string;
    url: string;
    logo: string;
}

export interface RecursoResponse {
    id: number;
    nombre: string;
    tipo: string;
    url: string;
}

export interface TestimonioResponse {
    id: number;
    texto: string;
    nombreUsuario: string;
}

import { Injectable } from '@angular/core';
import axiosClient from '../../../../api/axiosClient';
import {
    CarreraCardResponse,
    CarreraDetailResponse,
    RecursoResponse,
    TestimonioResponse,
    UniversitiesByCareerResponse
} from '../types/careerTypes';

@Injectable({
    providedIn: 'root'
})
export class CareerService {

    constructor() { }

    async getListado(page: number, size: number): Promise<CarreraCardResponse[]> {
        try {
            const response = await axiosClient.get<CarreraCardResponse[]>('/carreras/listado', {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching career list:', error);
            throw error;
        }
    }

    async filtrarCarreras(params: {
        nombre?: string;
        modalidad?: string;
        perfilRiasec?: string;
        page?: number;
        size?: number;
        sort?: string;
    }): Promise<CarreraCardResponse[]> {
        try {
            const response = await axiosClient.get<CarreraCardResponse[]>('/carreras', {
                params
            });
            return response.data;
        } catch (error) {
            console.error('Error filtering careers:', error);
            throw error;
        }
    }

    async getDetalle(id: number): Promise<CarreraDetailResponse> {
        try {
            const response = await axiosClient.get<CarreraDetailResponse>(`/carreras/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching career detail:', error);
            throw error;
        }
    }

    async getRecursos(id: number): Promise<RecursoResponse[]> {
        try {
            const response = await axiosClient.get<RecursoResponse[]>(`/carreras/${id}/recursos`);
            return response.data;
        } catch (error) {
            console.error('Error fetching career resources:', error);
            throw error;
        }
    }

    async getTestimonios(id: number): Promise<TestimonioResponse[]> {
        try {
            const response = await axiosClient.get<TestimonioResponse[]>(`/carreras/${id}/testimonios`);
            return response.data;
        } catch (error) {
            console.error('Error fetching career testimonials:', error);
            throw error;
        }
    }

    async getUniversities(idCarrera: number): Promise<UniversitiesByCareerResponse[]> {
        try {
            const response = await axiosClient.post<UniversitiesByCareerResponse[]>(`/carreras/${idCarrera}/universidades`, {
                idCarrera
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching universities:', error);
            throw error;
        }
    }
}

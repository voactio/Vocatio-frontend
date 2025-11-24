import { Injectable } from '@angular/core';
import axiosClient from '../../../../api/axiosClient';
import { CarreraCardResponse } from '../types/careerTypes';

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
}

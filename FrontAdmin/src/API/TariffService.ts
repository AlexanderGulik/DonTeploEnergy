import { HOST } from '../config/URLs';
import api from './axios';
import { TariffI, CreateTariffDto, UpdateTariffDto } from '../types/tariff.types';

export const TariffService = {
    getAll: async (page?: number, limit?: number) => {
        let url = `${HOST}/tariffs`;
        if (page && limit) {
            url += `?page=${page}&limit=${limit}`;
        }
        const response = await api.get(url);
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`${HOST}tariffs/${id}`);
        return response.data;
    },

    create: async (data: CreateTariffDto) => {
        const response = await api.post(`${HOST}/tariffs/create`, data);
        return response.data;
    },

    update: async (data: UpdateTariffDto) => {
        const { id, ...updateData } = data;
        const response = await api.put(`${HOST}/tariffs/update/${id}`, updateData);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`${HOST}/tariffs/delete/${id}`);
        return response.data;
    },

    };

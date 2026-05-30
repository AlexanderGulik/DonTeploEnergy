import { HOST } from '../config/URLs';
import api from './axios';
import { OutageI, CreateOutageDto, UpdateOutageDto } from '../types/outage.types';

export const OutageService = {
    getAll: async (page?: number, limit?: number) => {
        let url = `${HOST}/outages`;
        if (page && limit) {
            url += `?page=${page}&limit=${limit}`;
        }
        const response = await api.get(url);
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`${HOST}/outages/${id}`);
        return response.data;
    },

    create: async (data: CreateOutageDto) => {
        const response = await api.post(`${HOST}/outages/create`, data);
        return response.data;
    },

    update: async (data: UpdateOutageDto) => {
        const { id, ...updateData } = data;
        const response = await api.put(`${HOST}/outages/update/${id}`, updateData);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`${HOST}/outages/delete/${id}`);
        return response.data;
    },

   };

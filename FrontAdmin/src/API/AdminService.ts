// src/API/AdminService.ts
import { HOST } from '../config/URLs';
import api from './axios';
import { StatisticsResponseI, OrdersResponseI, OrdersTonResponseI } from '../types/response.types';
import { AdminI, CreateAdminDto, UpdateAdminDto, AdminsResponse } from '../types/admin.types';

export const AdminService = {
  getStatistics: async () => {
    const response = await api.get<StatisticsResponseI>(`${HOST}/admin/statistic`);
    return response.data;
  },

  
  getAll: async (page: number, limit: number, id?: string) => {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const idParams = id ? `&id=${Number(id)}` : '';
    
    
    const response = await api.get(`${HOST}/admin/admin?page=${pageNum}&limit=${limitNum}${idParams}`);
    return response.data;
  },

  create: async (data: CreateAdminDto) => {
    const response = await api.post(`${HOST}/admin/create`, data);
    return response.data;
  },

  update: async (id: string, data: UpdateAdminDto) => {
    const response = await api.put(`${HOST}/admin/admin/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`${HOST}/admin/delete/${id}`);
    return response.data;
  },

  getUsers: async (page: number, limit: number, id?: string) => {
    const idParams = id ? `&id=${id}` : '';
    const response = await api.get(`${HOST}/admin/user?page=${page}&limit=${limit}${idParams}`);
    return response.data;
  },
};

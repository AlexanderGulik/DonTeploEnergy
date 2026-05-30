import { HOST } from '../config/URLs';
import api from './axios';

export const UserService = {

   getUsers: async (page: number, limit: number, id?: string) => {
    const idParams = id ? `&id=${id}` : '';
    const response = await api.get(`${HOST}/admin/user?page=${page}&limit=${limit}${idParams}`);
    return response.data;
  },
  };

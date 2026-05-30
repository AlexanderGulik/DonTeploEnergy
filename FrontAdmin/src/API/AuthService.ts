import axios from 'axios';
import { HOST } from '../config/URLs';
import { LoginResponseI, LogoutResponseI } from '../types/response.types';
import { LoginCredentialsI } from '../types/user.types';

export const AuthService = {
  login: async (credentials: LoginCredentialsI) => {
    const response = await axios.post<LoginResponseI>(`${HOST}/auth/login`, credentials, { withCredentials: true });
    return response.data;
  },
  logout: async () => {
    const response = await axios.post<LogoutResponseI>(`${HOST}/auth/logout`, {}, { withCredentials: true });
    return response.data;
  },
};

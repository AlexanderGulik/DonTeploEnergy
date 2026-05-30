import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdminService } from '../../API/AdminService';
import { UserI } from '../../types/users.types';
import axios from 'axios';

interface UsersState {
    users: UserI[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentPage: number;
    totalPages: number;
}

const initialState: UsersState = {
    users: [],
    status: 'idle',
    error: null,
    currentPage: 1,
    totalPages: 1
};

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async ({ page, limit, id, email }: { page: number; limit: number; id?: string; email?: string }) => {
        let response;
        if (email) {
            response = await AdminService.getUserByEmail(email);
            return response;
        } else {
            response = await AdminService.getUsers(page, limit, id);
            return response;
        }
    }
);

export const toggleUserActive = createAsyncThunk(
    'users/toggleUserActive',
    async ({ userId, isActive }: { userId: number; isActive: boolean }, { rejectWithValue }) => {
        try {
            const response = await AdminService.toggleUserStatus(userId, isActive);
            return response;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message || 'Ошибка при изменении статуса');
            }
            return rejectWithValue('Ошибка при подключении к серверу');
        }
    }
);

// Оставляем для обратной совместимости, если используется
export const addUserBalance = createAsyncThunk(
    'users/addBalance',
    async ({ id_user, newBalance }: { id_user: string; newBalance: number }, { rejectWithValue }) => {
        try {
            const response = await AdminService.addUserBalance(id_user, newBalance);
            return response;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message || 'Ошибка при обновлении баланса');
            }
            return rejectWithValue('Ошибка при подключении к серверу');
        }
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setCurrentPageUsers: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        clearErrorUsers: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Проверяем структуру ответа
                if (action.payload.data) {
                    state.users = action.payload.data;
                } else if (action.payload.users) {
                    state.users = action.payload.users;
                } else if (Array.isArray(action.payload)) {
                    state.users = action.payload;
                } else {
                    state.users = [];
                }
                
                if (action.payload.pagination) {
                    state.totalPages = Math.ceil(action.payload.pagination.total / action.payload.pagination.limit);
                } else if (action.payload.totalPages) {
                    state.totalPages = action.payload.totalPages;
                } else {
                    state.totalPages = 1;
                }
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Произошла ошибка при загрузке пользователей';
            })
            .addCase(toggleUserActive.fulfilled, (state, action) => {
                // Обновляем статус пользователя
                if (action.payload && action.payload.id_user) {
                    const index = state.users.findIndex(user => user.id_user === action.payload.id_user);
                    if (index !== -1) {
                        state.users[index].is_active = action.payload.is_active;
                    }
                }
            })
            .addCase(toggleUserActive.rejected, (state, action) => {
                state.error = action.payload as string || 'Ошибка при изменении статуса';
            })
            .addCase(addUserBalance.fulfilled, (state, action) => {
                if (action.payload && action.payload.id_user) {
                    const index = state.users.findIndex(user => user.id_user === Number(action.payload.id_user));
                    if (index !== -1) {
                        state.users[index].UserBalance = action.payload.newBalance?.toString() || state.users[index].UserBalance;
                    }
                }
            });
    }
});

export const { actions, reducer } = usersSlice;
export const { setCurrentPageUsers, clearErrorUsers } = actions;
export default reducer;

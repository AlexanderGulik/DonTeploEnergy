import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserSliceI, UserStoreI, LoginCredentialsI } from '../../types/user.types';
import axios from 'axios';
import { AuthService } from '../../API/AuthService';
import { getItemFromLocalStorage, putItemInLocalStorage } from '../../service/localStorage.service';

function isUser(store: unknown): store is UserStoreI {
  return typeof store === 'object' && store !== null && 'accessToken' in store && 'isAuthenticated' in store && 'user' in store;
}

const loadStateFromLocalStorage = (): UserStoreI => {
  try {
    const localState = getItemFromLocalStorage('store');
    if (localState !== null && isUser(localState)) {
      console.log('Loaded from localStorage:', localState);
      return localState;
    }
    return defaultState.store;
  } catch (e) {
    console.error('Ошибка при загрузке из localStorage:', e);
    return defaultState.store;
  }
};

const defaultState: UserSliceI = {
  store: {
    accessToken: null,
    isAuthenticated: false,
    user: null,
  },
  status: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk('user/login', async (credentials: LoginCredentialsI, { rejectWithValue }) => {
  try {
    const data = await AuthService.login(credentials);
    console.log('Login response:', data);
    
    const userData: UserStoreI = {
      accessToken: data.accessToken,
      isAuthenticated: true, // <- Это true
      user: {
        name: data.admin.name,
        roles: data.admin.role,
      },
    };
    
    console.log('Saving to localStorage:', userData);
    putItemInLocalStorage('store', userData);
    return userData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'Ошибка авторизации');
    }
    return rejectWithValue('Ошибка при подключении к серверу');
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    store: loadStateFromLocalStorage(),
    status: 'idle',
    error: null as string | null,
  },
  reducers: {
    userInit: (state, { payload: userInit }: { payload: UserStoreI }) => {
      if (isUser(userInit)) {
        console.log('userInit called with:', userInit);
        state.store = { ...userInit };
        state.status = 'succeeded';
      }
    },
    setUser: (state, { payload: userStore }: { payload: UserStoreI }) => {
      console.log('setUser called with:', userStore);
      state.store = { ...userStore };
    },
    logout: (state) => {
      console.log('logout called');
      state.store = {
        accessToken: null,
        isAuthenticated: false,
        user: null,
      };
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('store');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        console.log('loginUser pending');
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('loginUser fulfilled:', action.payload);
        if (action.payload) {
          state.store = { ...action.payload }; // Создаем новый объект
          state.status = 'succeeded';
          state.error = null;
          console.log('New state after login:', state.store);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log('loginUser rejected:', action.payload);
        state.status = 'failed';
        state.error = action.payload as string;
        state.store.isAuthenticated = false;
      });
  },
});

export const { actions, reducer } = userSlice;

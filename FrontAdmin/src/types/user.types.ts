export interface UserStoreI {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: UserI | null;
}

export interface UserI {
  name: string;
  roles: string;
}

export interface UserSliceI {
  store: UserStoreI;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface LoginCredentialsI {
  name: string;
  password: string;
}

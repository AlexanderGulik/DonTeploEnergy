export interface AdminI {
    id_admin: number;
    fio: string;
    name: string;
    role: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateAdminDto {
    fio: string;
    name: string;
    password: string;
    role: string;
}

export interface UpdateAdminDto {
    fio?: string;
    name?: string;
    password?: string;
    role?: string;
}

export interface AdminsResponse {
    data: AdminI[];
    total: number;
    page: number;
    pages: number;
}

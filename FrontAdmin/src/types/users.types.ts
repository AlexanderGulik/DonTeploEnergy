export interface UserI {
    id_user: number;
    email: string;
    firstname: string;
    lastname: string | null;
    phone: string | null;
    district: string;
    address: string | null;
    is_active: boolean;
    created_at: string;
    last_login: string | null;
    id_district: number | null;
}

export interface UserDisplayI extends UserI {
    fullName: string;
}

export interface UserActionRequest {
    userId: number;
    action: 'toggle_active' | 'update_district' | 'other';
    value?: any;
}

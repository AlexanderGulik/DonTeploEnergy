export type FormStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface NullableInt {
    Int64: number;
    Valid: boolean;
}

export interface FormI {
    ID_form: number;
    FIO: string;
    Address: string;
    Phone: string;
    Data: string;
    ID_user: number;
    ID_admin: NullableInt;
    Status: FormStatus;
}

export interface ChatMessageI {
    id: number;
    form_id: number;
    sender_id: number;
    sender_type: 'admin' | 'user';
    message: string;
    created_at: string;
    is_read: boolean;
}

export interface SendMessageDto {
    form_id: number;
    admin_id: number;
    message: string;
}

export interface TakeFormDto {
    name_form: string;
    id_form: number;
}

export interface UpdateFormStatusDto {
    formId: number;
    formType: string;
    status: FormStatus;
    adminId: number;
}

export const FormStatusLabels: Record<FormStatus, string> = {
    'pending': 'Ожидает',
    'active': 'В работе',
    'completed': 'Завершена'
};

export const FormStatusColors: Record<FormStatus, string> = {
    'pending': '#FF9800', // оранжевый
    'active': '#2196F3', // синий
    'completed': '#4CAF50' // зеленый
};

import { HOST } from '../config/URLs';
import api from './axios';
import { FormI, ChatMessageI, SendMessageDto, TakeFormDto, UpdateFormStatusDto, FormStatus } from '../types/form.types';

export const FormService = {
    getAll: async (page: number, limit: number, formType: string = 'form_emergency', statuses?: FormStatus[]) => {
        let url = `${HOST}/admin/form?page=${page}&limit=${limit}&form=${formType}`;
        
        if (statuses && statuses.length > 0) {
            url += `&statuses=${statuses.join(',')}`;
        }
        
        const response = await api.get(url);
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`${HOST}/api/admin/form/${id}`);
        return response.data;
    },

    takeForm: async (data: TakeFormDto) => {
        console.log('Sending to backend:', data);
        
        if (!data.id_form || !data.name_form) {
            console.error('Missing required fields:', data);
            throw new Error('id_form and name_form are required');
        }
        
        const response = await api.post(`${HOST}/admin/form/take`, {
            FormId: data.id_form,
            FormType: data.name_form
        });
        return response.data;
    },

 

   updateStatus: async (data: UpdateFormStatusDto) => {
    console.log('Updating form status:', data);
    
    const response = await api.put(`${HOST}/admin/form/update`, {
        formId: data.formId,
        formType: data.formType,
        status: data.status,
        adminId: data.adminId
    });
    return response.data;
},    
// === ЧАТ ===
    getChatMessages: async (formId: number) => {
        const response = await api.get(`${HOST}/admin/form/${formId}/chat`);
        return response.data;
    },

    sendMessage: async (data: SendMessageDto) => {
      console.log(data)
        const response = await api.post(`${HOST}/admin/form/chat/send`, data);
        return response.data;
    },

    markMessagesAsRead: async (formId: number, adminId: number) => {
        const response = await api.post(`${HOST}/api/admin/form/${formId}/chat/read`, { adminId });
        return response.data;
    },

    getUnreadCount: async (adminId: number) => {
        const response = await api.get(`${HOST}/api/admin/form/chat/unread/${adminId}`);
        return response.data;
    }
};

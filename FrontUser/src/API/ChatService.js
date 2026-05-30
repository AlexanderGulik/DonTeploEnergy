// src/API/ChatService.js
import axios from './axios';

export const chatAPI = {
    getMessages: async (formId) => {
        const response = await axios.get(`/user/form/${formId}/chat`);
        return response.data;
    },

    sendMessage: async (formId, message) => {
      console.log(formId)
        const response = await axios.post('/user/form/chat/send', {
            form_id: Number(formId),
            message: message
        });
        return response.data;
    }
};

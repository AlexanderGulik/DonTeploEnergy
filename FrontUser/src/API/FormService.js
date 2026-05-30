import axios from './axios';

export const form_create = {
  pullForm: async (form_type, address, phone, data, userId) => {
    try {
      const response = await axios.post('/forms/create', {
        form_type,
        address,
        phone,
        data, 
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Emergency form error:', error);
      throw error;
    }
  }
};


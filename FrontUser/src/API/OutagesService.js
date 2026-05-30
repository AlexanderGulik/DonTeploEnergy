import axios from './axios';

export const Outages = {
  getOutages: async () => {
    try {
      const response = await axios.get('/outages');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}




import axios from './axios';

export const Tariffs = {
  getTariffs: async () => {
    try {
      const response = await axios.get('/tariffs');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}



// src/API/ProfileService.js
import axios from './axios';

export const profileAPI = {
  getProfile: async () => {
    try {
      const response = await axios.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Error loading profile:', error);
      throw error;
    }
  },
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await axios.post('/auth/change-password', {
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
 
 getMyApplications: async (page = 1) => {
        try {
            const response = await axios.get(`/applications?page=${page}`);
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return response.data;
        } catch (error) {
            console.error('Failed to load applications:', error);
            return [];
        }
    },


  updateProfile: async (profileData) => {
    try {
      console.log(profileData)
      const response = await axios.put('/auth/profile/update', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};

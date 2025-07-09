import axios from './axios-config';

export const userService = {
  // Récupérer les informations de l'utilisateur
  async getUserInfo(userId) {
    try {
      const response = await axios.get(`/auth/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour les informations de l'utilisateur
  async updateUser(userId, userData) {
    try {
      const response = await axios.put(`/auth/user/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Supprimer le compte utilisateur
  async deleteUser(userId) {
    try {
      const response = await axios.delete(`/auth/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 
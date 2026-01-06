import axios from 'axios';

const API_URL = 'https://sharespace-backend-xh5c.onrender.com';

// --- 1. Export authAPI (Fixes your error) ---
export const authAPI = {
  login: async (credentials) => {
    // credentials = { email, password }
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  },
  register: async (userData) => {
    // userData = { username, email, password }
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  }
};

// --- 2. Export userAPI (For profile updates) ---
export const userAPI = {
  updateProfile: async (formData) => {
    const token = localStorage.getItem('token');
    return await axios.put(`${API_URL}/user/profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
        // Do NOT set Content-Type here manually
      }
    });
  },
  
  getMatches: async () => {
    const token = localStorage.getItem('token');
    return await axios.get(`${API_URL}/user/matches`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
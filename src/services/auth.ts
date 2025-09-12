import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const authApi = {
  getNonce: async (address: string) => {
    const response = await axios.get(`${API_BASE_URL}/auth/nonce`, {
      params: { address }
    });
    return response.data;
  },
  
  login: async (address: string, signature: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      address,
      signature
    });
    return response.data;
  }
};
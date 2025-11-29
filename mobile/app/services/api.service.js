import { API_CONFIG } from '../config/api.config';
import { getToken, setToken, removeToken } from './storage.service';

class ApiService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = getToken();
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur de requête');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  async register(email, password, fullName) {
    const data = await this.request(API_CONFIG.ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
      }),
    });
    
    if (data.token) {
      setToken(data.token);
    }
    
    return data;
  }

  async login(email, password) {
    const data = await this.request(API_CONFIG.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });
    
    if (data.token) {
      setToken(data.token);
    }
    
    return data;
  }

  async logout() {
    try {
      await this.request(API_CONFIG.ENDPOINTS.LOGOUT, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      removeToken();
    }
  }

  async getProfile() {
    return await this.request(API_CONFIG.ENDPOINTS.PROFILE, {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService();


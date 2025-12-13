import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://vakio-boky-backend.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // CORRECTION ICI : Utiliser la même clé que dans useAuth.js
    const vakioUser = localStorage.getItem('vakio_user') || sessionStorage.getItem('vakio_user');
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    let token = null;
    
    // Essayer d'abord vakio_user (format principal)
    if (vakioUser) {
      try {
        const parsed = JSON.parse(vakioUser);
        token = parsed?.token;
      } catch (e) {
        console.error('❌ Erreur parsing vakio_user:', e);
      }
    }
    
    // Sinon essayer user (format de secours)
    if (!token && user) {
      try {
        const parsed = JSON.parse(user);
        token = parsed?.token;
      } catch (e) {
        console.error('❌ Erreur parsing user:', e);
      }
    }
    
    if (token) {
      console.log('🔑 [api] Token ajouté aux headers:', token.substring(0, 20) + '...');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('⚠️ [api] Aucun token trouvé pour la requête:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion des erreurs 401 (non autorisé)
    if (error.response?.status === 401) {
      console.log('🔒 [api] Erreur 401 - Token invalide ou expiré');
      
      // Rediriger vers login si sur une page admin
      if (window.location.pathname.includes('/admin')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const apiService = {
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data = {}) => api.post(url, data),
  put: (url, data = {}) => api.put(url, data),
  delete: (url, data = {}) => api.delete(url, { data }),
  patch: (url, data = {}) => api.patch(url, data),
};

export default api;
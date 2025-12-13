// import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'https://vakio-boky-backend.onrender.com',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// api.interceptors.request.use(
//   (config) => {
//     // CORRECTION ICI : Utiliser la même clé que dans useAuth.js
//     const vakioUser = localStorage.getItem('vakio_user') || sessionStorage.getItem('vakio_user');
//     const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    
//     let token = null;
    
//     // Essayer d'abord vakio_user (format principal)
//     if (vakioUser) {
//       try {
//         const parsed = JSON.parse(vakioUser);
//         token = parsed?.token;
//       } catch (e) {
//         console.error('❌ Erreur parsing vakio_user:', e);
//       }
//     }
    
//     // Sinon essayer user (format de secours)
//     if (!token && user) {
//       try {
//         const parsed = JSON.parse(user);
//         token = parsed?.token;
//       } catch (e) {
//         console.error('❌ Erreur parsing user:', e);
//       }
//     }
    
//     if (token) {
//       console.log('🔑 [api] Token ajouté aux headers:', token.substring(0, 20) + '...');
//       config.headers.Authorization = `Bearer ${token}`;
//     } else {
//       console.log('⚠️ [api] Aucun token trouvé pour la requête:', config.url);
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Gestion des erreurs 401 (non autorisé)
//     if (error.response?.status === 401) {
//       console.log('🔒 [api] Erreur 401 - Token invalide ou expiré');
      
//       // Rediriger vers login si sur une page admin
//       if (window.location.pathname.includes('/admin')) {
//         window.location.href = '/login';
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// export const apiService = {
//   get: (url, params = {}) => api.get(url, { params }),
//   post: (url, data = {}) => api.post(url, data),
//   put: (url, data = {}) => api.put(url, data),
//   delete: (url, data = {}) => api.delete(url, { data }),
//   patch: (url, data = {}) => api.patch(url, data),
// };

// export default api;
// api.js - CORRECTION ULTIME (cherche authToken)
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://vakio-boky-backend.onrender.com',
  timeout: 10000,
});

// FONCTION POUR TROUVER LE TOKEN
const findToken = () => {
  console.log('🔍 Recherche du token...');
  
  // 1. D'ABORD authToken (VOTRE FORMAT)
  let token = localStorage.getItem('authToken');
  if (token) {
    console.log('✅ Token trouvé: authToken (localStorage)');
    return token;
  }
  
  // 2. Ensuite sessionStorage
  token = sessionStorage.getItem('authToken');
  if (token) {
    console.log('✅ Token trouvé: authToken (sessionStorage)');
    return token;
  }
  
  // 3. Anciens formats pour compatibilité
  const oldFormats = ['vakio_token', 'token', 'vakioToken'];
  for (const key of oldFormats) {
    token = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (token) {
      console.log(`✅ Token trouvé: ${key}`);
      return token;
    }
  }
  
  // 4. Dans les objets JSON
  const jsonKeys = ['vakio_user', 'user'];
  for (const key of jsonKeys) {
    const item = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (item) {
      try {
        const parsed = JSON.parse(item);
        if (parsed?.token) {
          console.log(`✅ Token trouvé: ${key}.token`);
          return parsed.token;
        }
      } catch (e) {
        // Pas du JSON valide
      }
    }
  }
  
  console.log('❌ AUCUN TOKEN TROUVÉ !');
  console.log('   - authToken:', localStorage.getItem('authToken') ? 'OUI' : 'NON');
  console.log('   - vakio_token:', localStorage.getItem('vakio_token') ? 'OUI' : 'NON');
  console.log('   - vakio_user:', localStorage.getItem('vakio_user') ? 'OUI' : 'NON');
  
  return null;
};

// Intercepteur de requête
api.interceptors.request.use(
  (config) => {
    const token = findToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
    } else {
      console.warn('⚠️ Requête sans token:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔒 Session expirée - Redirection vers login');
      
      // Nettoyer tous les tokens
      ['authToken', 'vakio_token', 'token', 'vakio_user', 'user'].forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // Rediriger
      if (window.location.pathname.includes('/admin')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
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
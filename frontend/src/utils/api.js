// // import axios from 'axios';

// // const api = axios.create({
// //   baseURL: process.env.REACT_APP_API_URL || 'https://vakio-boky-backend.onrender.com',
// //   timeout: 10000,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });

// // api.interceptors.request.use(
// //   (config) => {
// //     // CORRECTION ICI : Utiliser la même clé que dans useAuth.js
// //     const vakioUser = localStorage.getItem('vakio_user') || sessionStorage.getItem('vakio_user');
// //     const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    
// //     let token = null;
    
// //     // Essayer d'abord vakio_user (format principal)
// //     if (vakioUser) {
// //       try {
// //         const parsed = JSON.parse(vakioUser);
// //         token = parsed?.token;
// //       } catch (e) {
// //         console.error('❌ Erreur parsing vakio_user:', e);
// //       }
// //     }
    
// //     // Sinon essayer user (format de secours)
// //     if (!token && user) {
// //       try {
// //         const parsed = JSON.parse(user);
// //         token = parsed?.token;
// //       } catch (e) {
// //         console.error('❌ Erreur parsing user:', e);
// //       }
// //     }
    
// //     if (token) {
// //       console.log('🔑 [api] Token ajouté aux headers:', token.substring(0, 20) + '...');
// //       config.headers.Authorization = `Bearer ${token}`;
// //     } else {
// //       console.log('⚠️ [api] Aucun token trouvé pour la requête:', config.url);
// //     }
    
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   }
// // );

// // api.interceptors.response.use(
// //   (response) => {
// //     return response;
// //   },
// //   (error) => {
// //     // Gestion des erreurs 401 (non autorisé)
// //     if (error.response?.status === 401) {
// //       console.log('🔒 [api] Erreur 401 - Token invalide ou expiré');
      
// //       // Rediriger vers login si sur une page admin
// //       if (window.location.pathname.includes('/admin')) {
// //         window.location.href = '/login';
// //       }
// //     }
    
// //     return Promise.reject(error);
// //   }
// // );

// // export const apiService = {
// //   get: (url, params = {}) => api.get(url, { params }),
// //   post: (url, data = {}) => api.post(url, data),
// //   put: (url, data = {}) => api.put(url, data),
// //   delete: (url, data = {}) => api.delete(url, { data }),
// //   patch: (url, data = {}) => api.patch(url, data),
// // };

// // export default api;
// // api.js - CORRECTION ULTIME (cherche authToken)
// import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'https://vakio-boky-backend.onrender.com',
//   timeout: 10000,
// });

// // FONCTION POUR TROUVER LE TOKEN
// const findToken = () => {
//   console.log('🔍 Recherche du token...');
  
//   // 1. D'ABORD authToken (VOTRE FORMAT)
//   let token = localStorage.getItem('authToken');
//   if (token) {
//     console.log('✅ Token trouvé: authToken (localStorage)');
//     return token;
//   }
  
//   // 2. Ensuite sessionStorage
//   token = sessionStorage.getItem('authToken');
//   if (token) {
//     console.log('✅ Token trouvé: authToken (sessionStorage)');
//     return token;
//   }
  
//   // 3. Anciens formats pour compatibilité
//   const oldFormats = ['vakio_token', 'token', 'vakioToken'];
//   for (const key of oldFormats) {
//     token = localStorage.getItem(key) || sessionStorage.getItem(key);
//     if (token) {
//       console.log(`✅ Token trouvé: ${key}`);
//       return token;
//     }
//   }
  
//   // 4. Dans les objets JSON
//   const jsonKeys = ['vakio_user', 'user'];
//   for (const key of jsonKeys) {
//     const item = localStorage.getItem(key) || sessionStorage.getItem(key);
//     if (item) {
//       try {
//         const parsed = JSON.parse(item);
//         if (parsed?.token) {
//           console.log(`✅ Token trouvé: ${key}.token`);
//           return parsed.token;
//         }
//       } catch (e) {
//         // Pas du JSON valide
//       }
//     }
//   }
  
//   console.log('❌ AUCUN TOKEN TROUVÉ !');
//   console.log('   - authToken:', localStorage.getItem('authToken') ? 'OUI' : 'NON');
//   console.log('   - vakio_token:', localStorage.getItem('vakio_token') ? 'OUI' : 'NON');
//   console.log('   - vakio_user:', localStorage.getItem('vakio_user') ? 'OUI' : 'NON');
  
//   return null;
// };

// // Intercepteur de requête
// api.interceptors.request.use(
//   (config) => {
//     const token = findToken();
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       config.headers['Content-Type'] = 'application/json';
//     } else {
//       console.warn('⚠️ Requête sans token:', config.url);
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Intercepteur de réponse
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.log('🔒 Session expirée - Redirection vers login');
      
//       // Nettoyer tous les tokens
//       ['authToken', 'vakio_token', 'token', 'vakio_user', 'user'].forEach(key => {
//         localStorage.removeItem(key);
//         sessionStorage.removeItem(key);
//       });
      
//       // Rediriger
//       if (window.location.pathname.includes('/admin')) {
//         setTimeout(() => {
//           window.location.href = '/login';
//         }, 100);
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
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://vakio-boky-backend.onrender.com',
  timeout: 10000,
});

const findToken = () => {
  console.log('🔍 Recherche du token pour les routes admin...');
  
  // 1. PRIORITÉ ABSOLUE : auth_token (c'est VOTRE format actuel)
  let token = localStorage.getItem('auth_token');
  if (token) {
    console.log('✅ Token trouvé: auth_token (localStorage)');
    return token;
  }
  
  // 2. SessionStorage
  token = sessionStorage.getItem('auth_token');
  if (token) {
    console.log('✅ Token trouvé: auth_token (sessionStorage)');
    return token;
  }
  
  // 3. Vérification de vakio_user (objet JSON)
  const vakioUser = localStorage.getItem('vakio_user') || sessionStorage.getItem('vakio_user');
  if (vakioUser) {
    try {
      const parsed = JSON.parse(vakioUser);
      if (parsed?.token) {
        console.log('✅ Token trouvé: vakio_user.token');
        return parsed.token;
      }
    } catch (e) {
      console.warn('Erreur parsing vakio_user:', e);
    }
  }
  
  // 4. Vérification de user (objet JSON)
  const user = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      if (parsed?.token) {
        console.log('✅ Token trouvé: user.token');
        return parsed.token;
      }
    } catch (e) {
      console.warn('Erreur parsing user:', e);
    }
  }
  
  // 5. Anciens formats pour compatibilité
  const oldFormats = ['vakio_token', 'token', 'authToken', 'jwt_token'];
  for (const key of oldFormats) {
    token = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (token) {
      console.log(`✅ Token trouvé: ${key} (ancien format)`);
      return token;
    }
  }
  
  console.log('❌ Aucun token trouvé ! Voici ce qui existe:');
  console.log('   - auth_token:', localStorage.getItem('auth_token') ? 'OUI' : 'NON');
  console.log('   - vakio_user:', localStorage.getItem('vakio_user') ? 'OUI' : 'NON');
  console.log('   - user:', localStorage.getItem('user') ? 'OUI' : 'NON');
  
  return null;
};

// Intercepteur de requête AVEC LOGGING DÉTAILLÉ
api.interceptors.request.use(
  (config) => {
    // Si c'est une requête admin, on doit avoir un token
    const isAdminRoute = config.url && config.url.includes('/api/admin/');
    
    if (isAdminRoute) {
      console.log(`🔐 Requête ADMIN détectée: ${config.url}`);
      const token = findToken();
      
      if (token) {
        console.log(`✅ Token ajouté aux headers: ${token.substring(0, 30)}...`);
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['Content-Type'] = 'application/json';
        
        // LOG POUR DÉBOGUAGE
        console.log('📋 Headers envoyés:', {
          Authorization: config.headers.Authorization?.substring(0, 40) + '...',
          'Content-Type': config.headers['Content-Type']
        });
      } else {
        console.error('❌ CRITIQUE: Requête admin sans token !');
        console.log('La requête va échouer avec "Token manquant"');
        
        // OPTION 1: Bloque la requête (recommandé)
        // return Promise.reject(new Error('Token manquant pour la route admin'));
        
        // OPTION 2: Continue sans token (pour test)
        console.warn('⚠️ Continuation sans token (pour test uniquement)');
      }
    } else {
      // Pour les routes non-admin, on tente quand même d'ajouter un token s'il existe
      const token = findToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse AMÉLIORÉ
api.interceptors.response.use(
  (response) => {
    // Log pour les réponses admin
    if (response.config.url.includes('/api/admin/')) {
      console.log(`✅ Réponse ADMIN reçue: ${response.config.url} - Status: ${response.status}`);
    }
    return response;
  },
  (error) => {
    // Log détaillé des erreurs
    const url = error.config?.url || 'URL inconnue';
    const status = error.response?.status;
    const data = error.response?.data;
    
    console.error(`❌ Erreur API: ${url} - Status: ${status}`);
    console.error('Détails:', data);
    
    if (status === 401) {
      console.log('🔒 Erreur 401 - Token invalide ou expiré');
      console.log('   - Vérifiez que votre token est valide');
      console.log('   - Vérifiez la console pour voir quel token a été envoyé');
      
      // Nettoyage des tokens
      const tokensToRemove = ['auth_token', 'vakio_user', 'user', 'vakio_token', 'token'];
      tokensToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // Redirection si sur page admin
      if (window.location.pathname.includes('/admin')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
    }
    
    if (status === 403) {
      console.error('🔒 Erreur 403 - Accès refusé');
      console.error('   Raison:', data?.error || data?.message || 'Inconnue');
      console.error('   Code:', data?.code || 'N/A');
      
      // Message utilisateur spécifique pour "Token manquant"
      if (data?.code === 'NO_TOKEN') {
        console.error('💡 SOLUTION: Le header Authorization n\'est pas envoyé au backend');
        console.error('   Vérifiez que findToken() retourne bien un token valide');
        console.error('   Vérifiez que le header Authorization est bien formaté: "Bearer {token}"');
      }
    }
    
    return Promise.reject(error);
  }
);

export const apiService = {
  get: (url, params = {}) => {
    console.log(`📥 GET: ${url}`, params);
    return api.get(url, { params });
  },
  post: (url, data = {}) => {
    console.log(`📤 POST: ${url}`, data);
    return api.post(url, data);
  },
  put: (url, data = {}) => {
    console.log(`🔄 PUT: ${url}`, data);
    return api.put(url, data);
  },
  delete: (url, data = {}) => {
    console.log(`🗑️ DELETE: ${url}`, data);
    return api.delete(url, { data });
  },
  patch: (url, data = {}) => {
    console.log(`🔧 PATCH: ${url}`, data);
    return api.patch(url, data);
  },
};

export default api;
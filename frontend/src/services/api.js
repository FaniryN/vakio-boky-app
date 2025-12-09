// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'https://vakio-boky-backend.onrender.com/api',
// });

// // Intercepteur pour ajouter le token aux requêtes
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;

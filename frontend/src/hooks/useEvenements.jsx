// // // import { useState, useEffect } from 'react';
// // // import { useAuth } from './useAuth';

// // // export const useEvenements = () => {
// // //   const [events, setEvents] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState(null);
// // //   const { user } = useAuth();

// // //   const API_BASE_URL = 'https://vakio-boky-backend.onrender.com/api';

// // //   const fetchEvents = async () => {
// // //     setLoading(true);
// // //     setError(null);
    
// // //     try {
// // //       const response = await fetch(`${API_BASE_URL}/events`);
      
// // //       if (!response.ok) {
// // //         throw new Error(`Erreur ${response.status}`);
// // //       }

// // //       const data = await response.json();

// // //       if (data.success) {
// // //         setEvents(data.events || []);
// // //       } else {
// // //         throw new Error(data.error || 'Erreur inconnue');
// // //       }
// // //     } catch (err) {
// // //       setError(err.message);
// // //       console.error('❌ Erreur récupération événements:', err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const createEvent = async (eventData) => {
// // //     setLoading(true);
// // //     setError(null);
    
// // //     try {
// // //       const response = await fetch(`${API_BASE_URL}/events`, {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //           'Authorization': `Bearer ${user?.token}`
// // //         },
// // //         body: JSON.stringify(eventData)
// // //       });

// // //       const data = await response.json();

// // //       if (!response.ok) {
// // //         throw new Error(data.error || `Erreur ${response.status}`);
// // //       }

// // //       if (data.success) {
// // //         await fetchEvents(); // Recharger la liste
// // //         return data.event;
// // //       } else {
// // //         throw new Error(data.error || 'Erreur création événement');
// // //       }
// // //     } catch (err) {
// // //       setError(err.message);
// // //       console.error('❌ Erreur création événement:', err);
// // //       throw err;
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const registerForEvent = async (eventId) => {
// // //     setLoading(true);
// // //     setError(null);
    
// // //     try {
// // //       const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
// // //         method: 'POST',
// // //         headers: {
// // //           'Authorization': `Bearer ${user?.token}`
// // //         }
// // //       });

// // //       const data = await response.json();

// // //       if (!response.ok) {
// // //         throw new Error(data.error || `Erreur ${response.status}`);
// // //       }

// // //       if (data.success) {
// // //         await fetchEvents(); // Recharger pour mettre à jour les compteurs
// // //         return data.registration;
// // //       } else {
// // //         throw new Error(data.error || 'Erreur inscription');
// // //       }
// // //     } catch (err) {
// // //       setError(err.message);
// // //       console.error('❌ Erreur inscription événement:', err);
// // //       throw err;
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchEvents();
// // //   }, []);

// // //   return {
// // //     events,
// // //     loading,
// // //     error,
// // //     fetchEvents,
// // //     createEvent,
// // //     registerForEvent
// // //   };
// // // };
// // import { useState, useEffect } from 'react';
// // import { useAuth } from './useAuth';

// // export const useEvenements = () => {
// //   const [events, setEvents] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const { user } = useAuth();

// //   const API_BASE_URL = 'https://vakio-boky-backend.onrender.com/api';

// //   const fetchEvents = async () => {
// //     setLoading(true);
// //     setError(null);
    
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/events`);
      
// //       if (!response.ok) {
// //         throw new Error(`Erreur ${response.status}`);
// //       }

// //       const data = await response.json();

// //       if (data.success) {
// //         setEvents(data.events || []);
// //       } else {
// //         throw new Error(data.error || 'Erreur inconnue');
// //       }
// //     } catch (err) {
// //       setError(err.message);
// //       console.error('❌ Erreur récupération événements:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const registerForEvent = async (eventId) => {
// //     setLoading(true);
// //     setError(null);
    
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
// //         method: 'POST',
// //         headers: {
// //           'Authorization': `Bearer ${user?.token}`
// //         }
// //       });

// //       const data = await response.json();

// //       if (!response.ok) {
// //         throw new Error(data.error || `Erreur ${response.status}`);
// //       }

// //       if (data.success) {
// //         await fetchEvents(); // Recharger pour mettre à jour les compteurs
// //         return data.registration;
// //       } else {
// //         throw new Error(data.error || 'Erreur inscription');
// //       }
// //     } catch (err) {
// //       setError(err.message);
// //       console.error('❌ Erreur inscription événement:', err);
// //       throw err;
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchEvents();
// //   }, []);

// //   return {
// //     events,
// //     loading,
// //     error,
// //     fetchEvents,
// //     registerForEvent
// //   };
// // };

// import { useState, useEffect } from 'react';

// export const useEvenements = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Récupérer tous les événements (public)
//   const fetchEvents = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch('https://vakio-boky-backend.onrender.com/api/events');
//       const data = await response.json();
      
//       if (data.success) {
//         setEvents(data.events || []);
//       } else {
//         throw new Error(data.error || 'Erreur lors du chargement des événements');
//       }
//     } catch (err) {
//       console.error('❌ Erreur fetchEvents:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Récupérer tous les événements (admin - avec tous les statuts)
//   const fetchAdminEvents = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch('https://vakio-boky-backend.onrender.com/api/events/admin/events', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
      
//       if (data.success) {
//         setEvents(data.events || []);
//       } else {
//         throw new Error(data.error || 'Erreur lors du chargement des événements admin');
//       }
//     } catch (err) {
//       console.error('❌ Erreur fetchAdminEvents:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Créer un événement
//   const createEvent = async (eventData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch('https://vakio-boky-backend.onrender.com/api/events', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(eventData)
//       });

//       const data = await response.json();

//       if (data.success) {
//         await fetchAdminEvents(); // Recharger la liste
//         return { success: true, event: data.event };
//       } else {
//         throw new Error(data.error || 'Erreur lors de la création');
//       }
//     } catch (err) {
//       console.error('❌ Erreur createEvent:', err);
//       setError(err.message);
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Modifier un événement
//   const updateEvent = async (eventId, updates) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/${eventId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(updates)
//       });

//       const data = await response.json();

//       if (data.success) {
//         await fetchAdminEvents(); // Recharger la liste
//         return { success: true, event: data.event };
//       } else {
//         throw new Error(data.error || 'Erreur lors de la modification');
//       }
//     } catch (err) {
//       console.error('❌ Erreur updateEvent:', err);
//       setError(err.message);
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Supprimer un événement
//   const deleteEvent = async (eventId) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/${eventId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();

//       if (data.success) {
//         await fetchAdminEvents(); // Recharger la liste
//         return { success: true };
//       } else {
//         throw new Error(data.error || 'Erreur lors de la suppression');
//       }
//     } catch (err) {
//       console.error('❌ Erreur deleteEvent:', err);
//       setError(err.message);
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Approuver un événement
//   const approveEvent = async (eventId) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/admin/${eventId}/approve`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();

//       if (data.success) {
//         await fetchAdminEvents(); // Recharger la liste
//         return { success: true, event: data.event };
//       } else {
//         throw new Error(data.error || 'Erreur lors de l\'approbation');
//       }
//     } catch (err) {
//       console.error('❌ Erreur approveEvent:', err);
//       setError(err.message);
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Rejeter un événement
//   const rejectEvent = async (eventId, reason) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/admin/${eventId}/reject`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ reason })
//       });

//       const data = await response.json();

//       if (data.success) {
//         await fetchAdminEvents(); // Recharger la liste
//         return { success: true, event: data.event };
//       } else {
//         throw new Error(data.error || 'Erreur lors du rejet');
//       }
//     } catch (err) {
//       console.error('❌ Erreur rejectEvent:', err);
//       setError(err.message);
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mettre en avant un événement
//   const featureEvent = async (eventId, featured) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/admin/${eventId}/feature`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ featured })
//       });

//       const data = await response.json();

//       if (data.success) {
//         await fetchAdminEvents(); // Recharger la liste
//         return { success: true, event: data.event };
//       } else {
//         throw new Error(data.error || 'Erreur lors de la mise à jour');
//       }
//     } catch (err) {
//       console.error('❌ Erreur featureEvent:', err);
//       setError(err.message);
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Récupérer les statistiques des événements
//   const fetchEventAnalytics = async (range = '30d') => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/admin/analytics?range=${range}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
      
//       if (data.success) {
//         return { success: true, analytics: data.analytics };
//       } else {
//         throw new Error(data.error || 'Erreur lors du chargement des statistiques');
//       }
//     } catch (err) {
//       console.error('❌ Erreur fetchEventAnalytics:', err);
//       setError(err.message);
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Récupérer les inscriptions d'un événement
//   const fetchEventRegistrations = async (eventId) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/${eventId}/registrations`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();

//       if (data.success) {
//         return { success: true, registrations: data.registrations };
//       } else {
//         throw new Error(data.error || 'Erreur lors du chargement des inscriptions');
//       }
//     } catch (err) {
//       console.error('❌ Erreur fetchEventRegistrations:', err);
//       setError(err.message);
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // S'inscrire à un événement
//   const registerToEvent = async (eventId) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/${eventId}/register`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();

//       if (data.success) {
//         return { success: true, registration: data.registration, message: data.message };
//       } else {
//         throw new Error(data.error || 'Erreur lors de l\'inscription');
//       }
//     } catch (err) {
//       console.error('❌ Erreur registerToEvent:', err);
//       setError(err.message);
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Récupérer un événement par ID
//   const fetchEventById = async (eventId) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/${eventId}`);
//       const data = await response.json();

//       if (data.success) {
//         return { success: true, event: data.event };
//       } else {
//         throw new Error(data.error || 'Événement non trouvé');
//       }
//     } catch (err) {
//       console.error('❌ Erreur fetchEventById:', err);
//       setError(err.message);
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Réinitialiser les erreurs
//   const clearError = () => {
//     setError(null);
//   };

//   return {
//     // State
//     events,
//     loading,
//     error,
    
//     // Actions publiques
//     fetchEvents,
//     fetchEventById,
//     registerToEvent,
    
//     // Actions d'administration
//     fetchAdminEvents,
//     createEvent,
//     updateEvent,
//     deleteEvent,
//     approveEvent,
//     rejectEvent,
//     featureEvent,
//     fetchEventAnalytics,
//     fetchEventRegistrations,
    
//     // Utilitaires
//     clearError
//   };
// };
import { useState, useEffect } from 'react';

export const useEvenements = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction utilitaire pour les requêtes fetch
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('vakio_token');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  };

  // Récupérer tous les événements (public)
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth('https://vakio-boky-backend.onrender.com/api/events');
      
      if (data.success) {
        setEvents(data.events || []);
      } else {
        throw new Error(data.error || 'Erreur lors du chargement des événements');
      }
    } catch (err) {
      console.error('❌ Erreur fetchEvents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer tous les événements (admin - avec tous les statuts)
  const fetchAdminEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth('https://vakio-boky-backend.onrender.com/api/events/admin/events');
      
      if (data.success) {
        setEvents(data.events || []);
      } else {
        throw new Error(data.error || 'Erreur lors du chargement des événements admin');
      }
    } catch (err) {
      console.error('❌ Erreur fetchAdminEvents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Créer un événement
  const createEvent = async (eventData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth('https://vakio-boky-backend.onrender.com/api/events', {
        method: 'POST',
        body: JSON.stringify(eventData)
      });

      if (data.success) {
        await fetchAdminEvents(); // Recharger la liste
        return { success: true, event: data.event };
      } else {
        throw new Error(data.error || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error('❌ Erreur createEvent:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Modifier un événement
  const updateEvent = async (eventId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`https://vakio-boky-backend.onrender.com/api/events/${eventId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      if (data.success) {
        await fetchAdminEvents(); // Recharger la liste
        return { success: true, event: data.event };
      } else {
        throw new Error(data.error || 'Erreur lors de la modification');
      }
    } catch (err) {
      console.error('❌ Erreur updateEvent:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un événement
  const deleteEvent = async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`https://vakio-boky-backend.onrender.com/api/events/${eventId}`, {
        method: 'DELETE'
      });

      if (data.success) {
        await fetchAdminEvents(); // Recharger la liste
        return { success: true, message: data.message };
      } else {
        throw new Error(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('❌ Erreur deleteEvent:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Approuver un événement
  const approveEvent = async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`https://vakio-boky-backend.onrender.com/api/events/admin/${eventId}/approve`, {
        method: 'PUT'
      });

      if (data.success) {
        await fetchAdminEvents(); // Recharger la liste
        return { success: true, event: data.event };
      } else {
        throw new Error(data.error || 'Erreur lors de l\'approbation');
      }
    } catch (err) {
      console.error('❌ Erreur approveEvent:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Rejeter un événement
  const rejectEvent = async (eventId, reason) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`https://vakio-boky-backend.onrender.com/api/events/admin/${eventId}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ reason })
      });

      if (data.success) {
        await fetchAdminEvents(); // Recharger la liste
        return { success: true, event: data.event };
      } else {
        throw new Error(data.error || 'Erreur lors du rejet');
      }
    } catch (err) {
      console.error('❌ Erreur rejectEvent:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Mettre en avant un événement
  const featureEvent = async (eventId, featured) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`https://vakio-boky-backend.onrender.com/api/events/admin/${eventId}/feature`, {
        method: 'PUT',
        body: JSON.stringify({ featured })
      });

      if (data.success) {
        await fetchAdminEvents(); // Recharger la liste
        return { success: true, event: data.event };
      } else {
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('❌ Erreur featureEvent:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les statistiques des événements
  const fetchEventAnalytics = async (range = '30d') => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`https://vakio-boky-backend.onrender.com/api/events/admin/analytics?range=${range}`);
      
      if (data.success) {
        return { success: true, analytics: data.analytics };
      } else {
        throw new Error(data.error || 'Erreur lors du chargement des statistiques');
      }
    } catch (err) {
      console.error('❌ Erreur fetchEventAnalytics:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les inscriptions d'un événement
  const fetchEventRegistrations = async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`https://vakio-boky-backend.onrender.com/api/events/${eventId}/registrations`);

      if (data.success) {
        return { success: true, registrations: data.registrations };
      } else {
        throw new Error(data.error || 'Erreur lors du chargement des inscriptions');
      }
    } catch (err) {
      console.error('❌ Erreur fetchEventRegistrations:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // S'inscrire à un événement
  const registerToEvent = async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`https://vakio-boky-backend.onrender.com/api/events/${eventId}/register`, {
        method: 'POST'
      });

      if (data.success) {
        return { success: true, registration: data.registration, message: data.message };
      } else {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      console.error('❌ Erreur registerToEvent:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Récupérer un événement par ID
  const fetchEventById = async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`https://vakio-boky-backend.onrender.com/api/events/${eventId}`);

      if (data.success) {
        return { success: true, event: data.event };
      } else {
        throw new Error(data.error || 'Événement non trouvé');
      }
    } catch (err) {
      console.error('❌ Erreur fetchEventById:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser les erreurs
  const clearError = () => {
    setError(null);
  };

  return {
    // State
    events,
    loading,
    error,
    
    // Actions publiques
    fetchEvents,
    fetchEventById,
    registerToEvent,
    
    // Actions d'administration
    fetchAdminEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    approveEvent,
    rejectEvent,
    featureEvent,
    fetchEventAnalytics,
    fetchEventRegistrations,
    
    // Utilitaires
    clearError
  };
};
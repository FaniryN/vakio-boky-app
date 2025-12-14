import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";

export const useEvenements = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAuthHeaders, isAuthenticated } = useAuth();

  // ============ FONCTIONS PUBLIQUES ============
  
  // 1. Récupérer tous les événements (PUBLIC - pour tous)
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("📅 [useEvenements] Récupération événements publics");
      
      const response = await fetch('https://vakio-boky-backend.onrender.com/api/events/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("📊 [useEvenements] Statut public:", response.status);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ [useEvenements] Événements publics:", data.length || 0);

      setEvents(data || []);
      return { success: true, events: data };
    } catch (err) {
      console.error("❌ [useEvenements] Erreur publique:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. S'inscrire à un événement
  const registerForEvent = async (eventId) => {
    try {
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/${eventId}/register`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      const data = await response.json();
      
      if (data.success) {
        // Recharger les événements après inscription
        await fetchEvents();
      }
      
      return data;
    } catch (err) {
      console.error("❌ Erreur registerForEvent:", err);
      return { success: false, error: err.message };
    }
  };

  // ============ FONCTIONS ADMIN ============
  
  // 3. Récupérer tous les événements (ADMIN seulement)
  const fetchAdminEvents = useCallback(async () => {
    if (!isAuthenticated) {
      setError("Non authentifié");
      return { success: false, error: "Non authentifié" };
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log("🔐 [useEvenements] Récupération événements admin");
      
      const response = await fetch('https://vakio-boky-backend.onrender.com/api/events/admin/events', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      console.log("📊 [useEvenements] Statut admin:", response.status);

      if (response.status === 401) {
        setError("Session expirée");
        return { success: false, error: "Session expirée" };
      }

      if (response.status === 403) {
        setError("Accès admin requis");
        return { success: false, error: "Accès admin requis" };
      }

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ [useEvenements] Événements admin:", data.events?.length || 0);

      if (data.success) {
        setEvents(data.events || []);
        return { success: true, events: data.events };
      } else {
        setError(data.error || "Erreur inconnue");
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error("❌ [useEvenements] Erreur admin:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAuthHeaders]);

  // 4. Approuver un événement (admin)
  const approveEvent = async (eventId) => {
    try {
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/admin/${eventId}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchEvents(); // Recharger la liste publique
      }
      
      return data;
    } catch (err) {
      console.error("❌ Erreur approveEvent:", err);
      return { success: false, error: err.message };
    }
  };

  // 5. Rejeter un événement (admin)
  const rejectEvent = async (eventId, reason) => {
    try {
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/admin/${eventId}/reject`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchEvents();
      }
      
      return data;
    } catch (err) {
      console.error("❌ Erreur rejectEvent:", err);
      return { success: false, error: err.message };
    }
  };

  // 6. Mettre en avant un événement (admin)
  const featureEvent = async (eventId, featured) => {
    try {
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/admin/${eventId}/feature`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ featured })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchEvents();
      }
      
      return data;
    } catch (err) {
      console.error("❌ Erreur featureEvent:", err);
      return { success: false, error: err.message };
    }
  };

  // 7. Supprimer un événement
  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/${eventId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchEvents();
      }
      
      return data;
    } catch (err) {
      console.error("❌ Erreur deleteEvent:", err);
      return { success: false, error: err.message };
    }
  };

  // ============ RETOUR ============
  
  return {
    // État
    events,
    loading,
    error,
    
    // Fonctions PUBLIQUES (pour tous)
    fetchEvents,
    registerForEvent,
    
    // Fonctions ADMIN
    fetchAdminEvents,
    approveEvent,
    rejectEvent,
    featureEvent,
    deleteEvent
  };
};
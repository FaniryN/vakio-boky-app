import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";

export const useEvenements = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAuthHeaders, isAuthenticated } = useAuth();

  // Récupérer tous les événements (admin)
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

      console.log("📊 [useEvenements] Statut:", response.status);

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
      console.log("✅ [useEvenements] Événements:", data.events?.length || 0);

      if (data.success) {
        setEvents(data.events || []);
        return { success: true, events: data.events };
      } else {
        setError(data.error || "Erreur inconnue");
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error("❌ [useEvenements] Erreur:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAuthHeaders]);

  // Approuver un événement
  const approveEvent = async (eventId) => {
    try {
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/admin/${eventId}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAdminEvents();
      }
      
      return data;
    } catch (err) {
      console.error("❌ Erreur approveEvent:", err);
      return { success: false, error: err.message };
    }
  };

  // Rejeter un événement
  const rejectEvent = async (eventId, reason) => {
    try {
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/admin/${eventId}/reject`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAdminEvents();
      }
      
      return data;
    } catch (err) {
      console.error("❌ Erreur rejectEvent:", err);
      return { success: false, error: err.message };
    }
  };

  // Mettre en avant un événement
  const featureEvent = async (eventId, featured) => {
    try {
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/admin/${eventId}/feature`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ featured })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAdminEvents();
      }
      
      return data;
    } catch (err) {
      console.error("❌ Erreur featureEvent:", err);
      return { success: false, error: err.message };
    }
  };

  // Supprimer un événement
  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/${eventId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAdminEvents();
      }
      
      return data;
    } catch (err) {
      console.error("❌ Erreur deleteEvent:", err);
      return { success: false, error: err.message };
    }
  };

  return {
    events,
    loading,
    error,
    fetchAdminEvents,
    approveEvent,
    rejectEvent,
    featureEvent,
    deleteEvent
  };
};
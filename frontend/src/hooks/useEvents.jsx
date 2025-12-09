import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const auth = useAuth();
  const token = auth.user?.token;

  const getAuthHeaders = () => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("https://vakio-boky-backend.onrender.com/api/events", {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setEvents(data);
      return data;
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors du chargement des événements";
      setError(errorMessage);
      console.error("fetchEvents error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("https://vakio-boky-backend.onrender.com/api/events", {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      await fetchEvents();

      return data;
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la création de l'événement";
      setError(errorMessage);
      console.error("createEvent error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchEvent = async (id) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/events/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors du chargement de l'événement";
      setError(errorMessage);
      console.error("fetchEvent error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError("");
  const reset = () => {
    setEvents([]);
    setError("");
    setLoading(false);
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    fetchEvent,
    clearError,
    reset,
    setEvents,
  };
};

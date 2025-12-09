import { useState } from 'react';
import { useAuth } from './useAuth';

export function useCommentActions() {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const token = auth.user?.token;

  // LIKE/UNLIKE un commentaire
  const toggleLike = async (commentId) => {
    if (!token) return { success: false, error: "Non authentifié" };

    setLoading(true);
    try {
      const response = await fetch(
        `https://vakio-boky-backend.onrender.com/api/comments/${commentId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur like commentaire:", error);
      return { success: false, error: "Erreur de connexion" };
    } finally {
      setLoading(false);
    }
  };

  // MODIFIER un commentaire
  const updateComment = async (commentId, newContent) => {
    if (!token) return { success: false, error: "Non authentifié" };

    setLoading(true);
    try {
      const response = await fetch(
        `https://vakio-boky-backend.onrender.com/api/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contenu: newContent }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur modification commentaire:", error);
      return { success: false, error: "Erreur de connexion" };
    } finally {
      setLoading(false);
    }
  };

  // SUPPRIMER un commentaire
  const deleteComment = async (commentId) => {
    if (!token) return { success: false, error: "Non authentifié" };

    setLoading(true);
    try {
      const response = await fetch(
        `https://vakio-boky-backend.onrender.com/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Erreur suppression commentaire:", error);
      return { success: false, error: "Erreur de connexion" };
    } finally {
      setLoading(false);
    }
  };

  // RÉPONDRE à un commentaire
  const replyToComment = async (commentId, replyContent) => {
    if (!token) return { success: false, error: "Non authentifié" };

    setLoading(true);
    try {
      const response = await fetch(
        `https://vakio-boky-backend.onrender.com/api/comments/${commentId}/replies`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contenu: replyContent }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur réponse commentaire:", error);
      return { success: false, error: "Erreur de connexion" };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    toggleLike,
    updateComment,
    deleteComment,
    replyToComment,
  };
}
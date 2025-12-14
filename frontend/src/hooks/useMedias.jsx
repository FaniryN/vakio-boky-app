import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * Upload et de gestion des médias
 */
export function useMedias() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const token = auth.user?.token;

  /**
   * Upload un ou plusieurs fichiers
   * @param {FileList} fichiers
   */
  const uploadMedias = async (fichiers) => {
    if (!token) {
      return { success: false, error: "Non authentifié" };
    }

    // Vérifie qu'il y a des fichiers
    if (!fichiers || fichiers.length === 0) {
      return { success: false, error: "Aucun fichier sélectionné" };
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      for (let i = 0; i < fichiers.length; i++) {
        formData.append("fichiers", fichiers[i]);
      }

      console.log(
        "📤 [useMedias] Début upload de",
        fichiers.length,
        "fichier(s)"
      );
      // Dans useMedias.js - ligne du fetch
      const response = await fetch(
        "https://vakio-boky-backend.onrender.com/api/medias/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          signal: AbortSignal.timeout(60000), // ⬅️ Ajoutez cette ligne (60 secondes)
        }
      );

      const data = await response.json();
      console.log("📡 [useMedias] Réponse upload:", data);

      if (data.success) {
        console.log(
          " [useMedias] Upload réussi:",
          data.medias.length,
          "média(s)"
        );
        return { success: true, medias: data.medias };
      } else {
        setError(data.error);
        console.log(" [useMedias] Erreur upload:", data.error);
        return { success: false, error: data.error };
      }
    } catch (err) {
      const errorMsg = "Erreur de connexion lors de l'upload";
      setError(errorMsg);
      console.error(" [useMedias] Erreur upload:", err);
      return { success: false, error: errorMsg };
    } finally {
      setUploading(false);
    }
  };

  /**
   * @param {Number} livreId - ID du livre
   * @param {Number} mediaId - ID du média
   */
  const setLivreCouverture = async (livreId, mediaId) => {
    if (!token) {
      return { success: false, error: "Non authentifié" };
    }

    try {
      console.log("🖼️ [useMedias] Association couverture:", {
        livreId,
        mediaId,
      });

      const response = await fetch(
        `https://vakio-boky-backend.onrender.com/api/medias/livres/${livreId}/couverture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mediaId }),
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("✅ [useMedias] Couverture associée avec succès");
        return { success: true, couverture: data.couverture };
      } else {
        console.log("❌ [useMedias] Erreur association:", data.error);
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error("💥 [useMedias] Erreur association couverture:", err);
      return { success: false, error: "Erreur de connexion" };
    }
  };

  /**
   * FONCTION : deleteMedia
   * Supprime un média
   * @param {Number} mediaId - ID du média à supprimer
   */
  const deleteMedia = async (mediaId) => {
    if (!token) {
      return { success: false, error: "Non authentifié" };
    }

    try {
      console.log("🗑️ [useMedias] Suppression média:", mediaId);

      const response = await fetch(
        `https://vakio-boky-backend.onrender.com/api/medias/${mediaId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("✅ [useMedias] Média supprimé avec succès");
        return { success: true };
      } else {
        console.log("❌ [useMedias] Erreur suppression:", data.error);
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error("💥 [useMedias] Erreur suppression média:", err);
      return { success: false, error: "Erreur de connexion" };
    }
  };

  return {
    uploading,
    error,
    uploadMedias,
    setLivreCouverture,
    deleteMedia,
  };
}

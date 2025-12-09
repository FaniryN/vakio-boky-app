import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export function useProfileStatistics() {
  const [statistics, setStatistics] = useState({
    postsCount: 0,
    likesReceivedCount: 0,
    commentsMadeCount: 0,
    clubsJoinedCount: 0,
    eventsRegisteredCount: 0,
    booksPublishedCount: 0,
    excerptsCreatedCount: 0,
    booksReadCount: 0,
    totalReadingTime: 0,
    totalPagesRead: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = useAuth();
  const token = auth.user?.token;

  /**
   * Récupère les statistiques du profil utilisateur
   */
  const fetchStatistics = async () => {
    console.log("📊 [useProfileStatistics] Début fetchStatistics, token:", token);

    if (!token) {
      console.log("📊 [useProfileStatistics] Pas de token disponible");
      setError("Veuillez vous reconnecter");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("📊 [useProfileStatistics] Envoi requête avec token...");

      const response = await fetch("http://localhost:5000/api/profile/statistics", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📊 [useProfileStatistics] Réponse status:", response.status);

      const data = await response.json();
      console.log("📊 [useProfileStatistics] Données reçues:", data);

      if (data.statistics) {
        setStatistics(data.statistics);
        console.log("📊 [useProfileStatistics] Statistiques chargées:", data.statistics);
      } else {
        setError(data.error || "Erreur inconnue du serveur");
        console.log("📊 [useProfileStatistics] Erreur API:", data.error);
      }
    } catch (err) {
      console.error("📊 [useProfileStatistics] Erreur fetch:", err);
      setError("Impossible de se connecter au serveur");
    } finally {
      setLoading(false);
      console.log("📊 [useProfileStatistics] Fetch terminé");
    }
  };

  // Chargement initial des statistiques
  useEffect(() => {
    if (token) {
      console.log(
        "🎯 [useProfileStatistics] useEffect - Token présent, chargement des statistiques"
      );
      fetchStatistics();
    } else {
      console.log("🎯 [useProfileStatistics] useEffect - Pas de token, arrêt");
      setLoading(false);
    }
  }, [token]);

  // Retourner les données et fonctions
  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics,
  };
}
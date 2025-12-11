// // import { useState, useEffect } from "react";
// // import { useAuth } from "./useAuth";

// // export function useProfileStatistics() {
// //   const [statistics, setStatistics] = useState({
// //     postsCount: 0,
// //     likesReceivedCount: 0,
// //     commentsMadeCount: 0,
// //     clubsJoinedCount: 0,
// //     eventsRegisteredCount: 0,
// //     booksPublishedCount: 0,
// //     excerptsCreatedCount: 0,
// //     booksReadCount: 0,
// //     totalReadingTime: 0,
// //     totalPagesRead: 0,
// //   });
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const auth = useAuth();
// //   const token = auth.user?.token;

// //   /**
// //    * Récupère les statistiques du profil utilisateur
// //    */
// //   const fetchStatistics = async () => {
// //     console.log("📊 [useProfileStatistics] Début fetchStatistics, token:", token);

// //     if (!token) {
// //       console.log("📊 [useProfileStatistics] Pas de token disponible");
// //       setError("Veuillez vous reconnecter");
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       setError(null);

// //       console.log("📊 [useProfileStatistics] Envoi requête avec token...");

// //       const response = await fetch("https://vakio-boky-backend.onrender.com/api/profile/statistics", {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //       });

// //       console.log("📊 [useProfileStatistics] Réponse status:", response.status);

// //       const data = await response.json();
// //       console.log("📊 [useProfileStatistics] Données reçues:", data);

// //       if (data.statistics) {
// //         setStatistics(data.statistics);
// //         console.log("📊 [useProfileStatistics] Statistiques chargées:", data.statistics);
// //       } else {
// //         setError(data.error || "Erreur inconnue du serveur");
// //         console.log("📊 [useProfileStatistics] Erreur API:", data.error);
// //       }
// //     } catch (err) {
// //       console.error("📊 [useProfileStatistics] Erreur fetch:", err);
// //       setError("Impossible de se connecter au serveur");
// //     } finally {
// //       setLoading(false);
// //       console.log("📊 [useProfileStatistics] Fetch terminé");
// //     }
// //   };

// //   // Chargement initial des statistiques
// //   useEffect(() => {
// //     if (token) {
// //       console.log(
// //         "🎯 [useProfileStatistics] useEffect - Token présent, chargement des statistiques"
// //       );
// //       fetchStatistics();
// //     } else {
// //       console.log("🎯 [useProfileStatistics] useEffect - Pas de token, arrêt");
// //       setLoading(false);
// //     }
// //   }, [token]);

// //   // Retourner les données et fonctions
// //   return {
// //     statistics,
// //     loading,
// //     error,
// //     refetch: fetchStatistics,
// //   };
// // }
// import { useState, useEffect, useCallback } from "react";
// import { useAuth } from "./useAuth";

// export function useProfileStatistics() {
//   const [statistics, setStatistics] = useState({
//     postsCount: 0,
//     likesReceivedCount: 0,
//     commentsMadeCount: 0,
//     clubsJoinedCount: 0,
//     eventsRegisteredCount: 0,
//     booksPublishedCount: 0,
//     excerptsCreatedCount: 0,
//     booksReadCount: 0,
//     totalReadingTime: 0,
//     totalPagesRead: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [lastFetchTime, setLastFetchTime] = useState(null);

//   const { user, isAuthenticated } = useAuth();
//   const token = user?.token;
//   const userId = user?.id;

//   /**
//    * Vérifie si le token et l'ID utilisateur sont valides
//    */
//   const validateAuth = useCallback(() => {
//     if (!isAuthenticated || !token) {
//       console.log("🔒 [useProfileStatistics] Utilisateur non authentifié");
//       return false;
//     }

//     if (!userId || typeof userId !== 'number' || userId < 1) {
//       console.log("⚠️ [useProfileStatistics] ID utilisateur invalide:", userId);
//       return false;
//     }

//     // Vérifier que le token a un format JWT basique
//     if (typeof token !== 'string' || token.split('.').length !== 3) {
//       console.log("⚠️ [useProfileStatistics] Format de token invalide");
//       return false;
//     }

//     return true;
//   }, [isAuthenticated, token, userId]);

//   /**
//    * Récupère les statistiques du profil utilisateur
//    */
//   const fetchStatistics = useCallback(async () => {
//     console.log("📊 [useProfileStatistics] Début fetchStatistics");

//     // Validation stricte de l'authentification
//     if (!validateAuth()) {
//       setError("Session invalide. Veuillez vous reconnecter.");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log(`📊 [useProfileStatistics] Chargement stats pour user ID: ${userId}`);

//       const response = await fetch("https://vakio-boky-backend.onrender.com/api/profile/statistics", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         // Timeout après 10 secondes
//         signal: AbortSignal.timeout(10000)
//       });

//       console.log("📊 [useProfileStatistics] Réponse status:", response.status);

//       // Vérifier si la réponse est OK
//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Session expirée. Veuillez vous reconnecter.");
//         } else if (response.status === 404) {
//           throw new Error("Endpoint des statistiques non trouvé.");
//         } else {
//           throw new Error(`Erreur serveur: ${response.status} ${response.statusText}`);
//         }
//       }

//       const data = await response.json();
//       console.log("📊 [useProfileStatistics] Données reçues:", data);

//       if (data.success && data.statistics) {
//         setStatistics(data.statistics);
//         setLastFetchTime(new Date());
//         console.log("✅ [useProfileStatistics] Statistiques chargées avec succès");
//       } else {
//         setError(data.error || "Format de réponse invalide du serveur");
//         console.log("❌ [useProfileStatistics] Erreur dans la réponse:", data.error);
//       }
//     } catch (err) {
//       console.error("❌ [useProfileStatistics] Erreur fetch:", err);
      
//       // Messages d'erreur plus précis
//       if (err.name === 'AbortError') {
//         setError("La requête a pris trop de temps. Vérifiez votre connexion.");
//       } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
//         setError("Impossible de se connecter au serveur. Vérifiez votre connexion internet.");
//       } else {
//         setError(err.message || "Erreur lors du chargement des statistiques");
//       }
      
//       // Fournir des statistiques par défaut en cas d'erreur
//       setStatistics({
//         postsCount: 0,
//         likesReceivedCount: 0,
//         commentsMadeCount: 0,
//         clubsJoinedCount: 0,
//         eventsRegisteredCount: 0,
//         booksPublishedCount: 0,
//         excerptsCreatedCount: 0,
//         booksReadCount: 0,
//         totalReadingTime: 0,
//         totalPagesRead: 0,
//       });
//     } finally {
//       setLoading(false);
//       console.log("📊 [useProfileStatistics] Fetch terminé");
//     }
//   }, [validateAuth, token, userId]);

//   /**
//    * Formate les statistiques pour l'affichage
//    */
//   const getFormattedStats = useCallback(() => {
//     return {
//       postsCount: statistics.postsCount || 0,
//       likesReceivedCount: statistics.likesReceivedCount || 0,
//       commentsMadeCount: statistics.commentsMadeCount || 0,
//       clubsJoinedCount: statistics.clubsJoinedCount || 0,
//       eventsRegisteredCount: statistics.eventsRegisteredCount || 0,
//       booksPublishedCount: statistics.booksPublishedCount || 0,
//       excerptsCreatedCount: statistics.excerptsCreatedCount || 0,
//       booksReadCount: statistics.booksReadCount || 0,
//       totalReadingTime: statistics.totalReadingTime || 0,
//       totalPagesRead: statistics.totalPagesRead || 0,
      
//       // Statistiques calculées
//       totalActivity: (statistics.postsCount || 0) + (statistics.commentsMadeCount || 0) + (statistics.booksPublishedCount || 0),
//       totalEngagement: (statistics.clubsJoinedCount || 0) + (statistics.eventsRegisteredCount || 0),
//       hasAnyActivity: (statistics.postsCount || 0) > 0 || 
//                      (statistics.commentsMadeCount || 0) > 0 || 
//                      (statistics.booksPublishedCount || 0) > 0,
//     };
//   }, [statistics]);

//   /**
//    * Réinitialise les statistiques (pour logout)
//    */
//   const resetStatistics = useCallback(() => {
//     console.log("🔄 [useProfileStatistics] Réinitialisation des statistiques");
//     setStatistics({
//       postsCount: 0,
//       likesReceivedCount: 0,
//       commentsMadeCount: 0,
//       clubsJoinedCount: 0,
//       eventsRegisteredCount: 0,
//       booksPublishedCount: 0,
//       excerptsCreatedCount: 0,
//       booksReadCount: 0,
//       totalReadingTime: 0,
//       totalPagesRead: 0,
//     });
//     setError(null);
//     setLoading(true);
//     setLastFetchTime(null);
//   }, []);

//   // Chargement initial des statistiques
//   useEffect(() => {
//     let isMounted = true;

//     const loadStatistics = async () => {
//       if (!isMounted) return;

//       if (validateAuth()) {
//         console.log("🎯 [useProfileStatistics] Chargement initial des statistiques");
        
//         // Vérifier si on a déjà récupéré récemment (cache de 30 secondes)
//         if (lastFetchTime && (new Date() - lastFetchTime) < 30000) {
//           console.log("⚡ [useProfileStatistics] Utilisation du cache (moins de 30s)");
//           setLoading(false);
//           return;
//         }

//         await fetchStatistics();
//       } else {
//         console.log("⏸️ [useProfileStatistics] Pas d'authentification valide, arrêt");
//         setLoading(false);
//       }
//     };

//     loadStatistics();

//     return () => {
//       isMounted = false;
//     };
//   }, [validateAuth, fetchStatistics, lastFetchTime]);

//   // Surveiller les changements d'authentification
//   useEffect(() => {
//     if (!isAuthenticated || !userId) {
//       console.log("👋 [useProfileStatistics] Utilisateur déconnecté, réinitialisation");
//       resetStatistics();
//     }
//   }, [isAuthenticated, userId, resetStatistics]);

//   // Retourner les données et fonctions
//   return {
//     statistics: getFormattedStats(),
//     rawStatistics: statistics,
//     loading,
//     error,
//     refetch: fetchStatistics,
//     reset: resetStatistics,
//     lastFetchTime,
//     hasValidAuth: validateAuth(),
//     formattedStats: getFormattedStats(),
//   };
// }
import { useState, useEffect, useCallback } from "react";
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
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const { user, isAuthenticated } = useAuth();
  const token = user?.token;
  const userId = user?.user?.id;

  const validateAuth = useCallback(() => {
    if (!isAuthenticated || !token) {
      console.log("🔒 [useProfileStatistics] Utilisateur non authentifié");
      return false;
    }

    if (!userId || typeof userId !== 'number' || userId < 1) {
      console.log("⚠️ [useProfileStatistics] ID utilisateur invalide:", userId);
      return false;
    }

    if (typeof token !== 'string' || token.split('.').length !== 3) {
      console.log("⚠️ [useProfileStatistics] Format de token invalide");
      return false;
    }

    return true;
  }, [isAuthenticated, token, userId]);

  const fetchStatistics = useCallback(async () => {
    console.log("📊 [useProfileStatistics] Début fetchStatistics");

    if (!validateAuth()) {
      setError("Session invalide. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`📊 [useProfileStatistics] Chargement stats pour user ID: ${userId}`);

      // CORRECTION : Utiliser AbortController correctement
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch("https://vakio-boky-backend.onrender.com/api/profile/statistics", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log("📊 [useProfileStatistics] Réponse status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée. Veuillez vous reconnecter.");
        } else if (response.status === 404) {
          throw new Error("Endpoint des statistiques non trouvé.");
        } else {
          throw new Error(`Erreur serveur: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log("📊 [useProfileStatistics] Données reçues:", data);

      if (data.success && data.statistics) {
        setStatistics(data.statistics);
        setLastFetchTime(new Date());
        console.log("✅ [useProfileStatistics] Statistiques chargées avec succès");
      } else {
        setError(data.error || "Format de réponse invalide du serveur");
        console.log("❌ [useProfileStatistics] Erreur dans la réponse:", data.error);
      }
    } catch (err) {
      console.error("❌ [useProfileStatistics] Erreur fetch:", err);
      
      if (err.name === 'AbortError') {
        setError("La requête a pris trop de temps. Vérifiez votre connexion.");
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError("Impossible de se connecter au serveur. Vérifiez votre connexion internet.");
      } else {
        setError(err.message || "Erreur lors du chargement des statistiques");
      }
      
      setStatistics({
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
    } finally {
      setLoading(false);
      console.log("📊 [useProfileStatistics] Fetch terminé");
    }
  }, [validateAuth, token, userId]);

  const getFormattedStats = useCallback(() => {
    return {
      postsCount: statistics.postsCount || 0,
      likesReceivedCount: statistics.likesReceivedCount || 0,
      commentsMadeCount: statistics.commentsMadeCount || 0,
      clubsJoinedCount: statistics.clubsJoinedCount || 0,
      eventsRegisteredCount: statistics.eventsRegisteredCount || 0,
      booksPublishedCount: statistics.booksPublishedCount || 0,
      excerptsCreatedCount: statistics.excerptsCreatedCount || 0,
      booksReadCount: statistics.booksReadCount || 0,
      totalReadingTime: statistics.totalReadingTime || 0,
      totalPagesRead: statistics.totalPagesRead || 0,
      
      totalActivity: (statistics.postsCount || 0) + (statistics.commentsMadeCount || 0) + (statistics.booksPublishedCount || 0),
      totalEngagement: (statistics.clubsJoinedCount || 0) + (statistics.eventsRegisteredCount || 0),
      hasAnyActivity: (statistics.postsCount || 0) > 0 || 
                     (statistics.commentsMadeCount || 0) > 0 || 
                     (statistics.booksPublishedCount || 0) > 0,
    };
  }, [statistics]);

  const resetStatistics = useCallback(() => {
    console.log("🔄 [useProfileStatistics] Réinitialisation des statistiques");
    setStatistics({
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
    setError(null);
    setLoading(true);
    setLastFetchTime(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadStatistics = async () => {
      if (!isMounted) return;

      if (validateAuth()) {
        console.log("🎯 [useProfileStatistics] Chargement initial des statistiques");
        
        if (lastFetchTime && (new Date() - lastFetchTime) < 30000) {
          console.log("⚡ [useProfileStatistics] Utilisation du cache (moins de 30s)");
          setLoading(false);
          return;
        }

        await fetchStatistics();
      } else {
        console.log("⏸️ [useProfileStatistics] Pas d'authentification valide, arrêt");
        setLoading(false);
      }
    };

    loadStatistics();

    return () => {
      isMounted = false;
    };
  }, [validateAuth, fetchStatistics, lastFetchTime]);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      console.log("👋 [useProfileStatistics] Utilisateur déconnecté, réinitialisation");
      resetStatistics();
    }
  }, [isAuthenticated, userId, resetStatistics]);

  return {
    statistics: getFormattedStats(),
    rawStatistics: statistics,
    loading,
    error,
    refetch: fetchStatistics,
    reset: resetStatistics,
    lastFetchTime,
    hasValidAuth: validateAuth(),
    formattedStats: getFormattedStats(),
  };
}
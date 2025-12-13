// import { createContext, useContext, useState, useEffect, useCallback } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     try {
//       // Essayer de récupérer depuis localStorage puis sessionStorage
//       const storedUser = localStorage.getItem("vakio_user") || 
//                         localStorage.getItem("user") || 
//                         sessionStorage.getItem("vakio_user") || 
//                         sessionStorage.getItem("user");
      
//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);
        
//         // Vérifier que le token existe
//         if (!parsedUser.token) {
//           console.error("❌ [useAuth] User sans token dans le storage");
//           return null;
//         }
        
//         console.log("✅ [useAuth] Auth initialisé - ID:", parsedUser.user?.id, "Nom:", parsedUser.user?.nom);
//         return parsedUser;
//       }
      
//       console.log("ℹ️ [useAuth] Aucun utilisateur stocké");
//       return null;
//     } catch (error) {
//       console.error("❌ [useAuth] Erreur parsing localStorage:", error);
//       // Nettoyer les données corrompues
//       localStorage.removeItem("vakio_user");
//       localStorage.removeItem("user");
//       sessionStorage.removeItem("vakio_user");
//       sessionStorage.removeItem("user");
//       return null;
//     }
//   });

//   const [isAdminState, setIsAdminState] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Fonction de login
//   const login = (data, rememberMe = false) => {
//     if (!data?.token) {
//       console.error("❌ [useAuth] Login impossible: pas de token", data);
//       throw new Error("Token manquant dans la réponse");
//     }
    
//     if (!data.user?.id) {
//       console.error("❌ [useAuth] Login impossible: pas d'ID utilisateur", data);
//       throw new Error("ID utilisateur manquant");
//     }
    
//     console.log("✅ [useAuth] Login - ID:", data.user.id, "Nom:", data.user.nom, "Rôle:", data.user.role);
    
//     // Choisir le storage selon rememberMe
//     const storage = rememberMe ? localStorage : sessionStorage;
    
//     // Stocker dans les deux formats pour compatibilité
//     storage.setItem("vakio_user", JSON.stringify(data));
//     storage.setItem("user", JSON.stringify(data));
    
//     // Mettre à jour l'état
//     setUser(data);
//     setIsAdminState(data.user?.role === "admin");
    
//     // Retourner les données pour usage immédiat
//     return data;
//   };

//   // Fonction de logout
//   const logout = () => {
//     console.log("✅ [useAuth] Logout - Nettoyage complet");
    
//     // Nettoyer tous les storages
//     localStorage.removeItem("vakio_user");
//     localStorage.removeItem("user");
//     sessionStorage.removeItem("vakio_user");
//     sessionStorage.removeItem("user");
    
//     // Réinitialiser l'état
//     setUser(null);
//     setIsAdminState(false);
    
//     // Éventuellement rediriger vers la page de login
//     window.location.href = "/login";
//   };

//   // Vérifier la validité du token
//   const isTokenValid = useCallback(() => {
//     if (!user?.token) {
//       console.log("⚠️ [useAuth] Pas de token dans user");
//       return false;
//     }
    
//     try {
//       const tokenParts = user.token.split(".");
//       if (tokenParts.length !== 3) {
//         console.log("❌ [useAuth] Format token invalide");
//         return false;
//       }
      
//       // Décoder le payload JWT
//       const payload = JSON.parse(atob(tokenParts[1]));
      
//       // Vérifier l'ID
//       if (!payload.id || typeof payload.id !== 'number' || payload.id < 1) {
//         console.log("❌ [useAuth] ID invalide dans token:", payload.id);
//         return false;
//       }
      
//       // Vérifier l'expiration
//       const isExpired = payload.exp && payload.exp * 1000 < Date.now();
//       if (isExpired) {
//         console.log("❌ [useAuth] Token expiré");
//         return false;
//       }
      
//       console.log("✅ [useAuth] Token valide, exp:", new Date(payload.exp * 1000).toLocaleString());
//       return true;
//     } catch (error) {
//       console.log("❌ [useAuth] Token invalide:", error);
//       return false;
//     }
//   }, [user]);

//   // Obtenir le rôle de l'utilisateur
//   const getUserRole = useCallback(() => {
//     if (!user) {
//       console.log("⚠️ [useAuth] getUserRole: pas d'user");
//       return null;
//     }
//     return user.user?.role || null;
//   }, [user]);

//   // Obtenir l'ID de l'utilisateur
//   const getUserId = useCallback(() => {
//     if (!user) {
//       console.log("⚠️ [useAuth] getUserId: pas d'user");
//       return null;
//     }
    
//     if (user.user?.id && typeof user.user.id === 'number') {
//       return user.user.id;
//     }
    
//     console.log("⚠️ [useAuth] getUserId: ID non trouvé");
//     return null;
//   }, [user]);

//   // Obtenir les headers d'authentification pour les requêtes API
//   const getAuthHeaders = useCallback(() => {
//     if (!user?.token) {
//       console.log("⚠️ [useAuth] getAuthHeaders: pas de token");
//       return { 'Content-Type': 'application/json' };
//     }
    
//     if (!isTokenValid()) {
//       console.log("⚠️ [useAuth] getAuthHeaders: token invalide");
//       logout(); // Déconnecter automatiquement
//       return { 'Content-Type': 'application/json' };
//     }
    
//     return {
//       'Authorization': `Bearer ${user.token}`,
//       'Content-Type': 'application/json'
//     };
//   }, [user, isTokenValid]);

//   // Rafraîchir les données utilisateur depuis l'API
//   const refreshUserData = useCallback(async () => {
//     if (!user?.token) {
//       console.log("⚠️ [useAuth] refreshUserData: pas de token");
//       return null;
//     }
    
//     setLoading(true);
//     try {
//       const response = await fetch('https://vakio-boky-backend.onrender.com/api/auth/me', {
//         headers: getAuthHeaders()
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         if (data.success) {
//           // Mettre à jour l'utilisateur
//           const updatedUser = { ...user, user: data.user };
//           setUser(updatedUser);
          
//           // Mettre à jour le storage
//           const storage = localStorage.getItem("vakio_user") ? localStorage : sessionStorage;
//           storage.setItem("vakio_user", JSON.stringify(updatedUser));
          
//           return data.user;
//         }
//       }
//     } catch (error) {
//       console.error("❌ [useAuth] Erreur rafraîchissement:", error);
//     } finally {
//       setLoading(false);
//     }
    
//     return null;
//   }, [user, getAuthHeaders]);

//   // Mettre à jour isAdminState quand user change
//   useEffect(() => {
//     const role = getUserRole();
//     const newIsAdmin = role === "admin";
//     console.log("🔄 [useAuth] Mise à jour isAdminState:", role, "→ admin?", newIsAdmin);
//     setIsAdminState(newIsAdmin);
//   }, [user, getUserRole]);

//   // Vérifier automatiquement le token au chargement
//   useEffect(() => {
//     if (user && !isTokenValid()) {
//       console.log("🔒 [useAuth] Token invalide, logout automatique");
//       logout();
//     }
//   }, [user, isTokenValid]);

//   // Vérifier le token périodiquement (toutes les 5 minutes)
//   useEffect(() => {
//     if (!user) return;
    
//     const checkInterval = setInterval(() => {
//       if (!isTokenValid()) {
//         console.log("🔒 [useAuth] Token expiré (check périodique)");
//         logout();
//       }
//     }, 5 * 60 * 1000); // 5 minutes
    
//     return () => clearInterval(checkInterval);
//   }, [user, isTokenValid]);

//   // Valeur du contexte
//   const value = {
//     user,
//     login,
//     logout,
//     isAuthenticated: !!user && isTokenValid(),
//     isAdmin: isAdminState,
//     getUserRole,
//     getUserId,
//     getAuthHeaders, // ← Fonction pour les headers API
//     refreshUserData,
//     isTokenValid,
//     loading
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
  
//   return context;
// }
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      // Essayer de récupérer depuis localStorage puis sessionStorage
      const storedUser = localStorage.getItem("vakio_user") || 
                        localStorage.getItem("user") || 
                        sessionStorage.getItem("vakio_user") || 
                        sessionStorage.getItem("user");
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        if (!parsedUser.token) {
          console.error("❌ [useAuth] User sans token");
          return null;
        }
        
        console.log("✅ [useAuth] Auth initialisé - ID:", parsedUser.user?.id);
        return parsedUser;
      }
      
      return null;
    } catch (error) {
      console.error("❌ [useAuth] Erreur parsing storage:", error);
      localStorage.removeItem("vakio_user");
      localStorage.removeItem("user");
      sessionStorage.removeItem("vakio_user");
      sessionStorage.removeItem("user");
      return null;
    }
  });

  const [isAdminState, setIsAdminState] = useState(false);

  const login = (data, rememberMe = false) => {
    if (!data?.token) {
      console.error("❌ [useAuth] Login: pas de token");
      throw new Error("Token manquant");
    }
    
    if (!data.user?.id) {
      console.error("❌ [useAuth] Login: pas d'ID");
      throw new Error("ID manquant");
    }
    
    console.log("✅ [useAuth] Login - ID:", data.user.id, "Rôle:", data.user.role);
    
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("vakio_user", JSON.stringify(data));
    storage.setItem("user", JSON.stringify(data));
    
    setUser(data);
    setIsAdminState(data.user?.role === "admin");
    return data;
  };

  const logout = () => {
    console.log("✅ [useAuth] Logout");
    localStorage.removeItem("vakio_user");
    localStorage.removeItem("user");
    sessionStorage.removeItem("vakio_user");
    sessionStorage.removeItem("user");
    setUser(null);
    setIsAdminState(false);
  };

  const isTokenValid = useCallback(() => {
    if (!user?.token) {
      console.log("⚠️ [useAuth] Pas de token");
      return false;
    }
    
    try {
      const tokenParts = user.token.split(".");
      if (tokenParts.length !== 3) {
        console.log("❌ [useAuth] Format token invalide");
        return false;
      }
      
      const payload = JSON.parse(atob(tokenParts[1]));
      
      if (!payload.id || typeof payload.id !== 'number' || payload.id < 1) {
        console.log("❌ [useAuth] ID invalide");
        return false;
      }
      
      const isExpired = payload.exp && payload.exp * 1000 < Date.now();
      if (isExpired) {
        console.log("❌ [useAuth] Token expiré");
        return false;
      }
      
      return true;
    } catch {
      console.log("❌ [useAuth] Token invalide");
      return false;
    }
  }, [user]);

  const getUserRole = useCallback(() => {
    if (!user) {
      return null;
    }
    return user.user?.role || null;
  }, [user]);

  const getUserId = useCallback(() => {
    if (!user) {
      return null;
    }
    
    if (user.user?.id && typeof user.user.id === 'number') {
      return user.user.id;
    }
    
    return null;
  }, [user]);

  // FONCTION IMPORTANTE : Headers pour les requêtes API
  const getAuthHeaders = useCallback(() => {
    if (!user?.token) {
      console.log("⚠️ [useAuth] getAuthHeaders: pas de token");
      return { 'Content-Type': 'application/json' };
    }
    
    if (!isTokenValid()) {
      console.log("⚠️ [useAuth] getAuthHeaders: token invalide");
      logout();
      return { 'Content-Type': 'application/json' };
    }
    
    return {
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    };
  }, [user, isTokenValid]);

  useEffect(() => {
    const role = getUserRole();
    setIsAdminState(role === "admin");
  }, [user, getUserRole]);

  useEffect(() => {
    if (user && !isTokenValid()) {
      console.log("🔒 [useAuth] Token invalide, logout");
      logout();
    }
  }, [user, isTokenValid]);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user && isTokenValid(),
    isAdmin: isAdminState,
    getUserRole,
    getUserId,
    getAuthHeaders, // ← FONCTION AJOUTÉE
    isTokenValid,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
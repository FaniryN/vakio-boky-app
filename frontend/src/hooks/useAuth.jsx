// // // import { createContext, useContext, useState, useEffect } from "react";

// // // const AuthContext = createContext();

// // // export function AuthProvider({ children }) {
// // //   const [user, setUser] = useState(() => {
// // //     try {
// // //       const storedUser = localStorage.getItem("vakio_user");
// // //       return storedUser ? JSON.parse(storedUser) : null;
// // //     } catch (error) {
// // //       console.error("Erreur parsing localStorage:", error);
// // //       localStorage.removeItem("vakio_user");
// // //       return null;
// // //     }
// // //   });

// // //   // Connexion
// // //   const login = (data) => {
// // //     setUser(data);
// // //     localStorage.setItem("vakio_user", JSON.stringify(data));
// // //   };

// // //   // Déconnexion
// // //   const logout = () => {
// // //     setUser(null);
// // //     localStorage.removeItem("vakio_user");
// // //   };

// // //   // Vérification de la validité du token
// // //   const isTokenValid = () => {
// // //     if (!user?.token) return false;

// // //     try {
// // //       const tokenParts = user.token.split(".");
// // //       return tokenParts.length === 3;
// // //     } catch {
// // //       return false;
// // //     }
// // //   };

// // //   const getUserRole = () => {
// // //     if (!user) return null;

// // //     const role = user.user?.role || user.role;
// // //     console.log("🔍 [useAuth] Rôle trouvé:", role);
// // //     return role;
// // //   };

// // //   const isAdmin = () => {
// // //     const role = getUserRole();
// // //     const adminStatus = role === "admin";
// // //     console.log("🔍 [useAuth] isAdmin:", adminStatus);
// // //     return adminStatus;
// // //   };

// // //   useEffect(() => {
// // //     if (!isTokenValid()) {
// // //       logout();
// // //     }
// // //   }, []);

// // //   const value = {
// // //     user,
// // //     login,
// // //     logout,
// // //     isAuthenticated: !!user?.token && isTokenValid(),
// // //     isAdmin: isAdmin(),
// // //   };

// // //   console.log("🔍 [useAuth] Valeur du contexte:", {
// // //     user: user,
// // //     isAuthenticated: !!user?.token && isTokenValid(),
// // //     isAdmin: isAdmin(),
// // //   });

// // //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // // }

// // // export function useAuth() {
// // //   const context = useContext(AuthContext);
// // //   if (!context) {
// // //     throw new Error("useAuth must be used within an AuthProvider");
// // //   }

// // //   console.log("🔍 [useAuth] Hook utilisé - isAdmin:", context.isAdmin);

// // //   return context;
// // // }

// // // import { createContext, useContext, useState, useEffect } from "react";

// // // const AuthContext = createContext();

// // // export function AuthProvider({ children }) {
// // //   const [user, setUser] = useState(() => {
// // //     try {
// // //       const storedUser = localStorage.getItem("vakio_user");
// // //       return storedUser ? JSON.parse(storedUser) : null;
// // //     } catch (error) {
// // //       console.error("Erreur parsing localStorage:", error);
// // //       localStorage.removeItem("vakio_user");
// // //       return null;
// // //     }
// // //   });

// // //   const [isAdminState, setIsAdminState] = useState(false);

// // //   // Connexion
// // //   const login = (data) => {
// // //     setUser(data);
// // //     localStorage.setItem("vakio_user", JSON.stringify(data));
// // //   };

// // //   // Déconnexion
// // //   const logout = () => {
// // //     setUser(null);
// // //     localStorage.removeItem("vakio_user");
// // //   };

// // //   // Vérification basique du token
// // //   const isTokenValid = () => {
// // //     if (!user?.token) return false;
// // //     try {
// // //       const tokenParts = user.token.split(".");
// // //       return tokenParts.length === 3; // structure JWT
// // //     } catch {
// // //       return false;
// // //     }
// // //   };

// // //   const getUserRole = () => {
// // //     if (!user) return null;
// // //     const role = user.role || user.user?.role || null;
// // //     return role;
// // //   };

// // //   // Met à jour l'état isAdmin dès que user change
// // //   useEffect(() => {
// // //     const role = getUserRole();
// // //     setIsAdminState(role === "admin");
// // //   }, [user]);

// // //   // Déconnexion si token invalide au chargement
// // //   useEffect(() => {
// // //     if (!isTokenValid()) {
// // //       logout();
// // //     }
// // //   }, []);

// // //   const value = {
// // //     user,
// // //     login,
// // //     logout,
// // //     isAuthenticated: !!user?.token && isTokenValid(),
// // //     isAdmin: isAdminState,
// // //   };

// // //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // // }

// // // export function useAuth() {
// // //   const context = useContext(AuthContext);
// // //   if (!context) {
// // //     throw new Error("useAuth must be used within an AuthProvider");
// // //   }
// // //   return context;
// // // }
// // import { createContext, useContext, useState, useEffect } from "react";

// // const AuthContext = createContext();

// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(() => {
// //     try {
// //       const storedUser = localStorage.getItem("vakio_user");
// //       return storedUser ? JSON.parse(storedUser) : null;
// //     } catch (error) {
// //       console.error("Erreur parsing localStorage:", error);
// //       localStorage.removeItem("vakio_user");
// //       return null;
// //     }
// //   });

// //   const [isAdminState, setIsAdminState] = useState(false);

// //   const login = (data) => {
// //     setUser(data);
// //     localStorage.setItem("vakio_user", JSON.stringify(data));
// //   };

// //   const logout = () => {
// //     setUser(null);
// //     localStorage.removeItem("vakio_user");
// //   };

// //   const isTokenValid = () => {
// //     if (!user?.token) return false;
// //     try {
// //       const tokenParts = user.token.split(".");
// //       return tokenParts.length === 3;
// //     } catch {
// //       return false;
// //     }
// //   };

// //   const getUserRole = () => {
// //     if (!user) return null;
// //     return user.role || user.user?.role || null;
// //   };

// //   useEffect(() => {
// //     const role = getUserRole();
// //     setIsAdminState(role === "admin");
// //   }, [user]);

// //   useEffect(() => {
// //     if (!isTokenValid()) {
// //       logout();
// //     }
// //   }, []);

// //   const value = {
// //     user,
// //     login,
// //     logout,
// //     isAuthenticated: !!user?.token && isTokenValid(),
// //     isAdmin: isAdminState,
// //     getUserRole,
// //   };

// //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // }

// // export function useAuth() {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error("useAuth must be used within an AuthProvider");
// //   }
// //   return context;
// // }
// // import { createContext, useContext, useState, useEffect } from "react";

// // const AuthContext = createContext();

// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(() => {
// //     try {
// //       const storedUser = localStorage.getItem("vakio_user");
// //       return storedUser ? JSON.parse(storedUser) : null;
// //     } catch (error) {
// //       console.error("Erreur parsing localStorage:", error);
// //       localStorage.removeItem("vakio_user");
// //       return null;
// //     }
// //   });

// //   const [isAdminState, setIsAdminState] = useState(false);

// //   const login = (data) => {
// //     setUser(data);
// //     localStorage.setItem("vakio_user", JSON.stringify(data));
// //   };

// //   const logout = () => {
// //     setUser(null);
// //     localStorage.removeItem("vakio_user");
// //   };

// //   const isTokenValid = () => {
// //     if (!user?.token) return false;
// //     try {
// //       const tokenParts = user.token.split(".");
// //       return tokenParts.length === 3;
// //     } catch {
// //       return false;
// //     }
// //   };

// //   const getUserRole = () => {
// //     if (!user) return null;
// //     return user.role || user.user?.role || null;
// //   };

// //   useEffect(() => {
// //     const role = getUserRole();
// //     setIsAdminState(role === "admin");
// //   }, [user]);

// //   useEffect(() => {
// //     if (!isTokenValid()) {
// //       logout();
// //     }
// //   }, []);

// //   const value = {
// //     user,
// //     login,
// //     logout,
// //     isAuthenticated: !!user?.token && isTokenValid(),
// //     isAdmin: isAdminState,
// //     getUserRole,
// //   };

// //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // }

// // export function useAuth() {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error("useAuth must be used within an AuthProvider");
// //   }
// //   return context;
// // }
// // useAuth.js - VERSION COMPLÈTE ET CORRECTE
// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     try {
//       // RÉCONCILIATION : Chercher l'user dans TOUTES les clés possibles
//       const storedUser = 
//         localStorage.getItem("vakio_user") || 
//         localStorage.getItem("user") || 
//         sessionStorage.getItem("user");
      
//       const storedToken = 
//         localStorage.getItem("authToken") || 
//         sessionStorage.getItem("authToken");
      
//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);
        
//         // Si on a un token séparé, l'ajouter à l'user
//         if (storedToken) {
//           parsedUser.token = storedToken;
//         }
        
//         // VALIDATION CRITIQUE : Vérifier que l'user a un ID
//         if (!parsedUser.id) {
//           console.error("❌ User sans ID dans le storage:", parsedUser);
//           return null;
//         }
        
//         console.log("✅ Auth initialisé - ID:", parsedUser.id, "Nom:", parsedUser.nom);
//         return parsedUser;
//       }
      
//       return null;
//     } catch (error) {
//       console.error("Erreur parsing localStorage:", error);
//       // Nettoyer toutes les clés potentielles
//       ["vakio_user", "user", "authToken"].forEach(key => {
//         localStorage.removeItem(key);
//         sessionStorage.removeItem(key);
//       });
//       return null;
//     }
//   });

//   const [isAdminState, setIsAdminState] = useState(false);

//   // Fonction de login UNIFIÉE
//   const login = (data, rememberMe = false) => {
//     // VALIDATION : L'user doit avoir un ID
//     if (!data.id) {
//       console.error("❌ Login impossible: user sans ID", data);
//       throw new Error("Données utilisateur invalides");
//     }
    
//     // PRÉPARER L'USER AVEC TOUTES LES DONNÉES
//     const userToStore = {
//       ...data,
//       // S'assurer que le token est inclus
//       token: data.token || user?.token
//     };
    
//     console.log("✅ Login - ID:", userToStore.id, "Nom:", userToStore.nom);
    
//     // STOCKAGE UNIFIÉ : utiliser TOUJOURS les mêmes clés
//     const storage = rememberMe ? localStorage : sessionStorage;
    
//     // Stocker l'user COMPLET dans "user"
//     storage.setItem("user", JSON.stringify(userToStore));
    
//     // Stocker aussi le token séparément (pour compatibilité)
//     if (userToStore.token) {
//       storage.setItem("authToken", userToStore.token);
//     }
    
//     // Stocker aussi dans "vakio_user" (pour rétro-compatibilité)
//     storage.setItem("vakio_user", JSON.stringify(userToStore));
    
//     setUser(userToStore);
    
//     return userToStore;
//   };

//   // Logout COMPLET
//   const logout = () => {
//     console.log("✅ Logout - Nettoyage complet");
    
//     // Nettoyer TOUTES les clés possibles
//     const keysToRemove = ["vakio_user", "user", "authToken"];
//     keysToRemove.forEach(key => {
//       localStorage.removeItem(key);
//       sessionStorage.removeItem(key);
//     });
    
//     setUser(null);
//     setIsAdminState(false);
//   };

//   // Validation améliorée du token
//   const isTokenValid = () => {
//     if (!user?.token) {
//       console.log("⚠️ Pas de token dans user");
//       return false;
//     }
    
//     try {
//       // Vérifier le format JWT
//       const tokenParts = user.token.split(".");
//       if (tokenParts.length !== 3) {
//         console.log("❌ Format token invalide");
//         return false;
//       }
      
//       // Essayer de décoder pour vérifier l'expiration
//       try {
//         const payload = JSON.parse(atob(tokenParts[1]));
        
//         // Vérifier l'ID
//         if (!payload.id || typeof payload.id !== 'number' || payload.id < 1) {
//           console.log("❌ ID invalide dans token:", payload.id);
//           return false;
//         }
        
//         // Vérifier l'expiration
//         const isExpired = payload.exp && payload.exp * 1000 < Date.now();
//         if (isExpired) {
//           console.log("❌ Token expiré");
//           return false;
//         }
        
//         return true;
//       } catch (decodeError) {
//         console.log("❌ Impossible de décoder token:", decodeError);
//         return false;
//       }
//     } catch {
//       console.log("❌ Token invalide");
//       return false;
//     }
//   };

//   const getUserRole = () => {
//     if (!user) {
//       console.log("⚠️ getUserRole: pas d'user");
//       return null;
//     }
//     return user.role || null;
//   };

//   // Récupérer l'ID utilisateur DE FAÇON FIABLE
//   const getUserId = () => {
//     if (!user) {
//       console.log("⚠️ getUserId: pas d'user");
//       return null;
//     }
    
//     // Priorité 1: user.id direct
//     if (user.id && typeof user.id === 'number') {
//       return user.id;
//     }
    
//     // Priorité 2: user.user?.id (pour certaines structures)
//     if (user.user?.id && typeof user.user.id === 'number') {
//       return user.user.id;
//     }
    
//     console.log("⚠️ getUserId: ID non trouvé dans:", user);
//     return null;
//   };

//   // Mettre à jour isAdmin
//   useEffect(() => {
//     const role = getUserRole();
//     const newIsAdmin = role === "admin";
//     setIsAdminState(newIsAdmin);
//   }, [user]);

//   // Vérifier la validité du token au chargement
//   useEffect(() => {
//     if (user && !isTokenValid()) {
//       console.log("🔒 Token invalide, logout automatique");
//       logout();
//     }
//   }, []);

//   const value = {
//     user,
//     login,
//     logout,
//     isAuthenticated: !!user && isTokenValid(),
//     isAdmin: isAdminState,
//     getUserRole,
//     getUserId, // AJOUT CRITIQUE !
//     isTokenValid,
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
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        if (!parsedUser.token) {
          console.error("❌ User sans token dans le storage");
          return null;
        }
        
        console.log("✅ Auth initialisé - ID:", parsedUser.user?.id, "Nom:", parsedUser.user?.nom);
        return parsedUser;
      }
      
      return null;
    } catch (error) {
      console.error("Erreur parsing localStorage:", error);
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      return null;
    }
  });

  const [isAdminState, setIsAdminState] = useState(false);

  const login = (data, rememberMe = false) => {
    if (!data?.token) {
      console.error("❌ Login impossible: pas de token", data);
      throw new Error("Token manquant dans la réponse");
    }
    
    if (!data.user?.id) {
      console.error("❌ Login impossible: pas d'ID utilisateur", data);
      throw new Error("ID utilisateur manquant");
    }
    
    console.log("✅ Login - ID:", data.user.id, "Nom:", data.user.nom);
    
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(data));
    
    setUser(data);
    return data;
  };

  const logout = () => {
    console.log("✅ Logout - Nettoyage complet");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setUser(null);
    setIsAdminState(false);
  };

  const isTokenValid = () => {
    if (!user?.token) {
      console.log("⚠️ Pas de token dans user");
      return false;
    }
    
    try {
      const tokenParts = user.token.split(".");
      if (tokenParts.length !== 3) {
        console.log("❌ Format token invalide");
        return false;
      }
      
      const payload = JSON.parse(atob(tokenParts[1]));
      
      if (!payload.id || typeof payload.id !== 'number' || payload.id < 1) {
        console.log("❌ ID invalide dans token:", payload.id);
        return false;
      }
      
      const isExpired = payload.exp && payload.exp * 1000 < Date.now();
      if (isExpired) {
        console.log("❌ Token expiré");
        return false;
      }
      
      return true;
    } catch {
      console.log("❌ Token invalide");
      return false;
    }
  };

  const getUserRole = () => {
    if (!user) {
      console.log("⚠️ getUserRole: pas d'user");
      return null;
    }
    return user.user?.role || null;
  };

  const getUserId = () => {
    if (!user) {
      console.log("⚠️ getUserId: pas d'user");
      return null;
    }
    
    if (user.user?.id && typeof user.user.id === 'number') {
      return user.user.id;
    }
    
    console.log("⚠️ getUserId: ID non trouvé");
    return null;
  };

  useEffect(() => {
    const role = getUserRole();
    const newIsAdmin = role === "admin";
    setIsAdminState(newIsAdmin);
  }, [user]);

  useEffect(() => {
    if (user && !isTokenValid()) {
      console.log("🔒 Token invalide, logout automatique");
      logout();
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user && isTokenValid(),
    isAdmin: isAdminState,
    getUserRole,
    getUserId,
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
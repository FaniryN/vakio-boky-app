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

// //   // Connexion
// //   const login = (data) => {
// //     setUser(data);
// //     localStorage.setItem("vakio_user", JSON.stringify(data));
// //   };

// //   // Déconnexion
// //   const logout = () => {
// //     setUser(null);
// //     localStorage.removeItem("vakio_user");
// //   };

// //   // Vérification de la validité du token
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

// //     const role = user.user?.role || user.role;
// //     console.log("🔍 [useAuth] Rôle trouvé:", role);
// //     return role;
// //   };

// //   const isAdmin = () => {
// //     const role = getUserRole();
// //     const adminStatus = role === "admin";
// //     console.log("🔍 [useAuth] isAdmin:", adminStatus);
// //     return adminStatus;
// //   };

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
// //     isAdmin: isAdmin(),
// //   };

// //   console.log("🔍 [useAuth] Valeur du contexte:", {
// //     user: user,
// //     isAuthenticated: !!user?.token && isTokenValid(),
// //     isAdmin: isAdmin(),
// //   });

// //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // }

// // export function useAuth() {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error("useAuth must be used within an AuthProvider");
// //   }

// //   console.log("🔍 [useAuth] Hook utilisé - isAdmin:", context.isAdmin);

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

// //   // Connexion
// //   const login = (data) => {
// //     setUser(data);
// //     localStorage.setItem("vakio_user", JSON.stringify(data));
// //   };

// //   // Déconnexion
// //   const logout = () => {
// //     setUser(null);
// //     localStorage.removeItem("vakio_user");
// //   };

// //   // Vérification basique du token
// //   const isTokenValid = () => {
// //     if (!user?.token) return false;
// //     try {
// //       const tokenParts = user.token.split(".");
// //       return tokenParts.length === 3; // structure JWT
// //     } catch {
// //       return false;
// //     }
// //   };

// //   const getUserRole = () => {
// //     if (!user) return null;
// //     const role = user.role || user.user?.role || null;
// //     return role;
// //   };

// //   // Met à jour l'état isAdmin dès que user change
// //   useEffect(() => {
// //     const role = getUserRole();
// //     setIsAdminState(role === "admin");
// //   }, [user]);

// //   // Déconnexion si token invalide au chargement
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
// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     try {
//       const storedUser = localStorage.getItem("vakio_user");
//       return storedUser ? JSON.parse(storedUser) : null;
//     } catch (error) {
//       console.error("Erreur parsing localStorage:", error);
//       localStorage.removeItem("vakio_user");
//       return null;
//     }
//   });

//   const [isAdminState, setIsAdminState] = useState(false);

//   const login = (data) => {
//     setUser(data);
//     localStorage.setItem("vakio_user", JSON.stringify(data));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("vakio_user");
//   };

//   const isTokenValid = () => {
//     if (!user?.token) return false;
//     try {
//       const tokenParts = user.token.split(".");
//       return tokenParts.length === 3;
//     } catch {
//       return false;
//     }
//   };

//   const getUserRole = () => {
//     if (!user) return null;
//     return user.role || user.user?.role || null;
//   };

//   useEffect(() => {
//     const role = getUserRole();
//     setIsAdminState(role === "admin");
//   }, [user]);

//   useEffect(() => {
//     if (!isTokenValid()) {
//       logout();
//     }
//   }, []);

//   const value = {
//     user,
//     login,
//     logout,
//     isAuthenticated: !!user?.token && isTokenValid(),
//     isAdmin: isAdminState,
//     getUserRole,
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
      const storedUser = localStorage.getItem("vakio_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Erreur parsing localStorage:", error);
      localStorage.removeItem("vakio_user");
      return null;
    }
  });

  const [isAdminState, setIsAdminState] = useState(false);

  const login = (data) => {
    setUser(data);
    localStorage.setItem("vakio_user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vakio_user");
  };

  const isTokenValid = () => {
    if (!user?.token) return false;
    try {
      const tokenParts = user.token.split(".");
      return tokenParts.length === 3;
    } catch {
      return false;
    }
  };

  const getUserRole = () => {
    if (!user) return null;
    return user.role || user.user?.role || null;
  };

  useEffect(() => {
    const role = getUserRole();
    setIsAdminState(role === "admin");
  }, [user]);

  useEffect(() => {
    if (!isTokenValid()) {
      logout();
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user?.token && isTokenValid(),
    isAdmin: isAdminState,
    getUserRole,
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

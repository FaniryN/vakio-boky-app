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
    setIsAdminState(data.user?.role === "admin");
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
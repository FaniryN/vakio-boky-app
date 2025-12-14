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
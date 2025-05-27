import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { verifyToken } from "../mocks/helpers";
import { redirect } from "react-router-dom";

const AuthContext = createContext();

// Proveedor de contexto para manejar la autenticación global del usuario
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  // Inicia sesión: guarda el token en localStorage y en el estado global
  const login = (token) => {
    sessionStorage.setItem("token", token);
    setToken(token);
  };

  // Cierra sesión: limpia localStorage y el estado global
  const logout = () => {
    sessionStorage.clear();
    setToken(null);
    setUser(null);
  };

  // Al iniciar la app, intenta restaurar la sesión desde localStorage
  const verify = async () => {
    setLoading(true);

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const payload = await verifyToken(token, { returnPayload: true });

      if (payload === null) {
        sessionStorage.removeItem("token");
        setToken(null);
        setUser(null);
        return;
      }

      setUser(payload);
    } catch (err) {
      console.error("Error verificando token:", err);
      sessionStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verify();
  }, [token]);
  // Valores y funciones expuestas a través del contexto de autenticación
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

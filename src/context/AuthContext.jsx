import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { verifyToken } from "../mocks/helpers";
import { redirect } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  const login = (token) => {
    sessionStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    sessionStorage.clear();
    setToken(null);
    setUser(null);
    redirect("/auth/login");
  };

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

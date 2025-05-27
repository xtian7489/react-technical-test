import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { verifyToken } from "../mocks/helpers";
import { redirect } from "react-router-dom";
import { jwtSecret } from "../lib/constants";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refreshToken")
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  const login = (newToken, newRefreshToken) => {
    sessionStorage.setItem("token", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    setToken(newToken);
    setRefreshToken(newRefreshToken);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const refreshAuthToken = async () => {
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const response = await axios.post(
        "/api/auth/refresh",
        {
          refreshToken,
        },
        {
          skipAuthRefresh: true,
        }
      );

      const { accessToken, newRefreshToken } = response.data;

      sessionStorage.setItem("token", accessToken);
      setToken(accessToken);

      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
        setRefreshToken(newRefreshToken);
      }

      return accessToken;
    } catch (error) {
      logout();
      return null;
    }
  };

  const verify = async () => {
    setLoading(true);

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const payload = await verifyToken(token, jwtSecret, {
        returnPayload: true,
      });

      if (payload === null && refreshToken) {
        const newToken = await refreshAuthToken();
        if (newToken) {
          const newPayload = await verifyToken(newToken, {
            returnPayload: true,
          });
          setUser(newPayload);
          setLoading(false);
          return;
        }
      }

      if (payload) {
        setUser(payload);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Error verifying token:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verify();

    const interval = setInterval(() => {
      if (token && refreshToken) {
        refreshAuthToken();
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        user,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        logout,
        refreshAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

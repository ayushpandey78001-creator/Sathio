import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("sathio_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch {
      localStorage.removeItem("sathio_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("sathio_token", res.data.access_token);
    await refreshUser();
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/auth/signup", { name, email, password });
    localStorage.setItem("sathio_token", res.data.access_token);
    await refreshUser();
  };

  const logout = () => {
    localStorage.removeItem("sathio_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

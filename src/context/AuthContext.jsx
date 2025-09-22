import { createContext, useContext, useEffect, useState } from "react";
import api from "../../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const partnerToken = localStorage.getItem("partnerToken");
      const userToken = localStorage.getItem("userToken");

      if (!partnerToken && !userToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      let res;
      if (partnerToken) {
        res = await api.get("/api/partners/profile", {
          headers: { Authorization: `Bearer ${partnerToken}` },
        });
      } else {
        res = await api.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${userToken}` },
        });
      }

      setUser(res.data);
    } catch (err) {
      console.error("❌ Auth profile fetch failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = (data, token, type = "user") => {
    if (type === "partner") {
      localStorage.setItem("partnerToken", token);
    } else {
      localStorage.setItem("userToken", token);
    }
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("partnerToken");
    localStorage.removeItem("userToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

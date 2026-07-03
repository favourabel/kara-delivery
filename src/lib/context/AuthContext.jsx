import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session storage for existing admin session
    const session = sessionStorage.getItem("akara_admin_session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed && parsed.email && parsed.loggedInAt) {
          const hoursSince = (Date.now() - parsed.loggedInAt) / (1000 * 60 * 60);
          if (hoursSince < 8) {
            setIsAuthenticated(true);
            setAdminData(parsed);
          } else {
            sessionStorage.removeItem("akara_admin_session");
          }
        }
      } catch {
        sessionStorage.removeItem("akara_admin_session");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    // Simulate async check
    await new Promise((r) => setTimeout(r, 1200));

    if (
      email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      const data = {
        name: "Akara Admin",
        email: email.trim().toLowerCase(),
        avatar: "AA",
        role: "Super Admin",
        loggedInAt: Date.now(),
      };
      setIsAuthenticated(true);
      setAdminData(data);
      sessionStorage.setItem("akara_admin_session", JSON.stringify(data));
      return { success: true };
    }

    return { success: false, error: "Invalid email or password. Please try again." };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAdminData(null);
    sessionStorage.removeItem("akara_admin_session");
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, adminData, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
};
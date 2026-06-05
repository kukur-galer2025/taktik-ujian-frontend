"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  logout: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/auth/callback", "/contact", "/faq", "/privacy", "/terms"];

  // Avoid hydration mismatch but prevent visual flash
  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? import("react").then(m => m.useLayoutEffect).catch(() => useEffect) : useEffect;

  // Since we can't reliably use top-level await for dynamic imports of hooks,
  // we'll just use a standard isomorphic approach.
  const useSafeLayoutEffect = typeof window !== 'undefined' ? require('react').useLayoutEffect : useEffect;

  useSafeLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("user_cache");
      if (cached) {
        setUser(JSON.parse(cached));
        setLoading(false);
      }
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        if (!PUBLIC_PATHS.includes(window.location.pathname)) {
          router.push("/login");
        }
        return;
      }
      
      const res = await axios.get("/api/user");
      setUser(res.data);
      localStorage.setItem("user_cache", JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      localStorage.removeItem("user_cache");
      if (!PUBLIC_PATHS.includes(window.location.pathname)) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try { await axios.post("/api/logout"); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user_cache");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/login");
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const res = await axios.get("/api/user");
      setUser(res.data);
      localStorage.setItem("user_cache", JSON.stringify(res.data));
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

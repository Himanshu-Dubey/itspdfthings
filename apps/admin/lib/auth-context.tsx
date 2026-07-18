"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { adminApi } from "@/lib/api";
import type { AdminUser } from "@/types/api";

interface AuthState {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  // Track whether the component is still mounted so stale async results are dropped.
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();

    // 5-second safety timeout — ensures loading never hangs forever.
    const timer = setTimeout(() => controller.abort(), 5000);

    adminApi
      .getMe(controller.signal)
      .then(({ admin }) => {
        if (mounted.current) setAdmin(admin);
      })
      .catch(() => {
        if (mounted.current) setAdmin(null);
      })
      .finally(() => {
        clearTimeout(timer);
        if (mounted.current) setLoading(false);
      });

    // Cleanup: abort the in-flight request when the component unmounts
    // (prevents Strict Mode's double-invoke from leaving stale state).
    return () => {
      mounted.current = false;
      controller.abort();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email: string, password: string) => {
    const { admin } = await adminApi.login(email, password);
    setAdmin(admin);
  };

  const logout = async () => {
    await adminApi.logout();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}

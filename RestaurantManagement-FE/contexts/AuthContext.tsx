"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import api from "@/lib/api";
import type { UserResponse } from "@/lib/types/user";

type AuthState = {
  user: UserResponse | null;
  loading: boolean;
  checked: boolean;
};

type AuthContextValue = AuthState & {
  setUser: (user: UserResponse | null) => void;
  setUserFromEmail: (email: string) => Promise<void>;
  refreshUser: (userId: number) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    checked: false,
  });

  const setUser = useCallback((user: UserResponse | null) => {
    setState((s) => ({ ...s, user, checked: true }));
  }, []);

  const setUserFromEmail = useCallback(async (email: string) => {
    try {
      const res = await api.get<{ data: { content: UserResponse[] } }>(
        "/api/users?size=100&sort=id,asc"
      );
      const list = res.data?.data?.content ?? [];
      const found = list.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) setState((s) => ({ ...s, user: found, checked: true }));
    } catch {
      setState((s) => ({ ...s, checked: true }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const refreshUser = useCallback(async (userId: number) => {
    try {
      const res = await api.get<{ data: UserResponse }>(`/api/users/${userId}`);
      if (res.data?.data) setState((s) => ({ ...s, user: res.data.data, checked: true }));
    } catch {
      setState((s) => ({ ...s, user: null, checked: true }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setState({ user: null, loading: false, checked: true });
    }
  }, []);

  useEffect(() => {
    setState((s) => ({ ...s, loading: false, checked: true }));
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      setState({ user: null, loading: false, checked: true });
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      setUser,
      setUserFromEmail,
      refreshUser,
      logout,
    }),
    [state, setUser, setUserFromEmail, refreshUser, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

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

const AUTH_USER_KEY = "resto-user";

function getStoredUser(): UserResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw) as UserResponse;
    return u && typeof u.id === "number" && u.email ? u : null;
  } catch {
    return null;
  }
}

function setStoredUser(user: UserResponse | null) {
  if (typeof window === "undefined") return;
  if (user) {
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
}

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
    setStoredUser(user);
    setState((s) => ({ ...s, user, checked: true }));
  }, []);

  const setUserFromEmail = useCallback(async (email: string) => {
    try {
      const res = await api.get<{ data: { content: UserResponse[] } }>(
        "/api/users?size=100&sort=id,asc"
      );
      const list = res.data?.data?.content ?? [];
      const found = list.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setStoredUser(found);
        setState((s) => ({ ...s, user: found, checked: true }));
      } else {
        setState((s) => ({ ...s, checked: true }));
      }
    } catch {
      setState((s) => ({ ...s, checked: true }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const refreshUser = useCallback(async (userId: number) => {
    try {
      const res = await api.get<{ data: UserResponse }>(`/api/users/${userId}`);
      if (res.data?.data) {
        setStoredUser(res.data.data);
        setState((s) => ({ ...s, user: res.data.data, checked: true }));
      } else {
        setStoredUser(null);
        setState((s) => ({ ...s, user: null, checked: true }));
      }
    } catch {
      setStoredUser(null);
      setState((s) => ({ ...s, user: null, checked: true }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setStoredUser(null);
      setState({ user: null, loading: false, checked: true });
    }
  }, []);

  // Restore user from localStorage on mount and verify session with backend
  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      setState((s) => ({ ...s, loading: false, checked: true }));
      return;
    }
    setState((s) => ({ ...s, user: stored, checked: true }));
    // Verify session: if API returns 401, clear stored user
    api
      .get<{ data: UserResponse }>(`/api/users/${stored.id}`)
      .then((res) => {
        if (res.data?.data) {
          setStoredUser(res.data.data);
          setState((s) => ({ ...s, user: res.data.data }));
        }
      })
      .catch(() => {
        setStoredUser(null);
        setState((s) => ({ ...s, user: null }));
      })
      .finally(() => {
        setState((s) => ({ ...s, loading: false }));
      });
  }, []);

  // Persist user whenever it changes (from setUser/setUserFromEmail/refreshUser)
  useEffect(() => {
    if (state.user) setStoredUser(state.user);
    else if (state.checked) setStoredUser(null);
  }, [state.user, state.checked]);

  useEffect(() => {
    const handleLogout = () => {
      setStoredUser(null);
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

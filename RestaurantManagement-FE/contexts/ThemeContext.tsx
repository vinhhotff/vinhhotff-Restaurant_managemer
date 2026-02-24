"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";
export type AccentColor = "gold" | "green" | "blue" | "orange" | "purple";

type ThemeContextValue = {
  theme: ThemeMode;
  accent: AccentColor;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  resolvedDark: boolean;
};

const STORAGE_THEME = "resto-theme";
const STORAGE_ACCENT = "resto-accent";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  const v = localStorage.getItem(STORAGE_THEME);
  if (v === "light" || v === "dark" || v === "system") return v;
  return "system";
}

function getStoredAccent(): AccentColor {
  if (typeof window === "undefined") return "gold";
  const v = localStorage.getItem(STORAGE_ACCENT);
  if (v === "gold" || v === "green" || v === "blue" || v === "orange" || v === "purple") return v;
  return "gold";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [accent, setAccentState] = useState<AccentColor>("gold");
  const [resolvedDark, setResolvedDark] = useState(false);

  const setTheme = useCallback((value: ThemeMode) => {
    setThemeState(value);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_THEME, value);
  }, []);

  const setAccent = useCallback((value: AccentColor) => {
    setAccentState(value);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_ACCENT, value);
  }, []);

  useEffect(() => {
    setThemeState(getStoredTheme());
    setAccentState(getStoredAccent());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const dark =
      theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setResolvedDark(dark);
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
  }, [accent]);

  const value: ThemeContextValue = {
    theme,
    accent,
    setTheme,
    setAccent,
    resolvedDark,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

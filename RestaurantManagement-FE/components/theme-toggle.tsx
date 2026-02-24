"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import type { ThemeMode, AccentColor } from "@/contexts/ThemeContext";
import { MdDarkMode, MdLightMode, MdSettingsBrightness, MdPalette } from "react-icons/md";

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Sáng", icon: <MdLightMode className="text-lg" /> },
  { value: "dark", label: "Tối", icon: <MdDarkMode className="text-lg" /> },
  { value: "system", label: "Theo hệ thống", icon: <MdSettingsBrightness className="text-lg" /> },
];

const ACCENT_OPTIONS: { value: AccentColor; label: string; color: string }[] = [
  { value: "gold", label: "Vàng", color: "#eec02b" },
  { value: "green", label: "Xanh lá", color: "#22c55e" },
  { value: "blue", label: "Xanh dương", color: "#3b82f6" },
  { value: "orange", label: "Cam", color: "#f97316" },
  { value: "purple", label: "Tím", color: "#a855f7" },
];

export function ThemeToggle() {
  const { theme, accent, setTheme, setAccent } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-lg border border-[#e5e5e5] dark:border-[#37322a] bg-white dark:bg-[#2A251E] text-[#171512] dark:text-white hover:bg-[#f0f0f0] dark:hover:bg-[#37322a] transition-colors"
        aria-label="Đổi theme"
      >
        <MdPalette className="text-[22px] text-gourmet-primary" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-[#e5e5e5] dark:border-[#37322a] bg-white dark:bg-[#2A251E] shadow-xl z-[100] p-4 flex flex-col gap-4">
          <p className="text-sm font-semibold text-[#171512] dark:text-white">Giao diện</p>
          <div className="flex gap-2">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheme(opt.value)}
                className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border text-sm transition-colors ${
                  theme === opt.value
                    ? "border-gourmet-primary bg-gourmet-primary/10 text-gourmet-primary"
                    : "border-[#e5e5e5] dark:border-[#37322a] text-[#6C6A66] dark:text-gourmet-muted hover:bg-[#f0f0f0] dark:hover:bg-[#37322a]"
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
          <p className="text-sm font-semibold text-[#171512] dark:text-white">Màu nhấn</p>
          <div className="flex flex-wrap gap-2">
            {ACCENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAccent(opt.value)}
                className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${
                  accent === opt.value ? "border-[#171512] dark:border-white scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: opt.color }}
                title={opt.label}
                aria-label={opt.label}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import type { CalendarSettings, ThemeMode } from "@/lib/calendar-types";
import { DEFAULT_SETTINGS } from "@/lib/calendar-types";

const SETTINGS_KEY = "calendar_settings";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
  } else if (mode === "light") {
    root.classList.remove("dark");
  } else {
    // system
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<CalendarSettings>(() => load(SETTINGS_KEY, DEFAULT_SETTINGS));

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    applyTheme(settings.theme);
  }, [settings]);

  // Listen for system theme changes
  useEffect(() => {
    if (settings.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [settings.theme]);

  const updateSettings = useCallback((partial: Partial<CalendarSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  return { settings, updateSettings };
}

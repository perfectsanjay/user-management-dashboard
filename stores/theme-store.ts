"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useEffect } from "react"

type ThemeState = {
  dark: boolean
  setDark: (val: boolean) => void
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      dark: false,
      setDark: (val) => set({ dark: val }),
      toggle: () => set({ dark: !get().dark }),
    }),
    { name: "theme-pref" },
  ),
)

// Sync the .dark class with Zustand
export function ThemeWatcher() {
  const dark = useThemeStore((s) => s.dark)
  useEffect(() => {
    const el = document.documentElement
    if (dark) el.classList.add("dark")
    else el.classList.remove("dark")
  }, [dark])
  return null
}

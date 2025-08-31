"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type LoggedInUser = {
  id: number
  name: string
  email?: string
}

type AuthState = {
  currentUser: LoggedInUser | null
  setUser: (user: LoggedInUser | null) => void
}

// Hardcode an existing JSONPlaceholder user as "logged in"
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: { id: 1, name: "Leanne Graham", email: "Sincere@april.biz" },
      setUser: (user) => set({ currentUser: user }),
    }),
    { name: "auth-user" },
  ),
)

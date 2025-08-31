"use client"

import { create } from "zustand"

export type ActivityEntry = {
  id: string
  message: string
  timestamp: number
  type: "add" | "edit" | "delete"
}

type ActivityLogState = {
  entries: ActivityEntry[]
  add: (entry: Omit<ActivityEntry, "id" | "timestamp">) => void
  clear: () => void
}

export const useActivityLog = create<ActivityLogState>()((set) => ({
  entries: [],
  add: (entry) =>
    set((state) => ({
      entries: [{ id: crypto.randomUUID(), timestamp: Date.now(), ...entry }, ...state.entries],
    })),
  clear: () => set({ entries: [] }),
}))

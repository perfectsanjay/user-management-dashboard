"use client"

import * as Switch from "@radix-ui/react-switch"
import { useAuthStore } from "@/stores/auth-store"
import { useThemeStore } from "@/stores/theme-store"
import { UserAvatar } from "@/components/user-avatar"

export function Navbar() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const dark = useThemeStore((s) => s.dark)
  const setDark = useThemeStore((s) => s.setDark)

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-primary" aria-hidden />
          <h1 className="text-lg font-semibold text-pretty">User Dashboard</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Dark mode</span>
            <Switch.Root
              checked={dark}
              onCheckedChange={(v) => setDark(Boolean(v))}
              className="relative h-6 w-11 cursor-pointer rounded-full bg-secondary data-[state=checked]:bg-primary outline-none"
              aria-label="Toggle dark mode"
            >
              <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-primary-foreground transition-transform will-change-transform data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
          </div>

          {currentUser && (
            <div className="flex items-center gap-2">
              <UserAvatar name={currentUser.name} />
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-5">{currentUser.name}</span>
                {currentUser.email && (
                  <span className="text-xs text-muted-foreground leading-4">{currentUser.email}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

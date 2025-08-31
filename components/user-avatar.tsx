"use client"

import { cn } from "@/lib/utils"

export function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean)
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "")
  return initials.join("")
}

export function UserAvatar({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium",
        className,
      )}
      aria-label={`Avatar for ${name}`}
    >
      {getInitials(name)}
    </div>
  )
}
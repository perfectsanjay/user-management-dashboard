"use client"

import { QueryProvider } from "@/components/query-provider"
import { Navbar } from "@/components/navbar"
import { UsersTable } from "@/components/users-table"
import { ThemeWatcher } from "@/stores/theme-store"
import { useActivityLog } from "@/stores/activity-log-store"

export default function Page() {
  return (
    <QueryProvider>
      <ThemeWatcher />
      <div className="min-h-dvh bg-background text-foreground">
        <Navbar />
        <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[1fr_320px]">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Users</h2>
            <UsersTable />
          </section>
          <aside className="space-y-3">
            <ActivityLog />
          </aside>
        </main>
      </div>
    </QueryProvider>
  )
}

function ActivityLog() {
  const entries = useActivityLog((s) => s.entries)
  const clear = useActivityLog((s) => s.clear)
  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <h3 className="text-sm font-medium">Activity Log</h3>
        <button className="text-xs text-destructive" onClick={clear}>
          Clear
        </button>
      </div>
      <div className="max-h-[60vh] overflow-auto">
        {entries.length === 0 ? (
          <div className="px-3 py-4 text-sm text-muted-foreground">No activity yet.</div>
        ) : (
          <ul className="divide-y">
            {entries.map((e) => (
              <li key={e.id} className="px-3 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{e.message}</span>
                  <span className="text-xs text-muted-foreground">{new Date(e.timestamp).toLocaleTimeString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

"use client"

import { QueryProvider } from "@/components/query-provider"
import { Navbar } from "@/components/navbar"
import { ThemeWatcher } from "@/stores/theme-store"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { User } from "@/types/user"
import { useParams } from "next/navigation"

export default function UserDetailPage() {
  return (
    <QueryProvider>
      <ThemeWatcher />
      <UserDetailInner />
    </QueryProvider>
  )
}

function UserDetailInner() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)

  const { data, isLoading, isError } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await api.get<User>(`/users/${id}`)
      return res.data
    },
    enabled: Number.isFinite(id),
  })

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-6">
        {isLoading && <div>Loading...</div>}
        {isError && <div className="text-sm text-destructive">User not found.</div>}
        {data && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-pretty">{data.name}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Info label="Email" value={data.email} />
              <Info label="Phone" value={data.phone} />
              <Info label="Company" value={data.company?.name} />
              <Info
                label="Address"
                value={data.address ? `${data.address.street}, ${data.address.city} ${data.address.zipcode}` : "—"}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-md border p-4">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm">{value || "—"}</div>
    </div>
  )
}

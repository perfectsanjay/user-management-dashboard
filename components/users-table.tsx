"use client"

// Table: fetch users, search by name, sort by email A–Z/Z–A, filter by company (Radix Select)
// Add/Edit via Dialog with optimistic updates, Delete via Confirmation with optimistic removal
import { useMemo, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { User } from "@/types/user"
import { UserAvatar } from "@/components/user-avatar"
import { CompanySelect } from "@/components/company-select"
import { UserFormDialog, type UserFormValues } from "@/components/user-form"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useRouter } from "next/navigation"
import { useActivityLog } from "@/stores/activity-log-store"

type SortOrder = "asc" | "desc"

export function UsersTable() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const addActivity = useActivityLog((s) => s.add)

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get<User[]>("/users")
      return res.data
    },
  })

  const [search, setSearch] = useState("")
  const [companyFilter, setCompanyFilter] = useState<string>("__all")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [page, setPage] = useState(1)
  const pageSize = 5

  const companies = useMemo(
    () => Array.from(new Set(users.map((u) => u.company?.name).filter(Boolean))) as string[],
    [users],
  )

  const filtered = useMemo(() => {
    const byName = users.filter((u) => u.name.toLowerCase().includes(search.trim().toLowerCase()))
    const byCompany = companyFilter === "__all" ? byName : byName.filter((u) => u.company?.name === companyFilter)
    const sorted = [...byCompany].sort((a, b) => {
      const ea = a.email.toLowerCase()
      const eb = b.email.toLowerCase()
      if (ea < eb) return sortOrder === "asc" ? -1 : 1
      if (ea > eb) return sortOrder === "asc" ? 1 : -1
      return 0
    })
    return sorted
  }, [users, search, companyFilter, sortOrder])

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, pageCount)
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage])

  // Mutations with optimistic updates
  const addMutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: { name: values.companyName },
      }
      const res = await api.post("/users", payload)
      return {
        ...(payload as any),
        id: res.data?.id ?? Math.floor(Math.random() * 100000),
      } as User
    },
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: ["users"] })
      const prev = queryClient.getQueryData<User[]>(["users"]) || []
      const temp: User = {
        id: Date.now(),
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: { name: values.companyName },
      }
      queryClient.setQueryData<User[]>(["users"], [...prev, temp])
      addActivity({ type: "add", message: `Added user "${values.name}"` })
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["users"], ctx.prev)
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData<User[]>(["users"], (old = []) =>
        old.map((u) =>
          // replace the optimistic one (Date.now() id) with server id
          String(u.id).length > 10 ? newUser : u,
        ),
      )
    },
  })

  const editMutation = useMutation({
    mutationFn: async (user: User) => {
      const res = await api.patch(`/users/${user.id}`, user)
      return { ...user, ...(res.data || {}) } as User
    },
    onMutate: async (user) => {
      await queryClient.cancelQueries({ queryKey: ["users"] })
      const prev = queryClient.getQueryData<User[]>(["users"]) || []
      queryClient.setQueryData<User[]>(
        ["users"],
        prev.map((u) => (u.id === user.id ? { ...u, ...user } : u)),
      )
      addActivity({ type: "edit", message: `Edited user "${user.name}"` })
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["users"], ctx.prev)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`)
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["users"] })
      const prev = queryClient.getQueryData<User[]>(["users"]) || []
      const removed = prev.find((u) => u.id === id)
      queryClient.setQueryData<User[]>(
        ["users"],
        prev.filter((u) => u.id !== id),
      )
      if (removed) {
        addActivity({ type: "delete", message: `Deleted user "${removed.name}"` })
      }
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["users"], ctx.prev)
    },
  })

  // Dialog state
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  function handleNew() {
    setEditingUser(null)
    setFormOpen(true)
  }

  function handleEdit(u: User) {
    setEditingUser(u)
    setFormOpen(true)
  }

  function handleDelete(u: User) {
    setDeleteId(u.id)
    setConfirmOpen(true)
  }

  function submitForm(values: UserFormValues) {
    if (editingUser) {
      editMutation.mutate({
        ...editingUser,
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: { name: values.companyName },
      })
    } else {
      addMutation.mutate(values)
    }
    setFormOpen(false)
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            aria-label="Search by name"
          />
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            aria-label="Toggle email sort order"
          >
            Sort email {sortOrder === "asc" ? "A–Z" : "Z–A"}
          </button>
          <CompanySelect
            companies={companies}
            value={companyFilter}
            onValueChange={(v) => {
              setCompanyFilter(v)
              setPage(1)
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            onClick={handleNew}
          >
            Add User
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-3 py-3" colSpan={6}>
                  Loading users...
                </td>
              </tr>
            )}
            {!isLoading && paged.length === 0 && (
              <tr>
                <td className="px-3 py-3" colSpan={6}>
                  No users found.
                </td>
              </tr>
            )}
            {paged.map((u) => (
              <tr
                key={u.id}
                className="border-t hover:bg-accent cursor-pointer"
                onClick={() => router.push(`/users/${u.id}`)}
              >
                <td className="px-3 py-2">
                  <UserAvatar name={u.name} />
                </td>
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">{u.phone}</td>
                <td className="px-3 py-2">{u.company?.name}</td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <button
                      className="rounded-md border px-2 py-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(u)
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-md border px-2 py-1 text-xs text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(u)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="px-3 py-3" colSpan={6}>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, total)} of {total}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                    >
                      Prev
                    </button>
                    <button
                      className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                      onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                      disabled={currentPage >= pageCount}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialUser={editingUser}
        onSubmit={submitForm}
        submitting={addMutation.isPending || editMutation.isPending}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete user?"
        description="This action cannot be undone."
        confirmText="Delete"
        onConfirm={() => {
          if (deleteId != null) deleteMutation.mutate(deleteId)
          setConfirmOpen(false)
        }}
      />
    </section>
  )
}

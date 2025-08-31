"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { useEffect, useMemo, useState } from "react"
import type { User } from "@/types/user"

export type UserFormValues = {
  name: string
  email: string
  phone: string
  companyName: string
}

export function UserFormDialog({
  open,
  onOpenChange,
  initialUser,
  onSubmit,
  submitting,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialUser?: User | null
  onSubmit: (values: UserFormValues) => void
  submitting?: boolean
}) {
  const defaults = useMemo<UserFormValues>(
    () => ({
      name: initialUser?.name || "",
      email: initialUser?.email || "",
      phone: initialUser?.phone || "",
      companyName: initialUser?.company?.name || "",
    }),
    [initialUser],
  )

  const [values, setValues] = useState<UserFormValues>(defaults)

  useEffect(() => {
    setValues(defaults)
  }, [defaults])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md border bg-background p-6 shadow-lg">
          <Dialog.Title className="text-base font-semibold">{initialUser ? "Edit User" : "Add User"}</Dialog.Title>
          <form
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit(values)
            }}
          >
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name</label>
              <input
                required
                type="text"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                placeholder="Leanne Graham"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <input
                required
                type="email"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={values.email}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                placeholder="leanne@example.com"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Phone</label>
              <input
                required
                type="text"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={values.phone}
                onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
                placeholder="1-770-736-8031"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Company</label>
              <input
                required
                type="text"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={values.companyName}
                onChange={(e) => setValues((v) => ({ ...v, companyName: e.target.value }))}
                placeholder="Romaguera-Crona"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Dialog.Close asChild>
                <button type="button" className="rounded-md border px-3 py-2 text-sm">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                disabled={submitting}
                type="submit"
                className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {initialUser ? "Save Changes" : "Add User"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

"use client"

import type React from "react"

import * as Select from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons"

export function CompanySelect({
  companies,
  value,
  onValueChange,
}: {
  companies: string[]
  value: string
  onValueChange: (val: string) => void
}) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className="inline-flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm w-56"
        aria-label="Filter by company"
      >
        <Select.Value placeholder="Filter by company" />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="z-50 overflow-hidden rounded-md border bg-popover shadow-sm">
          <Select.Viewport className="p-1">
            <SelectItem value="__all">All companies</SelectItem>
            {companies.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

function SelectItem({
  children,
  value,
}: {
  children: React.ReactNode
  value: string
}) {
  return (
    <Select.Item
      value={value}
      className="flex cursor-pointer select-none items-center gap-2 rounded px-2 py-2 text-sm outline-none hover:bg-accent focus:bg-accent"
    >
      <Select.ItemIndicator className="inline-flex">
        <CheckIcon />
      </Select.ItemIndicator>
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  )
}

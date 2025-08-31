"use client"

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number
  pageSize: number
  total: number
  onPageChange: (next: number) => void
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const prevDisabled = page <= 1
  const nextDisabled = page >= pageCount

  return (
    <div className="flex items-center justify-between">
      <div className="text-xs text-muted-foreground">
        Page {page} of {pageCount} • {total} total
      </div>
      <div className="flex items-center gap-2">
        <button
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          onClick={() => onPageChange(page - 1)}
          disabled={prevDisabled}
        >
          Prev
        </button>
        <button
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          onClick={() => onPageChange(page + 1)}
          disabled={nextDisabled}
        >
          Next
        </button>
      </div>
    </div>
  )
}

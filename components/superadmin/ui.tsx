"use client"

import { useEffect, useState, type ElementType, type ReactNode } from "react"
import { Download, Plus, X } from "lucide-react"

export type Accent = "blue" | "purple"

export const accentBtn: Record<Accent, string> = {
  blue: "bg-blue-600 hover:bg-blue-700",
  purple: "bg-purple-600 hover:bg-purple-700",
}

/* ---------------- formatting helpers ---------------- */

/** "2026-08-01" -> "Aug 1, 2026" */
export function formatDateLong(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

/** "2026-07-25" -> "07/25/2026" */
export function formatDateShort(iso: string | null): string {
  if (!iso) return "—"
  const [y, m, d] = iso.split("-")
  return `${m}/${d}/${y}`
}

/** 4500 -> "$4,500" */
export function formatMoney(n: number): string {
  return `$${n.toLocaleString("en-US")}`
}

/** Client-side CSV export; swap for a backend export endpoint later if needed. */
export function downloadCsv(filename: string, rows: Record<string, string | number | null>[]) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const esc = (v: string | number | null) => `"${String(v ?? "").replace(/"/g, '""')}"`
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }))
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/* ---------------- layout pieces ---------------- */

export function PageHeader({
  title,
  breadcrumb,
  accent = "blue",
  addLabel = "Add New",
  onAdd,
  onExport,
}: {
  title: string
  breadcrumb: string
  accent?: Accent
  addLabel?: string
  onAdd?: () => void
  onExport?: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">{title}</h1>
        <p className="text-[12px] text-gray-500 mt-0.5">{breadcrumb}</p>
      </div>
      <div className="flex items-center gap-2">
        {onExport && (
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12.5px] font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        )}
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12.5px] font-semibold text-white ${accentBtn[accent]}`}
          >
            <Plus className="w-3.5 h-3.5" /> {addLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
}: {
  label: string
  value: ReactNode
  icon: ElementType
  iconClass: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-xs">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div>
        <p className="text-[11px] text-gray-500">{label}</p>
        <p className="text-[18px] font-bold text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  )
}

export function Panel({ title, right, children }: { title: string; right?: ReactNode; children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <h2 className="text-[14px] font-semibold text-gray-900">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  )
}

export function LoadingBlock() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  )
}

export const thClass = "text-left px-5 py-3 text-[10.5px] font-semibold uppercase tracking-wide text-gray-500"
export const tdClass = "px-5 py-3 text-[12px] text-gray-600"

/* ---------------- generic form modal ---------------- */

export interface FormField {
  name: string
  label: string
  type?: "text" | "date" | "time" | "tel" | "number" | "select"
  options?: string[]
  required?: boolean
  placeholder?: string
}

export function FormModal({
  open,
  title,
  fields,
  initialValues,
  accent = "blue",
  submitLabel = "Save",
  onClose,
  onSubmit,
}: {
  open: boolean
  title: string
  fields: FormField[]
  initialValues?: Record<string, string>
  accent?: Accent
  submitLabel?: string
  onClose: () => void
  onSubmit: (values: Record<string, string>) => Promise<void>
}) {
  const getInitial = () => {
    const base = Object.fromEntries(
      fields.map((f) => [f.name, f.type === "select" ? f.options?.[0] ?? "" : ""]),
    )
    return initialValues ? { ...base, ...initialValues } : base
  }
  const [values, setValues] = useState<Record<string, string>>(getInitial)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setValues(getInitial())
    }
  }, [open, initialValues])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit(values)
      setValues(getInitial())
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-[15px] font-semibold text-gray-900">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {fields.map((f) => (
            <label key={f.name} className="block">
              <span className="text-[12px] font-medium text-gray-700">{f.label}</span>
              {f.type === "select" ? (
                <select
                  value={values[f.name]}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white"
                >
                  {f.options?.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type ?? "text"}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={values[f.name]}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px]"
                />
              )}
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-3.5 py-2 text-[12.5px] font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-3.5 py-2 text-[12.5px] font-semibold text-white rounded-lg disabled:opacity-60 ${accentBtn[accent]}`}
          >
            {saving ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}

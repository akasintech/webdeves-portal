"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Pencil, Search } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { VisitorRecord } from "@/lib/types"
import {
  FormModal,
  LoadingBlock,
  PageHeader,
  Panel,
  formatDateLong,
  tdClass,
  thClass,
  type FormField,
} from "@/components/superadmin/ui"

const fields: FormField[] = [
  { name: "name", label: "Visitor Name", required: true },
  { name: "purpose", label: "Purpose", required: true },
  { name: "meetWith", label: "Meet With", required: true },
  { name: "idType", label: "ID Type", type: "select", options: ["National ID", "Passport", "Driver's License"] },
  { name: "timeIn", label: "Time In", type: "time", required: true },
  { name: "timeOut", label: "Time Out", type: "time" },
  { name: "date", label: "Date", type: "date", required: true },
]

/** "13:05" -> "01:05 PM" (form inputs give 24h, the list displays 12h like the design) */
function to12h(t: string): string {
  if (!t) return "—"
  const [h, m] = t.split(":").map(Number)
  return `${String(h % 12 || 12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`
}

export default function VisitorsBookPage() {
  const [visitors, setVisitors] = useState<VisitorRecord[] | null>(null)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => setVisitors(await superAdminService.getVisitors()), [])
  useEffect(() => {
    load()
  }, [load])

  if (!visitors) return <LoadingBlock />

  const q = search.trim().toLowerCase()
  const rows = visitors.filter((v) => !q || [v.name, v.purpose, v.meetWith, v.id].some((s) => s.toLowerCase().includes(q)))

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader title="Visitors Book" breadcrumb="Front Office / Visitors Book" accent="purple" onAdd={() => setModalOpen(true)} />

      <Panel
        title={`Visitor Log — ${formatDateLong(visitors[0]?.date ?? "2026-08-01")}`}
        right={
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search visitors..."
              className="pl-8 pr-3 py-2 w-56 border border-gray-200 rounded-lg text-[12px]"
            />
          </div>
        }
      >
        <div className="overflow-x-auto border-t border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50/60">
              <tr>
                {["ID", "Visitor Name", "Purpose", "Meet With", "ID Type", "Time In", "Time Out", "Date", "Actions"].map((h) => (
                  <th key={h} className={thClass}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((v, i) => (
                <tr key={v.id} className={i % 2 === 1 ? "bg-gray-50/60" : ""}>
                  <td className={`${tdClass} text-gray-400`}>{v.id}</td>
                  <td className={`${tdClass} font-semibold text-gray-900`}>{v.name}</td>
                  <td className={tdClass}>{v.purpose}</td>
                  <td className={tdClass}>{v.meetWith}</td>
                  <td className={tdClass}>{v.idType}</td>
                  <td className={`${tdClass} font-semibold text-emerald-600`}>{v.timeIn}</td>
                  <td className={`${tdClass} font-semibold text-red-500`}>{v.timeOut}</td>
                  <td className={`${tdClass} text-blue-600`}>{formatDateLong(v.date)}</td>
                  <td className={tdClass}>
                    <div className="flex gap-2 text-gray-400">
                      <button type="button" aria-label="View visitor"><Eye className="w-3.5 h-3.5" /></button>
                      <button type="button" aria-label="Edit visitor"><Pencil className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-[12px] text-gray-400">No visitors found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <FormModal
        open={modalOpen}
        title="Add Visitor"
        fields={fields}
        accent="purple"
        onClose={() => setModalOpen(false)}
        onSubmit={async (v) => {
          await superAdminService.createVisitor({
            name: v.name,
            purpose: v.purpose,
            meetWith: v.meetWith,
            idType: v.idType,
            timeIn: to12h(v.timeIn),
            timeOut: to12h(v.timeOut),
            date: v.date,
          })
          setModalOpen(false)
          load()
        }}
      />
    </div>
  )
}

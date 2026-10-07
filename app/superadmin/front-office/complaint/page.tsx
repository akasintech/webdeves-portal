"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, Clock, Eye, Pencil } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { ComplaintResponse, ComplaintStatus } from "@/lib/types"
import {
  FormModal,
  LoadingBlock,
  PageHeader,
  Panel,
  StatCard,
  formatDateLong,
  tdClass,
  thClass,
  type FormField,
} from "@/components/superadmin/ui"

const fields: FormField[] = [
  { name: "complainant", label: "Complainant", required: true },
  { name: "type", label: "Type", type: "select", options: ["Academic", "Facility", "Staff Conduct", "Safety", "Other"] },
  { name: "subject", label: "Subject", required: true },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "assignedTo", label: "Assigned To", required: true },
]

const statusStyle: Record<ComplaintStatus, string> = {
  Open: "bg-red-50 text-red-600",
  "In-Progress": "bg-amber-100 text-amber-700",
  Resolved: "bg-emerald-100 text-emerald-700",
}

export default function ComplaintPage() {
  const [data, setData] = useState<ComplaintResponse | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => setData(await superAdminService.getComplaints()), [])
  useEffect(() => {
    load()
  }, [load])

  if (!data) return <LoadingBlock />

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader title="Complaint" breadcrumb="Front Office / Complaint" accent="purple" onAdd={() => setModalOpen(true)} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Open" value={data.stats.open} icon={AlertCircle} iconClass="bg-red-50 text-red-500" />
        <StatCard label="In Progress" value={data.stats.inProgress} icon={Clock} iconClass="bg-amber-50 text-amber-500" />
        <StatCard label="Resolved" value={data.stats.resolved} icon={CheckCircle2} iconClass="bg-emerald-50 text-emerald-500" />
      </div>

      <Panel title="Complaint Register">
        <div className="overflow-x-auto border-t border-gray-100 mt-6">
          <table className="w-full">
            <thead className="bg-gray-50/60">
              <tr>
                {["ID", "Complainant", "Type", "Subject", "Date", "Assigned To", "Status", "Actions"].map((h) => (
                  <th key={h} className={thClass}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.complaints.map((c) => (
                <tr key={c.id}>
                  <td className={`${tdClass} text-gray-400`}>{c.id}</td>
                  <td className={`${tdClass} font-semibold text-gray-900`}>{c.complainant}</td>
                  <td className={tdClass}>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10.5px]">{c.type}</span>
                  </td>
                  <td className={`${tdClass} max-w-[220px] truncate`} title={c.subject}>{c.subject}</td>
                  <td className={`${tdClass} text-blue-600`}>{formatDateLong(c.date)}</td>
                  <td className={tdClass}>{c.assignedTo}</td>
                  <td className={tdClass}>
                    <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${statusStyle[c.status]}`}>{c.status}</span>
                  </td>
                  <td className={tdClass}>
                    <div className="flex gap-2 text-gray-400">
                      <button type="button" aria-label="View complaint"><Eye className="w-3.5 h-3.5" /></button>
                      <button type="button" aria-label="Edit complaint"><Pencil className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <FormModal
        open={modalOpen}
        title="Add Complaint"
        fields={fields}
        accent="purple"
        onClose={() => setModalOpen(false)}
        onSubmit={async (v) => {
          await superAdminService.createComplaint({
            complainant: v.complainant,
            type: v.type,
            subject: v.subject,
            date: v.date,
            assignedTo: v.assignedTo,
          })
          setModalOpen(false)
          load()
        }}
      />
    </div>
  )
}

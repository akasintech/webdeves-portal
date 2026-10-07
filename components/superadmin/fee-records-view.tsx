"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, Clock, CreditCard, Eye, Pencil, Search } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { FeeRecordsResponse, FeeStatus } from "@/lib/types"
import {
  FormModal,
  LoadingBlock,
  PageHeader,
  Panel,
  StatCard,
  downloadCsv,
  formatDateLong,
  formatMoney,
  tdClass,
  thClass,
  type FormField,
} from "@/components/superadmin/ui"

const fields: FormField[] = [
  { name: "student", label: "Student", required: true },
  { name: "className", label: "Class (e.g. Grade 10-A)", required: true },
  { name: "feeType", label: "Fee Type", required: true, placeholder: "Tuition Fee" },
  { name: "amount", label: "Amount", type: "number", required: true },
  { name: "dueDate", label: "Due Date", type: "date", required: true },
]

const statusStyle: Record<FeeStatus, string> = {
  Paid: "bg-emerald-100 text-emerald-700",
  Partial: "bg-amber-100 text-amber-700",
  Overdue: "bg-red-100 text-red-600",
  Pending: "bg-blue-100 text-blue-600",
}

/** Shared by Collect Fee and Offline Bank Payments (identical layout, different endpoints). */
export function FeeRecordsView({
  title,
  source,
}: {
  title: string
  source: "collect" | "offline"
}) {
  const [data, setData] = useState<FeeRecordsResponse | null>(null)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => setData(await superAdminService.getFeeRecords(source)), [source])
  useEffect(() => {
    load()
  }, [load])

  if (!data) return <LoadingBlock />

  const q = search.trim().toLowerCase()
  const rows = data.records.filter(
    (r) => !q || [r.student, r.id, r.receiptNo ?? "", r.className].some((v) => v.toLowerCase().includes(q)),
  )

  const handleExport = () =>
    downloadCsv(
      `${source}-fee-records.csv`,
      rows.map((r) => ({
        Invoice: r.id,
        Receipt: r.receiptNo,
        Student: r.student,
        Class: r.className,
        "Fee Type": r.feeType,
        Amount: r.amount,
        Paid: r.paid,
        Balance: r.balance,
        "Due Date": r.dueDate,
        Status: r.status,
      })),
    )

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title={title}
        breadcrumb={`Fee Collection / ${title}`}
        onAdd={() => setModalOpen(true)}
        onExport={handleExport}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Collected" value={formatMoney(data.stats.totalCollected)} icon={CreditCard} iconClass="bg-emerald-50 text-emerald-500" />
        <StatCard label="Pending" value={formatMoney(data.stats.pending)} icon={Clock} iconClass="bg-amber-50 text-amber-500" />
        <StatCard label="Overdue" value={formatMoney(data.stats.overdue)} icon={AlertCircle} iconClass="bg-red-50 text-red-500" />
        <StatCard label="Paid Students" value={data.stats.paidStudents} icon={CheckCircle2} iconClass="bg-blue-50 text-blue-500" />
      </div>

      <Panel
        title="Fee Records"
        right={
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student..."
              className="pl-8 pr-3 py-2 w-56 border border-gray-200 rounded-lg text-[12px]"
            />
          </div>
        }
      >
        <div className="overflow-x-auto border-t border-gray-100 mt-4">
          <table className="w-full">
            <thead className="bg-gray-50/60">
              <tr>
                {["Receipt / ID", "Student", "Class", "Fee Type", "Amount", "Paid", "Balance", "Due Date", "Status", "Actions"].map((h) => (
                  <th key={h} className={thClass}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className={tdClass}>
                    <p className="text-[10.5px] text-gray-400">{r.id}</p>
                    <p className="text-[10.5px] font-mono text-blue-600">{r.receiptNo ?? "-"}</p>
                  </td>
                  <td className={`${tdClass} font-semibold text-gray-900`}>{r.student}</td>
                  <td className={tdClass}>{r.className}</td>
                  <td className={tdClass}>{r.feeType}</td>
                  <td className={`${tdClass} font-semibold text-gray-900`}>{formatMoney(r.amount)}</td>
                  <td className={`${tdClass} font-semibold text-emerald-600`}>{formatMoney(r.paid)}</td>
                  <td className={`${tdClass} font-semibold text-red-500`}>{formatMoney(r.balance)}</td>
                  <td className={`${tdClass} ${r.status === "Overdue" ? "text-amber-600" : "text-gray-500"}`}>{formatDateLong(r.dueDate)}</td>
                  <td className={tdClass}>
                    <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${statusStyle[r.status]}`}>{r.status}</span>
                  </td>
                  <td className={tdClass}>
                    <div className="flex gap-2 text-gray-400">
                      <button type="button" aria-label="View record"><Eye className="w-3.5 h-3.5" /></button>
                      <button type="button" aria-label="Edit record"><Pencil className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-[12px] text-gray-400">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <FormModal
        open={modalOpen}
        title={`Add ${title === "Collect Fee" ? "Fee Record" : "Offline Payment"}`}
        fields={fields}
        onClose={() => setModalOpen(false)}
        onSubmit={async (v) => {
          await superAdminService.createFeeRecord(source, {
            student: v.student,
            className: v.className,
            feeType: v.feeType,
            amount: Number(v.amount),
            dueDate: v.dueDate,
          })
          setModalOpen(false)
          load()
        }}
      />
    </div>
  )
}

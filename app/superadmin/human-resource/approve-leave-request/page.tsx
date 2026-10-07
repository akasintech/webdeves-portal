"use client"

import { useCallback, useEffect, useState } from "react"
import { Search, X, Check, Ban } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { LeaveRequestRecord } from "@/lib/types"
import {
  FormModal,
  LoadingBlock,
  PageHeader,
  Panel,
  downloadCsv,
  tdClass,
  thClass,
  type FormField,
} from "@/components/superadmin/ui"

const addLeaveFields: FormField[] = [
  { name: "staffMember", label: "Staff Member", required: true, placeholder: "e.g. Dr. Amara Singh" },
  {
    name: "leaveType",
    label: "Leave Type",
    type: "select",
    options: ["Sick Leave", "Annual Leave", "Emergency Leave", "Study Leave", "Maternity Leave"],
  },
  { name: "from", label: "From Date", required: true, placeholder: "e.g. Aug 4, 2026" },
  { name: "to", label: "To Date", required: true, placeholder: "e.g. Aug 5, 2026" },
  { name: "days", label: "Number of Days", type: "number", required: true, placeholder: "2" },
  { name: "reason", label: "Reason for Leave", required: true, placeholder: "e.g. Medical appointment" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Pending", "Approved", "Rejected"],
  },
]

export default function ApproveLeaveRequestPage() {
  const [requests, setRequests] = useState<LeaveRequestRecord[] | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getLeaveRequests()
      setRequests(res)
    } catch (e) {
      console.error("Failed to load leave requests", e)
      setRequests([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!requests) return <LoadingBlock />

  const filtered = requests.filter((r) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      r.staffMember.toLowerCase().includes(q) ||
      r.leaveType.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      "leave-requests.csv",
      requests.map((r, i) => ({
        "#": i + 1,
        ID: r.id,
        "Staff Member": r.staffMember,
        "Leave Type": r.leaveType,
        From: r.from,
        To: r.to,
        Days: r.days,
        Reason: r.reason,
        Status: r.status,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    await superAdminService.createLeaveRequest({
      staffMember: values.staffMember,
      leaveType: values.leaveType || "Sick Leave",
      from: values.from,
      to: values.to,
      days: parseInt(values.days, 10) || 1,
      reason: values.reason,
      status: (values.status as LeaveRequestRecord["status"]) || "Pending",
    })
    setIsAddOpen(false)
    await load()
  }

  const handleStatusChange = async (id: string, newStatus: "Approved" | "Rejected") => {
    await superAdminService.updateLeaveRequestStatus(id, newStatus)
    setActionSuccess(`Leave request for ${id} has been ${newStatus.toLowerCase()}.`)
    setTimeout(() => setActionSuccess(null), 3000)
    await load()
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Approve Leave Request"
        breadcrumb="Human Resource / Approve Leave Request"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <Panel
        title="Leave Requests"
        right={
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 w-56 border border-gray-200 rounded-lg text-[12.5px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        }
      >
        <div className="overflow-x-auto border-t border-gray-100 mt-2">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/75 border-b border-gray-100">
              <tr>
                <th className={thClass}>ID</th>
                <th className={thClass}>STAFF MEMBER</th>
                <th className={thClass}>LEAVE TYPE</th>
                <th className={thClass}>FROM</th>
                <th className={thClass}>TO</th>
                <th className={thClass}>DAYS</th>
                <th className={thClass}>REASON</th>
                <th className={thClass}>STATUS</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} text-gray-400 font-mono text-xs`}>{item.id}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>{item.staffMember}</td>
                    <td className={tdClass}>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {item.leaveType}
                      </span>
                    </td>
                    <td className={tdClass}>{item.from}</td>
                    <td className={tdClass}>{item.to}</td>
                    <td className={`${tdClass} font-semibold text-gray-700`}>{item.days}</td>
                    <td className={`${tdClass} text-gray-600 max-w-xs truncate`}>{item.reason}</td>
                    <td className={tdClass}>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.status === "Approved"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                            : item.status === "Pending"
                            ? "bg-amber-50 text-amber-600 border border-amber-200/50"
                            : "bg-red-50 text-red-600 border border-red-200/50"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStatusChange(item.id, "Approved")}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold transition-colors shadow-2xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, "Rejected")}
                          className="px-3 py-1 bg-white border border-red-200 hover:bg-red-50 text-red-500 rounded-md text-xs font-semibold transition-colors shadow-2xs"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <FormModal
        open={isAddOpen}
        title="Add Leave Request"
        fields={addLeaveFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}

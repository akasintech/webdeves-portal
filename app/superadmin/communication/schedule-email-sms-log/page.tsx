"use client"

import { useEffect, useState } from "react"
import { MessageSquare, CalendarClock, Plus, Trash2, X, Mail, Clock } from "lucide-react"
import {
  PageHeader,
  Panel,
  LoadingBlock,
  thClass,
  tdClass,
  downloadCsv,
} from "@/components/superadmin/ui"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { ScheduledBroadcastRecord } from "@/lib/types"

export default function ScheduleEmailSmsLogPage() {
  const [scheduled, setScheduled] = useState<ScheduledBroadcastRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  // Modal
  const [addOpen, setAddOpen] = useState(false)
  const [type, setType] = useState<"Email" | "SMS">("Email")
  const [title, setTitle] = useState("")
  const [recipients, setRecipients] = useState("All Students & Staff")
  const [scheduledFor, setScheduledFor] = useState("Aug 15, 2026 09:00 AM")
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    try {
      const res = await superAdminService.getScheduledBroadcasts()
      setScheduled(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAdd = () => {
    setTitle("")
    setType("Email")
    setRecipients("All Students & Staff")
    setScheduledFor("Aug 20, 2026 10:00 AM")
    setAddOpen(true)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      await superAdminService.createScheduledBroadcast({
        type,
        title,
        recipients,
        scheduledFor,
        status: "Scheduled",
      })
      setAddOpen(false)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async (id: string) => {
    if (confirm("Are you sure you want to cancel this scheduled broadcast?")) {
      await superAdminService.cancelScheduledBroadcast(id)
      await loadData()
    }
  }

  if (loading) return <LoadingBlock />

  const filtered = scheduled.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.recipients.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule Email SMS Log"
        breadcrumb="Communication / Schedule Email SMS Log"
        addLabel="Add New"
        onAdd={handleOpenAdd}
        onExport={() =>
          downloadCsv(
            "scheduled-broadcasts.csv",
            scheduled.map((s) => ({
              ID: s.id,
              Type: s.type,
              Title: s.title,
              Recipients: s.recipients,
              ScheduledFor: s.scheduledFor,
              Status: s.status,
            }))
          )
        }
      />

      <Panel
        title="Scheduled Broadcasts Queue"
        right={
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search scheduled..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[12px] px-3 py-1.5 border border-gray-200 rounded-lg w-48 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        }
      >
        {filtered.length === 0 ? (
          /* Centered State from screenshot */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-[15px] font-semibold text-gray-900">No Scheduled Broadcasts</h3>
            <p className="text-[13px] text-gray-500 mt-1 max-w-sm">
              Select a communication option from the sidebar or click &ldquo;Add New&rdquo; above to schedule a broadcast.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12.5px] font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Schedule Broadcast
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className={thClass}>ID</th>
                  <th className={thClass}>TYPE</th>
                  <th className={thClass}>TITLE / SUBJECT</th>
                  <th className={thClass}>RECIPIENTS</th>
                  <th className={thClass}>SCHEDULED FOR</th>
                  <th className={thClass}>STATUS</th>
                  <th className={`${thClass} text-right`}>ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} font-semibold text-gray-900`}>{item.id}</td>
                    <td className={tdClass}>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          item.type === "Email"
                            ? "bg-blue-50 text-blue-600 border border-blue-200/50"
                            : "bg-purple-50 text-purple-600 border border-purple-200/50"
                        }`}
                      >
                        {item.type === "Email" ? (
                          <Mail className="w-3 h-3" />
                        ) : (
                          <MessageSquare className="w-3 h-3" />
                        )}
                        {item.type}
                      </span>
                    </td>
                    <td className={`${tdClass} font-medium text-gray-800 max-w-md`}>
                      {item.title}
                    </td>
                    <td className={tdClass}>{item.recipients}</td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {item.scheduledFor}
                      </div>
                    </td>
                    <td className={tdClass}>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          item.status === "Scheduled"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                            : item.status === "Processing"
                            ? "bg-amber-50 text-amber-600 border border-amber-200/50"
                            : "bg-slate-100 text-slate-600 border border-slate-200/50"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      {item.status === "Scheduled" && (
                        <button
                          type="button"
                          onClick={() => handleCancel(item.id)}
                          title="Cancel Broadcast"
                          className="px-2.5 py-1 text-[11.5px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Add New Scheduled Modal */}
      {addOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-[15px] font-semibold text-gray-900">
                Schedule New Broadcast
              </h3>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  Broadcast Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "Email" | "SMS")}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  Title / Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End of Term Parent Assembly"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  Target Recipients
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. All Students & Parents"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  Scheduled For
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aug 15, 2026 09:00 AM"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="px-3.5 py-2 text-[12.5px] font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-3.5 py-2 text-[12.5px] font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Scheduling..." : "Schedule Broadcast"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

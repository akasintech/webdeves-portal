"use client"

import { useEffect, useState } from "react"
import { Eye, Trash2, X, Plus, Mail, MessageSquare } from "lucide-react"
import {
  PageHeader,
  Panel,
  LoadingBlock,
  thClass,
  tdClass,
  downloadCsv,
} from "@/components/superadmin/ui"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { CommunicationLogRecord } from "@/lib/types"

export default function EmailSmsLogPage() {
  const [logs, setLogs] = useState<CommunicationLogRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"Email" | "SMS">("Email")
  const [search, setSearch] = useState("")

  // Modals
  const [viewRecord, setViewRecord] = useState<CommunicationLogRecord | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  // New Log Form
  const [subject, setSubject] = useState("")
  const [recipients, setRecipients] = useState("350")
  const [status, setStatus] = useState<"Delivered" | "Partial" | "Failed">("Delivered")
  const [opens, setOpens] = useState("280 (80%)")
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    try {
      const res = await superAdminService.getCommunicationLogs()
      setLogs(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAdd = () => {
    setSubject("")
    setRecipients("350")
    setStatus("Delivered")
    setOpens("280 (80%)")
    setAddOpen(true)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim()) return
    setSaving(true)
    try {
      await superAdminService.createCommunicationLog({
        type: activeTab,
        subject,
        recipients: isNaN(Number(recipients)) ? recipients : Number(recipients),
        sentAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        opens,
        status,
      })
      setAddOpen(false)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this log entry?")) {
      await superAdminService.deleteCommunicationLog(id)
      await loadData()
    }
  }

  if (loading) return <LoadingBlock />

  const filteredLogs = logs
    .filter((l) => l.type === activeTab)
    .filter(
      (l) =>
        l.subject.toLowerCase().includes(search.toLowerCase()) ||
        l.id.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Email / SMS Log"
        breadcrumb="Communication / Email / SMS Log"
        addLabel="Add New"
        onAdd={handleOpenAdd}
        onExport={() =>
          downloadCsv(
            `${activeTab.toLowerCase()}-logs.csv`,
            filteredLogs.map((l) => ({
              ID: l.id,
              Type: l.type,
              Subject: l.subject,
              Recipients: l.recipients,
              SentAt: l.sentAt,
              Opens: l.opens,
              Status: l.status,
            }))
          )
        }
      />

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("Email")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors ${
            activeTab === "Email"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Mail className="w-4 h-4" />
          Email Log
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("SMS")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors ${
            activeTab === "SMS"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          SMS Log
        </button>
      </div>

      {/* Table Panel */}
      <Panel
        title={activeTab === "Email" ? "Email Log" : "SMS Log"}
        right={
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()} logs...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[12px] px-3 py-1.5 border border-gray-200 rounded-lg w-52 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className={thClass}>ID</th>
                <th className={thClass}>{activeTab === "Email" ? "SUBJECT" : "MESSAGE"}</th>
                <th className={thClass}>RECIPIENTS</th>
                <th className={thClass}>SENT AT</th>
                <th className={thClass}>{activeTab === "Email" ? "OPENS" : "DELIVERED"}</th>
                <th className={thClass}>STATUS</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[13px] text-gray-500">
                    No {activeTab.toLowerCase()} logs found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} font-semibold text-gray-900`}>{log.id}</td>
                    <td className={`${tdClass} font-medium text-gray-800 max-w-md`}>
                      {log.subject}
                    </td>
                    <td className={tdClass}>
                      {typeof log.recipients === "number"
                        ? log.recipients.toLocaleString("en-US")
                        : log.recipients}
                    </td>
                    <td className={tdClass}>{log.sentAt}</td>
                    <td className={tdClass}>{log.opens}</td>
                    <td className={tdClass}>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          log.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                            : log.status === "Partial"
                            ? "bg-amber-50 text-amber-600 border border-amber-200/50"
                            : "bg-red-50 text-red-600 border border-red-200/50"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewRecord(log)}
                          title="View Log Details"
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(log.id)}
                          title="Delete Log Entry"
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add New Log Modal */}
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
                Log New {activeTab} Dispatch
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
                  {activeTab === "Email" ? "Subject" : "Message Summary"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    activeTab === "Email"
                      ? "e.g. Fee Payment Reminder"
                      : "e.g. Bus delay notice"
                  }
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">
                    Recipients Count
                  </label>
                  <input
                    type="number"
                    required
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "Delivered" | "Partial" | "Failed")
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="Delivered">Delivered</option>
                    <option value="Partial">Partial</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  {activeTab === "Email" ? "Open Rate Metric" : "Delivery Metric"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 248 (79%)"
                  value={opens}
                  onChange={(e) => setOpens(e.target.value)}
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
                {saving ? "Saving..." : "Save Log"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Details Modal */}
      {viewRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {viewRecord.id}
                </span>
                <h3 className="text-[15px] font-semibold text-gray-900">
                  {viewRecord.type} Broadcast Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewRecord(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                  Subject / Message
                </p>
                <p className="text-[14px] font-medium text-gray-900 mt-1">{viewRecord.subject}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                    Recipients
                  </p>
                  <p className="text-[14px] font-semibold text-gray-900 mt-0.5">
                    {typeof viewRecord.recipients === "number"
                      ? viewRecord.recipients.toLocaleString()
                      : viewRecord.recipients}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                    Sent At
                  </p>
                  <p className="text-[13px] text-gray-700 mt-0.5">{viewRecord.sentAt}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                    {viewRecord.type === "Email" ? "Opens" : "Delivered"}
                  </p>
                  <p className="text-[14px] font-semibold text-blue-600 mt-0.5">
                    {viewRecord.opens}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                    Status
                  </p>
                  <span
                    className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                      viewRecord.status === "Delivered"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                        : "bg-amber-50 text-amber-600 border border-amber-200/50"
                    }`}
                  >
                    {viewRecord.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setViewRecord(null)}
                className="px-4 py-2 text-[12.5px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

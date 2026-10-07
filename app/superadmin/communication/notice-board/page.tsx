"use client"

import { useEffect, useState } from "react"
import { Bell, Eye, Pencil, Trash2, X, Plus } from "lucide-react"
import {
  PageHeader,
  StatCard,
  Panel,
  LoadingBlock,
  thClass,
  tdClass,
  downloadCsv,
} from "@/components/superadmin/ui"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { NoticeRecord, NoticeBoardResponse, NoticeAudience, NoticePriority, NoticeStatus } from "@/lib/types"

export default function NoticeBoardPage() {
  const [data, setData] = useState<NoticeBoardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  // Modals
  const [addOpen, setAddOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<NoticeRecord | null>(null)
  const [editRecord, setEditRecord] = useState<NoticeRecord | null>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [audience, setAudience] = useState<NoticeAudience>("All")
  const [priority, setPriority] = useState<NoticePriority>("Medium")
  const [status, setStatus] = useState<NoticeStatus>("Published")
  const [date, setDate] = useState("Aug 1, 2026")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    try {
      const res = await superAdminService.getNoticeBoard()
      setData(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAdd = () => {
    setTitle("")
    setAudience("All")
    setPriority("Medium")
    setStatus("Published")
    setDate(
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    )
    setContent("")
    setAddOpen(true)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      await superAdminService.createNotice({
        title,
        audience,
        date,
        priority,
        status,
        content: content || "Notice content details...",
      })
      setAddOpen(false)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  const handleOpenEdit = (notice: NoticeRecord) => {
    setEditRecord(notice)
    setTitle(notice.title)
    setAudience(notice.audience)
    setPriority(notice.priority)
    setStatus(notice.status)
    setDate(notice.date)
    setContent(notice.content || "")
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editRecord || !title.trim()) return
    setSaving(true)
    try {
      await superAdminService.updateNotice(editRecord.id, {
        title,
        audience,
        date,
        priority,
        status,
        content,
      })
      setEditRecord(null)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      await superAdminService.deleteNotice(id)
      await loadData()
    }
  }

  if (loading || !data) return <LoadingBlock />

  const filteredNotices = data.notices.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.id.toLowerCase().includes(search.toLowerCase()) ||
      n.audience.toLowerCase().includes(search.toLowerCase())
  )

  const audienceBadgeClass = (aud: NoticeAudience) => {
    switch (aud) {
      case "All":
        return "bg-purple-50 text-purple-600 border border-purple-200/50"
      case "Students":
        return "bg-blue-50 text-blue-600 border border-blue-200/50"
      case "Parents":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
      case "Staff":
        return "bg-amber-50 text-amber-600 border border-amber-200/50"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const priorityBadgeClass = (p: NoticePriority) => {
    switch (p) {
      case "High":
        return "bg-red-50 text-red-600 border border-red-200/50"
      case "Medium":
        return "bg-amber-50 text-amber-600 border border-amber-200/50"
      case "Low":
        return "bg-slate-100 text-slate-600 border border-slate-200/50"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notice Board"
        breadcrumb="Communication / Notice Board"
        addLabel="New Notice"
        onAdd={handleOpenAdd}
        onExport={() =>
          downloadCsv(
            "notices.csv",
            data.notices.map((n) => ({
              ID: n.id,
              Title: n.title,
              Audience: n.audience,
              Date: n.date,
              Priority: n.priority,
              Status: n.status,
            }))
          )
        }
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Notices"
          value={data.stats.totalNotices}
          icon={Bell}
          iconClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Published"
          value={data.stats.published}
          icon={Eye}
          iconClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Drafts"
          value={data.stats.drafts}
          icon={Pencil}
          iconClass="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="High Priority"
          value={data.stats.highPriority}
          icon={Bell}
          iconClass="bg-red-50 text-red-600"
        />
      </div>

      {/* Panel */}
      <Panel
        title="Notice Board"
        right={
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[12px] px-3 py-1.5 border border-gray-200 rounded-lg w-48 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className={thClass}>ID</th>
                <th className={thClass}>TITLE</th>
                <th className={thClass}>AUDIENCE</th>
                <th className={thClass}>DATE</th>
                <th className={thClass}>PRIORITY</th>
                <th className={thClass}>STATUS</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNotices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[13px] text-gray-500">
                    No notices found
                  </td>
                </tr>
              ) : (
                filteredNotices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} font-semibold text-gray-900`}>{notice.id}</td>
                    <td className={`${tdClass} font-medium text-gray-800 max-w-md`}>
                      {notice.title}
                    </td>
                    <td className={tdClass}>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${audienceBadgeClass(
                          notice.audience
                        )}`}
                      >
                        {notice.audience}
                      </span>
                    </td>
                    <td className={tdClass}>{notice.date}</td>
                    <td className={tdClass}>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${priorityBadgeClass(
                          notice.priority
                        )}`}
                      >
                        {notice.priority}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          notice.status === "Published"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                            : "bg-slate-100 text-slate-600 border border-slate-200/50"
                        }`}
                      >
                        {notice.status}
                      </span>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewRecord(notice)}
                          title="View Notice"
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(notice)}
                          title="Edit Notice"
                          className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(notice.id)}
                          title="Delete Notice"
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

      {/* New Notice Modal */}
      {addOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-[15px] font-semibold text-gray-900">New Notice</h3>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Sports Day 2026 Guidelines"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as NoticeAudience)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="Students">Students</option>
                    <option value="Parents">Parents</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as NoticePriority)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as NoticeStatus)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Aug 1, 2026"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Notice Details</label>
                <textarea
                  rows={4}
                  placeholder="Enter notice announcement text..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
                {saving ? "Saving..." : "Create Notice"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Notice Modal */}
      {editRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-[15px] font-semibold text-gray-900">Edit Notice ({editRecord.id})</h3>
              <button
                type="button"
                onClick={() => setEditRecord(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as NoticeAudience)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="Students">Students</option>
                    <option value="Parents">Parents</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as NoticePriority)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as NoticeStatus)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Notice Details</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setEditRecord(null)}
                className="px-3.5 py-2 text-[12.5px] font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-3.5 py-2 text-[12.5px] font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Notice Modal */}
      {viewRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {viewRecord.id}
                </span>
                <h3 className="text-[15px] font-semibold text-gray-900">Notice Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewRecord(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <h2 className="text-[17px] font-bold text-gray-900 leading-snug">
                {viewRecord.title}
              </h2>

              <div className="flex flex-wrap gap-2 text-[12px]">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-medium ${audienceBadgeClass(
                    viewRecord.audience
                  )}`}
                >
                  Audience: {viewRecord.audience}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-medium ${priorityBadgeClass(
                    viewRecord.priority
                  )}`}
                >
                  Priority: {viewRecord.priority}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-medium ${
                    viewRecord.status === "Published"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                      : "bg-slate-100 text-slate-600 border border-slate-200/50"
                  }`}
                >
                  {viewRecord.status}
                </span>
                <span className="text-gray-500 py-0.5 ml-auto">Date: {viewRecord.date}</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl text-[13px] text-gray-700 leading-relaxed border border-gray-100 whitespace-pre-wrap">
                {viewRecord.content || "No extended details provided for this notice."}
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

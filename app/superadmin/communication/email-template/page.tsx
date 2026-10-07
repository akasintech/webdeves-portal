"use client"

import { useEffect, useState } from "react"
import { Send, Pencil, Trash2, X, Plus } from "lucide-react"
import {
  PageHeader,
  Panel,
  LoadingBlock,
  thClass,
  tdClass,
  downloadCsv,
} from "@/components/superadmin/ui"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { CommunicationTemplateRecord } from "@/lib/types"

export default function EmailTemplatePage() {
  const [templates, setTemplates] = useState<CommunicationTemplateRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [addOpen, setAddOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<CommunicationTemplateRecord | null>(null)
  const [useRecord, setUseRecord] = useState<CommunicationTemplateRecord | null>(null)

  // Form states
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [category, setCategory] = useState("Finance")
  const [body, setBody] = useState("")
  const [saving, setSaving] = useState(false)
  const [useStatus, setUseStatus] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const res = await superAdminService.getCommunicationTemplates("Email")
      setTemplates(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAdd = () => {
    setTitle("")
    setSubject("")
    setCategory("Finance")
    setBody("")
    setAddOpen(true)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !subject.trim()) return
    setSaving(true)
    try {
      await superAdminService.createCommunicationTemplate({
        type: "Email",
        title,
        subject,
        category,
        body: body || subject,
        variables: [],
        lastUsed: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        updatedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      })
      setAddOpen(false)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  const handleOpenEdit = (tmpl: CommunicationTemplateRecord) => {
    setEditRecord(tmpl)
    setTitle(tmpl.title)
    setSubject(tmpl.subject || "")
    setCategory(tmpl.category || "Finance")
    setBody(tmpl.body || "")
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editRecord || !title.trim()) return
    setSaving(true)
    try {
      setEditRecord(null)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      await superAdminService.deleteCommunicationTemplate(id)
      await loadData()
    }
  }

  const handleUse = (tmpl: CommunicationTemplateRecord) => {
    setUseRecord(tmpl)
    setUseStatus(null)
  }

  const handleDispatchTemplate = async () => {
    if (!useRecord) return
    setSaving(true)
    try {
      await superAdminService.sendEmail({
        recipients: "All Users",
        subject: useRecord.subject || useRecord.title,
        message: useRecord.body,
      })
      setUseStatus("Email dispatched successfully with template!")
      setTimeout(() => {
        setUseRecord(null)
        setUseStatus(null)
      }, 2000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingBlock />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Email Template"
        breadcrumb="Communication / Email Template"
        addLabel="Add New"
        onAdd={handleOpenAdd}
        onExport={() =>
          downloadCsv(
            "email-templates.csv",
            templates.map((t, idx) => ({
              Index: idx + 1,
              TemplateName: t.title,
              Subject: t.subject || "",
              Category: t.category || "",
              LastUsed: t.lastUsed || t.updatedAt,
            }))
          )
        }
      />

      <Panel title="Email Templates">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className={`${thClass} w-12 text-gray-400`}>#</th>
                <th className={thClass}>TEMPLATE NAME</th>
                <th className={thClass}>SUBJECT</th>
                <th className={thClass}>CATEGORY</th>
                <th className={thClass}>LAST USED</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[13px] text-gray-500">
                    No templates found
                  </td>
                </tr>
              ) : (
                templates.map((tmpl, idx) => (
                  <tr key={tmpl.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} text-gray-400 font-medium`}>{idx + 1}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>{tmpl.title}</td>
                    <td className={`${tdClass} text-gray-600 font-normal`}>{tmpl.subject}</td>
                    <td className={tdClass}>
                      <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
                        {tmpl.category || "General"}
                      </span>
                    </td>
                    <td className={`${tdClass} text-gray-500`}>
                      {tmpl.lastUsed || tmpl.updatedAt}
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleUse(tmpl)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-gray-700 rounded-md text-[12px] font-medium transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          Use
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(tmpl)}
                          title="Edit"
                          className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(tmpl.id)}
                          title="Delete"
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

      {/* Add New Template Modal */}
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
              <h3 className="text-[15px] font-semibold text-gray-900">New Email Template</h3>
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
                  Template Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fee Reminder"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fee Payment Due — {month}"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="Finance">Finance</option>
                  <option value="Academic">Academic</option>
                  <option value="Events">Events</option>
                  <option value="HR">HR</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  Body Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Email body text with placeholders like {month}..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
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
                {saving ? "Saving..." : "Save Template"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Use Template Modal */}
      {useRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-[15px] font-semibold text-gray-900">
                Use Template: {useRecord.title}
              </h3>
              <button
                type="button"
                onClick={() => setUseRecord(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <span className="text-[11px] font-semibold uppercase text-gray-400">Subject</span>
                <p className="text-[13.5px] font-medium text-gray-900 mt-0.5">
                  {useRecord.subject}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase text-gray-400">Message</span>
                <div className="mt-1 p-3.5 bg-gray-50 rounded-xl text-[12.5px] text-gray-700 border border-gray-100 leading-relaxed whitespace-pre-wrap">
                  {useRecord.body}
                </div>
              </div>

              {useStatus && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-[12px] rounded-lg font-medium">
                  {useStatus}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setUseRecord(null)}
                className="px-3.5 py-2 text-[12.5px] font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDispatchTemplate}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-[12.5px] font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                {saving ? "Sending..." : "Dispatch Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

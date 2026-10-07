"use client"

import { useEffect, useState } from "react"
import { Send, Eye, CheckCircle2, X, Plus, ShieldCheck } from "lucide-react"
import { PageHeader, Panel, LoadingBlock } from "@/components/superadmin/ui"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { LoginCredentialRecord } from "@/lib/types"

export default function LoginCredentialsSendPage() {
  const [role, setRole] = useState("All Students")
  const [sendVia, setSendVia] = useState("Email")
  const [selectedClass, setSelectedClass] = useState("All Classes")

  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const handleSendCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      const res = await superAdminService.bulkSendLoginCredentials()
      setFeedback(`Login credentials successfully dispatched via ${sendVia} to ${role} (${selectedClass})!`)
      setTimeout(() => setFeedback(null), 5000)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Login Credentials Send"
        breadcrumb="Communication / Login Credentials Send"
        addLabel="Add New"
        onAdd={() => setFeedback("New credential batch configuration created.")}
      />

      {feedback && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[13px] font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Panel matching screenshot media_1791368949951.png */}
      <Panel title="Send Login Credentials">
        <form onSubmit={handleSendCredentials} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
                User Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] bg-white text-gray-800 focus:outline-hidden focus:border-blue-500"
              >
                <option value="All Students">All Students</option>
                <option value="All Parents">All Parents</option>
                <option value="All Staff">All Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
                Send Via
              </label>
              <select
                value={sendVia}
                onChange={(e) => setSendVia(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] bg-white text-gray-800 focus:outline-hidden focus:border-blue-500"
              >
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
                <option value="Both">Both (Email & SMS)</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
                Class (optional)
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] bg-white text-gray-800 focus:outline-hidden focus:border-blue-500"
              >
                <option value="All Classes">All Classes</option>
                <option value="Grade 10-A">Grade 10-A</option>
                <option value="Grade 8-B">Grade 8-B</option>
                <option value="Grade 11-C">Grade 11-C</option>
                <option value="Grade 9-A">Grade 9-A</option>
                <option value="Grade 12-A">Grade 12-A</option>
              </select>
            </div>
          </div>

          {/* Info notification note */}
          <div className="p-3.5 bg-blue-50/50 border border-blue-100/70 rounded-xl text-[12.5px] text-gray-600 leading-relaxed">
            This will send login usernames and auto-generated password reset links to the selected users. Credentials are encrypted and links expire after 24 hours.
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              {sending ? "Sending..." : "Send Credentials"}
            </button>

            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-[13px] font-semibold transition-colors"
            >
              Preview Message
            </button>
          </div>
        </form>
      </Panel>

      {/* Preview Message Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-[15px] font-semibold text-gray-900">
                Preview Credentials Notification ({sendVia})
              </h3>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-[13px] text-gray-700 leading-relaxed font-sans space-y-2">
                <p className="font-semibold text-gray-900">
                  Subject: Your Webdeves School Portal Login Details
                </p>
                <p>Dear {"{User Full Name}"},</p>
                <p>
                  Your portal account for <strong>Webdeves SMS</strong> has been configured.
                </p>
                <div className="p-3 bg-white border border-gray-200 rounded-lg font-mono text-[12px] space-y-1">
                  <div>Username: {"{Student / Staff ID}"}</div>
                  <div>Temporary Access Link: https://school.webdeves.edu/auth/reset?token=***</div>
                </div>
                <p className="text-[11.5px] text-gray-500">
                  * For security purposes, this password activation link will expire in 24 hours.
                </p>
              </div>
            </div>
            <div className="flex justify-end px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-2 text-[12.5px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Send, Calendar, BookmarkCheck, CheckCircle2, Clock } from "lucide-react"
import { PageHeader, Panel, LoadingBlock } from "@/components/superadmin/ui"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { CommunicationStats } from "@/lib/types"

export default function SendSmsPage() {
  const [stats, setStats] = useState<CommunicationStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Form states
  const [recipients, setRecipients] = useState("All Users")
  const [message, setMessage] = useState("")
  const [scheduleDate, setScheduleDate] = useState("")
  const [showScheduleInput, setShowScheduleInput] = useState(false)

  // Submitting states
  const [sending, setSending] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const loadStats = async () => {
    try {
      const res = await superAdminService.getCommunicationStats()
      setStats(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handleSendNow = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      alert("Please enter an SMS message.")
      return
    }

    setSending(true)
    try {
      await superAdminService.sendSms({
        recipients,
        message,
      })
      setSuccessMessage("SMS broadcast dispatched successfully to " + recipients + "!")
      setMessage("")
      setShowScheduleInput(false)
      await loadStats()
      setTimeout(() => setSuccessMessage(null), 5000)
    } finally {
      setSending(false)
    }
  }

  const handleSchedule = async () => {
    if (!message.trim()) {
      alert("Please enter an SMS message before scheduling.")
      return
    }
    if (!scheduleDate) {
      setShowScheduleInput(true)
      return
    }

    setSending(true)
    try {
      await superAdminService.createScheduledBroadcast({
        type: "SMS",
        title: message.slice(0, 30) + (message.length > 30 ? "..." : ""),
        recipients,
        scheduledFor: scheduleDate,
        status: "Scheduled",
      })
      setSuccessMessage("SMS scheduled for " + scheduleDate + " successfully!")
      setMessage("")
      setScheduleDate("")
      setShowScheduleInput(false)
      setTimeout(() => setSuccessMessage(null), 5000)
    } finally {
      setSending(false)
    }
  }

  const handleSaveDraft = () => {
    if (!message.trim()) {
      alert("Please enter a message to save as draft.")
      return
    }
    setSuccessMessage("SMS draft saved successfully!")
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  if (loading || !stats) return <LoadingBlock />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Send SMS"
        breadcrumb="Communication / Send SMS"
        addLabel="New SMS"
        onAdd={() => setMessage("")}
      />

      {successMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[13px] font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Send SMS */}
        <div className="lg:col-span-2">
          <Panel title="Send SMS">
            <form onSubmit={handleSendNow} className="p-6 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
                  Recipients
                </label>
                <select
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] bg-white text-gray-800 focus:outline-hidden focus:border-blue-500"
                >
                  <option value="All Users">All Users</option>
                  <option value="Students">Students</option>
                  <option value="Parents">Parents</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[12px] font-medium text-gray-700">
                    Message
                  </label>
                  <span
                    className={`text-[11px] ${
                      message.length > 160 ? "text-red-500 font-bold" : "text-gray-400"
                    }`}
                  >
                    {message.length} / 160 characters
                  </span>
                </div>
                <textarea
                  required
                  rows={6}
                  maxLength={160}
                  placeholder="Type your SMS message (max 160 chars)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-blue-500 resize-y"
                />
              </div>

              {showScheduleInput && (
                <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-blue-900 text-[12px] font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Select Schedule Date & Time
                  </div>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full border border-blue-200 rounded-lg px-3 py-2 text-[13px] bg-white text-gray-800 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              )}

              {/* Action buttons row */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sending ? "Sending..." : "Send Now"}
                </button>

                <button
                  type="button"
                  onClick={handleSchedule}
                  disabled={sending}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-[13px] font-semibold transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {showScheduleInput && scheduleDate ? "Confirm Schedule" : "Schedule"}
                </button>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex items-center gap-1 px-3 py-2.5 text-gray-600 hover:text-gray-900 text-[13px] font-medium transition-colors"
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  Save Draft
                </button>
              </div>
            </form>
          </Panel>
        </div>

        {/* Right column: Quick Stats */}
        <div className="lg:col-span-1">
          <Panel title="Quick Stats">
            <div className="p-6 space-y-6 divide-y divide-gray-100">
              <div>
                <p className="text-[12px] text-gray-500 font-medium">SMS Sent This Month</p>
                <p className="text-[26px] font-bold text-blue-600 mt-1 leading-tight">
                  {stats.smsSent}
                </p>
              </div>

              <div className="pt-6">
                <p className="text-[12px] text-gray-500 font-medium">Delivery Rate</p>
                <p className="text-[26px] font-bold text-emerald-600 mt-1 leading-tight">
                  {stats.deliveryRate}
                </p>
              </div>

              <div className="pt-6">
                <p className="text-[12px] text-gray-500 font-medium">Total Recipients</p>
                <p className="text-[26px] font-bold text-purple-600 mt-1 leading-tight">
                  {stats.totalRecipients}
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

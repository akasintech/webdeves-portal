"use client"

import { useState } from "react"
import { mockLeaveApplications, leaveTypes } from "@/lib/mock-data/leave"
import { CheckCircle2, Clock, XCircle, Calendar } from "lucide-react"

const statusConfig = {
  Approved: { color: "bg-green-50 text-green-700", icon: CheckCircle2, iconColor: "text-green-500" },
  Pending: { color: "bg-yellow-50 text-yellow-700", icon: Clock, iconColor: "text-yellow-500" },
  Rejected: { color: "bg-red-50 text-red-700", icon: XCircle, iconColor: "text-red-500" },
}

export default function ApplyLeavePage() {
  const [form, setForm] = useState({ type: "", fromDate: "", toDate: "", reason: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setForm({ type: "", fromDate: "", toDate: "", reason: "" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">Apply for Leave</h1>
        <p className="text-[14px] text-gray-500 mt-0.5">Submit a leave request to your instructor.</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Application Form */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-[15px] font-bold text-gray-900 mb-5">New Leave Application</h2>
          {submitted && (
            <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 text-green-700 text-[13px]">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              Leave application submitted successfully!
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-600 mb-1.5">Leave Type</label>
              <select
                required
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Select leave type</option>
                {leaveTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-600 mb-1.5">From Date</label>
                <input
                  type="date"
                  required
                  value={form.fromDate}
                  onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-600 mb-1.5">To Date</label>
                <input
                  type="date"
                  required
                  value={form.toDate}
                  onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-600 mb-1.5">Reason</label>
              <textarea
                required
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Describe the reason for your leave..."
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white text-[13px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Submit Application
            </button>
          </form>
        </div>

        {/* Leave History */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-[15px] font-bold text-gray-900 mb-5">Leave History</h2>
          <div className="space-y-3">
            {mockLeaveApplications.map((leave) => {
              const config = statusConfig[leave.status as keyof typeof statusConfig]
              const Icon = config.icon
              return (
                <div key={leave.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13px] font-bold text-gray-900">{leave.type}</p>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${config.color}`}>
                      <Icon className={`w-3 h-3 ${config.iconColor}`} />
                      {leave.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-gray-500 mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {leave.fromDate} → {leave.toDate} · {leave.days} day{leave.days > 1 ? "s" : ""}
                  </div>
                  <p className="text-[12px] text-gray-500">{leave.reason}</p>
                  {leave.approvedBy && (
                    <p className="text-[11px] text-gray-400 mt-1.5">Approved by: {leave.approvedBy}</p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-0.5">Applied: {leave.appliedOn}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

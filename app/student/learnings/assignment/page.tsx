"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, User, Eye, Upload } from "lucide-react"
import { mockStudentApi } from "@/lib/mock-api"

const statusStyles: Record<string, string> = {
  Pending: "bg-blue-50 text-blue-600 border border-blue-200",
  Submitted: "bg-green-50 text-green-600 border border-green-200",
  Overdue: "bg-red-500 text-white",
}

export default function AssignmentPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming")
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await mockStudentApi.getAllAssignments()
        setAssignments(data)
      } catch (error) {
        console.error("Failed to load assignments", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const displayed = assignments.filter((a) =>
    activeTab === "upcoming" ? a.status !== "Submitted" : a.status === "Submitted"
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">Assignments</h1>
        <p className="text-[14px] text-gray-500 mt-0.5">View and submit your assignments</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-5 py-2 rounded-lg text-[13px] font-semibold border transition-colors ${
            activeTab === "upcoming"
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          Upcoming Assignments
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-5 py-2 rounded-lg text-[13px] font-semibold border transition-colors ${
            activeTab === "completed"
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          Completed Assignments
        </button>
      </div>

      {/* Assignment Cards */}
      <div className="space-y-4">
        {displayed.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-5">
            {/* Header row */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-[15px] font-bold text-gray-900">{a.title}</h3>
                <span className={`text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyles[a.status]}`}>
                  {a.status}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="flex items-center gap-1.5 text-[12.5px] font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                {a.status !== "Submitted" && (
                  <button className="flex items-center gap-1.5 bg-blue-600 text-white text-[12.5px] font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> Submit
                  </button>
                )}
              </div>
            </div>

            {/* Subject + class */}
            <p className="text-[13px] mb-3">
              <span className="text-blue-500 font-semibold">{a.subject}</span>
              <span className="text-gray-400 mx-1.5">•</span>
              <span className="text-gray-500">{a.class}</span>
            </p>

            {/* Description */}
            <p className="text-[13px] text-gray-600 mb-4">{a.description}</p>

            {/* Meta row */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3" /> Assigned Date
                </p>
                <p className="text-[13.5px] font-bold text-gray-900">{a.assignedDate}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3" /> Due Date
                </p>
                <p className="text-[13.5px] font-bold text-gray-900">{a.dueDate}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-1">
                  <User className="w-3 h-3" /> Max Marks
                </p>
                <p className="text-[13.5px] font-bold text-gray-900">{a.maxMarks}</p>
              </div>
            </div>
          </div>
        ))}

        {displayed.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
            <p className="text-[14px] text-gray-400">No {activeTab} assignments.</p>
          </div>
        )}
      </div>
    </div>
  )
}

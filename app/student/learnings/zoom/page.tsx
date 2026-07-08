"use client"

import { useState, useEffect } from "react"
import { Clock, User } from "lucide-react"
import { mockStudentApi } from "@/lib/mock-api"

export default function ZoomOnlineClassPage() {
  const [zoomClasses, setZoomClasses] = useState<any[]>([])
  const [pendingAssignments, setPendingAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [classes, assignmentsData] = await Promise.all([
          mockStudentApi.getZoomClasses(),
          mockStudentApi.getAllAssignments()
        ])
        setZoomClasses(classes)
        setPendingAssignments(assignmentsData.filter(a => a.status === "Pending").slice(0, 2))
      } catch (error) {
        console.error("Failed to load zoom page data", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">Zoom Online Class</h1>
        <p className="text-[14px] text-gray-500 mt-0.5">Join your live classes and complete pending assignments.</p>
      </div>

      {/* Live class today */}
      <div>
        <h2 className="text-[15px] font-bold text-gray-900 mb-3">Live class today</h2>
        <div className="space-y-3">
          {zoomClasses.map((cls) => (
            <div
              key={cls.id}
              className="rounded-xl p-6 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, #3730a3 0%, #4338ca 50%, #6366f1 100%)" }}
            >
              <div className="text-white">
                <p className="text-[16px] font-bold mb-0.5">{cls.type}</p>
                <p className="text-[13.5px] text-indigo-200 mb-3">{cls.subject}</p>
                <div className="flex items-center gap-4 text-[12.5px] text-indigo-200">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {cls.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> {cls.tutor}
                  </span>
                </div>
              </div>
              <button className="bg-white text-indigo-700 text-[13px] font-bold px-5 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors flex-shrink-0">
                Join Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Assignment */}
      <div>
        <h2 className="text-[15px] font-bold text-gray-900 mb-3">Pending Assignment</h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-[13.5px] font-semibold text-gray-900">MERN Stack E-commerce App</span>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingAssignments.map((a) => (
              <div key={a.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[13.5px] font-bold text-gray-900">{a.title}</p>
                  <p className="text-[12px] text-blue-500 font-medium mt-0.5">{a.category} {a.type}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">Due: {a.dueDate}</p>
                </div>
                <button className="bg-gray-900 text-white text-[13px] font-bold px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors">
                  Submit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

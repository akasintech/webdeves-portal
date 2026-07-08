"use client"

import { useState, useEffect } from "react"
import { BookOpen, Download } from "lucide-react"
import { mockStudentApi } from "@/lib/mock-api"

const statusStyles: Record<string, string> = {
  Completed: "bg-green-50 text-green-700 border border-green-200",
  "In Progress": "bg-blue-50 text-blue-700 border border-blue-200",
  Upcoming: "bg-gray-100 text-gray-500",
}

export default function LessonPlanPage() {
  const [lessonPlans, setLessonPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await mockStudentApi.getLessonPlans()
        setLessonPlans(data)
      } catch (error) {
        console.error("Failed to load lesson plans", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">Lesson Plan</h1>
        <p className="text-[14px] text-gray-500 mt-0.5">View your weekly lesson plans and topics</p>
      </div>

      <div className="space-y-3">
        {lessonPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between hover:border-gray-200 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-[13px] text-blue-500 font-semibold mb-0.5">{plan.subject}</p>
                <h3 className="text-[14.5px] font-bold text-gray-900">{plan.topic}</h3>
                <div className="flex items-center gap-3 mt-1 text-[12px] text-gray-400">
                  <span>{plan.week}</span>
                  <span>·</span>
                  <span>Instructor: {plan.instructor}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${statusStyles[plan.status]}`}>
                {plan.status}
              </span>
              <button className="text-gray-400 hover:text-primary transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

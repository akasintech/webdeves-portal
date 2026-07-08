"use client"

import { useState, useEffect } from "react"
import { FileText, Download, ChevronRight } from "lucide-react"
import { mockStudentApi } from "@/lib/mock-api"

export default function SyllabusPage() {
  const [syllabuses, setSyllabuses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await mockStudentApi.getSyllabuses()
        setSyllabuses(data)
      } catch (error) {
        console.error("Failed to load syllabuses", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

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
        <h1 className="text-[22px] font-bold text-gray-900">Syllabus</h1>
        <p className="text-[14px] text-gray-500 mt-0.5">View course syllabus and track your topic coverage</p>
      </div>

      <div className="space-y-4">
        {syllabuses.map((syl) => {
          const pct = Math.round((syl.completedTopics / syl.totalTopics) * 100)
          return (
            <div key={syl.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[15px] font-bold text-gray-900">{syl.subject}</h3>
                  <button className="text-gray-400 hover:text-primary transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[12.5px] text-gray-500 mb-2">
                  <span>{syl.completedTopics} / {syl.totalTopics} topics covered</span>
                  <span className="font-bold text-gray-900">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {syl.units.map((unit) => {
                  const unitPct = Math.round((unit.completed / unit.topics) * 100)
                  return (
                    <div key={unit.name} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-[13.5px] font-semibold text-gray-900">{unit.name}</p>
                          <p className="text-[12px] text-gray-400">{unit.completed}/{unit.topics} topics</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${unitPct === 100 ? "bg-green-500" : unitPct > 0 ? "bg-blue-500" : "bg-gray-200"}`}
                            style={{ width: `${unitPct}%` }}
                          />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

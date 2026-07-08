"use client"

import { useState } from "react"
import { mockNotices } from "@/lib/mock-data/notices"

const priorityConfig: Record<string, { label: string; badgeClass: string }> = {
  Important: { label: "Important", badgeClass: "bg-red-500 text-white" },
  General: { label: "General", badgeClass: "bg-gray-200 text-gray-700" },
}

export default function NoticeBoardPage() {
  const [activeTab, setActiveTab] = useState<"new" | "read">("new")

  const newNotices = mockNotices.filter((n) => !n.read)
  const readNotices = mockNotices.filter((n) => n.read)
  const displayed = activeTab === "new" ? newNotices : readNotices

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">Notice Board</h1>
        <p className="text-[14px] text-gray-500 mt-0.5">Stay updated with important announcements.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab("new")}
          className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
            activeTab === "new"
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          New ({newNotices.length})
        </button>
        <button
          onClick={() => setActiveTab("read")}
          className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
            activeTab === "read"
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          Read ({readNotices.length})
        </button>
      </div>

      {/* Notice Cards */}
      <div className="space-y-3">
        {displayed.map((notice) => {
          const pConfig = priorityConfig[notice.priority] || priorityConfig.General
          return (
            <div key={notice.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-stretch hover:shadow-sm transition-shadow">
              {/* Left blue accent border */}
              <div className="w-1 bg-blue-500 rounded-full mr-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[14px] font-bold text-gray-900">{notice.title}</h3>
                    <p className="text-[12px] text-gray-400 mt-0.5">{notice.date}</p>
                  </div>
                  <span className={`text-[11.5px] font-semibold px-3 py-1 rounded-full flex-shrink-0 ${pConfig.badgeClass}`}>
                    {pConfig.label}
                  </span>
                </div>
                <p className="text-[13px] text-gray-500 mt-2.5 leading-relaxed">{notice.content}</p>
              </div>
            </div>
          )
        })}

        {displayed.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
            <p className="text-[14px] text-gray-400">No {activeTab} notices at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface AttendanceModalProps {
  isOpen: boolean
  onClose: () => void
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const calendarDays = [
  // First row
  { date: null, status: null },
  { date: null, status: null },
  { date: 1, status: "Present" },
  { date: 2, status: "No Attendance" },
  { date: 3, status: "Late" },
  { date: 4, status: "Holiday" },
  { date: 5, status: "No Attendance" },
  // Second row
  { date: 6, status: "No Attendance" },
  { date: 7, status: "Absent" },
  { date: 8, status: "Present" },
  { date: 9, status: "No Attendance" },
  { date: 10, status: "Late" },
  { date: 11, status: "Present" },
  { date: 12, status: "No Attendance" },
  // Third row
  { date: 13, status: "Present" },
  { date: 14, status: "Present" },
  { date: 15, status: "Present" },
  { date: 16, status: "Holiday" },
  { date: 17, status: "No Attendance" },
  { date: 18, status: "No Attendance" },
  { date: 19, status: "No Attendance" },
  // Fourth row
  { date: 20, status: null },
  { date: 21, status: null },
  { date: 22, status: null },
  { date: 23, status: null },
  { date: 24, status: null },
  { date: 25, status: null },
  { date: 26, status: null },
]

const statusStyles: Record<string, string> = {
  Present: "bg-[#00b050] text-white", // Green
  Absent: "bg-[#ff0000] text-white", // Red
  Late: "bg-[#ffc000] text-white", // Yellow
  Holiday: "bg-[#a5b1c2] text-white", // Gray-blue
  "No Attendance": "text-gray-400 border border-gray-200",
}

export function AttendanceModal({ isOpen, onClose }: AttendanceModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden m-4 z-10 flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-gray-900">Attendance</h2>
            <p className="text-[13px] text-gray-500 mt-0.5">View and manage your attendance records</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-[15px] font-bold text-gray-900">April 2026</h3>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            {/* Days header */}
            <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100">
              {days.map((day) => (
                <div key={day} className="py-3 text-center text-[12px] font-semibold text-gray-500 border-r border-gray-100 last:border-0">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar body */}
            <div className="grid grid-cols-7">
              {calendarDays.map((item, i) => (
                <div 
                  key={i} 
                  className={`min-h-[90px] p-2 border-r border-b border-gray-100 ${
                    i % 7 === 6 ? "border-r-0" : ""
                  }`}
                >
                  {item.date && (
                    <div className="flex flex-col h-full">
                      <span className="text-[13px] font-bold text-gray-900 mb-2">{item.date}</span>
                      {item.status && (
                        <div className="mt-auto">
                          {item.status === "No Attendance" ? (
                            <div className="text-[10px] font-semibold text-gray-400 text-center py-1">
                              No Attendance
                            </div>
                          ) : (
                            <div className={`text-[11px] font-bold text-center py-1 rounded-md w-fit px-3 mx-auto ${statusStyles[item.status]}`}>
                              {item.status}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

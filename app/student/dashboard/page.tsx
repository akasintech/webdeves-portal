"use client"

import { BookOpen, CheckCircle2, ClipboardList, DollarSign, Clock, TrendingUp } from "lucide-react"

const stats = [
  { label: "Total Courses", value: "3", icon: BookOpen, iconBg: "bg-blue-50", iconColor: "text-blue-400" },
  { label: "Attendance", value: "92%", icon: CheckCircle2, iconBg: "bg-green-50", iconColor: "text-green-400" },
  { label: "Assignments", value: "5", icon: ClipboardList, iconBg: "bg-orange-50", iconColor: "text-orange-400" },
  { label: "Fees Due", value: "$850", icon: DollarSign, iconBg: "bg-red-50", iconColor: "text-red-400" },
]

const upcomingClasses = [
  { id: 1, name: "Web Development", time: "10:00 AM - 12:00 PM", tutor: "Prof. Smith" },
  { id: 2, name: "Mobile App Development", time: "2:00 PM - 4:00 PM", tutor: "Prof. Johnson" },
  { id: 3, name: "Database Design", time: "4:30 PM - 6:00 PM", tutor: "Prof. Williams" },
]

const courseProgress = [
  { name: "Full Stack Web Development", progress: 75, completed: 30, total: 40 },
  { name: "Mobile App Development", progress: 50, completed: 15, total: 30 },
  { name: "Database Management", progress: 60, completed: 15, total: 25 },
]

const assignments = [
  {
    id: 1,
    title: "React Project - E-commerce Site",
    subject: "Web Development",
    dueDate: "2026-04-15",
    status: "Pending",
  },
  {
    id: 2,
    title: "Database Schema Design",
    subject: "Database Design",
    dueDate: "2026-04-12",
    status: "Overdue",
  },
  {
    id: 3,
    title: "Flutter App Development",
    subject: "Mobile Dev",
    dueDate: "2026-04-20",
    status: "Submitted",
  },
]

const statusConfig: Record<string, { badge: string; btn: string | null }> = {
  Pending: { badge: "bg-gray-100 text-gray-600 border border-gray-200", btn: "bg-gray-900 text-white hover:bg-gray-700" },
  Overdue: { badge: "bg-red-500 text-white", btn: "bg-red-500 text-white hover:bg-red-600" },
  Submitted: { badge: "bg-green-500 text-white", btn: null },
}

export default function StudentDashboard() {
  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">Welcome back, John!</h1>
        <p className="text-[14px] text-gray-500 mt-0.5">Here's what's happening with your learning today.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <p className="text-[12px] text-gray-500 mb-1">{stat.label}</p>
              <p className="text-[28px] font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.iconBg}`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Classes + Progress */}
      <div className="grid grid-cols-2 gap-4">
        {/* Upcoming Classes */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-[14px] font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4" /> Upcoming Classes Today
          </h2>
          <div className="space-y-3">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-[13.5px] font-bold text-gray-900">{cls.name}</p>
                  <p className="text-[12px] text-blue-500 font-medium mt-0.5">{cls.time}</p>
                  <p className="text-[11.5px] text-gray-400 mt-0.5">Tutor: {cls.tutor}</p>
                </div>
                <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-[12.5px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-[14px] font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4" /> Course Progress
          </h2>
          <div className="space-y-5">
            {courseProgress.map((course) => (
              <div key={course.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[13.5px] font-bold text-gray-900">{course.name}</p>
                  <p className="text-[13px] font-semibold text-gray-900">{course.progress}%</p>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <p className="text-[11.5px] text-gray-400">{course.completed} of {course.total} lessons completed</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-[14px] font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <ClipboardList className="w-4 h-4" /> Recent Assignments
        </h2>
        <div className="space-y-0 divide-y divide-gray-50">
          {assignments.map((a) => {
            const cfg = statusConfig[a.status]
            return (
              <div key={a.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-[13.5px] font-bold text-gray-900">{a.title}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">{a.subject}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[11.5px] text-gray-400 mb-1">Due: {a.dueDate}</p>
                    {a.status === "Overdue" && (
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${cfg.badge}`}>
                        Overdue
                      </span>
                    )}
                    {a.status === "Pending" && (
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${cfg.badge}`}>
                        Pending
                      </span>
                    )}
                  </div>
                  {cfg.btn ? (
                    <button className={`px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-colors ${cfg.btn}`}>
                      Submit
                    </button>
                  ) : (
                    <span className="text-[12px] font-semibold px-4 py-2 rounded-lg bg-green-500 text-white">
                      Submitted
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

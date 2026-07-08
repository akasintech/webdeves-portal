"use client"

import { Users, Clock, ClipboardList, TrendingUp, BookOpen, Calendar } from "lucide-react"

const stats = [
  { label: "Assigned Students", value: "75", icon: Users, iconBg: "bg-blue-50", iconColor: "text-blue-400" },
  { label: "Classes Today", value: "3", icon: Clock, iconBg: "bg-green-50", iconColor: "text-green-400" },
  { label: "Pending Assignments", value: "12", icon: ClipboardList, iconBg: "bg-orange-50", iconColor: "text-orange-400" },
  { label: "Avg Attendance", value: "88%", icon: TrendingUp, iconBg: "bg-purple-50", iconColor: "text-purple-400" },
]

const todayClasses = [
  { id: 1, name: "Full Stack Web Development", time: "10:00 AM - 12:00 PM", students: 28 },
  { id: 2, name: "Mobile App Development", time: "2:00 PM - 4:00 PM", students: 22 },
  { id: 3, name: "Database Design", time: "4:30 PM - 6:00 PM", students: 25 },
]

const assignmentProgress = [
  { id: 1, title: "React Project", subject: "Web Dev", dueDate: "2026-04-15", submitted: 18, total: 28 },
  { id: 2, title: "Database Schema", subject: "DB Design", dueDate: "2026-04-12", submitted: 22, total: 25 },
  { id: 3, title: "Flutter App", subject: "Mobile Dev", dueDate: "2026-04-20", submitted: 20, total: 22 },
]

const studentOverview = [
  { id: 1, name: "John Doe", subject: "Web Dev", attendance: 95, performance: "Excellent", performanceBg: "bg-green-500 text-white" },
  { id: 2, name: "Jane Smith", subject: "Web Dev", attendance: 88, performance: "Good", performanceBg: "border border-gray-300 text-gray-700" },
  { id: 3, name: "Mike Johnson", subject: "Web Dev", attendance: 72, performance: "Needs Attention", performanceBg: "bg-red-500 text-white" },
  { id: 4, name: "Sarah Williams", subject: "Web Dev", attendance: 90, performance: "Good", performanceBg: "border border-gray-300 text-gray-700" },
]

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("")
}

const avatarColors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500"]

export default function InstructorDashboard() {
  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">Welcome, Prof. Smith!</h1>
        <p className="text-[14px] text-gray-500 mt-0.5">Manage your classes and students effectively.</p>
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

      {/* Middle Row: Today's Classes + Assignment Progress */}
      <div className="grid grid-cols-2 gap-4">
        {/* Today's Classes */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Today's Classes
            </h2>
            <button className="text-[12px] font-semibold text-gray-500 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {todayClasses.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-[13.5px] font-bold text-gray-900">{cls.name}</p>
                  <p className="text-[12px] text-blue-500 font-medium mt-0.5">{cls.time}</p>
                  <p className="text-[11.5px] text-gray-400 mt-0.5">{cls.students} Students</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-[12px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    Join
                  </button>
                  <button className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-[12px] font-semibold hover:bg-gray-700 transition-colors">
                    Attendance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignment Progress */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4" /> Assignment Progress
            </h2>
            <button className="text-[12px] font-semibold text-gray-500 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors">
              Create New
            </button>
          </div>
          <div className="space-y-5">
            {assignmentProgress.map((a) => (
              <div key={a.id}>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-[13.5px] font-bold text-gray-900">{a.title}</p>
                    <p className="text-[11.5px] text-gray-400 mt-0.5">{a.subject}</p>
                  </div>
                  <span className="text-[11px] text-gray-400">Due: {a.dueDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(a.submitted / a.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-medium text-gray-600 w-12 text-right">
                    {a.submitted}/{a.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Overview */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4" /> Student Overview - Web Development Class
          </h2>
          <button className="px-4 py-2 bg-gray-900 text-white text-[12.5px] font-semibold rounded-lg hover:bg-gray-700 transition-colors">
            View Full List
          </button>
        </div>
        <div className="space-y-0 divide-y divide-gray-50">
          {studentOverview.map((student, idx) => (
            <div key={student.id} className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold ${avatarColors[idx % avatarColors.length]}`}>
                  {getInitials(student.name)}
                </div>
                <div>
                  <p className="text-[13.5px] font-bold text-gray-900">{student.name}</p>
                  <p className="text-[11.5px] text-gray-400">{student.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[14px] font-bold text-gray-900">{student.attendance}%</p>
                  <p className="text-[11px] text-gray-400">Attendance</p>
                </div>
                <span className={`text-[11.5px] font-semibold px-3 py-1 rounded-full ${student.performanceBg}`}>
                  {student.performance === "Excellent" && "✓ "}{student.performance === "Needs Attention" && "⊘ "}{student.performance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

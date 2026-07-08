"use client"

import { useState } from "react"
import { BookOpen, Users, Clock, Calendar, CheckCircle2, MoreVertical, Plus } from "lucide-react"

const courses = [
  {
    id: 1,
    name: "Full Stack Web Development",
    code: "WEB-101",
    students: 28,
    duration: "12 Weeks",
    progress: 75,
    status: "Active",
    schedule: "Mon, Wed 10:00 AM",
  },
  {
    id: 2,
    name: "Mobile App Development",
    code: "MOB-201",
    students: 22,
    duration: "8 Weeks",
    progress: 40,
    status: "Active",
    schedule: "Tue, Thu 2:00 PM",
  },
  {
    id: 3,
    name: "Database Design & Optimization",
    code: "DB-301",
    students: 25,
    duration: "10 Weeks",
    progress: 10,
    status: "Active",
    schedule: "Fri 9:00 AM",
  },
]

export default function InstructorCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Learning (My Courses)</h1>
          <p className="text-[14px] text-gray-500 mt-0.5">Manage your courses, curriculum, and students</p>
        </div>
        <button className="flex items-center gap-1.5 bg-gray-900 text-white text-[13px] font-bold px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4" /> Create New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header / Cover */}
            <div className="h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5 relative">
              <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                {course.status}
              </span>
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <p className="text-[12px] font-medium text-white/80 mb-0.5">{course.code}</p>
                <h3 className="text-[16px] font-bold leading-tight">{course.name}</h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-1">
                    <Users className="w-3 h-3" /> Enrolled
                  </p>
                  <p className="text-[14px] font-bold text-gray-900">{course.students} Students</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3" /> Duration
                  </p>
                  <p className="text-[14px] font-bold text-gray-900">{course.duration}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3" /> Schedule
                  </p>
                  <p className="text-[13.5px] font-medium text-gray-900">{course.schedule}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-[11px] font-medium mb-1.5">
                  <span className="text-gray-500">Course Completion</span>
                  <span className="text-gray-900">{course.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 bg-gray-50 text-gray-700 text-[12.5px] font-semibold py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                  View Details
                </button>
                <button className="flex-1 bg-gray-900 text-white text-[12.5px] font-semibold py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Manage
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

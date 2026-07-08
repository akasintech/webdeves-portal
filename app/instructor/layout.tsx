"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authUtils } from "@/lib/auth"
import type { Instructor } from "@/lib/types"
import { SidebarNav } from "@/components/sidebar-nav"
import { Bell, ClipboardList } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AttendanceModal } from "@/components/attendance-modal"

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<Instructor | null>(null)
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false)

  useEffect(() => {
    const currentUser = authUtils.getUser()
    if (!currentUser || currentUser.role !== "instructor") {
      router.push("/login")
      return
    }
    setUser(currentUser as Instructor)
  }, [router])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/60">
      <SidebarNav user={user} role="instructor" />

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
          {/* Left: Portal brand */}
          <div>
            <p className="text-[14px] font-bold text-gray-900 leading-tight">Webdeves SMS</p>
            <p className="text-[11px] text-gray-400">Tutor Portal</p>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Bell */}
            <button className="relative p-1.5 text-gray-500 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Attendance */}
            <button 
              onClick={() => setIsAttendanceOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-[12.5px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Attendance
            </button>

            {/* Avatar + Name */}
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-white text-[12px] font-bold">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-[13px] font-semibold text-gray-800">
                Prof. {user.firstName}
              </span>
            </div>
          </div>
        </header>

        <main className="p-5 lg:p-6">{children}</main>
      </div>

      <AttendanceModal 
        isOpen={isAttendanceOpen}
        onClose={() => setIsAttendanceOpen(false)}
      />
    </div>
  )
}

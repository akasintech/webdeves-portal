"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authUtils } from "@/lib/auth"
import type { SuperAdmin } from "@/lib/types"
import { mockSuperAdmins } from "@/lib/mock-data/users"
import { SidebarNav } from "@/components/sidebar-nav"
import { MobileHeader } from "@/components/mobile-header"
import { Bell, ClipboardList } from "lucide-react"
import { AttendanceModal } from "@/components/attendance-modal"

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<SuperAdmin | null>(null)
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false)

  useEffect(() => {
    const currentUser = authUtils.getUser()
    if (!currentUser || currentUser.role !== "superadmin") {
      // Default to mock Super Admin user for preview & development convenience
      const defaultUser = mockSuperAdmins[0]
      authUtils.setAuth("mock-jwt-superadmin", defaultUser)
      setUser(defaultUser)
      return
    }
    setUser(currentUser as SuperAdmin)
  }, [router])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SidebarNav user={user} role="superadmin" />
      <MobileHeader user={user} role="superadmin" />

      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-white border-b border-gray-100 sticky top-0 z-10">
          <div>
            <p className="text-[14px] font-bold text-gray-900 leading-tight">Webdeves SMS</p>
            <p className="text-[11px] text-gray-400">Superadmin Portal</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Bell */}
            <button
              type="button"
              className="relative p-1.5 text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Attendance button */}
            <button
              type="button"
              onClick={() => setIsAttendanceOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-[12.5px] font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-xs"
            >
              <ClipboardList className="w-3.5 h-3.5 text-gray-600" />
              Attendance
            </button>

            {/* Super Admin profile badge */}
            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[13px] shadow-xs">
                S
              </div>
              <span className="text-[13.5px] font-semibold text-gray-800">
                Super Admin
              </span>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>

      <AttendanceModal
        isOpen={isAttendanceOpen}
        onClose={() => setIsAttendanceOpen(false)}
      />
    </div>
  )
}

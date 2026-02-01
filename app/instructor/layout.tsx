"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authUtils } from "@/lib/auth"
import type { Instructor } from "@/lib/types"
import { SidebarNav } from "@/components/sidebar-nav"
import { Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<Instructor | null>(null)

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
    <div className="min-h-screen bg-gray-50">
      <SidebarNav user={user} role="instructor" />

      <div className="lg:pl-64">
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-700 hover:text-gray-900">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                2
              </span>
            </button>
            <Avatar>
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary text-white">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}

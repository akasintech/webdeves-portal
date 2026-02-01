"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "./logo"
import { LayoutDashboard, CreditCard, Users, GraduationCap, Settings, HelpCircle } from "lucide-react"
import type { User } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarNavProps {
  user: User
  role: "student" | "instructor" | "admin" | "parent"
}

export function SidebarNav({ user, role }: SidebarNavProps) {
  const pathname = usePathname()

  const getNavItems = () => {
    switch (role) {
      case "student":
        return [
          { href: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { href: "/student/payments", icon: CreditCard, label: "Payments" },
          { href: "/student/community", icon: Users, label: "Community & forums" },
          { href: "/student/learnings", icon: GraduationCap, label: "Learnings" },
        ]
      case "instructor":
        return [
          { href: "/instructor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { href: "/instructor/courses", icon: GraduationCap, label: "My Courses" },
          { href: "/instructor/students", icon: Users, label: "Students" },
        ]
      case "admin":
        return [
          { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { href: "/admin/students", icon: Users, label: "Students" },
          { href: "/admin/instructors", icon: GraduationCap, label: "Instructors" },
          { href: "/admin/courses", icon: GraduationCap, label: "Courses" },
        ]
      case "parent":
        return [
          { href: "/parent/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { href: "/parent/children", icon: Users, label: "My Children" },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-1">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-200">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-[#8C2453] text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Settings */}
        <div className="px-4 py-4 border-t border-gray-200">
          <Link
            href={`/${role}/settings`}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary text-white">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div className="px-4 py-4 bg-gray-50">
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <HelpCircle className="w-5 h-5" />
          Help & Support
        </button>
      </div>
    </aside>
  )
}

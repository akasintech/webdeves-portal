"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "./logo"
import {
  LayoutDashboard,
  CreditCard,
  Users,
  GraduationCap,
  Settings,
  HelpCircle,
  BookOpen,
  Bell,
  CalendarOff,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  Briefcase,
} from "lucide-react"
import type { User } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

interface SidebarNavProps {
  user: User
  role: "student" | "instructor" | "admin" | "parent"
}

interface NavItem {
  href?: string
  icon: React.ElementType
  label: string
  children?: { href: string; label: string }[]
}

export function SidebarNav({ user, role }: SidebarNavProps) {
  const pathname = usePathname()
  const [openGroup, setOpenGroup] = useState<string | null>("exams")

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case "student":
        return [
          { href: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          {
            icon: BookOpen,
            label: "Learning",
            children: [
              { href: "/student/learnings/zoom", label: "Zoom online class" },
              { href: "/student/learnings/googlemeet", label: "GoogleMeet online class" },
              { href: "/student/learnings/lesson-plan", label: "Lesson Plan" },
              { href: "/student/learnings/syllabus", label: "Syllabus" },
              { href: "/student/learnings/assignment", label: "Assignment" },
            ],
          },
          { href: "/student/payments", icon: CreditCard, label: "Payments" },
          {
            icon: ClipboardList,
            label: "Exams",
            children: [
              { href: "/student/exams/online", label: "Online Exam" },
              { href: "/student/exams/schedule", label: "Exam Schedule" },
              { href: "/student/exams/result", label: "Exam Result" },
            ],
          },
          { href: "/student/community", icon: Users, label: "Community" },
          { href: "/student/notice-board", icon: Bell, label: "Notice Board" },
          { href: "/student/apply-leave", icon: CalendarOff, label: "Apply for Leave" },
          { href: "/student/settings", icon: Settings, label: "Account" },
        ]
      case "instructor":
        return [
          { href: "/instructor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { href: "/instructor/courses", icon: BookOpen, label: "Learning" },
          { href: "/instructor/assignments", icon: ClipboardList, label: "Assignments" },
          { href: "/instructor/attendance", icon: CalendarOff, label: "Attendance" },
          { href: "/instructor/exams", icon: GraduationCap, label: "Exams" },
          { href: "/instructor/hr", icon: Briefcase, label: "HR Module" },
          { href: "/instructor/staff", icon: Users, label: "Staff Directory" },
          { href: "/instructor/settings", icon: Settings, label: "Account" },
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

  const isActiveChild = (children: { href: string }[]) =>
    children.some((c) => pathname === c.href)

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Logo + Portal Label */}
        <div className="px-6 py-5 border-b border-gray-100">
          <Logo />
          <p className="text-[11px] text-gray-400 mt-1 capitalize">
            {role === "instructor" ? "Tutor Portal" : `${role} Portal`}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            // Group with children
            if (item.children) {
              const isOpen = openGroup === item.label || isActiveChild(item.children)
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setOpenGroup(isOpen ? null : item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
                      isActiveChild(item.children)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                            pathname === child.href
                              ? "bg-primary text-white"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            // Regular link
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Profile at bottom */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary text-white text-[12px]">
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <button className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
            <HelpCircle className="w-4 h-4" />
            Help &amp; Support
          </button>
        </div>
      </div>
    </aside>
  )
}

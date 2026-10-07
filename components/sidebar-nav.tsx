"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "./logo"
import {
  LayoutDashboard,
  LayoutGrid,
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
  Building2,
  Laptop,
  GitFork,
  Video,
  TrendingUp,
  TrendingDown,
  CalendarCheck,
  BookMarked,
  MessageSquare,
} from "lucide-react"
import type { User } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

interface SidebarNavProps {
  user: User
  role: "student" | "instructor" | "admin" | "parent" | "superadmin"
}

interface NavItem {
  href?: string
  icon: React.ElementType
  label: string
  children?: { href: string; label: string }[]
  hasChevron?: boolean
}

export function SidebarNav({ user, role }: SidebarNavProps) {
  const pathname = usePathname()
  const [openGroup, setOpenGroup] = useState<string | null>("exams")

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case "superadmin":
        return [
          { href: "/superadmin/dashboard", icon: LayoutGrid, label: "Dashboard" },
          {
            icon: Building2,
            label: "Front Office",
            children: [
              { href: "/superadmin/front-office/admission-enquiry", label: "Admission Enquiry" },
              { href: "/superadmin/front-office/visitors-book", label: "Visitors Book" },
              { href: "/superadmin/front-office/complaint", label: "Complaint" },
            ],
          },
          {
            icon: GraduationCap,
            label: "Student Info",
            children: [
              { href: "/superadmin/student-info/student-details", label: "Student Details" },
              { href: "/superadmin/student-info/student-admission", label: "Student Admission" },
              { href: "/superadmin/student-info/online-admission", label: "Online Admission" },
              { href: "/superadmin/student-info/multi-class-students", label: "Multi-Class Students" },
              { href: "/superadmin/student-info/bulk-delete", label: "Bulk Delete" },
              { href: "/superadmin/student-info/student-category", label: "Student Category" },
            ],
          },
          {
            icon: CreditCard,
            label: "Fee Collection",
            children: [
              { href: "/superadmin/fee-collection/collect-fee", label: "Collect Fee" },
              { href: "/superadmin/fee-collection/offline-bank-payments", label: "Offline Bank Payments" },
              { href: "/superadmin/fee-collection/fee-group", label: "Fee Group" },
              { href: "/superadmin/fee-collection/fee-type", label: "Fee Type" },
              { href: "/superadmin/fee-collection/fee-reminder", label: "Fee Reminder" },
            ],
          },
          {
            icon: Laptop,
            label: "Online Course",
            children: [
              { href: "/superadmin/online-course/courses", label: "Online Courses" },
              { href: "/superadmin/online-course/course-category", label: "Course Category" },
              { href: "/superadmin/online-course/certificate-template", label: "Certificate Template" },
              { href: "/superadmin/online-course/report", label: "Online Course Report" },
              { href: "/superadmin/online-course/settings", label: "Online Course Settings" },
            ],
          },
          {
            icon: GitFork,
            label: "Multi Branch",
            children: [
              { href: "/superadmin/multi-branch/overview", label: "Overview" },
              { href: "/superadmin/multi-branch/report", label: "Report" },
              { href: "/superadmin/multi-branch/settings", label: "Settings" },
            ],
          },
          { href: "/superadmin/gmeet-live-class", icon: Video, label: "GMeet Live Class" },
          { href: "/superadmin/zoom-live-class", icon: Video, label: "Zoom Live Class" },
          { href: "/superadmin/income", icon: TrendingUp, label: "Income" },
          {
            icon: TrendingDown,
            label: "Expenses",
            children: [
              { href: "/superadmin/expenses/overview", label: "Overview" },
              { href: "/superadmin/expenses/add-expense", label: "Add Expense" },
              { href: "/superadmin/expenses/expense-head", label: "Expense Head" },
            ],
          },
          {
            icon: ClipboardList,
            label: "Examination",
            children: [
              { href: "/superadmin/examination/exam-group", label: "Exam Group" },
              { href: "/superadmin/examination/exam-schedule", label: "Exam Schedule" },
              { href: "/superadmin/examination/exam-result", label: "Exam Result" },
              { href: "/superadmin/examination/design-admit-card", label: "Design Admit Card" },
              { href: "/superadmin/examination/print-admit-card", label: "Print Admit Card" },
              { href: "/superadmin/examination/design-marksheet", label: "Design Marksheet" },
              { href: "/superadmin/examination/print-marksheet", label: "Print Marksheet" },
              { href: "/superadmin/examination/marks-grade", label: "Marks Grade" },
              { href: "/superadmin/examination/marks-division", label: "Marks Division" },
            ],
          },
          {
            icon: CalendarCheck,
            label: "Attendance",
            children: [
              { href: "/superadmin/attendance/student-attendance", label: "Student Attendance" },
              { href: "/superadmin/attendance/approve-leave", label: "Approve Leave" },
              { href: "/superadmin/attendance/attendance-by-date", label: "Attendance By Date" },
            ],
          },
          {
            icon: BookOpen,
            label: "Academics",
            children: [
              { href: "/superadmin/academics/class-timetable", label: "Class Timetable" },
              { href: "/superadmin/academics/teachers-timetable", label: "Teachers Timetable" },
              { href: "/superadmin/academics/assign-class-teacher", label: "Assign Class Teacher" },
              { href: "/superadmin/academics/promote-students", label: "Promote Students" },
              { href: "/superadmin/academics/subject-group", label: "Subject Group" },
              { href: "/superadmin/academics/subjects", label: "Subjects" },
              { href: "/superadmin/academics/class", label: "Class" },
              { href: "/superadmin/academics/sections", label: "Sections" },
            ],
          },
          {
            icon: BookMarked,
            label: "Lesson Plan",
            children: [
              { href: "/superadmin/lesson-plan/copy-old-lessons", label: "Copy Old Lessons" },
              { href: "/superadmin/lesson-plan/manage-lesson-plan", label: "Manage Lesson Plan" },
              { href: "/superadmin/lesson-plan/manage-syllabus-status", label: "Manage Syllabus Status" },
              { href: "/superadmin/lesson-plan/lesson", label: "Lesson" },
              { href: "/superadmin/lesson-plan/topic", label: "Topic" },
            ],
          },
          {
            icon: Users,
            label: "Human Resource",
            children: [
              { href: "/superadmin/human-resource/staff-directory", label: "Staff Directory" },
              { href: "/superadmin/human-resource/staff-attendance", label: "Staff Attendance" },
              { href: "/superadmin/human-resource/payroll", label: "Payroll" },
              { href: "/superadmin/human-resource/approve-leave-request", label: "Approve Leave Request" },
              { href: "/superadmin/human-resource/apply-leave", label: "Apply Leave" },
              { href: "/superadmin/human-resource/leave-type", label: "Leave Type" },
              { href: "/superadmin/human-resource/teachers-rating", label: "Teachers Rating" },
              { href: "/superadmin/human-resource/department", label: "Department" },
              { href: "/superadmin/human-resource/designation", label: "Designation" },
              { href: "/superadmin/human-resource/disabled-staff", label: "Disabled Staff" },
            ],
          },
          {
            icon: MessageSquare,
            label: "Communication",
            children: [
              { href: "/superadmin/communication/notice-board", label: "Notice Board" },
              { href: "/superadmin/communication/send-email", label: "Send Email" },
              { href: "/superadmin/communication/send-sms", label: "Send SMS" },
              { href: "/superadmin/communication/email-sms-log", label: "Email / SMS Log" },
              { href: "/superadmin/communication/schedule-email-sms-log", label: "Schedule Email SMS Log" },
              { href: "/superadmin/communication/login-credentials-send", label: "Login Credentials Send" },
              { href: "/superadmin/communication/email-template", label: "Email Template" },
              { href: "/superadmin/communication/sms-template", label: "SMS Template" },
            ],
          },
        ]
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
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 z-20">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Logo + Portal Label */}
        <div className="px-6 py-5 border-b border-gray-100">
          <Logo />
          <p className="text-[11px] text-gray-400 mt-1 capitalize">
            {role === "instructor" ? "Tutor Portal" : role === "superadmin" ? "Superadmin Portal" : `${role} Portal`}
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
                        ? role === "superadmin" ? "bg-blue-50 text-blue-600" : "bg-primary/10 text-primary"
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
                              ? role === "superadmin" ? "bg-blue-50 text-blue-600" : "bg-primary text-white"
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
            const isActive = pathname === item.href || (item.href === "/superadmin/dashboard" && pathname === "/superadmin")
            const isSuperAdmin = role === "superadmin"

            const activeClass = isSuperAdmin
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "bg-primary text-white"

            const iconActiveClass = isSuperAdmin
              ? (isActive ? "text-blue-600" : "text-slate-500")
              : (isActive ? "text-white" : "text-gray-500")

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
                  isActive
                    ? activeClass
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${iconActiveClass}`} />
                <span className="flex-1">{item.label}</span>
                {item.hasChevron && (
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-blue-500" : "text-gray-400"}`} />
                )}
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

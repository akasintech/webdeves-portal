"use client"

import { useState, useEffect, useMemo } from "react"
import { Logo } from "./logo"
import { Menu, X, Bell, ChevronDown, ChevronRight, HelpCircle, ClipboardList } from "lucide-react"
import type { User, UserRole } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getNavItems } from "./sidebar-nav"

interface MobileHeaderProps {
  user: User
  role: UserRole
  onAttendanceClick?: () => void
}

export function MobileHeader({ user, role, onAttendanceClick }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const navItems = useMemo(() => getNavItems(role), [role])

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    navItems.forEach((item) => {
      if (item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"))) {
        initial[item.label] = true
      }
    })
    return initial
  })

  // Whenever pathname changes, auto-expand the group for the active route
  useEffect(() => {
    const toOpen: string[] = []
    for (const item of navItems) {
      if (item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"))) {
        toOpen.push(item.label)
      }
    }

    if (toOpen.length > 0) {
      setOpenGroups((prev) => {
        const needsUpdate = toOpen.some((label) => !prev[label])
        if (!needsUpdate) return prev
        const next = { ...prev }
        for (const label of toOpen) {
          next[label] = true
        }
        return next
      })
    }
  }, [pathname, navItems])

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const isActiveChild = (children: { href: string }[]) =>
    children.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"))

  const isSuperAdmin = role === "superadmin"

  return (
    <>
      {/* Mobile Topbar */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="p-1.5 -ml-1.5 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Logo />
          </div>

          <div className="flex items-center gap-2.5">
            {onAttendanceClick && (
              <button
                type="button"
                onClick={onAttendanceClick}
                className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-[11.5px] font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-xs"
              >
                <ClipboardList className="w-3.5 h-3.5 text-gray-600" />
                <span className="hidden sm:inline">Attendance</span>
              </button>
            )}

            <button
              type="button"
              className="relative p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                3
              </span>
            </button>

            <Avatar className="w-8 h-8">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback
                className={
                  isSuperAdmin
                    ? "bg-blue-600 text-white text-xs font-bold"
                    : "bg-primary text-white text-xs font-bold"
                }
              >
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-[320px] bg-white h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <Logo />
                <p className="text-[11px] text-gray-400 mt-0.5 capitalize">
                  {role === "instructor"
                    ? "Tutor Portal"
                    : role === "superadmin"
                    ? "Superadmin Portal"
                    : `${role} Portal`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                // Group with children
                if (item.children) {
                  const isOpen = !!openGroups[item.label]
                  const hasActiveChild = isActiveChild(item.children)

                  return (
                    <div key={item.label} className="space-y-0.5">
                      <button
                        type="button"
                        onClick={() => toggleGroup(item.label)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
                          hasActiveChild
                            ? isSuperAdmin
                              ? "bg-blue-50 text-blue-600 font-semibold"
                              : "bg-primary/10 text-primary font-semibold"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3">
                          {item.children.map((child) => {
                            const isChildActive = pathname === child.href

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                                  isChildActive
                                    ? isSuperAdmin
                                      ? "bg-blue-50 text-blue-600 font-semibold"
                                      : "bg-primary text-white"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                              >
                                {child.label}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                }

                // Standalone link
                const isActive =
                  pathname === item.href ||
                  (item.href === "/superadmin/dashboard" && pathname === "/superadmin")

                const activeClass = isSuperAdmin
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "bg-primary text-white"

                const iconActiveClass = isSuperAdmin
                  ? isActive
                    ? "text-blue-600"
                    : "text-slate-500"
                  : isActive
                  ? "text-white"
                  : "text-gray-500"

                return (
                  <Link
                    key={item.href || item.label}
                    href={item.href!}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
                      isActive
                        ? activeClass
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${iconActiveClass}`} />
                    <span className="flex-1">{item.label}</span>
                    {item.hasChevron && (
                      <ChevronRight
                        className={`w-3.5 h-3.5 ${
                          isActive ? "text-blue-500" : "text-gray-400"
                        }`}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Profile at bottom */}
            <div className="px-4 py-3.5 border-t border-gray-100 bg-gray-50/60">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback
                    className={
                      isSuperAdmin
                        ? "bg-blue-600 text-white text-xs font-bold"
                        : "bg-primary text-white text-xs font-bold"
                    }
                  >
                    {user.firstName[0]}
                    {user.lastName[0]}
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

            {/* Help & Support */}
            <div className="px-4 py-2.5 border-t border-gray-100 bg-white">
              <button
                type="button"
                className="flex items-center gap-2 text-[12.5px] text-gray-500 hover:text-gray-900 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                Help &amp; Support
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

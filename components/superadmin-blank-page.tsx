import Link from "next/link"
import { ChevronRight, LayoutTemplate } from "lucide-react"

interface SuperAdminBlankPageProps {
  title: string
  description?: string
  moduleKey: string
  breadcrumbs?: { label: string; href?: string }[]
}

export function SuperAdminBlankPage({
  title,
  description = "This module has been registered and wired to mock data. Waiting for UI design.",
  moduleKey,
  breadcrumbs = [{ label: "Dashboard", href: "/superadmin/dashboard" }],
}: SuperAdminBlankPageProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
          {breadcrumbs.map((b, idx) => (
            <div key={b.label} className="flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="w-3 h-3" />}
              {b.href ? (
                <Link href={b.href} className="hover:text-gray-700 transition-colors">
                  {b.label}
                </Link>
              ) : (
                <span className="text-gray-700 font-medium">{b.label}</span>
              )}
            </div>
          ))}
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium">{title}</span>
        </nav>

        <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">{title}</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">{description}</p>
      </div>

      {/* Blank / Placeholder State */}
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center min-h-[380px]">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
          <LayoutTemplate className="w-7 h-7" />
        </div>
        <h3 className="text-[16px] font-semibold text-gray-800">
          {title} Module Ready
        </h3>
        <p className="text-sm text-gray-500 max-w-md mt-1 mb-6">
          This page is created and configured for Superadmin. The backend mock service is wired up and ready for your UI design.
        </p>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 font-mono">
          Module ID: {moduleKey}
        </span>
      </div>
    </div>
  )
}

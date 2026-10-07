"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Eye,
  Mail,
  Pencil,
  Phone,
  Search,
  Trash2,
  UserCheck,
  UserCog,
  Users,
  GraduationCap,
  X,
} from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { StaffRecord, StaffDirectoryResponse } from "@/lib/types"
import {
  FormModal,
  LoadingBlock,
  PageHeader,
  Panel,
  StatCard,
  downloadCsv,
  tdClass,
  thClass,
  type FormField,
} from "@/components/superadmin/ui"

interface StaffDirectoryViewProps {
  title: string
  breadcrumb: string
}

const addStaffFields: FormField[] = [
  { name: "name", label: "Full Name", required: true, placeholder: "e.g. Dr. Amara Singh" },
  { name: "role", label: "Role / Designation", required: true, placeholder: "e.g. Mathematics Teacher" },
  { name: "department", label: "Department", required: true, placeholder: "e.g. Sciences" },
  { name: "email", label: "Email Address", type: "text", required: true, placeholder: "e.g. amara@school.edu" },
  { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "e.g. +91 98765 11111" },
  { name: "joined", label: "Joining Date", type: "text", required: true, placeholder: "e.g. Aug 12, 2019" },
  {
    name: "type",
    label: "Staff Type",
    type: "select",
    options: ["Teacher", "Support Staff", "Admin"],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["active", "inactive"],
  },
]

export function StaffDirectoryView({ title, breadcrumb }: StaffDirectoryViewProps) {
  const [data, setData] = useState<StaffDirectoryResponse | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewStaff, setViewStaff] = useState<StaffRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<StaffRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getStaffDirectory()
      setData(res)
    } catch (e) {
      console.error("Failed to load staff directory", e)
      setData({
        staff: [],
        stats: { totalStaff: 0, active: 0, teachers: 0, supportStaff: 0 },
      })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!data) return <LoadingBlock />

  const filtered = data.staff.filter((s) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      s.name.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      `${title.toLowerCase().replace(/\s+/g, "-")}.csv`,
      data.staff.map((s, i) => ({
        "#": i + 1,
        ID: s.id,
        Name: s.name,
        Role: s.role,
        Department: s.department,
        Email: s.email,
        Phone: s.phone,
        Joined: s.joined,
        Status: s.status,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    await superAdminService.createStaffMember({
      name: values.name,
      role: values.role,
      initial: values.name.charAt(0).toUpperCase() || "S",
      initialColor: "bg-indigo-600",
      department: values.department,
      email: values.email,
      phone: values.phone,
      joined: values.joined,
      status: (values.status as "active" | "inactive") || "active",
      type: (values.type as StaffRecord["type"]) || "Teacher",
    })
    setIsAddOpen(false)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await superAdminService.deleteStaffMember(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title={title}
        breadcrumb={breadcrumb}
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Staff"
          value={data.stats.totalStaff}
          icon={Users}
          iconClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Active"
          value={data.stats.active}
          icon={UserCheck}
          iconClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Teachers"
          value={data.stats.teachers}
          icon={GraduationCap}
          iconClass="bg-purple-50 text-purple-600"
        />
        <StatCard
          label="Support Staff"
          value={data.stats.supportStaff}
          icon={UserCog}
          iconClass="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Main Panel */}
      <Panel
        title="Staff Directory"
        right={
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff..."
              className="pl-8 pr-3 py-1.5 w-60 border border-gray-200 rounded-lg text-[12.5px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        }
      >
        <div className="overflow-x-auto border-t border-gray-100 mt-2">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/75 border-b border-gray-100">
              <tr>
                <th className={thClass}>ID</th>
                <th className={thClass}>NAME & ROLE</th>
                <th className={thClass}>DEPARTMENT</th>
                <th className={thClass}>CONTACT</th>
                <th className={thClass}>JOINED</th>
                <th className={thClass}>STATUS</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No staff members found.
                  </td>
                </tr>
              ) : (
                filtered.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} text-gray-400 font-mono text-xs`}>{staff.id}</td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${
                            staff.initialColor || "bg-indigo-600"
                          } text-white flex items-center justify-center font-semibold text-xs shrink-0`}
                        >
                          {staff.initial}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 leading-tight">{staff.name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{staff.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`${tdClass} text-gray-600`}>{staff.department}</td>
                    <td className={tdClass}>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{staff.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{staff.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className={`${tdClass} text-gray-600`}>{staff.joined}</td>
                    <td className={tdClass}>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          staff.status === "active"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                            : "bg-gray-100 text-gray-500 border border-gray-200/50"
                        }`}
                      >
                        {staff.status}
                      </span>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1 text-gray-400">
                        <button
                          onClick={() => setViewStaff(staff)}
                          title="View"
                          className="p-1 hover:text-blue-600 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewStaff(staff)}
                          title="Edit"
                          className="p-1 hover:text-amber-600 rounded transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(staff)}
                          title="Delete"
                          className="p-1 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <FormModal
        open={isAddOpen}
        title="Add Staff Member"
        fields={addStaffFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* View Modal */}
      {viewStaff && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Staff Profile</h3>
              <button
                onClick={() => setViewStaff(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-base">
                  {viewStaff.initial}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{viewStaff.name}</h4>
                  <p className="text-xs text-gray-500">{viewStaff.role}</p>
                </div>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Staff ID:</span>
                <span className="font-mono text-gray-900">{viewStaff.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Department:</span>
                <span className="font-medium text-gray-900">{viewStaff.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-900">{viewStaff.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium text-gray-900">{viewStaff.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Joined Date:</span>
                <span className="font-medium text-gray-900">{viewStaff.joined}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Status:</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    viewStaff.status === "active"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                      : "bg-gray-100 text-gray-500 border border-gray-200/50"
                  }`}
                >
                  {viewStaff.status}
                </span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewStaff(null)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Delete Staff Member</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete staff profile for{" "}
              <strong className="text-gray-900">&quot;{deleteTarget.name}&quot;</strong> ({deleteTarget.id})? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

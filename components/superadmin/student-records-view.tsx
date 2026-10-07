"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Filter, GraduationCap, Pencil, Search, Trash2, UserCheck, UserPlus, UserX, X } from "lucide-react"
import { superAdminService, type StudentSource } from "@/lib/services/superadmin-service"
import { studentCategories } from "@/lib/mock-data/superadmin-modules"
import type { StudentListResponse, StudentRecord } from "@/lib/types"
import {
  FormModal,
  LoadingBlock,
  PageHeader,
  Panel,
  StatCard,
  downloadCsv,
  formatDateLong,
  tdClass,
  thClass,
  type FormField,
} from "@/components/superadmin/ui"

interface StudentRecordsViewProps {
  title: string
  breadcrumb: string
  source: StudentSource
}

const addStudentFields: FormField[] = [
  { name: "name", label: "Full Name", required: true, placeholder: "e.g. John Doe" },
  { name: "dob", label: "Date of Birth", type: "date", required: true },
  { name: "gender", label: "Gender", type: "select", options: ["Female", "Male"] },
  { name: "className", label: "Class (e.g. Grade 10-A)", required: true, placeholder: "Grade 10-A" },
  { name: "rollNo", label: "Roll No.", required: true, placeholder: "A-101" },
  { name: "parent", label: "Parent / Guardian", required: true, placeholder: "Parent Full Name" },
  { name: "phone", label: "Phone", type: "tel", required: true, placeholder: "+1 234 567 8900" },
  { name: "category", label: "Category", type: "select", options: studentCategories },
]

const avatarColors = ["bg-indigo-500", "bg-violet-500", "bg-blue-500", "bg-purple-500", "bg-rose-500", "bg-amber-500"]

export function StudentRecordsView({ title, breadcrumb, source }: StudentRecordsViewProps) {
  const [data, setData] = useState<StudentListResponse | null>(null)
  const [search, setSearch] = useState("")
  const [className, setClassName] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [viewStudent, setViewStudent] = useState<StudentRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<StudentRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getStudentDetails({ search, className, source })
      setData(res)
    } catch (e) {
      console.error("Failed to load students", e)
    }
  }, [search, className, source])

  useEffect(() => {
    load()
  }, [load])

  if (!data) return <LoadingBlock />

  const handleExport = () =>
    downloadCsv(
      `${title.toLowerCase().replace(/\s+/g, "-")}.csv`,
      data.students.map((s) => ({
        ID: s.id,
        Name: s.name,
        DOB: s.dob,
        Gender: s.gender,
        Class: s.className,
        "Roll No": s.rollNo,
        Parent: s.parent,
        Phone: s.phone,
        Category: s.category,
        Status: s.status,
      })),
    )

  const handleAddStudent = async (values: Record<string, string>) => {
    await superAdminService.createStudentRecord(
      {
        name: values.name,
        dob: values.dob,
        gender: (values.gender as "Male" | "Female") || "Female",
        className: values.className,
        rollNo: values.rollNo,
        parent: values.parent,
        phone: values.phone,
        category: values.category || "General",
      },
      source,
    )
    setModalOpen(false)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await superAdminService.deleteStudentRecord(deleteTarget.id)
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
        addLabel="Add Student"
        onAdd={() => setModalOpen(true)}
        onExport={handleExport}
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={data.stats.total.toLocaleString()}
          icon={GraduationCap}
          iconClass="bg-blue-50 text-blue-500"
        />
        <StatCard
          label="Active"
          value={data.stats.active.toLocaleString()}
          icon={UserCheck}
          iconClass="bg-emerald-50 text-emerald-500"
        />
        <StatCard
          label="Inactive"
          value={data.stats.inactive}
          icon={UserX}
          iconClass="bg-red-50 text-red-500"
        />
        <StatCard
          label="New This Month"
          value={data.stats.newThisMonth}
          icon={UserPlus}
          iconClass="bg-purple-50 text-purple-500"
        />
      </div>

      {/* Student List Panel */}
      <Panel
        title="Student List"
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="pl-8 pr-3 py-1.5 w-52 border border-gray-200 rounded-lg text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Classes</option>
              {data.classes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              type="button"
              aria-label="More filters"
              className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
            >
              <Filter className="w-3.5 h-3.5" />
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto border-t border-gray-100 mt-2">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                {["ID", "Name", "Class", "Roll No.", "Parent", "Phone", "Category", "Status", "Actions"].map((h) => (
                  <th key={h} className={thClass}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.students.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-400 text-[13px]">
                    No students found
                  </td>
                </tr>
              ) : (
                data.students.map((student, idx) => {
                  const avatarBg = avatarColors[idx % avatarColors.length]
                  return (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className={`${tdClass} text-gray-400 text-[11px]`}>{student.id}</td>
                      <td className={tdClass}>
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-7 h-7 rounded-full text-white text-[11px] font-semibold flex items-center justify-center shrink-0 ${avatarBg}`}
                          >
                            {student.name.charAt(0)}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">{student.name}</p>
                            <p className="text-[10.5px] text-gray-400 mt-0.5">
                              {formatDateLong(student.dob)} · {student.gender}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={`${tdClass} text-gray-700`}>{student.className}</td>
                      <td className={`${tdClass} text-gray-500 font-mono text-[11.5px]`}>{student.rollNo}</td>
                      <td className={`${tdClass} text-gray-700`}>{student.parent}</td>
                      <td className={`${tdClass} text-gray-500 text-[11.5px]`}>{student.phone}</td>
                      <td className={tdClass}>
                        <span className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[11px] font-medium">
                          {student.category}
                        </span>
                      </td>
                      <td className={tdClass}>
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            student.status === "active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className={tdClass}>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <button
                            type="button"
                            onClick={() => setViewStudent(student)}
                            title="View student"
                            aria-label="View student"
                            className="p-1 hover:text-blue-600 rounded transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewStudent(student)}
                            title="Edit student"
                            aria-label="Edit student"
                            className="p-1 hover:text-amber-600 rounded transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(student)}
                            title="Delete student"
                            aria-label="Delete student"
                            className="p-1 hover:text-red-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-[12px] text-gray-500">
          <p>
            Showing {data.students.length} of {data.stats.total} students
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="px-2.5 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 text-[11.5px] disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <span className="w-7 h-7 flex items-center justify-center rounded-md bg-blue-600 text-white font-medium text-[12px]">
              1
            </span>
            <button
              type="button"
              className="px-2.5 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 text-[11.5px] disabled:opacity-50"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </Panel>

      {/* Add Student Modal */}
      <FormModal
        open={modalOpen}
        title="Add New Student"
        fields={addStudentFields}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddStudent}
      />

      {/* View Student Modal */}
      {viewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-[16px] font-semibold text-gray-900">Student Profile</h3>
              <button
                type="button"
                onClick={() => setViewStudent(null)}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-[13px]">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  {viewStudent.name.charAt(0)}
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900">{viewStudent.name}</h4>
                  <p className="text-gray-400 text-[11px]">{viewStudent.id} · Roll: {viewStudent.rollNo}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-gray-400 text-[11px] uppercase font-semibold block">Class</span>
                  <p className="font-medium text-gray-800">{viewStudent.className}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-[11px] uppercase font-semibold block">Category</span>
                  <p className="font-medium text-gray-800">{viewStudent.category}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-[11px] uppercase font-semibold block">Parent</span>
                  <p className="font-medium text-gray-800">{viewStudent.parent}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-[11px] uppercase font-semibold block">Phone</span>
                  <p className="font-medium text-gray-800">{viewStudent.phone}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-[11px] uppercase font-semibold block">DOB & Gender</span>
                  <p className="font-medium text-gray-800">{formatDateLong(viewStudent.dob)} ({viewStudent.gender})</p>
                </div>
                <div>
                  <span className="text-gray-400 text-[11px] uppercase font-semibold block">Status</span>
                  <span
                    className={`mt-0.5 inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      viewStudent.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {viewStudent.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setViewStudent(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg text-[13px] hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6">
            <h3 className="text-[16px] font-semibold text-gray-900">Confirm Deletion</h3>
            <p className="text-[13px] text-gray-500 mt-2">
              Are you sure you want to delete student <span className="font-semibold text-gray-800">{deleteTarget.name}</span> ({deleteTarget.id})?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 text-[12.5px] font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-3.5 py-2 text-[12.5px] font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60"
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

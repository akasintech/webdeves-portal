"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Pencil, Search, Trash2, X } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { LessonPlanRecord } from "@/lib/types"
import {
  FormModal,
  LoadingBlock,
  PageHeader,
  Panel,
  downloadCsv,
  tdClass,
  thClass,
  type FormField,
} from "@/components/superadmin/ui"

const addPlanFields: FormField[] = [
  { name: "subject", label: "Subject", required: true, placeholder: "e.g. Mathematics" },
  { name: "className", label: "Class", required: true, placeholder: "e.g. Grade 10-A" },
  { name: "teacher", label: "Teacher / Instructor", required: true, placeholder: "e.g. Dr. Amara Singh" },
  { name: "topic", label: "Topic", required: true, placeholder: "e.g. Quadratic Equations" },
  { name: "date", label: "Date", required: true, placeholder: "e.g. Aug 3, 2026" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Approved", "Pending", "Rejected"],
  },
]

export default function ManageLessonPlanPage() {
  const [plans, setPlans] = useState<LessonPlanRecord[] | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewPlan, setViewPlan] = useState<LessonPlanRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LessonPlanRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getLessonPlans()
      setPlans(res)
    } catch (e) {
      console.error("Failed to load lesson plans", e)
      setPlans([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!plans) return <LoadingBlock />

  const filtered = plans.filter((p) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      p.subject.toLowerCase().includes(q) ||
      p.className.toLowerCase().includes(q) ||
      p.teacher.toLowerCase().includes(q) ||
      p.topic.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q) ||
      p.date.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      "lesson-plans.csv",
      plans.map((p, i) => ({
        "#": i + 1,
        ID: p.id,
        Subject: p.subject,
        Class: p.className,
        Teacher: p.teacher,
        Topic: p.topic,
        Date: p.date,
        Status: p.status,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    await superAdminService.createLessonPlan({
      subject: values.subject,
      className: values.className,
      teacher: values.teacher,
      topic: values.topic,
      date: values.date,
      status: (values.status as LessonPlanRecord["status"]) || "Approved",
    })
    setIsAddOpen(false)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await superAdminService.deleteLessonPlan(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadge = (status: LessonPlanRecord["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
      case "Pending":
        return "bg-amber-50 text-amber-600 border border-amber-200/50"
      case "Rejected":
        return "bg-red-50 text-red-600 border border-red-200/50"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Manage Lesson Plan"
        breadcrumb="Lesson Plan / Manage Lesson Plan"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      <Panel
        title="Manage Lesson Plan List"
        right={
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 w-56 border border-gray-200 rounded-lg text-[12.5px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        }
      >
        <div className="overflow-x-auto border-t border-gray-100 mt-2">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/75 border-b border-gray-100">
              <tr>
                <th className={thClass}>#</th>
                <th className={thClass}>SUBJECT</th>
                <th className={thClass}>CLASS</th>
                <th className={thClass}>TEACHER</th>
                <th className={thClass}>TOPIC</th>
                <th className={thClass}>DATE</th>
                <th className={thClass}>STATUS</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    No lesson plans found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} text-gray-400 font-mono text-xs`}>{index + 1}</td>
                    <td className={`${tdClass} font-medium text-gray-900`}>{item.subject}</td>
                    <td className={tdClass}>{item.className}</td>
                    <td className={tdClass}>{item.teacher}</td>
                    <td className={`${tdClass} text-gray-700`}>{item.topic}</td>
                    <td className={tdClass}>{item.date}</td>
                    <td className={tdClass}>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1 text-gray-400">
                        <button
                          onClick={() => setViewPlan(item)}
                          title="View"
                          className="p-1 hover:text-blue-600 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewPlan(item)}
                          title="Edit"
                          className="p-1 hover:text-amber-600 rounded transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
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
        title="Add Lesson Plan"
        fields={addPlanFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* View Modal */}
      {viewPlan && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Lesson Plan Details</h3>
              <button
                onClick={() => setViewPlan(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Subject:</span>
                <span className="font-medium text-gray-900">{viewPlan.subject}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Class:</span>
                <span className="font-medium text-gray-900">{viewPlan.className}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Teacher:</span>
                <span className="font-medium text-gray-900">{viewPlan.teacher}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Topic:</span>
                <span className="font-medium text-gray-900">{viewPlan.topic}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium text-gray-900">{viewPlan.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Status:</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                    viewPlan.status,
                  )}`}
                >
                  {viewPlan.status}
                </span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewPlan(null)}
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
            <h3 className="text-lg font-semibold text-gray-900">Delete Lesson Plan</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete lesson plan for{" "}
              <strong className="text-gray-900">&quot;{deleteTarget.topic}&quot;</strong> ({deleteTarget.subject})? This
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

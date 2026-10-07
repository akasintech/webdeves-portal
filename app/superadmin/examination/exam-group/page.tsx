"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Pencil, Search, Trash2, X } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { ExamGroupRecord } from "@/lib/types"
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

const addGroupFields: FormField[] = [
  { name: "groupName", label: "Group Name", required: true, placeholder: "e.g. Mid-Term 2026" },
  { name: "session", label: "Session", required: true, placeholder: "e.g. 2025-26" },
  { name: "classes", label: "Classes", required: true, placeholder: "e.g. All or Grade 9-12" },
  { name: "exams", label: "Number of Exams", type: "number", required: true, placeholder: "8" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Upcoming", "Completed"],
  },
]

export default function ExamGroupPage() {
  const [groups, setGroups] = useState<ExamGroupRecord[] | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewGroup, setViewGroup] = useState<ExamGroupRecord | null>(null)
  const [editGroup, setEditGroup] = useState<ExamGroupRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ExamGroupRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getExamGroups()
      setGroups(res)
    } catch (e) {
      console.error("Failed to load exam groups", e)
      setGroups([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!groups) return <LoadingBlock />

  const filtered = groups.filter((g) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      g.groupName.toLowerCase().includes(q) ||
      g.session.toLowerCase().includes(q) ||
      g.classes.toLowerCase().includes(q) ||
      g.status.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      "exam-groups.csv",
      groups.map((g, i) => ({
        "#": i + 1,
        ID: g.id,
        "Group Name": g.groupName,
        Session: g.session,
        Classes: g.classes,
        Exams: g.exams,
        Status: g.status,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    await superAdminService.createExamGroup({
      groupName: values.groupName,
      session: values.session,
      classes: values.classes,
      exams: parseInt(values.exams, 10) || 1,
      status: (values.status as ExamGroupRecord["status"]) || "Active",
    })
    setIsAddOpen(false)
    await load()
  }

  const handleEditSubmit = async (values: Record<string, string>) => {
    if (!editGroup) return
    await superAdminService.updateExamGroup(editGroup.id, {
      groupName: values.groupName || editGroup.groupName,
      session: values.session || editGroup.session,
      classes: values.classes || editGroup.classes,
      exams: parseInt(values.exams, 10) || editGroup.exams,
      status: (values.status as ExamGroupRecord["status"]) || editGroup.status,
    })
    setEditGroup(null)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await superAdminService.deleteExamGroup(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadge = (status: ExamGroupRecord["status"]) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
      case "Upcoming":
        return "bg-blue-50 text-blue-600 border border-blue-200/50"
      case "Completed":
        return "bg-purple-50 text-purple-600 border border-purple-200/50"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Exam Group"
        breadcrumb="Examination / Exam Group"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      <Panel
        title="Exam Group List"
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
                <th className={thClass}>GROUP NAME</th>
                <th className={thClass}>SESSION</th>
                <th className={thClass}>CLASSES</th>
                <th className={thClass}>EXAMS</th>
                <th className={thClass}>STATUS</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No exam groups found.
                  </td>
                </tr>
              ) : (
                filtered.map((group, index) => (
                  <tr key={group.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} text-gray-400 font-mono text-xs`}>{index + 1}</td>
                    <td className={`${tdClass} font-medium text-gray-900`}>{group.groupName}</td>
                    <td className={tdClass}>{group.session}</td>
                    <td className={tdClass}>{group.classes}</td>
                    <td className={`${tdClass} font-semibold text-gray-700`}>{group.exams}</td>
                    <td className={tdClass}>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          group.status,
                        )}`}
                      >
                        {group.status}
                      </span>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1 text-gray-400">
                        <button
                          onClick={() => setViewGroup(group)}
                          title="View"
                          className="p-1 hover:text-blue-600 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditGroup(group)}
                          title="Edit"
                          className="p-1 hover:text-amber-600 rounded transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(group)}
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
        title="Add Exam Group"
        fields={addGroupFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Modal */}
      {editGroup && (
        <FormModal
          open={!!editGroup}
          title="Edit Exam Group"
          fields={addGroupFields}
          initialValues={{
            groupName: editGroup.groupName,
            session: editGroup.session,
            classes: editGroup.classes,
            exams: String(editGroup.exams),
            status: editGroup.status,
          }}
          onClose={() => setEditGroup(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* View Modal */}
      {viewGroup && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Exam Group Details</h3>
              <button
                onClick={() => setViewGroup(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Group Name:</span>
                <span className="font-medium text-gray-900">{viewGroup.groupName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Session:</span>
                <span className="font-medium text-gray-900">{viewGroup.session}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Classes:</span>
                <span className="font-medium text-gray-900">{viewGroup.classes}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Exams Count:</span>
                <span className="font-medium text-gray-900">{viewGroup.exams}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Status:</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                    viewGroup.status,
                  )}`}
                >
                  {viewGroup.status}
                </span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewGroup(null)}
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
            <h3 className="text-lg font-semibold text-gray-900">Delete Exam Group</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete exam group{" "}
              <strong className="text-gray-900">&quot;{deleteTarget.groupName}&quot;</strong>? This
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

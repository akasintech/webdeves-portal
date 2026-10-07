"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Pencil, Search, Trash2, X } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { AcademicSubjectRecord } from "@/lib/types"
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

const subjectFields: FormField[] = [
  { name: "name", label: "Subject Name", required: true, placeholder: "e.g. Mathematics" },
  { name: "code", label: "Subject Code", required: true, placeholder: "e.g. MATH-01" },
  {
    name: "type",
    label: "Type",
    type: "select",
    options: ["Core", "Elective"],
  },
  { name: "classes", label: "Classes", required: true, placeholder: "e.g. Grade 7-12" },
  { name: "teachersCount", label: "Teachers Count", type: "number", required: true, placeholder: "3" },
]

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<AcademicSubjectRecord[] | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewSubject, setViewSubject] = useState<AcademicSubjectRecord | null>(null)
  const [editSubject, setEditSubject] = useState<AcademicSubjectRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AcademicSubjectRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getSubjects()
      setSubjects(res)
    } catch (e) {
      console.error("Failed to load subjects", e)
      setSubjects([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!subjects) return <LoadingBlock />

  const filtered = subjects.filter((s) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.type.toLowerCase().includes(q) ||
      s.classes.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      "subjects.csv",
      subjects.map((s, i) => ({
        "#": i + 1,
        ID: s.id,
        "Subject Name": s.name,
        Code: s.code,
        Type: s.type,
        Classes: s.classes,
        Teachers: s.teachersCount,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    await superAdminService.createSubject({
      name: values.name,
      code: values.code,
      type: (values.type as "Core" | "Elective") || "Core",
      classes: values.classes,
      teachersCount: parseInt(values.teachersCount, 10) || 1,
    })
    setIsAddOpen(false)
    await load()
  }

  const handleEditSubmit = async (values: Record<string, string>) => {
    if (!editSubject) return
    // In-place update in mock store
    editSubject.name = values.name || editSubject.name
    editSubject.code = values.code || editSubject.code
    editSubject.type = (values.type as "Core" | "Elective") || editSubject.type
    editSubject.classes = values.classes || editSubject.classes
    editSubject.teachersCount = parseInt(values.teachersCount, 10) || editSubject.teachersCount
    setEditSubject(null)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await superAdminService.deleteSubject(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Subjects"
        breadcrumb="Academics / Subjects"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      <Panel
        title="Subjects List"
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
                <th className={thClass}>SUBJECT NAME</th>
                <th className={thClass}>CODE</th>
                <th className={thClass}>TYPE</th>
                <th className={thClass}>CLASSES</th>
                <th className={thClass}>TEACHERS</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No subjects found.
                  </td>
                </tr>
              ) : (
                filtered.map((subject, index) => (
                  <tr key={subject.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} text-gray-400 font-mono text-xs`}>{index + 1}</td>
                    <td className={`${tdClass} font-medium text-gray-900`}>{subject.name}</td>
                    <td className={`${tdClass} text-gray-700 font-mono text-xs`}>{subject.code}</td>
                    <td className={`${tdClass} text-gray-700`}>{subject.type}</td>
                    <td className={tdClass}>{subject.classes}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>{subject.teachersCount}</td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1 text-gray-400">
                        <button
                          onClick={() => setViewSubject(subject)}
                          title="View"
                          className="p-1 hover:text-blue-600 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditSubject(subject)}
                          title="Edit"
                          className="p-1 hover:text-amber-600 rounded transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(subject)}
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

      {/* Add Modal */}
      <FormModal
        open={isAddOpen}
        title="Add Subject"
        fields={subjectFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Modal */}
      {editSubject && (
        <FormModal
          open={!!editSubject}
          title="Edit Subject"
          fields={subjectFields}
          initialValues={{
            name: editSubject.name,
            code: editSubject.code,
            type: editSubject.type,
            classes: editSubject.classes,
            teachersCount: String(editSubject.teachersCount),
          }}
          onClose={() => setEditSubject(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* View Modal */}
      {viewSubject && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Subject Details</h3>
              <button
                onClick={() => setViewSubject(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Subject Name:</span>
                <span className="font-semibold text-gray-900">{viewSubject.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Subject Code:</span>
                <span className="font-mono text-gray-900">{viewSubject.code}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium text-gray-800">{viewSubject.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Classes:</span>
                <span className="font-medium text-gray-800">{viewSubject.classes}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Assigned Teachers:</span>
                <span className="font-bold text-gray-900">{viewSubject.teachersCount}</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewSubject(null)}
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
            <h3 className="text-lg font-semibold text-gray-900">Delete Subject</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete subject{" "}
              <strong className="text-gray-900">&quot;{deleteTarget.name}&quot;</strong> ({deleteTarget.code})? This
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

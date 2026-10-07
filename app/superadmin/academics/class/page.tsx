"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Pencil, Search, Trash2, X } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { AcademicClassRecord } from "@/lib/types"
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

const classFields: FormField[] = [
  { name: "name", label: "Class Name", required: true, placeholder: "e.g. Grade 7" },
  { name: "sectionsCount", label: "Sections Count", type: "number", required: true, placeholder: "2" },
  { name: "capacity", label: "Capacity", type: "number", required: true, placeholder: "120" },
  { name: "enrolled", label: "Enrolled Students", type: "number", required: true, placeholder: "98" },
  { name: "classTeacher", label: "Class Teacher", required: true, placeholder: "e.g. Ms. Claire Fontaine" },
]

export default function ClassPage() {
  const [classes, setClasses] = useState<AcademicClassRecord[] | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewClass, setViewClass] = useState<AcademicClassRecord | null>(null)
  const [editClass, setEditClass] = useState<AcademicClassRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AcademicClassRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getClasses()
      setClasses(res)
    } catch (e) {
      console.error("Failed to load classes", e)
      setClasses([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!classes) return <LoadingBlock />

  const filtered = classes.filter((c) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.classTeacher.toLowerCase().includes(q) ||
      String(c.sectionsCount).includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      "classes.csv",
      classes.map((c, i) => ({
        "#": i + 1,
        ID: c.id,
        "Class Name": c.name,
        Sections: c.sectionsCount,
        Capacity: c.capacity,
        Enrolled: c.enrolled,
        "Class Teacher": c.classTeacher,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    await superAdminService.createClass({
      name: values.name,
      sectionsCount: parseInt(values.sectionsCount, 10) || 1,
      capacity: parseInt(values.capacity, 10) || 100,
      enrolled: parseInt(values.enrolled, 10) || 0,
      classTeacher: values.classTeacher,
    })
    setIsAddOpen(false)
    await load()
  }

  const handleEditSubmit = async (values: Record<string, string>) => {
    if (!editClass) return
    editClass.name = values.name || editClass.name
    editClass.sectionsCount = parseInt(values.sectionsCount, 10) || editClass.sectionsCount
    editClass.capacity = parseInt(values.capacity, 10) || editClass.capacity
    editClass.enrolled = parseInt(values.enrolled, 10) || editClass.enrolled
    editClass.classTeacher = values.classTeacher || editClass.classTeacher
    setEditClass(null)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await superAdminService.deleteClass(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Class"
        breadcrumb="Academics / Class"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      <Panel
        title="Class List"
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
                <th className={thClass}>CLASS NAME</th>
                <th className={thClass}>SECTIONS</th>
                <th className={thClass}>CAPACITY</th>
                <th className={thClass}>ENROLLED</th>
                <th className={thClass}>CLASS TEACHER</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No classes found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} text-gray-400 font-mono text-xs`}>{index + 1}</td>
                    <td className={`${tdClass} font-medium text-gray-900`}>{item.name}</td>
                    <td className={`${tdClass} font-semibold text-gray-800`}>{item.sectionsCount}</td>
                    <td className={`${tdClass} text-gray-600`}>{item.capacity}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>{item.enrolled}</td>
                    <td className={`${tdClass} text-gray-800`}>{item.classTeacher}</td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1 text-gray-400">
                        <button
                          onClick={() => setViewClass(item)}
                          title="View"
                          className="p-1 hover:text-blue-600 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditClass(item)}
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

      {/* Add Modal */}
      <FormModal
        open={isAddOpen}
        title="Add Class"
        fields={classFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Modal */}
      {editClass && (
        <FormModal
          open={!!editClass}
          title="Edit Class"
          fields={classFields}
          initialValues={{
            name: editClass.name,
            sectionsCount: String(editClass.sectionsCount),
            capacity: String(editClass.capacity),
            enrolled: String(editClass.enrolled),
            classTeacher: editClass.classTeacher,
          }}
          onClose={() => setEditClass(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* View Modal */}
      {viewClass && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Class Details</h3>
              <button
                onClick={() => setViewClass(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Class Name:</span>
                <span className="font-semibold text-gray-900">{viewClass.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Sections:</span>
                <span className="font-bold text-gray-900">{viewClass.sectionsCount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Capacity:</span>
                <span className="font-medium text-gray-800">{viewClass.capacity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Current Enrollment:</span>
                <span className="font-bold text-blue-600">{viewClass.enrolled}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Class Teacher:</span>
                <span className="font-medium text-gray-900">{viewClass.classTeacher}</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewClass(null)}
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
            <h3 className="text-lg font-semibold text-gray-900">Delete Class</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete class{" "}
              <strong className="text-gray-900">&quot;{deleteTarget.name}&quot;</strong>? This
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

"use client"

import { useCallback, useEffect, useState } from "react"
import { Pencil, Plus, Users, X, BookOpen } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { DepartmentCardRecord } from "@/lib/types"
import {
  FormModal,
  LoadingBlock,
  PageHeader,
  downloadCsv,
  type FormField,
} from "@/components/superadmin/ui"

const addDeptFields: FormField[] = [
  { name: "name", label: "Department Name", required: true, placeholder: "e.g. Sciences" },
  { name: "head", label: "Department Head", required: true, placeholder: "e.g. Dr. Amara Singh" },
  { name: "staffCount", label: "Number of Staff Members", type: "number", required: true, placeholder: "12" },
  {
    name: "subjects",
    label: "Subjects / Specializations (comma separated)",
    required: true,
    placeholder: "Mathematics, Physics, Chemistry, Biology",
  },
]

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<DepartmentCardRecord[] | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editDept, setEditDept] = useState<DepartmentCardRecord | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getDepartmentCards()
      setDepartments(res)
    } catch (e) {
      console.error("Failed to load departments", e)
      setDepartments([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!departments) return <LoadingBlock />

  const handleExport = () => {
    downloadCsv(
      "departments.csv",
      departments.map((d, i) => ({
        "#": i + 1,
        ID: d.id,
        Department: d.name,
        "Head of Department": d.head,
        "Staff Members": d.staffCount,
        Subjects: d.subjects.join(", "),
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    const subjectsArray = values.subjects
      ? values.subjects.split(",").map((s) => s.trim()).filter(Boolean)
      : []

    await superAdminService.createDepartmentCard({
      name: values.name,
      head: values.head,
      staffCount: parseInt(values.staffCount, 10) || 1,
      subjects: subjectsArray,
    })
    setIsAddOpen(false)
    await load()
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editDept) return
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const head = formData.get("head") as string
    const staffCount = parseInt(formData.get("staffCount") as string, 10) || editDept.staffCount
    const subjectsRaw = formData.get("subjects") as string
    const subjects = subjectsRaw.split(",").map((s) => s.trim()).filter(Boolean)

    const idx = departments.findIndex((d) => d.id === editDept.id)
    if (idx >= 0) {
      departments[idx] = {
        ...editDept,
        name,
        head,
        staffCount,
        subjects,
      }
    }
    setEditDept(null)
    await load()
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Department"
        breadcrumb="Human Resource / Department"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      {/* Grid of Department Cards matching screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Header with Title and Edit Icon */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-snug">{dept.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Head: {dept.head}</p>
                </div>
                <button
                  onClick={() => setEditDept(dept)}
                  title="Edit Department"
                  className="p-1 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>

              {/* Staff Count */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-3">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span>{dept.staffCount} staff members</span>
              </div>

              {/* Subject Badges */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {dept.subjects.map((sub, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100/50"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <FormModal
        open={isAddOpen}
        title="Add Department"
        fields={addDeptFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Department Modal */}
      {editDept && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Edit Department</h3>
              <button
                onClick={() => setEditDept(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Department Name
                </label>
                <input
                  name="name"
                  defaultValue={editDept.name}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Department Head
                </label>
                <input
                  name="head"
                  defaultValue={editDept.head}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Staff Members Count
                </label>
                <input
                  name="staffCount"
                  type="number"
                  defaultValue={editDept.staffCount}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Subjects (comma separated)
                </label>
                <input
                  name="subjects"
                  defaultValue={editDept.subjects.join(", ")}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditDept(null)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

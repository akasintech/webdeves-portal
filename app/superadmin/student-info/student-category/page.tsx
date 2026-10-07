"use client"

import { useCallback, useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { StudentCategory } from "@/lib/types"
import {
  FormModal,
  LoadingBlock,
  PageHeader,
  Panel,
  tdClass,
  thClass,
  type FormField,
} from "@/components/superadmin/ui"

const fields: FormField[] = [
  { name: "name", label: "Category Name", required: true },
  { name: "description", label: "Description", required: true },
]

// Cycled by position so any number of categories (including new ones) gets a badge colour.
const badgeColors = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
]

export default function StudentCategoryPage() {
  const [categories, setCategories] = useState<StudentCategory[] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => setCategories(await superAdminService.getStudentCategories()), [])
  useEffect(() => {
    load()
  }, [load])

  if (!categories) return <LoadingBlock />

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Student Category"
        breadcrumb="Student Information / Student Category"
        addLabel="Add Category"
        onAdd={() => setModalOpen(true)}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.slice(0, 4).map((c, i) => (
          <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
            <p className="text-[12px] text-gray-500">{c.name}</p>
            <p className="text-[26px] font-bold text-gray-900 my-1">{c.totalStudents}</p>
            <span className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-medium ${badgeColors[i % badgeColors.length]}`}>
              Students
            </span>
          </div>
        ))}
      </div>

      <Panel title="">
        <div className="overflow-x-auto border-t border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50/60">
              <tr>
                {["#", "Category Name", "Total Students", "Description", "Actions"].map((h) => (
                  <th key={h} className={thClass}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr key={c.id} className="border-t border-gray-50">
                  <td className={`${tdClass} text-gray-400`}>{i + 1}</td>
                  <td className={`${tdClass} font-semibold text-gray-900`}>{c.name}</td>
                  <td className={tdClass}>{c.totalStudents}</td>
                  <td className={tdClass}>{c.description}</td>
                  <td className={tdClass}>
                    <div className="flex gap-2 text-gray-400">
                      <button type="button" aria-label="Edit category"><Pencil className="w-3.5 h-3.5" /></button>
                      <button
                        type="button"
                        aria-label="Delete category"
                        className="hover:text-red-500"
                        onClick={async () => {
                          await superAdminService.deleteStudentCategory(c.id)
                          load()
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <FormModal
        open={modalOpen}
        title="Add Category"
        fields={fields}
        onClose={() => setModalOpen(false)}
        onSubmit={async (v) => {
          await superAdminService.createStudentCategory({ name: v.name, description: v.description })
          setModalOpen(false)
          load()
        }}
      />
    </div>
  )
}

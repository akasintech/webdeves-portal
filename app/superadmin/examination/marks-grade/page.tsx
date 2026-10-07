"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Pencil, Search, Trash2, X } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { MarksGradeRecord } from "@/lib/types"
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

const addGradeFields: FormField[] = [
  { name: "grade", label: "Grade Name (e.g. A+)", required: true, placeholder: "A+" },
  { name: "marksFrom", label: "Marks From", type: "number", required: true, placeholder: "90" },
  { name: "marksTo", label: "Marks To", type: "number", required: true, placeholder: "100" },
  { name: "gpa", label: "GPA Point", type: "number", required: true, placeholder: "4.0" },
  { name: "remarks", label: "Remarks", required: true, placeholder: "Outstanding" },
]

export default function MarksGradePage() {
  const [grades, setGrades] = useState<MarksGradeRecord[] | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewGrade, setViewGrade] = useState<MarksGradeRecord | null>(null)
  const [editGrade, setEditGrade] = useState<MarksGradeRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MarksGradeRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getMarksGrades()
      setGrades(res)
    } catch (e) {
      console.error("Failed to load marks grades", e)
      setGrades([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!grades) return <LoadingBlock />

  const filtered = grades.filter((g) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      g.grade.toLowerCase().includes(q) ||
      g.remarks.toLowerCase().includes(q) ||
      String(g.gpa).includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      "marks-grades.csv",
      grades.map((g, i) => ({
        "#": i + 1,
        ID: g.id,
        Grade: g.grade,
        "Marks From": g.marksFrom,
        "Marks To": g.marksTo,
        GPA: g.gpa,
        Remarks: g.remarks,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    await superAdminService.createMarksGrade({
      grade: values.grade,
      marksFrom: parseInt(values.marksFrom, 10) || 0,
      marksTo: parseInt(values.marksTo, 10) || 100,
      gpa: parseFloat(values.gpa) || 0,
      remarks: values.remarks,
    })
    setIsAddOpen(false)
    await load()
  }

  const handleEditSubmit = async (values: Record<string, string>) => {
    if (!editGrade) return
    await superAdminService.updateMarksGrade(editGrade.id, {
      grade: values.grade || editGrade.grade,
      marksFrom: parseInt(values.marksFrom, 10) || editGrade.marksFrom,
      marksTo: parseInt(values.marksTo, 10) || editGrade.marksTo,
      gpa: parseFloat(values.gpa) || editGrade.gpa,
      remarks: values.remarks || editGrade.remarks,
    })
    setEditGrade(null)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await superAdminService.deleteMarksGrade(deleteTarget.id)
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
        title="Marks Grade"
        breadcrumb="Examination / Marks Grade"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      {/* Main Panel */}
      <Panel
        title="Marks Grade List"
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
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className={`w-14 ${thClass}`}>#</th>
                <th className={thClass}>GRADE</th>
                <th className={thClass}>MARKS FROM</th>
                <th className={thClass}>MARKS TO</th>
                <th className={thClass}>GPA</th>
                <th className={thClass}>REMARKS</th>
                <th className={`text-right ${thClass}`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400 text-[13px]">
                    No grade rules found
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} text-gray-400`}>{idx + 1}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>{item.grade}</td>
                    <td className={`${tdClass} text-gray-600`}>{item.marksFrom}</td>
                    <td className={`${tdClass} text-gray-600`}>{item.marksTo}</td>
                    <td className={`${tdClass} font-medium text-gray-800`}>{item.gpa}</td>
                    <td className={`${tdClass} text-gray-600`}>{item.remarks}</td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1.5 text-gray-400">
                        <button
                          type="button"
                          onClick={() => setViewGrade(item)}
                          title="View Grade"
                          aria-label="View Grade"
                          className="p-1 hover:text-blue-600 rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditGrade(item)}
                          title="Edit Grade"
                          aria-label="Edit Grade"
                          className="p-1 hover:text-amber-600 rounded transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          title="Delete Grade"
                          aria-label="Delete Grade"
                          className="p-1 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add Grade Modal */}
      <FormModal
        open={isAddOpen}
        title="Add New Marks Grade"
        fields={addGradeFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Grade Modal */}
      {editGrade && (
        <FormModal
          open={!!editGrade}
          title="Edit Marks Grade"
          fields={addGradeFields}
          initialValues={{
            grade: editGrade.grade,
            marksFrom: String(editGrade.marksFrom),
            marksTo: String(editGrade.marksTo),
            gpa: String(editGrade.gpa),
            remarks: editGrade.remarks,
          }}
          onClose={() => setEditGrade(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* View Grade Modal */}
      {viewGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-[16px] font-semibold text-gray-900">Grade Rule Details</h3>
              <button
                type="button"
                onClick={() => setViewGrade(null)}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-[13px]">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-bold text-lg flex items-center justify-center">
                  {viewGrade.grade}
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900 text-base">{viewGrade.remarks}</h4>
                  <p className="text-gray-400 text-[11.5px]">GPA Scale: {viewGrade.gpa}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-gray-400 text-[11px] uppercase font-semibold block">Marks Range</span>
                  <p className="font-medium text-gray-800">{viewGrade.marksFrom} - {viewGrade.marksTo}%</p>
                </div>
                <div>
                  <span className="text-gray-400 text-[11px] uppercase font-semibold block">GPA</span>
                  <p className="font-medium text-gray-800">{viewGrade.gpa}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setViewGrade(null)}
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
              Are you sure you want to delete grade rule <span className="font-semibold text-gray-800">{deleteTarget.grade}</span> ({deleteTarget.remarks})?
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

"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Pencil, Search, Trash2, X } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { ExamResultRecord } from "@/lib/types"
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

const addResultFields: FormField[] = [
  { name: "student", label: "Student Name", required: true, placeholder: "e.g. Priya Krishnamurthy" },
  { name: "className", label: "Class", required: true, placeholder: "e.g. Grade 10-A" },
  { name: "examGroup", label: "Exam Group", required: true, placeholder: "e.g. Mid-Term 2026" },
  { name: "totalMarks", label: "Total Marks", type: "number", required: true, placeholder: "500" },
  { name: "obtained", label: "Marks Obtained", type: "number", required: true, placeholder: "462" },
  { name: "percentage", label: "Percentage (e.g. 92.4%)", required: true, placeholder: "92.4%" },
  { name: "grade", label: "Grade", required: true, placeholder: "A+" },
  { name: "result", label: "Result", type: "select", options: ["Pass", "Fail"] },
]

export default function ExamResultPage() {
  const [results, setResults] = useState<ExamResultRecord[] | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewResult, setViewResult] = useState<ExamResultRecord | null>(null)
  const [editResult, setEditResult] = useState<ExamResultRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ExamResultRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getExamResults()
      setResults(res)
    } catch (e) {
      console.error("Failed to load exam results", e)
      setResults([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!results) return <LoadingBlock />

  const filtered = results.filter((r) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      r.student.toLowerCase().includes(q) ||
      r.className.toLowerCase().includes(q) ||
      r.examGroup.toLowerCase().includes(q) ||
      r.grade.toLowerCase().includes(q) ||
      r.result.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      "exam-results.csv",
      results.map((r, i) => ({
        "#": i + 1,
        ID: r.id,
        Student: r.student,
        Class: r.className,
        "Exam Group": r.examGroup,
        "Total Marks": r.totalMarks,
        Obtained: r.obtained,
        Percentage: r.percentage,
        Grade: r.grade,
        Result: r.result,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    const total = parseInt(values.totalMarks, 10) || 500
    const obt = parseInt(values.obtained, 10) || 0
    const pct = values.percentage || `${((obt / total) * 100).toFixed(1)}%`

    await superAdminService.createExamResult({
      student: values.student,
      className: values.className,
      examGroup: values.examGroup,
      totalMarks: total,
      obtained: obt,
      percentage: pct.endsWith("%") ? pct : `${pct}%`,
      grade: values.grade || "A",
      result: (values.result as ExamResultRecord["result"]) || "Pass",
    })
    setIsAddOpen(false)
    await load()
  }

  const handleEditSubmit = async (values: Record<string, string>) => {
    if (!editResult) return
    const total = parseInt(values.totalMarks, 10) || editResult.totalMarks
    const obt = parseInt(values.obtained, 10) || editResult.obtained
    const pct = values.percentage || `${((obt / total) * 100).toFixed(1)}%`

    await superAdminService.updateExamResult(editResult.id, {
      student: values.student || editResult.student,
      className: values.className || editResult.className,
      examGroup: values.examGroup || editResult.examGroup,
      totalMarks: total,
      obtained: obt,
      percentage: pct.endsWith("%") ? pct : `${pct}%`,
      grade: values.grade || editResult.grade,
      result: (values.result as ExamResultRecord["result"]) || editResult.result,
    })

    setEditResult(null)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await superAdminService.deleteExamResult(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Exam Result"
        breadcrumb="Examination / Exam Result"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      <Panel
        title="Exam Result List"
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
                <th className={thClass}>STUDENT</th>
                <th className={thClass}>CLASS</th>
                <th className={thClass}>EXAM GROUP</th>
                <th className={thClass}>TOTAL MARKS</th>
                <th className={thClass}>OBTAINED</th>
                <th className={thClass}>PERCENTAGE</th>
                <th className={thClass}>GRADE</th>
                <th className={thClass}>RESULT</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    No exam results found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} font-medium text-gray-900`}>{r.student}</td>
                    <td className={tdClass}>{r.className}</td>
                    <td className={tdClass}>{r.examGroup}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>{r.totalMarks}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>{r.obtained}</td>
                    <td className={tdClass}>{r.percentage}</td>
                    <td className={`${tdClass} text-gray-700 font-medium`}>{r.grade}</td>
                    <td className={tdClass}>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          r.result === "Pass"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {r.result}
                      </span>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1 text-gray-400">
                        <button
                          onClick={() => setViewResult(r)}
                          title="View"
                          className="p-1 hover:text-blue-600 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditResult(r)}
                          title="Edit"
                          className="p-1 hover:text-amber-600 rounded transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(r)}
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
        title="Add Exam Result"
        fields={addResultFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Modal */}
      {editResult && (
        <FormModal
          open={!!editResult}
          title="Edit Exam Result"
          fields={addResultFields}
          initialValues={{
            student: editResult.student,
            className: editResult.className,
            examGroup: editResult.examGroup,
            totalMarks: String(editResult.totalMarks),
            obtained: String(editResult.obtained),
            percentage: editResult.percentage,
            grade: editResult.grade,
            result: editResult.result,
          }}
          onClose={() => setEditResult(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* View Modal */}
      {viewResult && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Student Exam Result</h3>
              <button
                onClick={() => setViewResult(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Student Name:</span>
                <span className="font-medium text-gray-900">{viewResult.student}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Class:</span>
                <span className="font-medium text-gray-900">{viewResult.className}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Exam Group:</span>
                <span className="font-medium text-gray-900">{viewResult.examGroup}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Total Marks:</span>
                <span className="font-medium text-gray-900">{viewResult.totalMarks}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Marks Obtained:</span>
                <span className="font-semibold text-gray-900">{viewResult.obtained}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Percentage:</span>
                <span className="font-medium text-gray-900">{viewResult.percentage}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Grade:</span>
                <span className="font-bold text-blue-600">{viewResult.grade}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Result:</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    viewResult.result === "Pass"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                      : "bg-red-50 text-red-600 border border-red-200/50"
                  }`}
                >
                  {viewResult.result}
                </span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewResult(null)}
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
            <h3 className="text-lg font-semibold text-gray-900">Delete Exam Result</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete the result record for{" "}
              <strong className="text-gray-900">&quot;{deleteTarget.student}&quot;</strong>? This
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

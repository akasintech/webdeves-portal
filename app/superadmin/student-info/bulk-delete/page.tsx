"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertTriangle, Trash2, X } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { StudentListResponse, StudentRecord } from "@/lib/types"
import { LoadingBlock, Panel, tdClass, thClass } from "@/components/superadmin/ui"

export default function BulkDeletePage() {
  const [data, setData] = useState<StudentListResponse | null>(null)
  const [className, setClassName] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getStudentDetails({ className })
      setData(res)
    } catch (e) {
      console.error("Failed to load students", e)
    }
  }, [className])

  useEffect(() => {
    load()
  }, [load])

  if (!data) return <LoadingBlock />

  const students = data.students

  const allSelected =
    students.length > 0 && students.every((s) => selectedIds.has(s.id))
  const someSelected =
    students.some((s) => selectedIds.has(s.id)) && !allSelected

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(students.map((s) => s.id)))
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return
    setIsDeleting(true)
    try {
      await superAdminService.bulkDeleteStudents(Array.from(selectedIds))
      setSelectedIds(new Set())
      setConfirmOpen(false)
      await load()
    } catch (e) {
      console.error("Failed to bulk delete", e)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Bulk Delete Students</h1>
        <p className="text-[12px] text-gray-500 mt-0.5">Student Information / Bulk Delete</p>
      </div>

      {/* Caution Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-2xs">
        <div className="p-1.5 rounded-lg bg-amber-100/70 text-amber-600 shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-[13.5px] font-semibold text-amber-900">Caution: This action is irreversible</h2>
          <p className="text-[12.5px] text-amber-800/90 mt-0.5 leading-relaxed">
            Deleting students will permanently remove all associated records including attendance, exam results, and fee history.
          </p>
        </div>
      </div>

      {/* Table Panel */}
      <Panel
        title="Select Students to Delete"
        right={
          <div className="flex items-center gap-3">
            <select
              value={className}
              onChange={(e) => {
                setClassName(e.target.value)
                setSelectedIds(new Set())
              }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-[12.5px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
            >
              <option value="">All Classes</option>
              {data.classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={selectedIds.size === 0}
              onClick={() => setConfirmOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[12.5px] font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected {selectedIds.size > 0 && `(${selectedIds.size})`}
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto border-t border-gray-100 mt-2">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="w-12 px-5 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected
                    }}
                    onChange={toggleSelectAll}
                    aria-label="Select all students"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className={thClass}>ID</th>
                <th className={thClass}>NAME</th>
                <th className={thClass}>CLASS</th>
                <th className={thClass}>ROLL NO.</th>
                <th className={thClass}>STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-[13px]">
                    No students found to delete
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const isChecked = selectedIds.has(student.id)
                  return (
                    <tr
                      key={student.id}
                      onClick={() => toggleSelect(student.id)}
                      className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                        isChecked ? "bg-red-50/30" : ""
                      }`}
                    >
                      <td className="w-12 px-5 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(student.id)}
                          aria-label={`Select student ${student.name}`}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                        />
                      </td>
                      <td className={`${tdClass} text-gray-500 text-[12px] font-mono`}>{student.id}</td>
                      <td className={`${tdClass} font-semibold text-gray-900`}>{student.name}</td>
                      <td className={`${tdClass} text-gray-700`}>{student.className}</td>
                      <td className={`${tdClass} text-gray-500 font-mono text-[12px]`}>{student.rollNo}</td>
                      <td className={tdClass}>
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            student.status === "active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-[16px] font-semibold text-gray-900">Confirm Bulk Deletion</h3>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[13px] text-gray-600 mt-3 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-bold text-gray-900">{selectedIds.size}</span> student record(s)?
              All records associated with these students will be deleted immediately.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-3.5 py-2 text-[12.5px] font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteSelected}
                className="px-4 py-2 text-[12.5px] font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors shadow-xs"
              >
                {isDeleting ? "Deleting..." : `Yes, Delete (${selectedIds.size})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

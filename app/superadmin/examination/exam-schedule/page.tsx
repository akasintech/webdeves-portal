"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Pencil, Search, Trash2, X } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { ExamScheduleRecord } from "@/lib/types"
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

const addScheduleFields: FormField[] = [
  { name: "subject", label: "Subject", required: true, placeholder: "e.g. Mathematics" },
  { name: "className", label: "Class", required: true, placeholder: "e.g. Grade 10" },
  { name: "examGroup", label: "Exam Group", required: true, placeholder: "e.g. Mid-Term 2026" },
  { name: "date", label: "Date", required: true, placeholder: "e.g. Aug 18, 2026" },
  { name: "startTime", label: "Start Time", required: true, placeholder: "e.g. 09:00 AM" },
  { name: "endTime", label: "End Time", required: true, placeholder: "e.g. 12:00 PM" },
  { name: "room", label: "Room / Hall", required: true, placeholder: "e.g. Hall A" },
]

export default function ExamSchedulePage() {
  const [schedules, setSchedules] = useState<ExamScheduleRecord[] | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewSchedule, setViewSchedule] = useState<ExamScheduleRecord | null>(null)
  const [editSchedule, setEditSchedule] = useState<ExamScheduleRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ExamScheduleRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getExamSchedules()
      setSchedules(res)
    } catch (e) {
      console.error("Failed to load exam schedules", e)
      setSchedules([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!schedules) return <LoadingBlock />

  const filtered = schedules.filter((s) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      s.subject.toLowerCase().includes(q) ||
      s.className.toLowerCase().includes(q) ||
      s.examGroup.toLowerCase().includes(q) ||
      s.room.toLowerCase().includes(q) ||
      s.date.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      "exam-schedules.csv",
      schedules.map((s, i) => ({
        "#": i + 1,
        ID: s.id,
        Subject: s.subject,
        Class: s.className,
        "Exam Group": s.examGroup,
        Date: s.date,
        "Start Time": s.startTime,
        "End Time": s.endTime,
        Room: s.room,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    await superAdminService.createExamSchedule({
      subject: values.subject,
      className: values.className,
      examGroup: values.examGroup,
      date: values.date,
      startTime: values.startTime,
      endTime: values.endTime,
      room: values.room,
    })
    setIsAddOpen(false)
    await load()
  }

  const handleEditSubmit = async (values: Record<string, string>) => {
    if (!editSchedule) return
    await superAdminService.updateExamSchedule(editSchedule.id, {
      subject: values.subject || editSchedule.subject,
      className: values.className || editSchedule.className,
      examGroup: values.examGroup || editSchedule.examGroup,
      date: values.date || editSchedule.date,
      startTime: values.startTime || editSchedule.startTime,
      endTime: values.endTime || editSchedule.endTime,
      room: values.room || editSchedule.room,
    })
    setEditSchedule(null)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await superAdminService.deleteExamSchedule(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Exam Schedule"
        breadcrumb="Examination / Exam Schedule"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      <Panel
        title="Exam Schedule List"
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
                <th className={thClass}>EXAM GROUP</th>
                <th className={thClass}>DATE</th>
                <th className={thClass}>START TIME</th>
                <th className={thClass}>END TIME</th>
                <th className={thClass}>ROOM</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    No exam schedules found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} text-gray-400 font-mono text-xs`}>{index + 1}</td>
                    <td className={`${tdClass} font-medium text-gray-900`}>{item.subject}</td>
                    <td className={tdClass}>{item.className}</td>
                    <td className={tdClass}>{item.examGroup}</td>
                    <td className={tdClass}>{item.date}</td>
                    <td className={`${tdClass} text-gray-600`}>{item.startTime}</td>
                    <td className={`${tdClass} text-gray-600`}>{item.endTime}</td>
                    <td className={`${tdClass} font-medium text-gray-700`}>{item.room}</td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1 text-gray-400">
                        <button
                          onClick={() => setViewSchedule(item)}
                          title="View"
                          className="p-1 hover:text-blue-600 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditSchedule(item)}
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
        title="Add Exam Schedule"
        fields={addScheduleFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Modal */}
      {editSchedule && (
        <FormModal
          open={!!editSchedule}
          title="Edit Exam Schedule"
          fields={addScheduleFields}
          initialValues={{
            subject: editSchedule.subject,
            className: editSchedule.className,
            examGroup: editSchedule.examGroup,
            date: editSchedule.date,
            startTime: editSchedule.startTime,
            endTime: editSchedule.endTime,
            room: editSchedule.room,
          }}
          onClose={() => setEditSchedule(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* View Modal */}
      {viewSchedule && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Exam Schedule Details</h3>
              <button
                onClick={() => setViewSchedule(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Subject:</span>
                <span className="font-medium text-gray-900">{viewSchedule.subject}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Class:</span>
                <span className="font-medium text-gray-900">{viewSchedule.className}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Exam Group:</span>
                <span className="font-medium text-gray-900">{viewSchedule.examGroup}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium text-gray-900">{viewSchedule.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Timing:</span>
                <span className="font-medium text-gray-900">
                  {viewSchedule.startTime} - {viewSchedule.endTime}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Room / Hall:</span>
                <span className="font-semibold text-gray-900">{viewSchedule.room}</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewSchedule(null)}
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
            <h3 className="text-lg font-semibold text-gray-900">Delete Exam Schedule</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete the schedule for{" "}
              <strong className="text-gray-900">&quot;{deleteTarget.subject}&quot;</strong> ({deleteTarget.className})? This
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

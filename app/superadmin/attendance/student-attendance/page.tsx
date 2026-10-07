"use client"

import { useEffect, useState } from "react"
import { Eye, Pencil, Trash2, X, Plus, Search } from "lucide-react"
import {
  PageHeader,
  Panel,
  LoadingBlock,
  thClass,
  tdClass,
  downloadCsv,
} from "@/components/superadmin/ui"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { StudentAttendanceResponse, StudentAttendanceRecord } from "@/lib/types"

export default function StudentAttendancePage() {
  const [data, setData] = useState<StudentAttendanceResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  // Modals
  const [addOpen, setAddOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<StudentAttendanceRecord | null>(null)
  const [viewRecord, setViewRecord] = useState<StudentAttendanceRecord | null>(null)

  // Form states
  const [student, setStudent] = useState("")
  const [className, setClassName] = useState("Grade 10-A")
  const [rollNo, setRollNo] = useState("")
  const [dateStatus, setDateStatus] = useState<StudentAttendanceRecord["dateStatus"]>("Present")
  const [monthlyPercent, setMonthlyPercent] = useState("95.0%")
  const [status, setStatus] = useState<"Good" | "Warning" | "Critical">("Good")
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    try {
      const res = await superAdminService.getStudentAttendance()
      setData(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAdd = () => {
    setStudent("")
    setClassName("Grade 10-A")
    setRollNo("A-106")
    setDateStatus("Present")
    setMonthlyPercent("95.0%")
    setStatus("Good")
    setAddOpen(true)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!student.trim() || !rollNo.trim()) return
    setSaving(true)
    try {
      await superAdminService.createStudentAttendanceRecord({
        student,
        class: className,
        rollNo,
        dateStatus,
        monthlyPercent,
        status,
      })
      setAddOpen(false)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  const handleOpenEdit = (rec: StudentAttendanceRecord) => {
    setEditRecord(rec)
    setStudent(rec.student)
    setClassName(rec.class)
    setRollNo(rec.rollNo)
    setDateStatus(rec.dateStatus)
    setMonthlyPercent(rec.monthlyPercent)
    setStatus(rec.status)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editRecord || !student.trim()) return
    setSaving(true)
    try {
      await superAdminService.updateStudentAttendanceRecord(editRecord.id, {
        student,
        class: className,
        rollNo,
        dateStatus,
        monthlyPercent,
        status,
      })
      setEditRecord(null)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this attendance record?")) {
      await superAdminService.deleteStudentAttendanceRecord(id)
      await loadData()
    }
  }

  if (loading || !data) return <LoadingBlock />

  const filtered = data.records.filter(
    (r) =>
      r.student.toLowerCase().includes(search.toLowerCase()) ||
      r.class.toLowerCase().includes(search.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Attendance"
        breadcrumb="Attendance / Student Attendance"
        addLabel="Add New"
        onAdd={handleOpenAdd}
        onExport={() =>
          downloadCsv(
            "student-attendance.csv",
            data.records.map((r) => ({
              Student: r.student,
              Class: r.class,
              RollNo: r.rollNo,
              Aug1: r.dateStatus,
              MonthlyPercent: r.monthlyPercent,
              Status: r.status,
            }))
          )
        }
      />

      {/* 4 Stat Cards matching screenshot media_1791368949939.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <p className="text-[12px] text-gray-500 font-medium">Present Today</p>
          <p className="text-[24px] font-bold text-gray-900 mt-1 leading-tight">
            {data.stats.presentToday}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <p className="text-[12px] text-gray-500 font-medium">Absent</p>
          <p className="text-[24px] font-bold text-gray-900 mt-1 leading-tight">
            {data.stats.absent}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <p className="text-[12px] text-gray-500 font-medium">Late</p>
          <p className="text-[24px] font-bold text-gray-900 mt-1 leading-tight">
            {data.stats.late}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <p className="text-[12px] text-gray-500 font-medium">On leave</p>
          <p className="text-[24px] font-bold text-gray-900 mt-1 leading-tight">
            {data.stats.onLeave}
          </p>
        </div>
      </div>

      {/* Main Panel */}
      <Panel
        title="Student Attendance List"
        right={
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-[12.5px] border border-gray-200 rounded-lg w-52 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className={thClass}>STUDENT</th>
                <th className={thClass}>CLASS</th>
                <th className={thClass}>ROLL NO.</th>
                <th className={thClass}>AUG 1</th>
                <th className={thClass}>MONTHLY %</th>
                <th className={thClass}>STATUS</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[13px] text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} font-semibold text-gray-900`}>{item.student}</td>
                    <td className={`${tdClass} text-gray-600`}>{item.class}</td>
                    <td className={`${tdClass} text-gray-600`}>{item.rollNo}</td>
                    <td className={tdClass}>
                      <span
                        className={`font-medium ${
                          item.dateStatus === "Present"
                            ? "text-emerald-600"
                            : item.dateStatus === "Absent"
                            ? "text-red-600"
                            : "text-amber-600"
                        }`}
                      >
                        {item.dateStatus}
                      </span>
                    </td>
                    <td className={`${tdClass} font-medium text-gray-800`}>
                      {item.monthlyPercent}
                    </td>
                    <td className={tdClass}>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          item.status === "Good"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : item.status === "Warning"
                            ? "bg-amber-50 text-amber-600 border border-amber-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewRecord(item)}
                          title="View"
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          title="Edit"
                          className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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

      {/* Add New Modal */}
      {addOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-[15px] font-semibold text-gray-900">Add Student Attendance</h3>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Patel"
                  value={student}
                  onChange={(e) => setStudent(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Class</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="Grade 10-A">Grade 10-A</option>
                    <option value="Grade 8-B">Grade 8-B</option>
                    <option value="Grade 11-C">Grade 11-C</option>
                    <option value="Grade 9-A">Grade 9-A</option>
                    <option value="Grade 12-A">Grade 12-A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">
                    Roll No.
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-106"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">
                    Today&apos;s Status
                  </label>
                  <select
                    value={dateStatus}
                    onChange={(e) =>
                      setDateStatus(e.target.value as StudentAttendanceRecord["dateStatus"])
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">
                    Monthly %
                  </label>
                  <input
                    type="text"
                    required
                    value={monthlyPercent}
                    onChange={(e) => setMonthlyPercent(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  Overall Standing
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Good" | "Warning" | "Critical")}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="Good">Good</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="px-3.5 py-2 text-[12.5px] font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-3.5 py-2 text-[12.5px] font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Record"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-[15px] font-semibold text-gray-900">
                Update Attendance: {editRecord.student}
              </h3>
              <button
                type="button"
                onClick={() => setEditRecord(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  Today&apos;s Status
                </label>
                <select
                  value={dateStatus}
                  onChange={(e) =>
                    setDateStatus(e.target.value as StudentAttendanceRecord["dateStatus"])
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Holiday">Holiday</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  Monthly %
                </label>
                <input
                  type="text"
                  required
                  value={monthlyPercent}
                  onChange={(e) => setMonthlyPercent(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  Overall Standing
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Good" | "Warning" | "Critical")}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="Good">Good</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setEditRecord(null)}
                className="px-3.5 py-2 text-[12.5px] font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-3.5 py-2 text-[12.5px] font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Modal */}
      {viewRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-[15px] font-semibold text-gray-900">
                Attendance Profile
              </h3>
              <button
                type="button"
                onClick={() => setViewRecord(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[17px] font-bold text-gray-900">{viewRecord.student}</p>
                <p className="text-[12px] text-gray-500">
                  {viewRecord.class} • Roll No: {viewRecord.rollNo}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">
                    Current Day
                  </span>
                  <p className="text-[15px] font-bold text-emerald-600 mt-0.5">
                    {viewRecord.dateStatus}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">
                    Monthly Rate
                  </span>
                  <p className="text-[15px] font-bold text-gray-900 mt-0.5">
                    {viewRecord.monthlyPercent}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setViewRecord(null)}
                className="px-4 py-2 text-[12.5px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

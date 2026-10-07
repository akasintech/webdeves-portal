"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Pencil, Search, Trash2, X } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { GMeetLiveClassRecord } from "@/lib/types"
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

const gmeetClassFields: FormField[] = [
  { name: "className", label: "Class Name", required: true, placeholder: "e.g. Grade 10 Mathematics" },
  { name: "subject", label: "Subject", required: true, placeholder: "e.g. Calculus" },
  { name: "teacher", label: "Teacher", required: true, placeholder: "e.g. Dr. Amara Singh" },
  { name: "dateTime", label: "Date & Time", required: true, placeholder: "e.g. Aug 3, 2026 09:00 AM" },
  { name: "duration", label: "Duration", required: true, placeholder: "e.g. 60 min" },
  { name: "meetLink", label: "Meet Link", required: true, placeholder: "e.g. meet.google.com/abc-defg-hij" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Scheduled", "Completed", "Cancelled"],
  },
]

export default function GMeetLiveClassPage() {
  const [classes, setClasses] = useState<GMeetLiveClassRecord[] | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewClass, setViewClass] = useState<GMeetLiveClassRecord | null>(null)
  const [editClass, setEditClass] = useState<GMeetLiveClassRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<GMeetLiveClassRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getGMeetLiveClasses()
      setClasses(res)
    } catch (e) {
      console.error("Failed to load GMeet live classes", e)
      setClasses([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!classes) return <LoadingBlock />

  const filtered = classes.filter((item) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      item.className.toLowerCase().includes(q) ||
      item.subject.toLowerCase().includes(q) ||
      item.teacher.toLowerCase().includes(q) ||
      item.meetLink.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      "gmeet-live-classes.csv",
      classes.map((item, i) => ({
        "#": i + 1,
        ID: item.id,
        "Class Name": item.className,
        Subject: item.subject,
        Teacher: item.teacher,
        "Date & Time": item.dateTime,
        Duration: item.duration,
        "Meet Link": item.meetLink,
        Status: item.status,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    await superAdminService.createGMeetLiveClass({
      className: values.className,
      subject: values.subject,
      teacher: values.teacher,
      dateTime: values.dateTime,
      duration: values.duration.includes("min") ? values.duration : `${values.duration} min`,
      meetLink: values.meetLink,
      status: (values.status as GMeetLiveClassRecord["status"]) || "Scheduled",
    })
    setIsAddOpen(false)
    await load()
  }

  const handleEditSubmit = async (values: Record<string, string>) => {
    if (!editClass) return
    await superAdminService.updateGMeetLiveClass(editClass.id, {
      className: values.className || editClass.className,
      subject: values.subject || editClass.subject,
      teacher: values.teacher || editClass.teacher,
      dateTime: values.dateTime || editClass.dateTime,
      duration: values.duration || editClass.duration,
      meetLink: values.meetLink || editClass.meetLink,
      status: (values.status as GMeetLiveClassRecord["status"]) || editClass.status,
    })
    setEditClass(null)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await superAdminService.deleteGMeetLiveClass(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadge = (status: GMeetLiveClassRecord["status"]) => {
    switch (status) {
      case "Scheduled":
        return "bg-purple-100 text-purple-700"
      case "Completed":
        return "bg-blue-100 text-blue-700"
      case "Cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header matching screenshot media_1791401925987.png */}
      <PageHeader
        title="GMeet Live Class"
        breadcrumb="GMeet Live Class"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      {/* Main Table Panel matching screenshot media_1791401925987.png */}
      <Panel
        title="GMeet Live Class List"
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
                <th className={thClass}>SUBJECT</th>
                <th className={thClass}>TEACHER</th>
                <th className={thClass}>DATE & TIME</th>
                <th className={thClass}>DURATION</th>
                <th className={thClass}>MEET LINK</th>
                <th className={thClass}>STATUS</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    No GMeet live classes found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} text-gray-400`}>{idx + 1}</td>
                    <td className={`${tdClass} font-medium text-gray-900`}>{item.className}</td>
                    <td className={`${tdClass} text-gray-600`}>{item.subject}</td>
                    <td className={`${tdClass} text-gray-700`}>{item.teacher}</td>
                    <td className={`${tdClass} text-gray-500`}>{item.dateTime}</td>
                    <td className={`${tdClass} text-gray-600`}>{item.duration}</td>
                    <td className={`${tdClass} text-gray-700 font-mono text-[12.5px]`}>
                      <a
                        href={item.meetLink.startsWith("http") ? item.meetLink : `https://${item.meetLink}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-blue-600 underline-offset-2 hover:underline"
                      >
                        {item.meetLink}
                      </a>
                    </td>
                    <td className={tdClass}>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
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
        title="Add GMeet Live Class"
        fields={gmeetClassFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Modal */}
      {editClass && (
        <FormModal
          open={!!editClass}
          title="Edit GMeet Live Class"
          fields={gmeetClassFields}
          initialValues={{
            className: editClass.className,
            subject: editClass.subject,
            teacher: editClass.teacher,
            dateTime: editClass.dateTime,
            duration: editClass.duration,
            meetLink: editClass.meetLink,
            status: editClass.status,
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
              <h3 className="text-lg font-semibold text-gray-900">GMeet Live Class Details</h3>
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
                <span className="font-medium text-gray-900">{viewClass.className}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Subject:</span>
                <span className="font-medium text-gray-800">{viewClass.subject}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Teacher:</span>
                <span className="font-medium text-gray-800">{viewClass.teacher}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Date & Time:</span>
                <span className="text-gray-700">{viewClass.dateTime}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Duration:</span>
                <span className="text-gray-700">{viewClass.duration}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Meet Link:</span>
                <span className="font-mono font-medium text-gray-900">{viewClass.meetLink}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Status:</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                    viewClass.status,
                  )}`}
                >
                  {viewClass.status}
                </span>
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
            <h3 className="text-lg font-semibold text-gray-900">Delete Live Class</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete the scheduled session for{" "}
              <strong className="text-gray-900">&quot;{deleteTarget.className} - {deleteTarget.subject}&quot;</strong>? This
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

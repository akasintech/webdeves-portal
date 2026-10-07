"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Pencil, Search, Trash2, X } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { OnlineCourseItem, OnlineCoursesResponse, OnlineCourseStatus } from "@/lib/types"
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

const addCourseFields: FormField[] = [
  { name: "name", label: "Course Name", required: true, placeholder: "e.g. Data Structures & Algorithms" },
  { name: "category", label: "Category", type: "select", options: ["Academic", "Elective", "Vocational"] },
  { name: "instructor", label: "Instructor", required: true, placeholder: "e.g. Prof. David Miller" },
  { name: "duration", label: "Duration", required: true, placeholder: "e.g. 40 hrs" },
  { name: "students", label: "Initial Enrolled Students", type: "number", required: true, placeholder: "e.g. 0" },
  { name: "status", label: "Status", type: "select", options: ["Published", "Draft"] },
]

export default function OnlineCoursesPage() {
  const [data, setData] = useState<OnlineCoursesResponse | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewCourse, setViewCourse] = useState<OnlineCourseItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<OnlineCourseItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getOnlineCoursesList()
      setData(res)
    } catch (e) {
      console.error("Failed to load courses list", e)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!data) return <LoadingBlock />

  const filtered = data.courses.filter((c) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      "online-courses.csv",
      data.courses.map((c, i) => ({
        "#": i + 1,
        ID: c.id,
        "Course Name": c.name,
        Category: c.category,
        Instructor: c.instructor,
        Duration: c.duration,
        Students: c.students,
        Status: c.status,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    await superAdminService.createOnlineCourse({
      name: values.name,
      category: values.category || "Academic",
      instructor: values.instructor,
      duration: values.duration,
      students: parseInt(values.students, 10) || 0,
      status: (values.status as OnlineCourseStatus) || "Published",
    })
    setIsAddOpen(false)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await superAdminService.deleteOnlineCourse(deleteTarget.id)
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
        title="Online Courses"
        breadcrumb="Online Course / Online Courses"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <p className="text-[12px] text-gray-500 font-medium">Total Courses</p>
          <p className="text-[24px] font-bold text-gray-900 mt-1">{data.stats.totalCourses}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <p className="text-[12px] text-gray-500 font-medium">Published</p>
          <p className="text-[24px] font-bold text-gray-900 mt-1">{data.stats.published}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <p className="text-[12px] text-gray-500 font-medium">Draft</p>
          <p className="text-[24px] font-bold text-gray-900 mt-1">{data.stats.draft}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <p className="text-[12px] text-gray-500 font-medium">Enrolled Students</p>
          <p className="text-[24px] font-bold text-gray-900 mt-1">
            {data.stats.enrolledStudents.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Online Courses List Panel */}
      <Panel
        title="Online Courses List"
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
                <th className={thClass}>COURSE NAME</th>
                <th className={thClass}>CATEGORY</th>
                <th className={thClass}>INSTRUCTOR</th>
                <th className={thClass}>DURATION</th>
                <th className={thClass}>STUDENTS</th>
                <th className={thClass}>STATUS</th>
                <th className={`text-right ${thClass}`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400 text-[13px]">
                    No courses found
                  </td>
                </tr>
              ) : (
                filtered.map((course, idx) => (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} text-gray-400`}>{idx + 1}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>{course.name}</td>
                    <td className={`${tdClass} text-gray-600`}>{course.category}</td>
                    <td className={`${tdClass} text-gray-700 font-medium`}>{course.instructor}</td>
                    <td className={`${tdClass} text-gray-500`}>{course.duration}</td>
                    <td className={`${tdClass} text-gray-600`}>{course.students}</td>
                    <td className={tdClass}>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          course.status === "Published"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1.5 text-gray-400">
                        <button
                          type="button"
                          onClick={() => setViewCourse(course)}
                          title="View Course"
                          aria-label="View Course"
                          className="p-1 hover:text-blue-600 rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewCourse(course)}
                          title="Edit Course"
                          aria-label="Edit Course"
                          className="p-1 hover:text-amber-600 rounded transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(course)}
                          title="Delete Course"
                          aria-label="Delete Course"
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

      {/* Add Course Modal */}
      <FormModal
        open={isAddOpen}
        title="Add New Online Course"
        fields={addCourseFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* View Course Modal */}
      {viewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-[16px] font-semibold text-gray-900">Course Details</h3>
              <button
                type="button"
                onClick={() => setViewCourse(null)}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-[13px]">
              <div>
                <span className="text-gray-400 text-[11px] uppercase font-semibold block">Course Name</span>
                <p className="font-semibold text-gray-900 mt-0.5">{viewCourse.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-400 text-[11px] uppercase font-semibold block">Category</span>
                  <p className="text-gray-700 mt-0.5">{viewCourse.category}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-[11px] uppercase font-semibold block">Instructor</span>
                  <p className="text-gray-700 mt-0.5">{viewCourse.instructor}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-400 text-[11px] uppercase font-semibold block">Duration</span>
                  <p className="text-gray-700 mt-0.5">{viewCourse.duration}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-[11px] uppercase font-semibold block">Enrolled Students</span>
                  <p className="text-gray-700 mt-0.5">{viewCourse.students}</p>
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] uppercase font-semibold block">Status</span>
                <span
                  className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    viewCourse.status === "Published"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {viewCourse.status}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setViewCourse(null)}
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
              Are you sure you want to delete <span className="font-semibold text-gray-800">{deleteTarget.name}</span>? This action cannot be undone.
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

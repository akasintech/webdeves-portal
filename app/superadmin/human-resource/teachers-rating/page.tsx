"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Star, Search, X } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { TeacherRatingRecord } from "@/lib/types"
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

const addRatingFields: FormField[] = [
  { name: "name", label: "Teacher Name", required: true, placeholder: "e.g. Dr. Amara Singh" },
  { name: "role", label: "Designation / Subject", required: true, placeholder: "e.g. Mathematics Teacher" },
  { name: "department", label: "Department", required: true, placeholder: "e.g. Sciences" },
  { name: "rating", label: "Rating (out of 5.0)", type: "number", required: true, placeholder: "4.8" },
  { name: "reviewsCount", label: "Number of Reviews", type: "number", required: true, placeholder: "37" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Inactive"],
  },
]

export default function TeachersRatingPage() {
  const [ratings, setRatings] = useState<TeacherRatingRecord[] | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewRating, setViewRating] = useState<TeacherRatingRecord | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getTeacherRatingsOverview()
      setRatings(res)
    } catch (e) {
      console.error("Failed to load teacher ratings", e)
      setRatings([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!ratings) return <LoadingBlock />

  const filtered = ratings.filter((r) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      r.name.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      "teachers-rating.csv",
      ratings.map((r, i) => ({
        "#": i + 1,
        ID: r.id,
        Staff: r.name,
        Role: r.role,
        Department: r.department,
        Rating: `${r.rating} / 5.0`,
        Reviews: `${r.reviewsCount} reviews`,
        Status: r.status,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    const newRating = parseFloat(values.rating) || 5.0
    const reviews = parseInt(values.reviewsCount, 10) || 1

    ratings.push({
      id: `TR-00${ratings.length + 1}`,
      name: values.name,
      role: values.role,
      initial: values.name.charAt(0).toUpperCase() || "T",
      initialColor: "bg-indigo-600",
      department: values.department,
      rating: newRating,
      reviewsCount: reviews,
      status: (values.status as "Active" | "Inactive") || "Active",
    })
    setIsAddOpen(false)
    await load()
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Teachers Rating"
        breadcrumb="Human Resource / Teachers Rating"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      <Panel
        title="Teachers Rating Overview"
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
                <th className={thClass}>STAFF</th>
                <th className={thClass}>DEPARTMENT</th>
                <th className={thClass}>RATING</th>
                <th className={thClass}>REVIEWS</th>
                <th className={thClass}>STATUS</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No teacher ratings found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={tdClass}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${
                            item.initialColor || "bg-indigo-600"
                          } text-white flex items-center justify-center font-semibold text-xs shrink-0`}
                        >
                          {item.initial}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-tight">{item.name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{item.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`${tdClass} text-gray-600`}>{item.department}</td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{item.rating.toFixed(1)}</span>
                        <span className="text-gray-400 font-normal text-xs">/5.0</span>
                      </div>
                    </td>
                    <td className={`${tdClass} text-gray-500`}>{item.reviewsCount} reviews</td>
                    <td className={tdClass}>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                        {item.status}
                      </span>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => setViewRating(item)}
                          title="View Reviews"
                          className="p-1 hover:text-blue-600 text-gray-400 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
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
        title="Add Teacher Rating"
        fields={addRatingFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* View Rating Modal */}
      {viewRating && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Teacher Evaluation</h3>
              <button
                onClick={() => setViewRating(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-base">
                  {viewRating.initial}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{viewRating.name}</h4>
                  <p className="text-xs text-gray-500">{viewRating.role}</p>
                </div>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Department:</span>
                <span className="font-medium text-gray-900">{viewRating.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Overall Score:</span>
                <span className="font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" /> {viewRating.rating.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Student & Peer Feedback:</span>
                <span className="font-medium text-gray-900">{viewRating.reviewsCount} submissions</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Teaching Status:</span>
                <span className="text-emerald-600 font-semibold">{viewRating.status}</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewRating(null)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
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

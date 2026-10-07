"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Pencil, Search, Trash2, X } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { BranchOverviewRecord, BranchOverviewResponse } from "@/lib/types"
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

const addBranchFields: FormField[] = [
  { name: "branch", label: "Branch Name", required: true, placeholder: "e.g. West Campus" },
  { name: "location", label: "Location", required: true, placeholder: "e.g. 52 West Boulevard, Uptown" },
  { name: "principal", label: "Principal", required: true, placeholder: "e.g. Dr. Arthur Hayes" },
  { name: "students", label: "Total Students", type: "number", required: true, placeholder: "e.g. 240" },
  { name: "staff", label: "Total Staff", type: "number", required: true, placeholder: "e.g. 22" },
  { name: "revenue", label: "Monthly Revenue", required: true, placeholder: "e.g. $32,500" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
]

export default function MultiBranchOverviewPage() {
  const [data, setData] = useState<BranchOverviewResponse | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewBranch, setViewBranch] = useState<BranchOverviewRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BranchOverviewRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getBranchOverview()
      setData(res)
    } catch (e) {
      console.error("Failed to load branch overview", e)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!data) return <LoadingBlock />

  const filtered = data.branches.filter((b) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      b.branch.toLowerCase().includes(q) ||
      b.location.toLowerCase().includes(q) ||
      b.principal.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      "branch-overview.csv",
      data.branches.map((b) => ({
        ID: b.id,
        Branch: b.branch,
        Location: b.location,
        Principal: b.principal,
        Students: b.students,
        Staff: b.staff,
        Revenue: b.revenue,
        Status: b.status,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    await superAdminService.createBranch({
      branch: values.branch,
      location: values.location,
      principal: values.principal,
      students: parseInt(values.students, 10) || 0,
      staff: parseInt(values.staff, 10) || 0,
      revenue: values.revenue.startsWith("$") ? values.revenue : `$${values.revenue}`,
      status: (values.status as "Active" | "Inactive") || "Active",
    })
    setIsAddOpen(false)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await superAdminService.deleteBranch(deleteTarget.id)
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
        title="Branch Overview"
        breadcrumb="Multi Branch / Branch Overview"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <p className="text-[12px] text-gray-500 font-medium">Total Branches</p>
          <p className="text-[24px] font-bold text-gray-900 mt-1">{data.stats.totalBranches}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <p className="text-[12px] text-gray-500 font-medium">Total Students</p>
          <p className="text-[24px] font-bold text-gray-900 mt-1">
            {data.stats.totalStudents.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <p className="text-[12px] text-gray-500 font-medium">Total Staff</p>
          <p className="text-[24px] font-bold text-gray-900 mt-1">{data.stats.totalStaff}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <p className="text-[12px] text-gray-500 font-medium">Monthly Revenue</p>
          <p className="text-[24px] font-bold text-gray-900 mt-1">{data.stats.monthlyRevenue}</p>
        </div>
      </div>

      {/* Branch Overview List Panel */}
      <Panel
        title="Branch Overview List"
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
                <th className={thClass}>BRANCH</th>
                <th className={thClass}>LOCATION</th>
                <th className={thClass}>PRINCIPAL</th>
                <th className={thClass}>STUDENTS</th>
                <th className={thClass}>STAFF</th>
                <th className={thClass}>REVENUE</th>
                <th className={thClass}>STATUS</th>
                <th className={`text-right ${thClass}`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400 text-[13px]">
                    No branches found
                  </td>
                </tr>
              ) : (
                filtered.map((branch) => (
                  <tr key={branch.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} font-semibold text-gray-900`}>{branch.branch}</td>
                    <td className={`${tdClass} text-gray-600`}>{branch.location}</td>
                    <td className={`${tdClass} text-gray-700`}>{branch.principal}</td>
                    <td className={`${tdClass} text-gray-600`}>{branch.students}</td>
                    <td className={`${tdClass} text-gray-600`}>{branch.staff}</td>
                    <td className={`${tdClass} text-gray-700 font-medium`}>{branch.revenue}</td>
                    <td className={tdClass}>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          branch.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {branch.status}
                      </span>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1.5 text-gray-400">
                        <button
                          type="button"
                          onClick={() => setViewBranch(branch)}
                          title="View Branch"
                          aria-label="View Branch"
                          className="p-1 hover:text-blue-600 rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewBranch(branch)}
                          title="Edit Branch"
                          aria-label="Edit Branch"
                          className="p-1 hover:text-amber-600 rounded transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(branch)}
                          title="Delete Branch"
                          aria-label="Delete Branch"
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

      {/* Add Branch Modal */}
      <FormModal
        open={isAddOpen}
        title="Add New Branch"
        fields={addBranchFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* View Branch Modal */}
      {viewBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-[16px] font-semibold text-gray-900">Branch Details</h3>
              <button
                type="button"
                onClick={() => setViewBranch(null)}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-[13px]">
              <div>
                <span className="text-gray-400 text-[11px] uppercase font-semibold block">Branch Name</span>
                <p className="font-semibold text-gray-900 mt-0.5">{viewBranch.branch}</p>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] uppercase font-semibold block">Location</span>
                <p className="text-gray-700 mt-0.5">{viewBranch.location}</p>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] uppercase font-semibold block">Principal</span>
                <p className="text-gray-700 mt-0.5">{viewBranch.principal}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-gray-400 text-[11px] uppercase font-semibold block">Total Students</span>
                  <p className="font-medium text-gray-800">{viewBranch.students}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-[11px] uppercase font-semibold block">Total Staff</span>
                  <p className="font-medium text-gray-800">{viewBranch.staff}</p>
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] uppercase font-semibold block">Monthly Revenue</span>
                <p className="font-medium text-gray-800 mt-0.5">{viewBranch.revenue}</p>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] uppercase font-semibold block">Status</span>
                <span
                  className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    viewBranch.status === "Active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {viewBranch.status}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setViewBranch(null)}
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
              Are you sure you want to delete <span className="font-semibold text-gray-800">{deleteTarget.branch}</span>? This action cannot be undone.
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

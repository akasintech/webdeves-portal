"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Pencil, Search, Trash2, X } from "lucide-react"
import type { GenericRecordItem } from "@/lib/types"
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

interface GenericRecordsViewProps {
  title: string
  breadcrumb: string
  tableTitle: string
  fetchRecords: () => Promise<GenericRecordItem[]>
  createRecord: (data: Omit<GenericRecordItem, "id">) => Promise<GenericRecordItem>
  updateRecord?: (id: string, data: Partial<GenericRecordItem>) => Promise<GenericRecordItem>
  deleteRecord: (id: string) => Promise<{ success: boolean }>
}

const addFields: FormField[] = [
  { name: "name", label: "Record Name", required: true, placeholder: "e.g. Record 3" },
  { name: "details", label: "Details", required: true, placeholder: "e.g. Sample record" },
  { name: "date", label: "Date", type: "text", required: true, placeholder: "e.g. Aug 1, 2026" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
]

export function GenericRecordsView({
  title,
  breadcrumb,
  tableTitle,
  fetchRecords,
  createRecord,
  updateRecord,
  deleteRecord,
}: GenericRecordsViewProps) {
  const [records, setRecords] = useState<GenericRecordItem[] | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<GenericRecordItem | null>(null)
  const [editRecord, setEditRecord] = useState<GenericRecordItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<GenericRecordItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await fetchRecords()
      setRecords(data)
    } catch (e) {
      console.error("Failed to load records", e)
      setRecords([])
    }
  }, [fetchRecords])

  useEffect(() => {
    load()
  }, [load])

  if (!records) return <LoadingBlock />

  const filtered = records.filter((r) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      r.name.toLowerCase().includes(q) ||
      r.details.toLowerCase().includes(q) ||
      r.date.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      `${title.toLowerCase()}-list.csv`,
      records.map((r, i) => ({
        "#": i + 1,
        ID: r.id,
        Name: r.name,
        Details: r.details,
        Date: r.date,
        Status: r.status,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    await createRecord({
      name: values.name,
      details: values.details,
      date: values.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: (values.status as "Active" | "Inactive") || "Active",
    })
    setIsAddOpen(false)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteRecord(deleteTarget.id)
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
        title={title}
        breadcrumb={breadcrumb}
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      {/* Main Table Panel */}
      <Panel
        title={tableTitle}
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
                <th className={thClass}>NAME</th>
                <th className={thClass}>DETAILS</th>
                <th className={thClass}>DATE</th>
                <th className={thClass}>STATUS</th>
                <th className={`text-right ${thClass}`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-[13px]">
                    No records found
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} text-gray-400`}>{index + 1}</td>
                    <td className={`${tdClass} font-medium text-gray-800`}>{item.name}</td>
                    <td className={`${tdClass} text-gray-500`}>{item.details}</td>
                    <td className={`${tdClass} text-gray-500`}>{item.date}</td>
                    <td className={tdClass}>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          item.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1.5 text-gray-400">
                        <button
                          type="button"
                          onClick={() => setViewRecord(item)}
                          title="View Details"
                          aria-label="View Details"
                          className="p-1 hover:text-blue-600 rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditRecord(item)}
                          title="Edit Record"
                          aria-label="Edit Record"
                          className="p-1 hover:text-amber-600 rounded transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          title="Delete Record"
                          aria-label="Delete Record"
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

      {/* Add New Modal */}
      <FormModal
        open={isAddOpen}
        title={`Add New ${title}`}
        fields={addFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Record Modal */}
      {editRecord && (
        <FormModal
          open={!!editRecord}
          title={`Edit ${title}`}
          fields={addFields}
          initialValues={{
            name: editRecord.name,
            details: editRecord.details,
            date: editRecord.date,
            status: editRecord.status,
          }}
          onClose={() => setEditRecord(null)}
          onSubmit={async (values) => {
            if (updateRecord) {
              await updateRecord(editRecord.id, {
                name: values.name,
                details: values.details,
                date: values.date,
                status: (values.status as "Active" | "Inactive") || "Active",
              })
            } else {
              editRecord.name = values.name || editRecord.name
              editRecord.details = values.details || editRecord.details
              editRecord.date = values.date || editRecord.date
              editRecord.status = (values.status as "Active" | "Inactive") || editRecord.status
            }
            setEditRecord(null)
            await load()
          }}
        />
      )}

      {/* View Detail Modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-[16px] font-semibold text-gray-900">Record Details</h3>
              <button
                type="button"
                onClick={() => setViewRecord(null)}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-[13px]">
              <div>
                <span className="text-gray-400 text-[11px] uppercase font-semibold block">Record Name</span>
                <p className="font-medium text-gray-900 mt-0.5">{viewRecord.name}</p>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] uppercase font-semibold block">Details</span>
                <p className="text-gray-700 mt-0.5">{viewRecord.details}</p>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] uppercase font-semibold block">Date</span>
                <p className="text-gray-700 mt-0.5">{viewRecord.date}</p>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] uppercase font-semibold block">Status</span>
                <span
                  className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    viewRecord.status === "Active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {viewRecord.status}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setViewRecord(null)}
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

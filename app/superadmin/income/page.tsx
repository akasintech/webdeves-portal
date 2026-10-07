"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Pencil, Search, Trash2, X } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { IncomeRecord, IncomeStats } from "@/lib/types"
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

const incomeFields: FormField[] = [
  { name: "incomeHead", label: "Income Head", required: true, placeholder: "e.g. Tuition Fee — Grade 10" },
  { name: "amount", label: "Amount ($)", required: true, placeholder: "$42,000" },
  { name: "date", label: "Date", required: true, placeholder: "e.g. Aug 1, 2026" },
  {
    name: "paymentMode",
    label: "Payment Mode",
    type: "select",
    options: ["Online", "Bank Transfer", "Cheque", "Cash"],
  },
  { name: "reference", label: "Reference", required: true, placeholder: "e.g. FEE-AUG-001" },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: ["Fee", "Online", "Donation", "Other"],
  },
]

export default function IncomePage() {
  const [incomeList, setIncomeList] = useState<IncomeRecord[] | null>(null)
  const [stats, setStats] = useState<IncomeStats | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewIncome, setViewIncome] = useState<IncomeRecord | null>(null)
  const [editIncome, setEditIncome] = useState<IncomeRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<IncomeRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getIncome()
      setIncomeList(res.income)
      setStats(res.stats)
    } catch (e) {
      console.error("Failed to load income data", e)
      setIncomeList([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!incomeList || !stats) return <LoadingBlock />

  const filtered = incomeList.filter((item) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      item.incomeHead.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.paymentMode.toLowerCase().includes(q) ||
      item.reference.toLowerCase().includes(q) ||
      item.amount.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      "income-list.csv",
      incomeList.map((item, i) => ({
        "#": i + 1,
        ID: item.id,
        "Income Head": item.incomeHead,
        Amount: item.amount,
        Date: item.date,
        "Payment Mode": item.paymentMode,
        Reference: item.reference,
        Category: item.category,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    const rawAmt = values.amount?.trim() || "$0"
    const formattedAmt = rawAmt.startsWith("$") ? rawAmt : `$${rawAmt}`

    await superAdminService.createIncome({
      incomeHead: values.incomeHead,
      amount: formattedAmt,
      date: values.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      paymentMode: values.paymentMode || "Online",
      reference: values.reference || `REF-${Date.now().toString().slice(-4)}`,
      category: values.category || "Fee",
    })
    setIsAddOpen(false)
    await load()
  }

  const handleEditSubmit = async (values: Record<string, string>) => {
    if (!editIncome) return
    const rawAmt = values.amount?.trim() || editIncome.amount
    const formattedAmt = rawAmt.startsWith("$") ? rawAmt : `$${rawAmt}`

    await superAdminService.updateIncome(editIncome.id, {
      incomeHead: values.incomeHead || editIncome.incomeHead,
      amount: formattedAmt,
      date: values.date || editIncome.date,
      paymentMode: values.paymentMode || editIncome.paymentMode,
      reference: values.reference || editIncome.reference,
      category: values.category || editIncome.category,
    })
    setEditIncome(null)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await superAdminService.deleteIncome(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header matching screenshot media_1791401925973.png */}
      <PageHeader
        title="Income"
        breadcrumb="Income"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      {/* 4 Stat Cards matching screenshot media_1791401925973.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-[12px] text-gray-400 font-medium">Total Income (Aug)</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalIncome}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-[12px] text-gray-400 font-medium">Fee Collection</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.feeCollection}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-[12px] text-gray-400 font-medium">Other Income</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.otherIncome}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-[12px] text-gray-400 font-medium">vs Last Month</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.vsLastMonth}</p>
        </div>
      </div>

      {/* Main Table Panel matching screenshot media_1791401925973.png */}
      <Panel
        title="Income List"
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
                <th className={thClass}>INCOME HEAD</th>
                <th className={thClass}>AMOUNT</th>
                <th className={thClass}>DATE</th>
                <th className={thClass}>PAYMENT MODE</th>
                <th className={thClass}>REFERENCE</th>
                <th className={thClass}>CATEGORY</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    No income records found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} text-gray-400`}>{idx + 1}</td>
                    <td className={`${tdClass} font-medium text-gray-900`}>{item.incomeHead}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>{item.amount}</td>
                    <td className={`${tdClass} text-gray-500`}>{item.date}</td>
                    <td className={`${tdClass} text-gray-700`}>{item.paymentMode}</td>
                    <td className={`${tdClass} font-mono text-[12px] text-gray-500`}>{item.reference}</td>
                    <td className={`${tdClass} text-gray-700`}>{item.category}</td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1 text-gray-400">
                        <button
                          onClick={() => setViewIncome(item)}
                          title="View"
                          className="p-1 hover:text-blue-600 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditIncome(item)}
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
        title="Add Income Record"
        fields={incomeFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Modal */}
      {editIncome && (
        <FormModal
          open={!!editIncome}
          title="Edit Income Record"
          fields={incomeFields}
          initialValues={{
            incomeHead: editIncome.incomeHead,
            amount: editIncome.amount,
            date: editIncome.date,
            paymentMode: editIncome.paymentMode,
            reference: editIncome.reference,
            category: editIncome.category,
          }}
          onClose={() => setEditIncome(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* View Modal */}
      {viewIncome && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Income Details</h3>
              <button
                onClick={() => setViewIncome(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Income Head:</span>
                <span className="font-medium text-gray-900">{viewIncome.incomeHead}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Amount:</span>
                <span className="font-semibold text-gray-900">{viewIncome.amount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Date:</span>
                <span className="text-gray-700">{viewIncome.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Payment Mode:</span>
                <span className="font-medium text-gray-800">{viewIncome.paymentMode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Reference:</span>
                <span className="font-mono text-gray-800">{viewIncome.reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Category:</span>
                <span className="text-gray-700">{viewIncome.category}</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewIncome(null)}
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
            <h3 className="text-lg font-semibold text-gray-900">Delete Income Record</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900">&quot;{deleteTarget.incomeHead}&quot;</strong>? This
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

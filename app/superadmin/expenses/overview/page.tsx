"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Pencil, Search, Trash2, X } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { ExpenseOverviewRecord, ExpensesOverviewStats } from "@/lib/types"
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

const expenseFields: FormField[] = [
  { name: "expenseHead", label: "Expense Head", required: true, placeholder: "e.g. Teaching Staff Salaries" },
  { name: "amount", label: "Amount ($)", required: true, placeholder: "$5,000" },
  { name: "date", label: "Date", required: true, placeholder: "e.g. Aug 1, 2026" },
  { name: "approvedBy", label: "Approved By", required: true, placeholder: "e.g. Super Admin" },
  { name: "category", label: "Category", required: true, placeholder: "e.g. Operations" },
  { name: "receipt", label: "Receipt Number", required: true, placeholder: "e.g. EXP-005" },
]

export default function ExpensesOverviewPage() {
  const [expenses, setExpenses] = useState<ExpenseOverviewRecord[] | null>(null)
  const [stats, setStats] = useState<ExpensesOverviewStats | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewExpense, setViewExpense] = useState<ExpenseOverviewRecord | null>(null)
  const [editExpense, setEditExpense] = useState<ExpenseOverviewRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ExpenseOverviewRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getExpensesOverview()
      setExpenses(res.expenses)
      setStats(res.stats)
    } catch (e) {
      console.error("Failed to load expenses overview", e)
      setExpenses([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!expenses || !stats) return <LoadingBlock />

  const filtered = expenses.filter((item) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      item.expenseHead.toLowerCase().includes(q) ||
      item.approvedBy.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.receipt.toLowerCase().includes(q) ||
      item.amount.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      "expenses-overview.csv",
      expenses.map((e, i) => ({
        "#": i + 1,
        ID: e.id,
        "Expense Head": e.expenseHead,
        Amount: e.amount,
        Date: e.date,
        "Approved By": e.approvedBy,
        Category: e.category,
        Receipt: e.receipt,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    const rawAmt = values.amount || "$0"
    const formattedAmt = rawAmt.startsWith("$") ? rawAmt : `$${rawAmt}`
    await superAdminService.createExpenseOverview({
      expenseHead: values.expenseHead,
      amount: formattedAmt,
      date: values.date,
      approvedBy: values.approvedBy,
      category: values.category,
      receipt: values.receipt,
    })
    setIsAddOpen(false)
    await load()
  }

  const handleEditSubmit = async (values: Record<string, string>) => {
    if (!editExpense) return
    const rawAmt = values.amount || editExpense.amount
    const formattedAmt = rawAmt.startsWith("$") ? rawAmt : `$${rawAmt}`
    editExpense.expenseHead = values.expenseHead || editExpense.expenseHead
    editExpense.amount = formattedAmt
    editExpense.date = values.date || editExpense.date
    editExpense.approvedBy = values.approvedBy || editExpense.approvedBy
    editExpense.category = values.category || editExpense.category
    editExpense.receipt = values.receipt || editExpense.receipt
    setEditExpense(null)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await superAdminService.deleteExpenseOverview(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Expenses Overview"
        breadcrumb="Expenses / Expenses Overview"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      {/* 4 Stat Cards matching screenshot media_1791386465801.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-[12px] text-gray-400 font-medium">Total Expenses (Aug)</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalExpenses}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-[12px] text-gray-400 font-medium">Staff Salaries</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.staffSalaries}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-[12px] text-gray-400 font-medium">Operations</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.operations}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-[12px] text-gray-400 font-medium">Miscellaneous</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.miscellaneous}</p>
        </div>
      </div>

      <Panel
        title="Expenses Overview List"
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
                <th className={thClass}>EXPENSE HEAD</th>
                <th className={thClass}>AMOUNT</th>
                <th className={thClass}>DATE</th>
                <th className={thClass}>APPROVED BY</th>
                <th className={thClass}>CATEGORY</th>
                <th className={thClass}>RECEIPT</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    No expenses found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} text-gray-400 font-mono text-xs`}>{index + 1}</td>
                    <td className={`${tdClass} font-medium text-gray-900`}>{item.expenseHead}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>{item.amount}</td>
                    <td className={tdClass}>{item.date}</td>
                    <td className={`${tdClass} text-gray-700`}>{item.approvedBy}</td>
                    <td className={`${tdClass} text-gray-700`}>{item.category}</td>
                    <td className={`${tdClass} font-mono text-xs text-gray-600`}>{item.receipt}</td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1 text-gray-400">
                        <button
                          onClick={() => setViewExpense(item)}
                          title="View"
                          className="p-1 hover:text-blue-600 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditExpense(item)}
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
        title="Add Expense"
        fields={expenseFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Modal */}
      {editExpense && (
        <FormModal
          open={!!editExpense}
          title="Edit Expense"
          fields={expenseFields}
          initialValues={{
            expenseHead: editExpense.expenseHead,
            amount: editExpense.amount,
            date: editExpense.date,
            approvedBy: editExpense.approvedBy,
            category: editExpense.category,
            receipt: editExpense.receipt,
          }}
          onClose={() => setEditExpense(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* View Modal */}
      {viewExpense && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Expense Details</h3>
              <button
                onClick={() => setViewExpense(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Expense Head:</span>
                <span className="font-semibold text-gray-900">{viewExpense.expenseHead}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Amount:</span>
                <span className="font-bold text-gray-900">{viewExpense.amount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium text-gray-800">{viewExpense.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Approved By:</span>
                <span className="font-medium text-gray-800">{viewExpense.approvedBy}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Category:</span>
                <span className="font-medium text-gray-800">{viewExpense.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Receipt No:</span>
                <span className="font-mono text-gray-900">{viewExpense.receipt}</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewExpense(null)}
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
            <h3 className="text-lg font-semibold text-gray-900">Delete Expense</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete expense{" "}
              <strong className="text-gray-900">&quot;{deleteTarget.expenseHead}&quot;</strong> ({deleteTarget.amount})? This
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

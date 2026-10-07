"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Printer, Search, Trash2, X, Download } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { PayrollRecord } from "@/lib/types"
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

const addPayrollFields: FormField[] = [
  { name: "name", label: "Staff Name", required: true, placeholder: "e.g. Dr. Amara Singh" },
  { name: "role", label: "Role / Designation", required: true, placeholder: "e.g. Mathematics Teacher" },
  { name: "basicSalary", label: "Basic Salary ($)", type: "number", required: true, placeholder: "5500" },
  { name: "allowances", label: "Allowances ($)", type: "number", required: true, placeholder: "800" },
  { name: "deductions", label: "Deductions ($)", type: "number", required: true, placeholder: "620" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Processing", "Paid", "Pending"],
  },
]

export default function PayrollPage() {
  const [payroll, setPayroll] = useState<PayrollRecord[] | null>(null)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedSlip, setSelectedSlip] = useState<PayrollRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PayrollRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await superAdminService.getPayroll()
      setPayroll(res)
    } catch (e) {
      console.error("Failed to load payroll", e)
      setPayroll([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!payroll) return <LoadingBlock />

  const filtered = payroll.filter((p) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    downloadCsv(
      "payroll-august-2026.csv",
      payroll.map((p, i) => ({
        "#": i + 1,
        ID: p.id,
        Name: p.name,
        Role: p.role,
        "Basic Salary": `$${p.basicSalary.toLocaleString()}`,
        Allowances: `+$${p.allowances.toLocaleString()}`,
        Deductions: `-$${p.deductions.toLocaleString()}`,
        "Net Salary": `$${p.netSalary.toLocaleString()}`,
        Status: p.status,
      })),
    )
  }

  const handleCreate = async (values: Record<string, string>) => {
    const basic = parseFloat(values.basicSalary) || 0
    const allow = parseFloat(values.allowances) || 0
    const deduct = parseFloat(values.deductions) || 0
    const net = basic + allow - deduct

    await superAdminService.createPayroll({
      name: values.name,
      role: values.role,
      basicSalary: basic,
      allowances: allow,
      deductions: deduct,
      netSalary: net,
      status: (values.status as PayrollRecord["status"]) || "Processing",
    })
    setIsAddOpen(false)
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await superAdminService.deletePayroll(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Payroll"
        breadcrumb="Human Resource / Payroll"
        addLabel="Add New"
        onAdd={() => setIsAddOpen(true)}
        onExport={handleExport}
      />

      <Panel
        title="Payroll — August 2026"
        right={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 w-52 border border-gray-200 rounded-lg text-[12.5px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200/60">
              Processing
            </span>
          </div>
        }
      >
        <div className="overflow-x-auto border-t border-gray-100 mt-2">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/75 border-b border-gray-100">
              <tr>
                <th className={thClass}>ID</th>
                <th className={thClass}>NAME</th>
                <th className={thClass}>ROLE</th>
                <th className={thClass}>BASIC SALARY</th>
                <th className={thClass}>ALLOWANCES</th>
                <th className={thClass}>DEDUCTIONS</th>
                <th className={thClass}>NET SALARY</th>
                <th className={`${thClass} text-right`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    No payroll records found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`${tdClass} text-gray-400 font-mono text-xs`}>{item.id}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>{item.name}</td>
                    <td className={`${tdClass} text-gray-500`}>{item.role}</td>
                    <td className={`${tdClass} text-gray-600`}>${item.basicSalary.toLocaleString()}</td>
                    <td className={`${tdClass} text-emerald-600 font-medium`}>
                      +${item.allowances.toLocaleString()}
                    </td>
                    <td className={`${tdClass} text-red-500 font-medium`}>
                      -${item.deductions.toLocaleString()}
                    </td>
                    <td className={`${tdClass} font-bold text-gray-900`}>
                      ${item.netSalary.toLocaleString()}
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedSlip(item)}
                          className="px-3 py-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                        >
                          Pay Slip
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          title="Delete Record"
                          className="p-1 hover:text-red-600 text-gray-400 rounded transition-colors"
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

      <FormModal
        open={isAddOpen}
        title="Add Payroll Entry"
        fields={addPayrollFields}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Pay Slip Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Salary Pay Slip</h3>
                <p className="text-xs text-gray-500">Pay Period: August 2026</p>
              </div>
              <button
                onClick={() => setSelectedSlip(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Staff Member:</span>
                <span className="font-semibold text-gray-900">{selectedSlip.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Employee ID:</span>
                <span className="font-mono text-gray-900">{selectedSlip.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Designation / Role:</span>
                <span className="text-gray-900">{selectedSlip.role}</span>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden text-sm">
              <div className="bg-gray-50/75 px-4 py-2 font-semibold text-xs text-gray-600 uppercase tracking-wider border-b border-gray-100">
                Earnings & Deductions Summary
              </div>
              <div className="divide-y divide-gray-100 px-4">
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-600">Basic Salary</span>
                  <span className="font-medium text-gray-900">${selectedSlip.basicSalary.toLocaleString()}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-emerald-700">Allowances & Benefits</span>
                  <span className="font-medium text-emerald-600">+${selectedSlip.allowances.toLocaleString()}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-red-700">Deductions (Taxes & Social)</span>
                  <span className="font-medium text-red-500">-${selectedSlip.deductions.toLocaleString()}</span>
                </div>
                <div className="py-3 flex justify-between bg-blue-50/50 -mx-4 px-4 font-bold text-base">
                  <span className="text-gray-900">Net Payable Salary</span>
                  <span className="text-blue-700">${selectedSlip.netSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedSlip(null)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Pay slip printed/downloaded for ${selectedSlip.name}`)
                  setSelectedSlip(null)
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
              >
                <Printer className="w-4 h-4" /> Print Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Delete Payroll Record</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to remove the payroll entry for{" "}
              <strong className="text-gray-900">&quot;{deleteTarget.name}&quot;</strong>?
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

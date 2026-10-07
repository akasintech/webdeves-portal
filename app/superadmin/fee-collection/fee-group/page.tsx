"use client"

import { useCallback, useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { FeeGroup } from "@/lib/types"
import {
  FormModal,
  LoadingBlock,
  PageHeader,
  Panel,
  downloadCsv,
  formatMoney,
  tdClass,
  thClass,
  type FormField,
} from "@/components/superadmin/ui"

const fields: FormField[] = [
  { name: "name", label: "Group Name", required: true },
  { name: "includes", label: "Includes (comma separated)", required: true, placeholder: "Tuition, Library" },
  { name: "totalAmount", label: "Total Amount", type: "number", required: true },
  { name: "applicableClasses", label: "Applicable Classes", required: true, placeholder: "Grade 7–10" },
]

export default function FeeGroupPage() {
  const [groups, setGroups] = useState<FeeGroup[] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => setGroups(await superAdminService.getFeeGroups()), [])
  useEffect(() => {
    load()
  }, [load])

  if (!groups) return <LoadingBlock />

  const handleExport = () =>
    downloadCsv(
      "fee-groups.csv",
      groups.map((g) => ({
        "Group Name": g.name,
        Includes: g.includes.join(", "),
        "Total Amount": g.totalAmount,
        "Applicable Classes": g.applicableClasses,
        Students: g.students,
      })),
    )

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Fee Group"
        breadcrumb="Fee Collection / Fee Group"
        onAdd={() => setModalOpen(true)}
        onExport={handleExport}
      />

      <Panel title="Fee Groups">
        <div className="overflow-x-auto mt-6">
          <table className="w-full">
            <thead className="bg-gray-50/60">
              <tr>
                {["#", "Group Name", "Includes", "Total Amount", "Applicable Classes", "Students", "Actions"].map((h) => (
                  <th key={h} className={thClass}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((g, i) => (
                <tr key={g.id} className="border-t border-gray-50">
                  <td className={`${tdClass} text-gray-400`}>{i + 1}</td>
                  <td className={`${tdClass} font-semibold text-gray-900`}>{g.name}</td>
                  <td className={tdClass}>{g.includes.join(", ")}</td>
                  <td className={`${tdClass} font-semibold text-gray-900`}>{formatMoney(g.totalAmount)}</td>
                  <td className={tdClass}>{g.applicableClasses}</td>
                  <td className={tdClass}>{g.students}</td>
                  <td className={tdClass}>
                    <div className="flex gap-2 text-gray-400">
                      <button type="button" aria-label="Edit fee group"><Pencil className="w-3.5 h-3.5" /></button>
                      <button
                        type="button"
                        aria-label="Delete fee group"
                        className="hover:text-red-500"
                        onClick={async () => {
                          await superAdminService.deleteFeeGroup(g.id)
                          load()
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <FormModal
        open={modalOpen}
        title="Add Fee Group"
        fields={fields}
        onClose={() => setModalOpen(false)}
        onSubmit={async (v) => {
          await superAdminService.createFeeGroup({
            name: v.name,
            includes: v.includes.split(",").map((s) => s.trim()).filter(Boolean),
            totalAmount: Number(v.totalAmount),
            applicableClasses: v.applicableClasses,
          })
          setModalOpen(false)
          load()
        }}
      />
    </div>
  )
}

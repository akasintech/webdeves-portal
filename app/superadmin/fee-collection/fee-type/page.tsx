"use client"

import { useCallback, useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import { feeFrequencies } from "@/lib/mock-data/superadmin-fees"
import type { FeeFrequency, FeeType } from "@/lib/types"
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
  { name: "name", label: "Fee Name", required: true },
  { name: "description", label: "Description", required: true },
  { name: "amount", label: "Amount", type: "number", required: true },
  { name: "frequency", label: "Frequency", type: "select", options: feeFrequencies },
]

export default function FeeTypePage() {
  const [types, setTypes] = useState<FeeType[] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => setTypes(await superAdminService.getFeeTypes()), [])
  useEffect(() => {
    load()
  }, [load])

  if (!types) return <LoadingBlock />

  const handleExport = () =>
    downloadCsv(
      "fee-types.csv",
      types.map((t) => ({ "Fee Name": t.name, Description: t.description, Amount: t.amount, Frequency: t.frequency })),
    )

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Fee Type"
        breadcrumb="Fee Collection / Fee Type"
        onAdd={() => setModalOpen(true)}
        onExport={handleExport}
      />

      <Panel title="Fee Types">
        <div className="overflow-x-auto mt-6">
          <table className="w-full">
            <thead className="bg-gray-50/60">
              <tr>
                {["#", "Fee Name", "Description", "Amount", "Frequency", "Actions"].map((h) => (
                  <th key={h} className={thClass}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {types.map((t, i) => (
                <tr key={t.id} className="border-t border-gray-50">
                  <td className={`${tdClass} text-gray-400`}>{i + 1}</td>
                  <td className={`${tdClass} font-semibold text-gray-900`}>{t.name}</td>
                  <td className={tdClass}>{t.description}</td>
                  <td className={`${tdClass} font-semibold text-gray-900`}>{formatMoney(t.amount)}</td>
                  <td className={tdClass}>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10.5px] font-medium">{t.frequency}</span>
                  </td>
                  <td className={tdClass}>
                    <div className="flex gap-2 text-gray-400">
                      <button type="button" aria-label="Edit fee type"><Pencil className="w-3.5 h-3.5" /></button>
                      <button
                        type="button"
                        aria-label="Delete fee type"
                        className="hover:text-red-500"
                        onClick={async () => {
                          await superAdminService.deleteFeeType(t.id)
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
        title="Add Fee Type"
        fields={fields}
        onClose={() => setModalOpen(false)}
        onSubmit={async (v) => {
          await superAdminService.createFeeType({
            name: v.name,
            description: v.description,
            amount: Number(v.amount),
            frequency: v.frequency as FeeFrequency,
          })
          setModalOpen(false)
          load()
        }}
      />
    </div>
  )
}

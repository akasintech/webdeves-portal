"use client"

import { useCallback, useEffect, useState } from "react"
import { Building2, CheckCircle2, Clock, Phone, Pencil, Search, UserPlus, X } from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import { enquirySources } from "@/lib/mock-data/superadmin-modules"
import type { AdmissionEnquiryResponse } from "@/lib/types"
import {
  FormModal,
  LoadingBlock,
  PageHeader,
  Panel,
  StatCard,
  downloadCsv,
  formatDateShort,
  tdClass,
  thClass,
  type FormField,
} from "@/components/superadmin/ui"

const fields: FormField[] = [
  { name: "name", label: "Name", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "source", label: "Source", type: "select", options: enquirySources },
  { name: "enquiryDate", label: "Enquiry Date", type: "date", required: true },
  { name: "nextFollowUpDate", label: "Next Follow Up Date", type: "date", required: true },
]

export default function AdmissionEnquiryPage() {
  const [data, setData] = useState<AdmissionEnquiryResponse | null>(null)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => setData(await superAdminService.getAdmissionEnquiries()), [])
  useEffect(() => {
    load()
  }, [load])

  if (!data) return <LoadingBlock />

  const q = search.trim().toLowerCase()
  const rows = data.enquiries.filter((e) => !q || [e.name, e.phone, e.source].some((v) => v.toLowerCase().includes(q)))

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Admission Enquiry"
        breadcrumb="Front Office / Admission Enquiry"
        accent="purple"
        onAdd={() => setModalOpen(true)}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Enquiries" value={data.stats.total} icon={Building2} iconClass="bg-blue-50 text-blue-500" />
        <StatCard label="New This Week" value={data.stats.newThisWeek} icon={UserPlus} iconClass="bg-purple-50 text-purple-500" />
        <StatCard label="Won" value={data.stats.won} icon={CheckCircle2} iconClass="bg-emerald-50 text-emerald-500" />
        <StatCard label="Follow-up Due" value={data.stats.followUpDue} icon={Clock} iconClass="bg-amber-50 text-amber-500" />
      </div>

      <Panel
        title="Enquiry List"
        right={
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search enquiries..."
              className="pl-8 pr-3 py-2 w-56 border border-gray-200 rounded-lg text-[12px]"
            />
          </div>
        }
      >
        <div className="overflow-x-auto border-t border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50/60">
              <tr>
                {["Name", "Phone", "Source", "Enquiry Date", "Last Follow Up Date", "Next Follow Up Date", "Status", "Action"].map((h) => (
                  <th key={h} className={thClass}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((e, i) => (
                <tr key={e.id} className={i % 2 === 0 ? "bg-rose-50/50" : ""}>
                  <td className={`${tdClass} font-semibold text-gray-900`}>{e.name}</td>
                  <td className={tdClass}>{e.phone}</td>
                  <td className={tdClass}>{e.source}</td>
                  <td className={tdClass}>{formatDateShort(e.enquiryDate)}</td>
                  <td className={tdClass}>{formatDateShort(e.lastFollowUpDate)}</td>
                  <td className={tdClass}>{formatDateShort(e.nextFollowUpDate)}</td>
                  <td className={tdClass}>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10.5px] font-medium">{e.status}</span>
                  </td>
                  <td className={tdClass}>
                    <div className="flex gap-1.5">
                      <button type="button" aria-label="Log follow-up call" className="w-6 h-6 rounded bg-purple-600 text-white flex items-center justify-center">
                        <Phone className="w-3 h-3" />
                      </button>
                      <button type="button" aria-label="Edit enquiry" className="w-6 h-6 rounded bg-purple-600 text-white flex items-center justify-center">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete enquiry"
                        onClick={async () => {
                          await superAdminService.deleteEnquiry(e.id)
                          load()
                        }}
                        className="w-6 h-6 rounded bg-purple-600 text-white flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-[12px] text-gray-400">No enquiries found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="px-5 py-3 text-[11px] text-blue-500">
          Showing {rows.length ? 1 : 0} to {rows.length} of {data.enquiries.length} entries
        </p>
      </Panel>

      <FormModal
        open={modalOpen}
        title="Add Admission Enquiry"
        fields={fields}
        accent="purple"
        onClose={() => setModalOpen(false)}
        onSubmit={async (v) => {
          await superAdminService.createEnquiry({
            name: v.name,
            phone: v.phone,
            source: v.source,
            enquiryDate: v.enquiryDate,
            nextFollowUpDate: v.nextFollowUpDate,
          })
          setModalOpen(false)
          load()
        }}
      />
    </div>
  )
}

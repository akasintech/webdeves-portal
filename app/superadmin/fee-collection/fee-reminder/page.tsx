"use client"

import { useEffect, useState } from "react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { FeeReminderSettings } from "@/lib/types"
import { LoadingBlock, PageHeader, downloadCsv } from "@/components/superadmin/ui"

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
      <span className="text-[12.5px] text-gray-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
    </div>
  )
}

export default function FeeReminderPage() {
  const [settings, setSettings] = useState<FeeReminderSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    superAdminService.getFeeReminderSettings().then(setSettings)
  }, [])

  if (!settings) return <LoadingBlock />

  const setEmail = (k: keyof FeeReminderSettings["email"], v: boolean) =>
    setSettings({ ...settings, email: { ...settings.email, [k]: v } })
  const setSms = (k: keyof FeeReminderSettings["sms"], v: boolean) =>
    setSettings({ ...settings, sms: { ...settings.sms, [k]: v } })

  const save = async () => {
    setSaving(true)
    try {
      await superAdminService.saveFeeReminderSettings(settings)
      setNotice("Settings saved")
    } catch {
      setNotice("Failed to save settings")
    } finally {
      setSaving(false)
      setTimeout(() => setNotice(null), 3000)
    }
  }

  const exportSettings = () =>
    downloadCsv("fee-reminder-settings.csv", [
      ...Object.entries(settings.email).map(([k, v]) => ({ channel: "email", setting: k, enabled: String(v) })),
      ...Object.entries(settings.sms).map(([k, v]) => ({ channel: "sms", setting: k, enabled: String(v) })),
    ])

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Fee Reminder"
        breadcrumb="Fee Collection / Fee Reminder"
        onExport={exportSettings}
        onAdd={() => {}}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
        <h2 className="text-[13.5px] font-semibold text-gray-900 mb-6">Fee Reminder Settings</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-3">
            <h3 className="text-[15px] font-semibold text-gray-800 mb-4">Email Reminders</h3>
            <Toggle label="Send reminder 7 days before due date" checked={settings.email.sevenDaysBefore} onChange={(v) => setEmail("sevenDaysBefore", v)} />
            <Toggle label="Send reminder on due date" checked={settings.email.onDueDate} onChange={(v) => setEmail("onDueDate", v)} />
            <Toggle label="Send reminder 3 days after due date" checked={settings.email.threeDaysAfter} onChange={(v) => setEmail("threeDaysAfter", v)} />
          </div>
          <div className="space-y-3">
            <h3 className="text-[15px] font-semibold text-gray-800 mb-4">SMS Reminders</h3>
            <Toggle label="Send SMS 3 days before due date" checked={settings.sms.threeDaysBefore} onChange={(v) => setSms("threeDaysBefore", v)} />
            <Toggle label="Send SMS on due date" checked={settings.sms.onDueDate} onChange={(v) => setSms("onDueDate", v)} />
            <Toggle label="Send SMS for overdue fees" checked={settings.sms.overdue} onChange={(v) => setSms("overdue", v)} />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-semibold rounded-lg disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {notice && <span className="text-[12px] font-medium text-emerald-600">{notice}</span>}
        </div>
      </div>
    </div>
  )
}

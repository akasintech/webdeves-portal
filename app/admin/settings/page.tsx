import { SettingsContent } from "@/components/settings-content"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground mt-2">Manage system-wide settings and configurations</p>
      </div>
      <SettingsContent />
    </div>
  )
}

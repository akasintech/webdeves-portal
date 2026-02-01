import { SettingsContent } from "@/components/settings-content"

export default function InstructorSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your instructor settings and preferences</p>
      </div>
      <SettingsContent />
    </div>
  )
}

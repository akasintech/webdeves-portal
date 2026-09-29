import { SuperAdminBlankPage } from "@/components/superadmin-blank-page"

export default function CommunicationPage() {
  return (
    <SuperAdminBlankPage
      title="Communication"
      description="Send SMS notices, mass broadcast emails, and manage the campus notice board."
      moduleKey="communication"
    />
  )
}

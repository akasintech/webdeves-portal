import { SuperAdminBlankPage } from "@/components/superadmin-blank-page"

export default function AttendancePage() {
  return (
    <SuperAdminBlankPage
      title="Attendance"
      description="Monitor student and staff daily attendance, approve leave requests, and audit attendance logs."
      moduleKey="attendance"
    />
  )
}

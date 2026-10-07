import { redirect } from "next/navigation"

export default function AttendanceRootPage() {
  redirect("/superadmin/attendance/student-attendance")
}

"use client"

import { StudentRecordsView } from "@/components/superadmin/student-records-view"

export default function OnlineAdmissionPage() {
  return (
    <StudentRecordsView
      title="Online Admission"
      breadcrumb="Student Information / Online Admission"
      source="online"
    />
  )
}

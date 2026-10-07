"use client"

import { StudentRecordsView } from "@/components/superadmin/student-records-view"

export default function StudentDetailsPage() {
  return (
    <StudentRecordsView
      title="Student Details"
      breadcrumb="Student Information / Student Details"
      source="details"
    />
  )
}

"use client"

import { StudentRecordsView } from "@/components/superadmin/student-records-view"

export default function StudentAdmissionPage() {
  return (
    <StudentRecordsView
      title="Student Admission"
      breadcrumb="Student Information / Student Admission"
      source="admission"
    />
  )
}

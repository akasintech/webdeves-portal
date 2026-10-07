"use client"

import { StudentRecordsView } from "@/components/superadmin/student-records-view"

export default function MultiClassStudentsPage() {
  return (
    <StudentRecordsView
      title="Multi-Class Students"
      breadcrumb="Student Information / Multi-Class Students"
      source="multi-class"
    />
  )
}

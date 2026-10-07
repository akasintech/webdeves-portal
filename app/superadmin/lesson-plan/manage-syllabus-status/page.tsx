"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function ManageSyllabusStatusPage() {
  return (
    <GenericRecordsView
      title="Syllabus Status"
      breadcrumb="Lesson / Syllabus Status"
      tableTitle="Syllabus Status List"
      fetchRecords={() => superAdminService.getSyllabusStatuses()}
      createRecord={(data) => superAdminService.createSyllabusStatus(data)}
      deleteRecord={(id) => superAdminService.deleteSyllabusStatus(id)}
    />
  )
}

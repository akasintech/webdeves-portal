"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function CopyOldLessonsPage() {
  return (
    <GenericRecordsView
      title="Copy"
      breadcrumb="Lesson / Copy"
      tableTitle="Copy List"
      fetchRecords={() => superAdminService.getCopyOldLessons()}
      createRecord={(data) => superAdminService.createCopyOldLesson(data)}
      deleteRecord={(id) => superAdminService.deleteCopyOldLesson(id)}
    />
  )
}

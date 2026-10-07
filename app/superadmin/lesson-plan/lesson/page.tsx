"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function LessonPage() {
  return (
    <GenericRecordsView
      title="List"
      breadcrumb="Lesson / List"
      tableTitle="List List"
      fetchRecords={() => superAdminService.getLessonsList()}
      createRecord={(data) => superAdminService.createLessonItem(data)}
      deleteRecord={(id) => superAdminService.deleteLessonItem(id)}
    />
  )
}

"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function TeachersTimetablePage() {
  return (
    <GenericRecordsView
      title="Teachers Timetable"
      breadcrumb="Academics / Teachers Timetable"
      tableTitle="Teachers Timetable List"
      fetchRecords={() => superAdminService.getTeachersTimetables()}
      createRecord={(data) => superAdminService.createTeachersTimetable(data)}
      deleteRecord={(id) => superAdminService.deleteTeachersTimetable(id)}
    />
  )
}

"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function ClassTimetablePage() {
  return (
    <GenericRecordsView
      title="Class Timetable"
      breadcrumb="Academics / Class Timetable"
      tableTitle="Class Timetable List"
      fetchRecords={() => superAdminService.getClassTimetables()}
      createRecord={(data) => superAdminService.createClassTimetable(data)}
      deleteRecord={(id) => superAdminService.deleteClassTimetable(id)}
    />
  )
}

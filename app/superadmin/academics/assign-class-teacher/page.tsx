"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function AssignTeacherPage() {
  return (
    <GenericRecordsView
      title="Assign Teacher"
      breadcrumb="Academics / Assign Teacher"
      tableTitle="Assign Teacher List"
      fetchRecords={() => superAdminService.getAssignTeachers()}
      createRecord={(data) => superAdminService.createAssignTeacher(data)}
      deleteRecord={(id) => superAdminService.deleteAssignTeacher(id)}
    />
  )
}

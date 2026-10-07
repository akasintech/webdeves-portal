"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function PromoteStudentsPage() {
  return (
    <GenericRecordsView
      title="Promote"
      breadcrumb="Academics / Promote"
      tableTitle="Promote List"
      fetchRecords={() => superAdminService.getPromoteStudents()}
      createRecord={(data) => superAdminService.createPromoteStudent(data)}
      deleteRecord={(id) => superAdminService.deletePromoteStudent(id)}
    />
  )
}

"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function SubjectGroupPage() {
  return (
    <GenericRecordsView
      title="Subject Group"
      breadcrumb="Academics / Subject Group"
      tableTitle="Subject Group List"
      fetchRecords={() => superAdminService.getSubjectGroups()}
      createRecord={(data) => superAdminService.createSubjectGroup(data)}
      deleteRecord={(id) => superAdminService.deleteSubjectGroup(id)}
    />
  )
}

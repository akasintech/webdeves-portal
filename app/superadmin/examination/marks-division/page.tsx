"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function MarksDivisionPage() {
  return (
    <GenericRecordsView
      title="Marks Division"
      breadcrumb="Exam / Marks Division"
      tableTitle="Marks Division List"
      fetchRecords={() => superAdminService.getMarksDivisions()}
      createRecord={(data) => superAdminService.createMarksDivision(data)}
      updateRecord={(id, data) => superAdminService.updateMarksDivision(id, data)}
      deleteRecord={(id) => superAdminService.deleteMarksDivision(id)}
    />
  )
}

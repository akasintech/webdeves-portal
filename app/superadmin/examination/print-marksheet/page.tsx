"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function PrintMarksheetPage() {
  return (
    <GenericRecordsView
      title="Print Marksheet"
      breadcrumb="Exam / Print Marksheet"
      tableTitle="Print Marksheet List"
      fetchRecords={() => superAdminService.getPrintMarksheets()}
      createRecord={(data) => superAdminService.createPrintMarksheet(data)}
      updateRecord={(id, data) => superAdminService.updatePrintMarksheet(id, data)}
      deleteRecord={(id) => superAdminService.deletePrintMarksheet(id)}
    />
  )
}

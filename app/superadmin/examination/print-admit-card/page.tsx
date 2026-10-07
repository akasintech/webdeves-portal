"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function PrintAdmitCardPage() {
  return (
    <GenericRecordsView
      title="Print Admit Card"
      breadcrumb="Exam / Print Admit Card"
      tableTitle="Print Admit Card List"
      fetchRecords={() => superAdminService.getPrintAdmitCards()}
      createRecord={(data) => superAdminService.createPrintAdmitCard(data)}
      updateRecord={(id, data) => superAdminService.updatePrintAdmitCard(id, data)}
      deleteRecord={(id) => superAdminService.deletePrintAdmitCard(id)}
    />
  )
}

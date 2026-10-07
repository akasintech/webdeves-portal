"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function MultiBranchReportPage() {
  return (
    <GenericRecordsView
      title="Report"
      breadcrumb="Branch / Report"
      tableTitle="Report List"
      fetchRecords={() => superAdminService.getBranchReports()}
      createRecord={(data) => superAdminService.createBranchReport(data)}
      deleteRecord={(id) => superAdminService.deleteBranchReport(id)}
    />
  )
}

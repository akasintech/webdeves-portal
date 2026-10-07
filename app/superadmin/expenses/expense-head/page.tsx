"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function ExpenseHeadPage() {
  return (
    <GenericRecordsView
      title="Head"
      breadcrumb="Expenses / Head"
      tableTitle="Head List"
      fetchRecords={() => superAdminService.getExpenseHeads()}
      createRecord={(data) => superAdminService.createExpenseHead(data)}
      deleteRecord={(id) => superAdminService.deleteExpenseHead(id)}
    />
  )
}

"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function AddExpensePage() {
  return (
    <GenericRecordsView
      title="Add"
      breadcrumb="Expenses / Add"
      tableTitle="Add List"
      fetchRecords={() => superAdminService.getAddExpenses()}
      createRecord={(data) => superAdminService.createAddExpense(data)}
      deleteRecord={(id) => superAdminService.deleteAddExpense(id)}
    />
  )
}

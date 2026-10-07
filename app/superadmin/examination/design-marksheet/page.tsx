"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function DesignMarksheetPage() {
  return (
    <GenericRecordsView
      title="Design Marksheet"
      breadcrumb="Exam / Design Marksheet"
      tableTitle="Design Marksheet List"
      fetchRecords={() => superAdminService.getDesignMarksheets()}
      createRecord={(data) => superAdminService.createDesignMarksheet(data)}
      updateRecord={(id, data) => superAdminService.updateDesignMarksheet(id, data)}
      deleteRecord={(id) => superAdminService.deleteDesignMarksheet(id)}
    />
  )
}

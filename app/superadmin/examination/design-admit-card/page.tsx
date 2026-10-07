"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function DesignAdmitCardPage() {
  return (
    <GenericRecordsView
      title="Design Admit Card"
      breadcrumb="Exam / Design Admit Card"
      tableTitle="Design Admit Card List"
      fetchRecords={() => superAdminService.getDesignAdmitCards()}
      createRecord={(data) => superAdminService.createDesignAdmitCard(data)}
      updateRecord={(id, data) => superAdminService.updateDesignAdmitCard(id, data)}
      deleteRecord={(id) => superAdminService.deleteDesignAdmitCard(id)}
    />
  )
}

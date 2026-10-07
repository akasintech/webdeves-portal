"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function SectionsPage() {
  return (
    <GenericRecordsView
      title="Sections"
      breadcrumb="Academics / Sections"
      tableTitle="Sections List"
      fetchRecords={() => superAdminService.getSections()}
      createRecord={(data) => superAdminService.createSection(data)}
      deleteRecord={(id) => superAdminService.deleteSection(id)}
    />
  )
}

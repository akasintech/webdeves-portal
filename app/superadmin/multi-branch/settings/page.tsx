"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function MultiBranchSettingsPage() {
  return (
    <GenericRecordsView
      title="Settings"
      breadcrumb="Branch / Settings"
      tableTitle="Settings List"
      fetchRecords={() => superAdminService.getBranchSettings()}
      createRecord={(data) => superAdminService.createBranchSetting(data)}
      deleteRecord={(id) => superAdminService.deleteBranchSetting(id)}
    />
  )
}

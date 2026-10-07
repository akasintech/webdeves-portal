"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function ApproveLeavePage() {
  return (
    <GenericRecordsView
      title="Approve Leave"
      breadcrumb="Attendance / Approve Leave"
      tableTitle="Approve Leave List"
      fetchRecords={() => superAdminService.getApproveLeaveRecords()}
      createRecord={(data) => superAdminService.createApproveLeaveRecord(data)}
      deleteRecord={(id) => superAdminService.deleteApproveLeaveRecord(id)}
    />
  )
}

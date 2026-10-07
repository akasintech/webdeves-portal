"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function AttendanceByDatePage() {
  return (
    <GenericRecordsView
      title="By Date"
      breadcrumb="Attendance / By Date"
      tableTitle="By Date List"
      fetchRecords={() => superAdminService.getByDateRecords()}
      createRecord={(data) => superAdminService.createByDateRecord(data)}
      deleteRecord={(id) => superAdminService.deleteByDateRecord(id)}
    />
  )
}

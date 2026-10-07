"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function OnlineCourseReportPage() {
  return (
    <GenericRecordsView
      title="Report"
      breadcrumb="Courses / Report"
      tableTitle="Report List"
      fetchRecords={() => superAdminService.getCourseReports()}
      createRecord={(data) => superAdminService.createCourseReport(data)}
      deleteRecord={(id) => superAdminService.deleteCourseReport(id)}
    />
  )
}

"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function OnlineCourseSettingsPage() {
  return (
    <GenericRecordsView
      title="Settings"
      breadcrumb="Courses / Settings"
      tableTitle="Settings List"
      fetchRecords={() => superAdminService.getCourseSettings()}
      createRecord={(data) => superAdminService.createCourseSetting(data)}
      deleteRecord={(id) => superAdminService.deleteCourseSetting(id)}
    />
  )
}

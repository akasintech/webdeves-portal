"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function TopicPage() {
  return (
    <GenericRecordsView
      title="Topic"
      breadcrumb="Lesson / Topic"
      tableTitle="Topic List"
      fetchRecords={() => superAdminService.getTopicsList()}
      createRecord={(data) => superAdminService.createTopicItem(data)}
      deleteRecord={(id) => superAdminService.deleteTopicItem(id)}
    />
  )
}

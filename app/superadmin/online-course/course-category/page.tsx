"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function CourseCategoryPage() {
  return (
    <GenericRecordsView
      title="Category"
      breadcrumb="Courses / Category"
      tableTitle="Category List"
      fetchRecords={() => superAdminService.getCourseCategories()}
      createRecord={(data) => superAdminService.createCourseCategory(data)}
      deleteRecord={(id) => superAdminService.deleteCourseCategory(id)}
    />
  )
}

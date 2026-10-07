"use client"

import { GenericRecordsView } from "@/components/superadmin/generic-records-view"
import { superAdminService } from "@/lib/services/superadmin-service"

export default function CertificateTemplatePage() {
  return (
    <GenericRecordsView
      title="Certificate"
      breadcrumb="Courses / Certificate"
      tableTitle="Certificate List"
      fetchRecords={() => superAdminService.getCertificateTemplates()}
      createRecord={(data) => superAdminService.createCertificateTemplate(data)}
      deleteRecord={(id) => superAdminService.deleteCertificateTemplate(id)}
    />
  )
}

/**
 * Super Admin Service
 * 
 * Provides an abstraction layer between UI components and backend data.
 * Currently backed by `mockSuperAdminApi`. When ready to connect to real backend,
 * toggle `USE_MOCK` to false and configure the API endpoints.
 */

import { mockSuperAdminApi } from "@/lib/mock-api"
import type {
  SuperAdminDashboardData,
  VisitorRecord,
  AdmissionEnquiry,
  AdmissionEnquiryResponse,
  ComplaintRecord,
  ComplaintResponse,
  StudentRecord,
  StudentListResponse,
  FeeReminderSettings,
  StudentCategory,
  FeeGroup,
  FeeType,
  FeeRecord,
  FeeRecordsResponse,
  BranchOverviewRecord,
  BranchOverviewResponse,
  GenericRecordItem,
  OnlineCourseItem,
  OnlineCoursesResponse,
  MarksGradeRecord,
  ExamGroupRecord,
  ExamScheduleRecord,
  ExamResultRecord,
  LessonPlanRecord,
  StaffRecord,
  StaffDirectoryResponse,
  PayrollRecord,
  LeaveRequestRecord,
  TeacherRatingRecord,
  DepartmentCardRecord,
  NoticeRecord,
  NoticeBoardResponse,
  CommunicationStats,
  SendEmailRequest,
  SendSmsRequest,
  CommunicationLogRecord,
  ScheduledBroadcastRecord,
  CommunicationTemplateRecord,
  LoginCredentialRecord,
  StudentAttendanceRecord,
  StudentAttendanceResponse,
  StudentLeaveApprovalRecord,
  AttendanceByDateRecord,
  AcademicSubjectRecord,
  AcademicClassRecord,
  ExpenseOverviewRecord,
  ExpensesOverviewResponse,
  IncomeRecord,
  IncomeResponse,
  ZoomLiveClassRecord,
  GMeetLiveClassRecord,
} from "@/lib/types"

/** Which student screen is asking; lets the real backend filter/route per screen. */
export type StudentSource = "details" | "admission" | "online" | "multi-class"

const USE_MOCK = true
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/superadmin"

/** Minimal typed fetch wrapper used by every non-mock branch below. */
async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return (await res.json()) as T
}

export const superAdminService = {
  /**
   * Fetches the Super Admin dashboard overview data.
   */
  async getDashboard(): Promise<SuperAdminDashboardData> {
    if (USE_MOCK) {
      return await mockSuperAdminApi.getDashboardOverview()
    }

    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) throw new Error("Failed to fetch dashboard data")
    return await response.json()
  },

  /**
   * Exports summary reports (CSV/PDF)
   */
  async exportReport(): Promise<{ success: boolean; downloadUrl: string }> {
    if (USE_MOCK) {
      return await mockSuperAdminApi.exportReport()
    }

    const response = await fetch(`${API_BASE_URL}/export-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) throw new Error("Failed to export report")
    return await response.json()
  },

  // ---------------- Front Office ----------------
  getVisitors(): Promise<VisitorRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getVisitors()
    return http("/front-office/visitors")
  },
  createVisitor(data: Omit<VisitorRecord, "id">): Promise<VisitorRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createVisitor(data)
    return http("/front-office/visitors", { method: "POST", body: JSON.stringify(data) })
  },

  getAdmissionEnquiries(): Promise<AdmissionEnquiryResponse> {
    if (USE_MOCK) return mockSuperAdminApi.getAdmissionEnquiries()
    return http("/front-office/enquiries")
  },
  createEnquiry(data: Omit<AdmissionEnquiry, "id" | "lastFollowUpDate" | "status">): Promise<AdmissionEnquiry> {
    if (USE_MOCK) return mockSuperAdminApi.createEnquiry(data)
    return http("/front-office/enquiries", { method: "POST", body: JSON.stringify(data) })
  },
  deleteEnquiry(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteEnquiry(id)
    return http(`/front-office/enquiries/${id}`, { method: "DELETE" })
  },

  getComplaints(): Promise<ComplaintResponse> {
    if (USE_MOCK) return mockSuperAdminApi.getComplaints()
    return http("/front-office/complaints")
  },
  createComplaint(data: Omit<ComplaintRecord, "id" | "status">): Promise<ComplaintRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createComplaint(data)
    return http("/front-office/complaints", { method: "POST", body: JSON.stringify(data) })
  },

  // ---------------- Student Info ----------------
  getStudentDetails(params: { search?: string; className?: string; source?: StudentSource } = {}): Promise<StudentListResponse> {
    if (USE_MOCK) return mockSuperAdminApi.getStudentDetails(params)
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][])
    return http(`/students?${qs.toString()}`)
  },
  createStudentRecord(data: Omit<StudentRecord, "id" | "status">, source: StudentSource = "details"): Promise<StudentRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createStudentRecord(data)
    return http("/students", { method: "POST", body: JSON.stringify({ ...data, source }) })
  },
  bulkDeleteStudents(ids: string[]): Promise<{ success: boolean; deleted: number }> {
    if (USE_MOCK) return mockSuperAdminApi.bulkDeleteStudentRecords(ids)
    return http("/students/bulk-delete", { method: "POST", body: JSON.stringify({ ids }) })
  },
  deleteStudentRecord(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteStudentRecord(id)
    return http(`/students/${id}`, { method: "DELETE" })
  },

  // ---------------- Fee Collection ----------------
  getFeeReminderSettings(): Promise<FeeReminderSettings> {
    if (USE_MOCK) return mockSuperAdminApi.getFeeReminderSettings()
    return http("/fee-collection/reminders")
  },
  saveFeeReminderSettings(settings: FeeReminderSettings): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.saveFeeReminderSettings(settings)
    return http("/fee-collection/reminders", { method: "PUT", body: JSON.stringify(settings) })
  },

  // ---------------- Student Category ----------------
  getStudentCategories(): Promise<StudentCategory[]> {
    if (USE_MOCK) return mockSuperAdminApi.getStudentCategories()
    return http("/student-categories")
  },
  createStudentCategory(data: Pick<StudentCategory, "name" | "description">): Promise<StudentCategory> {
    if (USE_MOCK) return mockSuperAdminApi.createStudentCategory(data)
    return http("/student-categories", { method: "POST", body: JSON.stringify(data) })
  },
  deleteStudentCategory(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteStudentCategory(id)
    return http(`/student-categories/${id}`, { method: "DELETE" })
  },

  // ---------------- Fee Group ----------------
  getFeeGroups(): Promise<FeeGroup[]> {
    if (USE_MOCK) return mockSuperAdminApi.getFeeGroups()
    return http("/fee-collection/groups")
  },
  createFeeGroup(data: Omit<FeeGroup, "id" | "students">): Promise<FeeGroup> {
    if (USE_MOCK) return mockSuperAdminApi.createFeeGroup(data)
    return http("/fee-collection/groups", { method: "POST", body: JSON.stringify(data) })
  },
  deleteFeeGroup(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteFeeGroup(id)
    return http(`/fee-collection/groups/${id}`, { method: "DELETE" })
  },

  // ---------------- Fee Type ----------------
  getFeeTypes(): Promise<FeeType[]> {
    if (USE_MOCK) return mockSuperAdminApi.getFeeTypes()
    return http("/fee-collection/types")
  },
  createFeeType(data: Omit<FeeType, "id">): Promise<FeeType> {
    if (USE_MOCK) return mockSuperAdminApi.createFeeType(data)
    return http("/fee-collection/types", { method: "POST", body: JSON.stringify(data) })
  },
  deleteFeeType(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteFeeType(id)
    return http(`/fee-collection/types/${id}`, { method: "DELETE" })
  },

  // ---------------- Collect Fee / Offline Bank Payments ----------------
  getFeeRecords(source: "collect" | "offline"): Promise<FeeRecordsResponse> {
    if (USE_MOCK) return mockSuperAdminApi.getFeeRecords(source)
    return http(source === "collect" ? "/fee-collection/records" : "/fee-collection/offline-payments")
  },
  createFeeRecord(
    source: "collect" | "offline",
    data: Pick<FeeRecord, "student" | "className" | "feeType" | "amount" | "dueDate">,
  ): Promise<FeeRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createFeeRecord(source, data)
    return http(source === "collect" ? "/fee-collection/records" : "/fee-collection/offline-payments", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  /**
   * Front Office module service
   */
  async getFrontOffice() {
    if (USE_MOCK) return await mockSuperAdminApi.getFrontOffice()
    const res = await fetch(`${API_BASE_URL}/front-office`)
    return await res.json()
  },

  /**
   * Student Info module service
   */
  async getStudentInfo() {
    if (USE_MOCK) return await mockSuperAdminApi.getStudentInfo()
    const res = await fetch(`${API_BASE_URL}/student-info`)
    return await res.json()
  },

  /**
   * Fee Collection module service
   */
  async getFeeCollection() {
    if (USE_MOCK) return await mockSuperAdminApi.getFeeCollection()
    const res = await fetch(`${API_BASE_URL}/fee-collection`)
    return await res.json()
  },

  /**
   * Online Courses module service
   */
  async getOnlineCourses() {
    if (USE_MOCK) return await mockSuperAdminApi.getOnlineCourses()
    const res = await fetch(`${API_BASE_URL}/online-courses`)
    return await res.json()
  },

  /**
   * Multi Branch module service
   */
  async getMultiBranch() {
    if (USE_MOCK) return await mockSuperAdminApi.getMultiBranch()
    const res = await fetch(`${API_BASE_URL}/multi-branch`)
    return await res.json()
  },

  // ---------------- Multi Branch ----------------
  getBranchOverview(): Promise<BranchOverviewResponse> {
    if (USE_MOCK) return mockSuperAdminApi.getBranchOverview()
    return http("/multi-branch/overview")
  },
  createBranch(data: Omit<BranchOverviewRecord, "id">): Promise<BranchOverviewRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createBranch(data)
    return http("/multi-branch/overview", { method: "POST", body: JSON.stringify(data) })
  },
  deleteBranch(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteBranch(id)
    return http(`/multi-branch/overview/${id}`, { method: "DELETE" })
  },

  getBranchReports(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getBranchReports()
    return http("/multi-branch/reports")
  },
  createBranchReport(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createBranchReport(data)
    return http("/multi-branch/reports", { method: "POST", body: JSON.stringify(data) })
  },
  deleteBranchReport(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteBranchReport(id)
    return http(`/multi-branch/reports/${id}`, { method: "DELETE" })
  },

  getBranchSettings(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getBranchSettings()
    return http("/multi-branch/settings")
  },
  createBranchSetting(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createBranchSetting(data)
    return http("/multi-branch/settings", { method: "POST", body: JSON.stringify(data) })
  },
  deleteBranchSetting(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteBranchSetting(id)
    return http(`/multi-branch/settings/${id}`, { method: "DELETE" })
  },

  // ---------------- Online Course ----------------
  getOnlineCoursesList(): Promise<OnlineCoursesResponse> {
    if (USE_MOCK) return mockSuperAdminApi.getOnlineCoursesList()
    return http("/online-course/courses")
  },
  createOnlineCourse(data: Omit<OnlineCourseItem, "id">): Promise<OnlineCourseItem> {
    if (USE_MOCK) return mockSuperAdminApi.createOnlineCourse(data)
    return http("/online-course/courses", { method: "POST", body: JSON.stringify(data) })
  },
  deleteOnlineCourse(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteOnlineCourse(id)
    return http(`/online-course/courses/${id}`, { method: "DELETE" })
  },

  getCourseCategories(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getCourseCategories()
    return http("/online-course/categories")
  },
  createCourseCategory(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createCourseCategory(data)
    return http("/online-course/categories", { method: "POST", body: JSON.stringify(data) })
  },
  deleteCourseCategory(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteCourseCategory(id)
    return http(`/online-course/categories/${id}`, { method: "DELETE" })
  },

  getCertificateTemplates(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getCertificateTemplates()
    return http("/online-course/certificates")
  },
  createCertificateTemplate(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createCertificateTemplate(data)
    return http("/online-course/certificates", { method: "POST", body: JSON.stringify(data) })
  },
  deleteCertificateTemplate(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteCertificateTemplate(id)
    return http(`/online-course/certificates/${id}`, { method: "DELETE" })
  },

  getCourseReports(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getCourseReports()
    return http("/online-course/reports")
  },
  createCourseReport(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createCourseReport(data)
    return http("/online-course/reports", { method: "POST", body: JSON.stringify(data) })
  },
  deleteCourseReport(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteCourseReport(id)
    return http(`/online-course/reports/${id}`, { method: "DELETE" })
  },

  getCourseSettings(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getCourseSettings()
    return http("/online-course/settings")
  },
  createCourseSetting(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createCourseSetting(data)
    return http("/online-course/settings", { method: "POST", body: JSON.stringify(data) })
  },
  deleteCourseSetting(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteCourseSetting(id)
    return http(`/online-course/settings/${id}`, { method: "DELETE" })
  },

  /**
   * Live Classes module service
   */
  async getLiveClasses(platform: "zoom" | "gmeet") {
    if (USE_MOCK) return await mockSuperAdminApi.getLiveClasses(platform)
    const res = await fetch(`${API_BASE_URL}/live-classes?platform=${platform}`)
    return await res.json()
  },

  getZoomLiveClasses(): Promise<ZoomLiveClassRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getZoomLiveClasses()
    return http("/live-classes/zoom")
  },
  createZoomLiveClass(data: Omit<ZoomLiveClassRecord, "id">): Promise<ZoomLiveClassRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createZoomLiveClass(data)
    return http("/live-classes/zoom", { method: "POST", body: JSON.stringify(data) })
  },
  updateZoomLiveClass(id: string, data: Partial<ZoomLiveClassRecord>): Promise<ZoomLiveClassRecord> {
    if (USE_MOCK) return mockSuperAdminApi.updateZoomLiveClass(id, data)
    return http(`/live-classes/zoom/${id}`, { method: "PUT", body: JSON.stringify(data) })
  },
  deleteZoomLiveClass(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteZoomLiveClass(id)
    return http(`/live-classes/zoom/${id}`, { method: "DELETE" })
  },

  getGMeetLiveClasses(): Promise<GMeetLiveClassRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getGMeetLiveClasses()
    return http("/live-classes/gmeet")
  },
  createGMeetLiveClass(data: Omit<GMeetLiveClassRecord, "id">): Promise<GMeetLiveClassRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createGMeetLiveClass(data)
    return http("/live-classes/gmeet", { method: "POST", body: JSON.stringify(data) })
  },
  updateGMeetLiveClass(id: string, data: Partial<GMeetLiveClassRecord>): Promise<GMeetLiveClassRecord> {
    if (USE_MOCK) return mockSuperAdminApi.updateGMeetLiveClass(id, data)
    return http(`/live-classes/gmeet/${id}`, { method: "PUT", body: JSON.stringify(data) })
  },
  deleteGMeetLiveClass(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteGMeetLiveClass(id)
    return http(`/live-classes/gmeet/${id}`, { method: "DELETE" })
  },

  /**
   * Income module service
   */
  getIncome(): Promise<IncomeResponse> {
    if (USE_MOCK) return mockSuperAdminApi.getIncome()
    return http("/income")
  },
  createIncome(data: Omit<IncomeRecord, "id">): Promise<IncomeRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createIncome(data)
    return http("/income", { method: "POST", body: JSON.stringify(data) })
  },
  updateIncome(id: string, data: Partial<IncomeRecord>): Promise<IncomeRecord> {
    if (USE_MOCK) return mockSuperAdminApi.updateIncome(id, data)
    return http(`/income/${id}`, { method: "PUT", body: JSON.stringify(data) })
  },
  deleteIncome(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteIncome(id)
    return http(`/income/${id}`, { method: "DELETE" })
  },

  /**
   * Expenses module service
   */
  async getExpenses() {
    if (USE_MOCK) return await mockSuperAdminApi.getExpenses()
    const res = await fetch(`${API_BASE_URL}/expenses`)
    return await res.json()
  },

  /**
   * Examination module service
   */
  async getExamination() {
    if (USE_MOCK) return await mockSuperAdminApi.getExamination()
    const res = await fetch(`${API_BASE_URL}/examination`)
    return await res.json()
  },

  // ---------------- Examination ----------------
  getMarksGrades(): Promise<MarksGradeRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getMarksGrades()
    return http("/examination/marks-grades")
  },
  createMarksGrade(data: Omit<MarksGradeRecord, "id">): Promise<MarksGradeRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createMarksGrade(data)
    return http("/examination/marks-grades", { method: "POST", body: JSON.stringify(data) })
  },
  updateMarksGrade(id: string, data: Partial<MarksGradeRecord>): Promise<MarksGradeRecord> {
    if (USE_MOCK) return mockSuperAdminApi.updateMarksGrade(id, data)
    return http(`/examination/marks-grades/${id}`, { method: "PUT", body: JSON.stringify(data) })
  },
  deleteMarksGrade(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteMarksGrade(id)
    return http(`/examination/marks-grades/${id}`, { method: "DELETE" })
  },

  getMarksDivisions(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getMarksDivisions()
    return http("/examination/marks-divisions")
  },
  createMarksDivision(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createMarksDivision(data)
    return http("/examination/marks-divisions", { method: "POST", body: JSON.stringify(data) })
  },
  updateMarksDivision(id: string, data: Partial<GenericRecordItem>): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.updateMarksDivision(id, data)
    return http(`/examination/marks-divisions/${id}`, { method: "PUT", body: JSON.stringify(data) })
  },
  deleteMarksDivision(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteMarksDivision(id)
    return http(`/examination/marks-divisions/${id}`, { method: "DELETE" })
  },

  getPrintAdmitCards(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getPrintAdmitCards()
    return http("/examination/print-admit-cards")
  },
  createPrintAdmitCard(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createPrintAdmitCard(data)
    return http("/examination/print-admit-cards", { method: "POST", body: JSON.stringify(data) })
  },
  updatePrintAdmitCard(id: string, data: Partial<GenericRecordItem>): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.updatePrintAdmitCard(id, data)
    return http(`/examination/print-admit-cards/${id}`, { method: "PUT", body: JSON.stringify(data) })
  },
  deletePrintAdmitCard(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deletePrintAdmitCard(id)
    return http(`/examination/print-admit-cards/${id}`, { method: "DELETE" })
  },

  getDesignMarksheets(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getDesignMarksheets()
    return http("/examination/design-marksheets")
  },
  createDesignMarksheet(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createDesignMarksheet(data)
    return http("/examination/design-marksheets", { method: "POST", body: JSON.stringify(data) })
  },
  updateDesignMarksheet(id: string, data: Partial<GenericRecordItem>): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.updateDesignMarksheet(id, data)
    return http(`/examination/design-marksheets/${id}`, { method: "PUT", body: JSON.stringify(data) })
  },
  deleteDesignMarksheet(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteDesignMarksheet(id)
    return http(`/examination/design-marksheets/${id}`, { method: "DELETE" })
  },

  getPrintMarksheets(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getPrintMarksheets()
    return http("/examination/print-marksheets")
  },
  createPrintMarksheet(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createPrintMarksheet(data)
    return http("/examination/print-marksheets", { method: "POST", body: JSON.stringify(data) })
  },
  updatePrintMarksheet(id: string, data: Partial<GenericRecordItem>): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.updatePrintMarksheet(id, data)
    return http(`/examination/print-marksheets/${id}`, { method: "PUT", body: JSON.stringify(data) })
  },
  deletePrintMarksheet(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deletePrintMarksheet(id)
    return http(`/examination/print-marksheets/${id}`, { method: "DELETE" })
  },

  getExamGroups(): Promise<ExamGroupRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getExamGroups()
    return http("/examination/exam-groups")
  },
  createExamGroup(data: Omit<ExamGroupRecord, "id">): Promise<ExamGroupRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createExamGroup(data)
    return http("/examination/exam-groups", { method: "POST", body: JSON.stringify(data) })
  },
  updateExamGroup(id: string, data: Partial<ExamGroupRecord>): Promise<ExamGroupRecord> {
    if (USE_MOCK) return mockSuperAdminApi.updateExamGroup(id, data)
    return http(`/examination/exam-groups/${id}`, { method: "PUT", body: JSON.stringify(data) })
  },
  deleteExamGroup(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteExamGroup(id)
    return http(`/examination/exam-groups/${id}`, { method: "DELETE" })
  },

  getExamSchedules(): Promise<ExamScheduleRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getExamSchedules()
    return http("/examination/exam-schedules")
  },
  createExamSchedule(data: Omit<ExamScheduleRecord, "id">): Promise<ExamScheduleRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createExamSchedule(data)
    return http("/examination/exam-schedules", { method: "POST", body: JSON.stringify(data) })
  },
  updateExamSchedule(id: string, data: Partial<ExamScheduleRecord>): Promise<ExamScheduleRecord> {
    if (USE_MOCK) return mockSuperAdminApi.updateExamSchedule(id, data)
    return http(`/examination/exam-schedules/${id}`, { method: "PUT", body: JSON.stringify(data) })
  },
  deleteExamSchedule(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteExamSchedule(id)
    return http(`/examination/exam-schedules/${id}`, { method: "DELETE" })
  },

  getExamResults(): Promise<ExamResultRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getExamResults()
    return http("/examination/exam-results")
  },
  createExamResult(data: Omit<ExamResultRecord, "id">): Promise<ExamResultRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createExamResult(data)
    return http("/examination/exam-results", { method: "POST", body: JSON.stringify(data) })
  },
  updateExamResult(id: string, data: Partial<ExamResultRecord>): Promise<ExamResultRecord> {
    if (USE_MOCK) return mockSuperAdminApi.updateExamResult(id, data)
    return http(`/examination/exam-results/${id}`, { method: "PUT", body: JSON.stringify(data) })
  },
  deleteExamResult(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteExamResult(id)
    return http(`/examination/exam-results/${id}`, { method: "DELETE" })
  },

  getDesignAdmitCards(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getDesignAdmitCards()
    return http("/examination/design-admit-cards")
  },
  createDesignAdmitCard(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createDesignAdmitCard(data)
    return http("/examination/design-admit-cards", { method: "POST", body: JSON.stringify(data) })
  },
  updateDesignAdmitCard(id: string, data: Partial<GenericRecordItem>): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.updateDesignAdmitCard(id, data)
    return http(`/examination/design-admit-cards/${id}`, { method: "PUT", body: JSON.stringify(data) })
  },
  deleteDesignAdmitCard(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteDesignAdmitCard(id)
    return http(`/examination/design-admit-cards/${id}`, { method: "DELETE" })
  },

  // ---------------- Expenses ----------------
  getExpensesOverview(): Promise<ExpensesOverviewResponse> {
    if (USE_MOCK) return mockSuperAdminApi.getExpensesOverview()
    return http("/expenses/overview")
  },
  createExpenseOverview(
    data: Omit<ExpenseOverviewRecord, "id">,
  ): Promise<ExpenseOverviewRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createExpenseOverview(data)
    return http("/expenses/overview", { method: "POST", body: JSON.stringify(data) })
  },
  deleteExpenseOverview(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteExpenseOverview(id)
    return http(`/expenses/overview/${id}`, { method: "DELETE" })
  },

  getAddExpenses(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getAddExpenses()
    return http("/expenses/records")
  },
  createAddExpense(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createAddExpense(data)
    return http("/expenses/records", { method: "POST", body: JSON.stringify(data) })
  },
  deleteAddExpense(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteAddExpense(id)
    return http(`/expenses/records/${id}`, { method: "DELETE" })
  },

  getExpenseHeads(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getExpenseHeads()
    return http("/expenses/expense-heads")
  },
  createExpenseHead(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createExpenseHead(data)
    return http("/expenses/expense-heads", { method: "POST", body: JSON.stringify(data) })
  },
  deleteExpenseHead(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteExpenseHead(id)
    return http(`/expenses/expense-heads/${id}`, { method: "DELETE" })
  },

  // ---------------- Lesson Plan ----------------
  getLessonPlans(): Promise<LessonPlanRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getLessonPlans()
    return http("/lesson-plan/records")
  },
  createLessonPlan(data: Omit<LessonPlanRecord, "id">): Promise<LessonPlanRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createLessonPlan(data)
    return http("/lesson-plan/records", { method: "POST", body: JSON.stringify(data) })
  },
  deleteLessonPlan(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteLessonPlan(id)
    return http(`/lesson-plan/records/${id}`, { method: "DELETE" })
  },

  getSyllabusStatuses(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getSyllabusStatuses()
    return http("/lesson-plan/syllabus-status")
  },
  createSyllabusStatus(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createSyllabusStatus(data)
    return http("/lesson-plan/syllabus-status", { method: "POST", body: JSON.stringify(data) })
  },
  deleteSyllabusStatus(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteSyllabusStatus(id)
    return http(`/lesson-plan/syllabus-status/${id}`, { method: "DELETE" })
  },

  getLessonsList(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getLessonsList()
    return http("/lesson-plan/lessons")
  },
  createLessonItem(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createLessonItem(data)
    return http("/lesson-plan/lessons", { method: "POST", body: JSON.stringify(data) })
  },
  deleteLessonItem(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteLessonItem(id)
    return http(`/lesson-plan/lessons/${id}`, { method: "DELETE" })
  },

  getTopicsList(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getTopicsList()
    return http("/lesson-plan/topics")
  },
  createTopicItem(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createTopicItem(data)
    return http("/lesson-plan/topics", { method: "POST", body: JSON.stringify(data) })
  },
  deleteTopicItem(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteTopicItem(id)
    return http(`/lesson-plan/topics/${id}`, { method: "DELETE" })
  },

  getCopyOldLessons(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getCopyOldLessons()
    return http("/lesson-plan/copy-old-lessons")
  },
  createCopyOldLesson(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createCopyOldLesson(data)
    return http("/lesson-plan/copy-old-lessons", { method: "POST", body: JSON.stringify(data) })
  },
  deleteCopyOldLesson(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteCopyOldLesson(id)
    return http(`/lesson-plan/copy-old-lessons/${id}`, { method: "DELETE" })
  },

  /**
   * Attendance module service
   */
  async getAttendance() {
    if (USE_MOCK) return await mockSuperAdminApi.getAttendance()
    const res = await fetch(`${API_BASE_URL}/attendance`)
    return await res.json()
  },

  /**
   * Academics module service
   */
  async getAcademics() {
    if (USE_MOCK) return await mockSuperAdminApi.getAcademics()
    const res = await fetch(`${API_BASE_URL}/academics`)
    return await res.json()
  },

  /**
   * Lesson Plan module service
   */
  async getLessonPlan() {
    if (USE_MOCK) return await mockSuperAdminApi.getLessonPlan()
    const res = await fetch(`${API_BASE_URL}/lesson-plan`)
    return await res.json()
  },

  /**
   * Human Resource module service
   */
  async getHumanResource() {
    if (USE_MOCK) return await mockSuperAdminApi.getHumanResource()
    const res = await fetch(`${API_BASE_URL}/human-resource`)
    return await res.json()
  },

  // ---------------- Human Resource ----------------
  getStaffDirectory(): Promise<StaffDirectoryResponse> {
    if (USE_MOCK) return mockSuperAdminApi.getStaffDirectory()
    return http("/human-resource/staff")
  },
  createStaffMember(data: Omit<StaffRecord, "id">): Promise<StaffRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createStaffMember(data)
    return http("/human-resource/staff", { method: "POST", body: JSON.stringify(data) })
  },
  deleteStaffMember(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteStaffMember(id)
    return http(`/human-resource/staff/${id}`, { method: "DELETE" })
  },

  getPayroll(): Promise<PayrollRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getPayroll()
    return http("/human-resource/payroll")
  },
  createPayroll(data: Omit<PayrollRecord, "id">): Promise<PayrollRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createPayroll(data)
    return http("/human-resource/payroll", { method: "POST", body: JSON.stringify(data) })
  },
  deletePayroll(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deletePayroll(id)
    return http(`/human-resource/payroll/${id}`, { method: "DELETE" })
  },

  getLeaveRequests(): Promise<LeaveRequestRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getLeaveRequests()
    return http("/human-resource/leave-requests")
  },
  createLeaveRequest(data: Omit<LeaveRequestRecord, "id">): Promise<LeaveRequestRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createLeaveRequest(data)
    return http("/human-resource/leave-requests", { method: "POST", body: JSON.stringify(data) })
  },
  updateLeaveRequestStatus(
    id: string,
    status: "Approved" | "Rejected",
  ): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.updateLeaveRequestStatus(id, status)
    return http(`/human-resource/leave-requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  },
  deleteLeaveRequest(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteLeaveRequest(id)
    return http(`/human-resource/leave-requests/${id}`, { method: "DELETE" })
  },

  getLeaveTypes(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getLeaveTypes()
    return http("/human-resource/leave-types")
  },
  createLeaveType(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createLeaveType(data)
    return http("/human-resource/leave-types", { method: "POST", body: JSON.stringify(data) })
  },
  deleteLeaveType(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteLeaveType(id)
    return http(`/human-resource/leave-types/${id}`, { method: "DELETE" })
  },

  getTeachersRatings(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getTeachersRatings()
    return http("/human-resource/teachers-ratings")
  },
  createTeachersRating(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createTeachersRating(data)
    return http("/human-resource/teachers-ratings", { method: "POST", body: JSON.stringify(data) })
  },
  deleteTeachersRating(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteTeachersRating(id)
    return http(`/human-resource/teachers-ratings/${id}`, { method: "DELETE" })
  },

  getDepartments(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getDepartments()
    return http("/human-resource/departments")
  },
  createDepartment(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createDepartment(data)
    return http("/human-resource/departments", { method: "POST", body: JSON.stringify(data) })
  },
  deleteDepartment(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteDepartment(id)
    return http(`/human-resource/departments/${id}`, { method: "DELETE" })
  },

  getDesignations(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getDesignations()
    return http("/human-resource/designations")
  },
  createDesignation(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createDesignation(data)
    return http("/human-resource/designations", { method: "POST", body: JSON.stringify(data) })
  },
  deleteDesignation(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteDesignation(id)
    return http(`/human-resource/designations/${id}`, { method: "DELETE" })
  },

  getDisabledStaff(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getDisabledStaff()
    return http("/human-resource/disabled-staff")
  },
  createDisabledStaff(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createDisabledStaff(data)
    return http("/human-resource/disabled-staff", { method: "POST", body: JSON.stringify(data) })
  },
  deleteDisabledStaff(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteDisabledStaff(id)
    return http(`/human-resource/disabled-staff/${id}`, { method: "DELETE" })
  },

  getTeacherRatingsOverview(): Promise<TeacherRatingRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getTeacherRatingsOverview()
    return http("/human-resource/teachers-ratings-overview")
  },

  getDepartmentCards(): Promise<DepartmentCardRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getDepartmentCards()
    return http("/human-resource/departments-cards")
  },
  createDepartmentCard(data: Omit<DepartmentCardRecord, "id">): Promise<DepartmentCardRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createDepartmentCard(data)
    return http("/human-resource/departments-cards", { method: "POST", body: JSON.stringify(data) })
  },
  deleteDepartmentCard(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteDepartmentCard(id)
    return http(`/human-resource/departments-cards/${id}`, { method: "DELETE" })
  },

  // ---------------- Communication Module ----------------
  getNoticeBoard(): Promise<NoticeBoardResponse> {
    if (USE_MOCK) return mockSuperAdminApi.getNoticeBoard()
    return http("/communication/notice-board")
  },
  createNotice(data: Omit<NoticeRecord, "id">): Promise<NoticeRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createNotice(data)
    return http("/communication/notice-board", { method: "POST", body: JSON.stringify(data) })
  },
  updateNotice(id: string, data: Partial<NoticeRecord>): Promise<NoticeRecord> {
    if (USE_MOCK) return mockSuperAdminApi.updateNotice(id, data)
    return http(`/communication/notice-board/${id}`, { method: "PUT", body: JSON.stringify(data) })
  },
  deleteNotice(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteNotice(id)
    return http(`/communication/notice-board/${id}`, { method: "DELETE" })
  },

  getCommunicationStats(): Promise<CommunicationStats> {
    if (USE_MOCK) return mockSuperAdminApi.getCommunicationStats()
    return http("/communication/stats")
  },

  sendEmail(data: SendEmailRequest): Promise<{ success: boolean; log: CommunicationLogRecord }> {
    if (USE_MOCK) return mockSuperAdminApi.sendEmail(data)
    return http("/communication/send-email", { method: "POST", body: JSON.stringify(data) })
  },

  sendSms(data: SendSmsRequest): Promise<{ success: boolean; log: CommunicationLogRecord }> {
    if (USE_MOCK) return mockSuperAdminApi.sendSms(data)
    return http("/communication/send-sms", { method: "POST", body: JSON.stringify(data) })
  },

  getCommunicationLogs(type?: "Email" | "SMS"): Promise<CommunicationLogRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getCommunicationLogs(type)
    return http(`/communication/logs${type ? `?type=${type}` : ""}`)
  },
  createCommunicationLog(data: Omit<CommunicationLogRecord, "id">): Promise<CommunicationLogRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createCommunicationLog(data)
    return http("/communication/logs", { method: "POST", body: JSON.stringify(data) })
  },
  deleteCommunicationLog(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteCommunicationLog(id)
    return http(`/communication/logs/${id}`, { method: "DELETE" })
  },

  getScheduledBroadcasts(): Promise<ScheduledBroadcastRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getScheduledBroadcasts()
    return http("/communication/scheduled-logs")
  },
  createScheduledBroadcast(data: Omit<ScheduledBroadcastRecord, "id">): Promise<ScheduledBroadcastRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createScheduledBroadcast(data)
    return http("/communication/scheduled-logs", { method: "POST", body: JSON.stringify(data) })
  },
  cancelScheduledBroadcast(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.cancelScheduledBroadcast(id)
    return http(`/communication/scheduled-logs/${id}`, { method: "DELETE" })
  },

  getCommunicationTemplates(type: "Email" | "SMS"): Promise<CommunicationTemplateRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getCommunicationTemplates(type)
    return http(`/communication/templates?type=${type}`)
  },
  createCommunicationTemplate(data: Omit<CommunicationTemplateRecord, "id">): Promise<CommunicationTemplateRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createCommunicationTemplate(data)
    return http("/communication/templates", { method: "POST", body: JSON.stringify(data) })
  },
  deleteCommunicationTemplate(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteCommunicationTemplate(id)
    return http(`/communication/templates/${id}`, { method: "DELETE" })
  },

  getLoginCredentials(): Promise<LoginCredentialRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getLoginCredentials()
    return http("/communication/login-credentials")
  },
  sendLoginCredential(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.sendLoginCredential(id)
    return http(`/communication/login-credentials/${id}/send`, { method: "POST" })
  },
  bulkSendLoginCredentials(ids?: string[]): Promise<{ count: number }> {
    if (USE_MOCK) return mockSuperAdminApi.bulkSendLoginCredentials(ids)
    return http("/communication/login-credentials/bulk-send", { method: "POST", body: JSON.stringify({ ids }) })
  },

  async getCommunication() {
    if (USE_MOCK) return await mockSuperAdminApi.getCommunication()
    const res = await fetch(`${API_BASE_URL}/communication`)
    return await res.json()
  },

  // ---------------- Attendance Module ----------------
  getStudentAttendance(): Promise<StudentAttendanceResponse> {
    if (USE_MOCK) return mockSuperAdminApi.getStudentAttendance()
    return http("/attendance/student-attendance")
  },
  createStudentAttendanceRecord(
    data: Omit<StudentAttendanceRecord, "id">,
  ): Promise<StudentAttendanceRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createStudentAttendanceRecord(data)
    return http("/attendance/student-attendance", { method: "POST", body: JSON.stringify(data) })
  },
  updateStudentAttendanceRecord(
    id: string,
    data: Partial<StudentAttendanceRecord>,
  ): Promise<StudentAttendanceRecord> {
    if (USE_MOCK) return mockSuperAdminApi.updateStudentAttendanceRecord(id, data)
    return http(`/attendance/student-attendance/${id}`, { method: "PUT", body: JSON.stringify(data) })
  },
  deleteStudentAttendanceRecord(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteStudentAttendanceRecord(id)
    return http(`/attendance/student-attendance/${id}`, { method: "DELETE" })
  },

  getStudentLeaveApprovals(): Promise<StudentLeaveApprovalRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getStudentLeaveApprovals()
    return http("/attendance/approve-leave")
  },
  approveStudentLeave(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.approveStudentLeave(id)
    return http(`/attendance/approve-leave/${id}/approve`, { method: "POST" })
  },
  rejectStudentLeave(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.rejectStudentLeave(id)
    return http(`/attendance/approve-leave/${id}/reject`, { method: "POST" })
  },
  createStudentLeave(
    data: Omit<StudentLeaveApprovalRecord, "id">,
  ): Promise<StudentLeaveApprovalRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createStudentLeave(data)
    return http("/attendance/approve-leave", { method: "POST", body: JSON.stringify(data) })
  },

  getAttendanceByDate(classId?: string, date?: string): Promise<AttendanceByDateRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getAttendanceByDate(classId, date)
    return http(`/attendance/by-date?classId=${classId || ""}&date=${date || ""}`)
  },
  saveAttendanceByDate(records: AttendanceByDateRecord[]): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.saveAttendanceByDate(records)
    return http("/attendance/by-date", { method: "POST", body: JSON.stringify(records) })
  },

  getApproveLeaveRecords(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getApproveLeaveRecords()
    return http("/attendance/approve-leave-generic")
  },
  createApproveLeaveRecord(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createApproveLeaveRecord(data)
    return http("/attendance/approve-leave-generic", { method: "POST", body: JSON.stringify(data) })
  },
  deleteApproveLeaveRecord(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteApproveLeaveRecord(id)
    return http(`/attendance/approve-leave-generic/${id}`, { method: "DELETE" })
  },

  getByDateRecords(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getByDateRecords()
    return http("/attendance/by-date-generic")
  },
  createByDateRecord(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createByDateRecord(data)
    return http("/attendance/by-date-generic", { method: "POST", body: JSON.stringify(data) })
  },
  deleteByDateRecord(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteByDateRecord(id)
    return http(`/attendance/by-date-generic/${id}`, { method: "DELETE" })
  },

  // ---------------- Academics Module ----------------
  getClassTimetables(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getClassTimetables()
    return http("/academics/class-timetable")
  },
  createClassTimetable(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createClassTimetable(data)
    return http("/academics/class-timetable", { method: "POST", body: JSON.stringify(data) })
  },
  deleteClassTimetable(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteClassTimetable(id)
    return http(`/academics/class-timetable/${id}`, { method: "DELETE" })
  },

  getTeachersTimetables(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getTeachersTimetables()
    return http("/academics/teachers-timetable")
  },
  createTeachersTimetable(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createTeachersTimetable(data)
    return http("/academics/teachers-timetable", { method: "POST", body: JSON.stringify(data) })
  },
  deleteTeachersTimetable(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteTeachersTimetable(id)
    return http(`/academics/teachers-timetable/${id}`, { method: "DELETE" })
  },

  getAssignTeachers(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getAssignTeachers()
    return http("/academics/assign-teacher")
  },
  createAssignTeacher(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createAssignTeacher(data)
    return http("/academics/assign-teacher", { method: "POST", body: JSON.stringify(data) })
  },
  deleteAssignTeacher(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteAssignTeacher(id)
    return http(`/academics/assign-teacher/${id}`, { method: "DELETE" })
  },

  getPromoteStudents(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getPromoteStudents()
    return http("/academics/promote-students")
  },
  createPromoteStudent(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createPromoteStudent(data)
    return http("/academics/promote-students", { method: "POST", body: JSON.stringify(data) })
  },
  deletePromoteStudent(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deletePromoteStudent(id)
    return http(`/academics/promote-students/${id}`, { method: "DELETE" })
  },

  getSubjectGroups(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getSubjectGroups()
    return http("/academics/subject-group")
  },
  createSubjectGroup(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createSubjectGroup(data)
    return http("/academics/subject-group", { method: "POST", body: JSON.stringify(data) })
  },
  deleteSubjectGroup(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteSubjectGroup(id)
    return http(`/academics/subject-group/${id}`, { method: "DELETE" })
  },

  getSubjects(): Promise<AcademicSubjectRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getSubjects()
    return http("/academics/subjects")
  },
  createSubject(
    data: Omit<AcademicSubjectRecord, "id">,
  ): Promise<AcademicSubjectRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createSubject(data)
    return http("/academics/subjects", { method: "POST", body: JSON.stringify(data) })
  },
  deleteSubject(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteSubject(id)
    return http(`/academics/subjects/${id}`, { method: "DELETE" })
  },

  getClasses(): Promise<AcademicClassRecord[]> {
    if (USE_MOCK) return mockSuperAdminApi.getClasses()
    return http("/academics/class")
  },
  createClass(
    data: Omit<AcademicClassRecord, "id">,
  ): Promise<AcademicClassRecord> {
    if (USE_MOCK) return mockSuperAdminApi.createClass(data)
    return http("/academics/class", { method: "POST", body: JSON.stringify(data) })
  },
  deleteClass(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteClass(id)
    return http(`/academics/class/${id}`, { method: "DELETE" })
  },

  getSections(): Promise<GenericRecordItem[]> {
    if (USE_MOCK) return mockSuperAdminApi.getSections()
    return http("/academics/sections")
  },
  createSection(data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> {
    if (USE_MOCK) return mockSuperAdminApi.createSection(data)
    return http("/academics/sections", { method: "POST", body: JSON.stringify(data) })
  },
  deleteSection(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mockSuperAdminApi.deleteSection(id)
    return http(`/academics/sections/${id}`, { method: "DELETE" })
  },
}




import type {
  User,
  Student,
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
  StudentAttendanceStats,
  StudentAttendanceResponse,
  StudentLeaveApprovalRecord,
  AttendanceByDateRecord,
  AcademicSubjectRecord,
  AcademicClassRecord,
  ExpenseOverviewRecord,
  ExpensesOverviewStats,
  ExpensesOverviewResponse,
  IncomeRecord,
  IncomeStats,
  IncomeResponse,
  ZoomLiveClassRecord,
  GMeetLiveClassRecord,
} from "./types"
import { mockStudents, mockInstructors, mockAdmins, mockParents, mockSuperAdmins } from "./mock-data/users"
import { mockCourses, mockClasses } from "./mock-data/courses"
import { mockAttendance } from "./mock-data/attendance"
import { mockGrades } from "./mock-data/grades"
import { mockPayments } from "./mock-data/payments"
import { mockEnrollments } from "./mock-data/enrollments"
import {
  mockSuperAdminDashboard,
  mockFrontOfficeData,
  mockFeeCollectionData,
  mockMultiBranchData,
} from "./mock-data/superadmin"
import {
  visitorStore,
  enquiryStore,
  enquiryServerStats,
  complaintStore,
  studentStore,
  studentServerStats,
  feeReminderStore,
} from "./mock-data/superadmin-modules"
import {
  categoryStore,
  feeGroupStore,
  feeTypeStore,
  feeRecordStore,
  offlinePaymentStore,
  feeServerStats,
} from "./mock-data/superadmin-fees"
import {
  branchOverviewStore,
  branchServerStats,
  courseReportsStore,
  courseSettingsStore,
  branchReportsStore,
  branchSettingsStore,
  onlineCoursesStore,
  onlineCoursesServerStats,
  courseCategoriesStore,
  certificateTemplatesStore,
} from "./mock-data/superadmin-branches"
import {
  marksGradeStore,
  marksDivisionStore,
  printAdmitCardStore,
  designMarksheetStore,
  printMarksheetStore,
  examGroupStore,
  examScheduleStore,
  examResultStore,
  designAdmitCardStore,
} from "./mock-data/superadmin-examination"
import {
  lessonPlanStore,
  syllabusStatusStore,
  lessonListStore,
  topicListStore,
  copyOldLessonsStore,
} from "./mock-data/superadmin-lesson-plan"
import {
  addExpenseStore,
  expenseHeadStore,
  expensesOverviewStatsStore,
  expensesOverviewStore,
} from "./mock-data/superadmin-expenses"
import {
  staffStats,
  staffDirectoryStore,
  payrollStore,
  leaveRequestStore,
  leaveTypeStore,
  teachersRatingStore,
  departmentStore,
  designationStore,
  disabledStaffStore,
  teacherRatingOverviewStore,
  departmentCardStore,
} from "./mock-data/superadmin-human-resource"
import {
  noticeStore,
  communicationStats,
  emailLogStore,
  smsLogStore,
  scheduledBroadcastStore,
  emailTemplateStore,
  smsTemplateStore,
  loginCredentialsStore,
} from "./mock-data/superadmin-communication"
import {
  studentAttendanceStats,
  studentAttendanceStore,
  studentLeaveApprovalStore,
  attendanceByDateStore,
  approveLeaveGenericStore,
  byDateGenericStore,
} from "./mock-data/superadmin-attendance"
import {
  classTimetableStore,
  teachersTimetableStore,
  assignTeacherStore,
  promoteStudentsStore,
  subjectGroupStore,
  subjectsStore,
  classStore,
  sectionsStore,
} from "./mock-data/superadmin-academics"
import { incomeStore, incomeStatsStore } from "./mock-data/superadmin-income"
import { zoomLiveClassesStore, gmeetLiveClassesStore } from "./mock-data/superadmin-live-classes"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Generates the next sequential id, e.g. nextId("VIS", store) -> "VIS-005" */
function nextId(prefix: string, store: { id: string }[], pad = 3): string {
  const max = store.reduce((m, r) => Math.max(m, parseInt(r.id.split("-").pop() || "0", 10) || 0), 0)
  return `${prefix}-${String(max + 1).padStart(pad, "0")}`
}

// Authentication APIs
export const mockAuthApi = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    await delay(500)

    // Find user across all user types
    const allUsers = [...mockStudents, ...mockInstructors, ...mockAdmins, ...mockParents, ...mockSuperAdmins]
    const user = allUsers.find((u) => u.email === email)

    if (user && password === "password123") {
      return {
        user,
        token: "mock-jwt-token-" + user.id,
      }
    }

    throw new Error("Invalid credentials")
  },

  signup: async (data: any): Promise<{ user: User; token: string }> => {
    await delay(500)

    const newUser: Student = {
      id: "STU" + Date.now(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: "student",
      studentId: "WDA-" + new Date().getFullYear() + "-" + Date.now(),
      enrollmentDate: new Date().toISOString().split("T")[0],
      program: data.program,
      cohort: data.cohort,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    }

    return {
      user: newUser,
      token: "mock-jwt-token-" + newUser.id,
    }
  },

  resetPassword: async (email: string): Promise<{ success: boolean }> => {
    await delay(500)
    return { success: true }
  },

  verifyEmail: async (code: string): Promise<{ success: boolean }> => {
    await delay(500)
    return { success: true }
  },
}

// Student APIs
export const mockStudentApi = {
  getProfile: async (studentId: string) => {
    await delay(300)
    return mockStudents.find((s) => s.id === studentId)
  },

  getEnrollments: async (studentId: string) => {
    await delay(300)
    const enrollments = mockEnrollments.filter((e) => e.studentId === studentId)
    return enrollments.map((enrollment) => ({
      ...enrollment,
      course: mockCourses.find((c) => c.id === enrollment.courseId),
    }))
  },

  getUpcomingClasses: async (studentId: string) => {
    await delay(300)
    const enrollments = mockEnrollments.filter((e) => e.studentId === studentId)
    const courseIds = enrollments.map((e) => e.courseId)

    return mockClasses
      .filter((c) => courseIds.includes(c.courseId) && c.status === "scheduled")
      .map((cls) => ({
        ...cls,
        course: mockCourses.find((c) => c.id === cls.courseId),
      }))
  },

  getAttendance: async (studentId: string) => {
    await delay(300)
    return mockAttendance.filter((a) => a.studentId === studentId)
  },

  getGrades: async (studentId: string) => {
    await delay(300)
    return mockGrades.filter((g) => g.studentId === studentId)
  },

  getPayments: async (studentId: string) => {
    await delay(300)
    return mockPayments.filter((p) => p.studentId === studentId)
  },

  markAttendance: async (classId: string, studentId: string) => {
    await delay(300)
    return { success: true }
  },

  // Learning methods
  getZoomClasses: async () => {
    await delay(300)
    const { mockZoomClasses } = await import("./mock-data/learning")
    return mockZoomClasses
  },

  getGoogleMeetClasses: async () => {
    await delay(300)
    const { mockMeetClasses } = await import("./mock-data/learning")
    return mockMeetClasses
  },

  getAllAssignments: async () => {
    await delay(300)
    const { mockAssignments } = await import("./mock-data/learning")
    return mockAssignments
  },

  getLessonPlans: async () => {
    await delay(300)
    const { mockLessonPlans } = await import("./mock-data/learning")
    return mockLessonPlans
  },

  getSyllabuses: async () => {
    await delay(300)
    const { mockSyllabuses } = await import("./mock-data/learning")
    return mockSyllabuses
  },

  getCourseProgress: async () => {
    await delay(300)
    const { mockCourseProgress } = await import("./mock-data/learning")
    return mockCourseProgress
  },
}

// Instructor APIs
export const mockInstructorApi = {
  getProfile: async (instructorId: string) => {
    await delay(300)
    return mockInstructors.find((i) => i.id === instructorId)
  },

  getCourses: async (instructorId: string) => {
    await delay(300)
    return mockCourses.filter((c) => c.instructorId === instructorId)
  },

  getClasses: async (instructorId: string) => {
    await delay(300)
    const courses = mockCourses.filter((c) => c.instructorId === instructorId)
    const courseIds = courses.map((c) => c.id)

    return mockClasses
      .filter((c) => courseIds.includes(c.courseId))
      .map((cls) => ({
        ...cls,
        course: mockCourses.find((c) => c.id === cls.courseId),
      }))
  },

  getStudents: async (courseId: string) => {
    await delay(300)
    const enrollments = mockEnrollments.filter((e) => e.courseId === courseId)
    return enrollments.map((enrollment) => mockStudents.find((s) => s.id === enrollment.studentId)).filter(Boolean)
  },

  markAttendance: async (classId: string, studentId: string, status: string) => {
    await delay(300)
    return { success: true }
  },

  submitGrade: async (data: any) => {
    await delay(300)
    return { success: true }
  },
}

// Admin APIs
export const mockAdminApi = {
  getAllStudents: async () => {
    await delay(300)
    return mockStudents
  },

  getAllInstructors: async () => {
    await delay(300)
    return mockInstructors
  },

  getAllCourses: async () => {
    await delay(300)
    return mockCourses.map((course) => ({
      ...course,
      instructor: mockInstructors.find((i) => i.id === course.instructorId),
    }))
  },

  getStats: async () => {
    await delay(300)
    return {
      totalStudents: mockStudents.length,
      totalInstructors: mockInstructors.length,
      totalCourses: mockCourses.length,
      activeEnrollments: mockEnrollments.filter((e) => e.status === "active").length,
    }
  },

  createUser: async (data: any) => {
    await delay(500)
    return { success: true, userId: "NEW" + Date.now() }
  },

  createCourse: async (data: any) => {
    await delay(500)
    return { success: true, courseId: "CRS" + Date.now() }
  },
}

// Parent APIs
export const mockParentApi = {
  getChildren: async (parentId: string) => {
    await delay(300)
    const parent = mockParents.find((p) => p.id === parentId)
    if (!parent) return []

    return mockStudents.filter((s) => parent.studentIds.includes(s.id))
  },

  getChildProgress: async (studentId: string) => {
    await delay(300)
    return {
      student: mockStudents.find((s) => s.id === studentId),
      enrollments: await mockStudentApi.getEnrollments(studentId),
      attendance: await mockStudentApi.getAttendance(studentId),
      grades: await mockStudentApi.getGrades(studentId),
    }
  },
}

// SuperAdmin APIs
export const mockSuperAdminApi = {
  getDashboardOverview: async (): Promise<SuperAdminDashboardData> => {
    await delay(300)
    return mockSuperAdminDashboard
  },

  exportReport: async (): Promise<{ success: boolean; downloadUrl: string }> => {
    await delay(500)
    return {
      success: true,
      downloadUrl: "#export-report-aug-2026",
    }
  },

  // ---- Front Office ----
  getVisitors: async (): Promise<VisitorRecord[]> => {
    await delay(300)
    return [...visitorStore]
  },

  createVisitor: async (data: Omit<VisitorRecord, "id">): Promise<VisitorRecord> => {
    await delay(300)
    const record = { ...data, id: nextId("VIS", visitorStore) }
    visitorStore.unshift(record)
    return record
  },

  getAdmissionEnquiries: async (): Promise<AdmissionEnquiryResponse> => {
    await delay(300)
    return {
      enquiries: [...enquiryStore],
      stats: {
        total: enquiryStore.length,
        won: enquiryStore.filter((e) => e.status === "Won").length,
        ...enquiryServerStats,
      },
    }
  },

  createEnquiry: async (data: Omit<AdmissionEnquiry, "id" | "lastFollowUpDate" | "status">): Promise<AdmissionEnquiry> => {
    await delay(300)
    const record: AdmissionEnquiry = { ...data, id: nextId("ENQ", enquiryStore), lastFollowUpDate: null, status: "Active" }
    enquiryStore.unshift(record)
    return record
  },

  deleteEnquiry: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = enquiryStore.findIndex((e) => e.id === id)
    if (idx >= 0) enquiryStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getComplaints: async (): Promise<ComplaintResponse> => {
    await delay(300)
    return {
      complaints: [...complaintStore],
      stats: {
        open: complaintStore.filter((c) => c.status === "Open").length,
        inProgress: complaintStore.filter((c) => c.status === "In-Progress").length,
        resolved: complaintStore.filter((c) => c.status === "Resolved").length,
      },
    }
  },

  createComplaint: async (data: Omit<ComplaintRecord, "id" | "status">): Promise<ComplaintRecord> => {
    await delay(300)
    const record: ComplaintRecord = { ...data, id: nextId("CMP", complaintStore), status: "Open" }
    complaintStore.unshift(record)
    return record
  },

  // ---- Student Info ----
  getStudentDetails: async (params: { search?: string; className?: string } = {}): Promise<StudentListResponse> => {
    await delay(300)
    const q = params.search?.trim().toLowerCase()
    const students = studentStore.filter(
      (s) =>
        (!params.className || s.className.startsWith(params.className)) &&
        (!q || [s.name, s.id, s.parent, s.rollNo, s.phone].some((v) => v.toLowerCase().includes(q))),
    )
    const classes = Array.from(new Set(studentStore.map((s) => s.className.split("-")[0]))).sort()
    return { students, stats: { ...studentServerStats }, classes }
  },

  createStudentRecord: async (data: Omit<StudentRecord, "id" | "status">): Promise<StudentRecord> => {
    await delay(300)
    const record: StudentRecord = { ...data, id: nextId("STU-2026", studentStore, 3), status: "active" }
    studentStore.push(record)
    return record
  },

  deleteStudentRecord: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = studentStore.findIndex((s) => s.id === id)
    if (idx >= 0) studentStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  bulkDeleteStudentRecords: async (ids: string[]): Promise<{ success: boolean; deleted: number }> => {
    await delay(400)
    let deleted = 0
    for (const id of ids) {
      const idx = studentStore.findIndex((s) => s.id === id)
      if (idx >= 0) {
        studentStore.splice(idx, 1)
        deleted++
      }
    }
    return { success: true, deleted }
  },

  // ---- Fee Collection ----
  getFeeReminderSettings: async (): Promise<FeeReminderSettings> => {
    await delay(300)
    return structuredClone(feeReminderStore.current)
  },

  saveFeeReminderSettings: async (settings: FeeReminderSettings): Promise<{ success: boolean }> => {
    await delay(400)
    feeReminderStore.current = structuredClone(settings)
    return { success: true }
  },

  // ---- Student Category ----
  getStudentCategories: async (): Promise<StudentCategory[]> => {
    await delay(300)
    return [...categoryStore]
  },
  createStudentCategory: async (data: Pick<StudentCategory, "name" | "description">): Promise<StudentCategory> => {
    await delay(300)
    const record: StudentCategory = { ...data, id: nextId("CAT", categoryStore), totalStudents: 0 }
    categoryStore.push(record)
    return record
  },
  deleteStudentCategory: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = categoryStore.findIndex((c) => c.id === id)
    if (idx >= 0) categoryStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  // ---- Fee Group ----
  getFeeGroups: async (): Promise<FeeGroup[]> => {
    await delay(300)
    return [...feeGroupStore]
  },
  createFeeGroup: async (data: Omit<FeeGroup, "id" | "students">): Promise<FeeGroup> => {
    await delay(300)
    const record: FeeGroup = { ...data, id: nextId("FG", feeGroupStore), students: 0 }
    feeGroupStore.push(record)
    return record
  },
  deleteFeeGroup: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = feeGroupStore.findIndex((g) => g.id === id)
    if (idx >= 0) feeGroupStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  // ---- Fee Type ----
  getFeeTypes: async (): Promise<FeeType[]> => {
    await delay(300)
    return [...feeTypeStore]
  },
  createFeeType: async (data: Omit<FeeType, "id">): Promise<FeeType> => {
    await delay(300)
    const record: FeeType = { ...data, id: nextId("FT", feeTypeStore) }
    feeTypeStore.push(record)
    return record
  },
  deleteFeeType: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = feeTypeStore.findIndex((t) => t.id === id)
    if (idx >= 0) feeTypeStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  // ---- Collect Fee / Offline Bank Payments (same shape, separate resources) ----
  getFeeRecords: async (source: "collect" | "offline"): Promise<FeeRecordsResponse> => {
    await delay(300)
    const store = source === "collect" ? feeRecordStore : offlinePaymentStore
    return { records: [...store], stats: { ...feeServerStats } }
  },
  createFeeRecord: async (
    source: "collect" | "offline",
    data: Pick<FeeRecord, "student" | "className" | "feeType" | "amount" | "dueDate">,
  ): Promise<FeeRecord> => {
    await delay(300)
    const store = source === "collect" ? feeRecordStore : offlinePaymentStore
    const record: FeeRecord = {
      ...data,
      id: nextId("FEE-2026", store, 4),
      receiptNo: null,
      paid: 0,
      balance: data.amount,
      status: "Pending",
    }
    store.unshift(record)
    return record
  },

  // Module endpoints for future UI integration
  getFrontOffice: async () => {
    await delay(300)
    return mockFrontOfficeData
  },

  getStudentInfo: async () => {
    await delay(300)
    return {
      students: mockStudents,
      summary: mockSuperAdminDashboard.stats.students,
    }
  },

  getFeeCollection: async () => {
    await delay(300)
    return {
      ...mockFeeCollectionData,
      stats: mockSuperAdminDashboard.stats.fees,
      debt: mockSuperAdminDashboard.stats.debt,
    }
  },

  getOnlineCourses: async () => {
    await delay(300)
    return {
      courses: mockCourses,
    }
  },

  getMultiBranch: async () => {
    await delay(300)
    return mockMultiBranchData
  },

  // ---- Multi Branch Overview ----
  getBranchOverview: async (): Promise<BranchOverviewResponse> => {
    await delay(300)
    return {
      branches: [...branchOverviewStore],
      stats: { ...branchServerStats },
    }
  },
  createBranch: async (data: Omit<BranchOverviewRecord, "id">): Promise<BranchOverviewRecord> => {
    await delay(300)
    const record: BranchOverviewRecord = { ...data, id: nextId("BR", branchOverviewStore) }
    branchOverviewStore.push(record)
    return record
  },
  deleteBranch: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = branchOverviewStore.findIndex((b) => b.id === id)
    if (idx >= 0) branchOverviewStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  // ---- Online Courses List ----
  getOnlineCoursesList: async (): Promise<OnlineCoursesResponse> => {
    await delay(300)
    return {
      courses: [...onlineCoursesStore],
      stats: { ...onlineCoursesServerStats },
    }
  },
  createOnlineCourse: async (data: Omit<OnlineCourseItem, "id">): Promise<OnlineCourseItem> => {
    await delay(300)
    const record: OnlineCourseItem = {
      ...data,
      id: nextId("CRS", onlineCoursesStore),
    }
    onlineCoursesStore.push(record)
    return record
  },
  deleteOnlineCourse: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = onlineCoursesStore.findIndex((c) => c.id === id)
    if (idx >= 0) onlineCoursesStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  // ---- Course Categories ----
  getCourseCategories: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...courseCategoriesStore]
  },
  createCourseCategory: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(courseCategoriesStore.length + 1) }
    courseCategoriesStore.push(record)
    return record
  },
  deleteCourseCategory: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = courseCategoriesStore.findIndex((r) => r.id === id)
    if (idx >= 0) courseCategoriesStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  // ---- Certificate Templates ----
  getCertificateTemplates: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...certificateTemplatesStore]
  },
  createCertificateTemplate: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(certificateTemplatesStore.length + 1) }
    certificateTemplatesStore.push(record)
    return record
  },
  deleteCertificateTemplate: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = certificateTemplatesStore.findIndex((r) => r.id === id)
    if (idx >= 0) certificateTemplatesStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  // ---- Online Course Report & Settings ----
  getCourseReports: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...courseReportsStore]
  },
  createCourseReport: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(courseReportsStore.length + 1) }
    courseReportsStore.push(record)
    return record
  },
  deleteCourseReport: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = courseReportsStore.findIndex((r) => r.id === id)
    if (idx >= 0) courseReportsStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getCourseSettings: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...courseSettingsStore]
  },
  createCourseSetting: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(courseSettingsStore.length + 1) }
    courseSettingsStore.push(record)
    return record
  },
  deleteCourseSetting: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = courseSettingsStore.findIndex((r) => r.id === id)
    if (idx >= 0) courseSettingsStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  // ---- Multi Branch Report & Settings ----
  getBranchReports: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...branchReportsStore]
  },
  createBranchReport: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(branchReportsStore.length + 1) }
    branchReportsStore.push(record)
    return record
  },
  deleteBranchReport: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = branchReportsStore.findIndex((r) => r.id === id)
    if (idx >= 0) branchReportsStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getBranchSettings: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...branchSettingsStore]
  },
  createBranchSetting: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(branchSettingsStore.length + 1) }
    branchSettingsStore.push(record)
    return record
  },
  deleteBranchSetting: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = branchSettingsStore.findIndex((r) => r.id === id)
    if (idx >= 0) branchSettingsStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getLiveClasses: async (platform: "zoom" | "gmeet") => {
    await delay(300)
    return {
      platform,
      classes: platform === "zoom" ? zoomLiveClassesStore : gmeetLiveClassesStore,
    }
  },

  getZoomLiveClasses: async (): Promise<ZoomLiveClassRecord[]> => {
    await delay(300)
    return [...zoomLiveClassesStore]
  },
  createZoomLiveClass: async (data: Omit<ZoomLiveClassRecord, "id">): Promise<ZoomLiveClassRecord> => {
    await delay(300)
    const record: ZoomLiveClassRecord = {
      ...data,
      id: nextId("ZM", zoomLiveClassesStore, 3),
    }
    zoomLiveClassesStore.unshift(record)
    return record
  },
  updateZoomLiveClass: async (id: string, data: Partial<ZoomLiveClassRecord>): Promise<ZoomLiveClassRecord> => {
    await delay(300)
    const idx = zoomLiveClassesStore.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Zoom class not found")
    zoomLiveClassesStore[idx] = { ...zoomLiveClassesStore[idx], ...data }
    return zoomLiveClassesStore[idx]
  },
  deleteZoomLiveClass: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = zoomLiveClassesStore.findIndex((r) => r.id === id)
    if (idx >= 0) zoomLiveClassesStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getGMeetLiveClasses: async (): Promise<GMeetLiveClassRecord[]> => {
    await delay(300)
    return [...gmeetLiveClassesStore]
  },
  createGMeetLiveClass: async (data: Omit<GMeetLiveClassRecord, "id">): Promise<GMeetLiveClassRecord> => {
    await delay(300)
    const record: GMeetLiveClassRecord = {
      ...data,
      id: nextId("GM", gmeetLiveClassesStore, 3),
    }
    gmeetLiveClassesStore.unshift(record)
    return record
  },
  updateGMeetLiveClass: async (id: string, data: Partial<GMeetLiveClassRecord>): Promise<GMeetLiveClassRecord> => {
    await delay(300)
    const idx = gmeetLiveClassesStore.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("GMeet class not found")
    gmeetLiveClassesStore[idx] = { ...gmeetLiveClassesStore[idx], ...data }
    return gmeetLiveClassesStore[idx]
  },
  deleteGMeetLiveClass: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = gmeetLiveClassesStore.findIndex((r) => r.id === id)
    if (idx >= 0) gmeetLiveClassesStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getIncome: async (): Promise<IncomeResponse> => {
    await delay(300)
    return {
      income: [...incomeStore],
      stats: { ...incomeStatsStore },
    }
  },
  createIncome: async (data: Omit<IncomeRecord, "id">): Promise<IncomeRecord> => {
    await delay(300)
    const record: IncomeRecord = {
      ...data,
      id: nextId("INC", incomeStore, 3),
    }
    incomeStore.unshift(record)
    return record
  },
  updateIncome: async (id: string, data: Partial<IncomeRecord>): Promise<IncomeRecord> => {
    await delay(300)
    const idx = incomeStore.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Income record not found")
    incomeStore[idx] = { ...incomeStore[idx], ...data }
    return incomeStore[idx]
  },
  deleteIncome: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = incomeStore.findIndex((r) => r.id === id)
    if (idx >= 0) incomeStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getExpenses: async () => {
    await delay(300)
    return {
      totalExpenses: 78000,
      currency: "₹",
      records: [],
    }
  },

  // ---- Examination Module ----
  getMarksGrades: async (): Promise<MarksGradeRecord[]> => {
    await delay(300)
    return [...marksGradeStore]
  },
  createMarksGrade: async (data: Omit<MarksGradeRecord, "id">): Promise<MarksGradeRecord> => {
    await delay(300)
    const record: MarksGradeRecord = { ...data, id: nextId("GRD", marksGradeStore) }
    marksGradeStore.push(record)
    return record
  },
  deleteMarksGrade: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = marksGradeStore.findIndex((g) => g.id === id)
    if (idx >= 0) marksGradeStore.splice(idx, 1)
    return { success: idx >= 0 }
  },
  updateMarksGrade: async (id: string, data: Partial<MarksGradeRecord>): Promise<MarksGradeRecord> => {
    await delay(300)
    const idx = marksGradeStore.findIndex((g) => g.id === id)
    if (idx === -1) throw new Error("Marks grade rule not found")
    marksGradeStore[idx] = { ...marksGradeStore[idx], ...data }
    return marksGradeStore[idx]
  },

  getMarksDivisions: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...marksDivisionStore]
  },
  createMarksDivision: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(marksDivisionStore.length + 1) }
    marksDivisionStore.push(record)
    return record
  },
  updateMarksDivision: async (id: string, data: Partial<GenericRecordItem>): Promise<GenericRecordItem> => {
    await delay(300)
    const idx = marksDivisionStore.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Record not found")
    marksDivisionStore[idx] = { ...marksDivisionStore[idx], ...data }
    return marksDivisionStore[idx]
  },
  deleteMarksDivision: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = marksDivisionStore.findIndex((r) => r.id === id)
    if (idx >= 0) marksDivisionStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getPrintAdmitCards: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...printAdmitCardStore]
  },
  createPrintAdmitCard: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(printAdmitCardStore.length + 1) }
    printAdmitCardStore.push(record)
    return record
  },
  updatePrintAdmitCard: async (id: string, data: Partial<GenericRecordItem>): Promise<GenericRecordItem> => {
    await delay(300)
    const idx = printAdmitCardStore.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Record not found")
    printAdmitCardStore[idx] = { ...printAdmitCardStore[idx], ...data }
    return printAdmitCardStore[idx]
  },
  deletePrintAdmitCard: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = printAdmitCardStore.findIndex((r) => r.id === id)
    if (idx >= 0) printAdmitCardStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getDesignMarksheets: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...designMarksheetStore]
  },
  createDesignMarksheet: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(designMarksheetStore.length + 1) }
    designMarksheetStore.push(record)
    return record
  },
  updateDesignMarksheet: async (id: string, data: Partial<GenericRecordItem>): Promise<GenericRecordItem> => {
    await delay(300)
    const idx = designMarksheetStore.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Record not found")
    designMarksheetStore[idx] = { ...designMarksheetStore[idx], ...data }
    return designMarksheetStore[idx]
  },
  deleteDesignMarksheet: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = designMarksheetStore.findIndex((r) => r.id === id)
    if (idx >= 0) designMarksheetStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getPrintMarksheets: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...printMarksheetStore]
  },
  createPrintMarksheet: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(printMarksheetStore.length + 1) }
    printMarksheetStore.push(record)
    return record
  },
  updatePrintMarksheet: async (id: string, data: Partial<GenericRecordItem>): Promise<GenericRecordItem> => {
    await delay(300)
    const idx = printMarksheetStore.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Record not found")
    printMarksheetStore[idx] = { ...printMarksheetStore[idx], ...data }
    return printMarksheetStore[idx]
  },
  deletePrintMarksheet: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = printMarksheetStore.findIndex((r) => r.id === id)
    if (idx >= 0) printMarksheetStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getDesignAdmitCards: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...designAdmitCardStore]
  },
  createDesignAdmitCard: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(designAdmitCardStore.length + 1) }
    designAdmitCardStore.push(record)
    return record
  },
  updateDesignAdmitCard: async (id: string, data: Partial<GenericRecordItem>): Promise<GenericRecordItem> => {
    await delay(300)
    const idx = designAdmitCardStore.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Record not found")
    designAdmitCardStore[idx] = { ...designAdmitCardStore[idx], ...data }
    return designAdmitCardStore[idx]
  },
  deleteDesignAdmitCard: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = designAdmitCardStore.findIndex((r) => r.id === id)
    if (idx >= 0) designAdmitCardStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getExamGroups: async (): Promise<ExamGroupRecord[]> => {
    await delay(300)
    return [...examGroupStore]
  },
  createExamGroup: async (data: Omit<ExamGroupRecord, "id">): Promise<ExamGroupRecord> => {
    await delay(300)
    const record: ExamGroupRecord = { ...data, id: nextId("GRP", examGroupStore) }
    examGroupStore.push(record)
    return record
  },
  updateExamGroup: async (id: string, data: Partial<ExamGroupRecord>): Promise<ExamGroupRecord> => {
    await delay(300)
    const idx = examGroupStore.findIndex((g) => g.id === id)
    if (idx === -1) throw new Error("Exam group not found")
    examGroupStore[idx] = { ...examGroupStore[idx], ...data }
    return examGroupStore[idx]
  },
  deleteExamGroup: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = examGroupStore.findIndex((g) => g.id === id)
    if (idx >= 0) examGroupStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getExamSchedules: async (): Promise<ExamScheduleRecord[]> => {
    await delay(300)
    return [...examScheduleStore]
  },
  createExamSchedule: async (data: Omit<ExamScheduleRecord, "id">): Promise<ExamScheduleRecord> => {
    await delay(300)
    const record: ExamScheduleRecord = { ...data, id: nextId("SCH", examScheduleStore) }
    examScheduleStore.push(record)
    return record
  },
  updateExamSchedule: async (id: string, data: Partial<ExamScheduleRecord>): Promise<ExamScheduleRecord> => {
    await delay(300)
    const idx = examScheduleStore.findIndex((s) => s.id === id)
    if (idx === -1) throw new Error("Exam schedule not found")
    examScheduleStore[idx] = { ...examScheduleStore[idx], ...data }
    return examScheduleStore[idx]
  },
  deleteExamSchedule: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = examScheduleStore.findIndex((s) => s.id === id)
    if (idx >= 0) examScheduleStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getExamResults: async (): Promise<ExamResultRecord[]> => {
    await delay(300)
    return [...examResultStore]
  },
  createExamResult: async (data: Omit<ExamResultRecord, "id">): Promise<ExamResultRecord> => {
    await delay(300)
    const record: ExamResultRecord = { ...data, id: nextId("RES", examResultStore) }
    examResultStore.push(record)
    return record
  },
  updateExamResult: async (id: string, data: Partial<ExamResultRecord>): Promise<ExamResultRecord> => {
    await delay(300)
    const idx = examResultStore.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Exam result not found")
    examResultStore[idx] = { ...examResultStore[idx], ...data }
    return examResultStore[idx]
  },
  deleteExamResult: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = examResultStore.findIndex((r) => r.id === id)
    if (idx >= 0) examResultStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  // ---- Expenses Module ----
  getExpensesOverview: async (): Promise<ExpensesOverviewResponse> => {
    await delay(300)
    return {
      expenses: [...expensesOverviewStore],
      stats: { ...expensesOverviewStatsStore },
    }
  },
  createExpenseOverview: async (
    data: Omit<ExpenseOverviewRecord, "id">,
  ): Promise<ExpenseOverviewRecord> => {
    await delay(300)
    const record: ExpenseOverviewRecord = {
      ...data,
      id: nextId("EXP", expensesOverviewStore, 3),
    }
    expensesOverviewStore.unshift(record)
    return record
  },
  deleteExpenseOverview: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = expensesOverviewStore.findIndex((e) => e.id === id)
    if (idx >= 0) expensesOverviewStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getAddExpenses: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...addExpenseStore]
  },
  createAddExpense: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(addExpenseStore.length + 1) }
    addExpenseStore.push(record)
    return record
  },
  deleteAddExpense: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = addExpenseStore.findIndex((r) => r.id === id)
    if (idx >= 0) addExpenseStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getExpenseHeads: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...expenseHeadStore]
  },
  createExpenseHead: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(expenseHeadStore.length + 1) }
    expenseHeadStore.push(record)
    return record
  },
  deleteExpenseHead: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = expenseHeadStore.findIndex((r) => r.id === id)
    if (idx >= 0) expenseHeadStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  // ---- Lesson Plan Module ----
  getLessonPlans: async (): Promise<LessonPlanRecord[]> => {
    await delay(300)
    return [...lessonPlanStore]
  },
  createLessonPlan: async (data: Omit<LessonPlanRecord, "id">): Promise<LessonPlanRecord> => {
    await delay(300)
    const record: LessonPlanRecord = { ...data, id: nextId("LP", lessonPlanStore) }
    lessonPlanStore.push(record)
    return record
  },
  deleteLessonPlan: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = lessonPlanStore.findIndex((l) => l.id === id)
    if (idx >= 0) lessonPlanStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getSyllabusStatuses: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...syllabusStatusStore]
  },
  createSyllabusStatus: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(syllabusStatusStore.length + 1) }
    syllabusStatusStore.push(record)
    return record
  },
  deleteSyllabusStatus: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = syllabusStatusStore.findIndex((r) => r.id === id)
    if (idx >= 0) syllabusStatusStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getLessonsList: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...lessonListStore]
  },
  createLessonItem: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(lessonListStore.length + 1) }
    lessonListStore.push(record)
    return record
  },
  deleteLessonItem: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = lessonListStore.findIndex((r) => r.id === id)
    if (idx >= 0) lessonListStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getTopicsList: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...topicListStore]
  },
  createTopicItem: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(topicListStore.length + 1) }
    topicListStore.push(record)
    return record
  },
  deleteTopicItem: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = topicListStore.findIndex((r) => r.id === id)
    if (idx >= 0) topicListStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getCopyOldLessons: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...copyOldLessonsStore]
  },
  createCopyOldLesson: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(copyOldLessonsStore.length + 1) }
    copyOldLessonsStore.push(record)
    return record
  },
  deleteCopyOldLesson: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = copyOldLessonsStore.findIndex((r) => r.id === id)
    if (idx >= 0) copyOldLessonsStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getExamination: async () => {
    await delay(300)
    return {
      exams: [],
    }
  },

  getAttendance: async () => {
    await delay(300)
    return {
      staffAttendance: mockSuperAdminDashboard.staffTodayAttendance,
      studentAttendance: mockSuperAdminDashboard.studentTodayAttendance,
      stats: {
        staffPresent: mockSuperAdminDashboard.metrics.staffPresentToday,
        studentPresent: mockSuperAdminDashboard.metrics.studentPresentToday,
      },
    }
  },

  getAcademics: async () => {
    await delay(300)
    return {
      classes: [],
      sections: [],
      subjects: [],
    }
  },

  getLessonPlan: async () => {
    await delay(300)
    return {
      plans: [],
    }
  },

  getHumanResource: async () => {
    await delay(300)
    return {
      staff: staffDirectoryStore,
      stats: {
        totalStaff: staffStats.totalStaff,
        active: staffStats.active,
        teachers: staffStats.teachers,
        supportStaff: staffStats.supportStaff,
      },
    }
  },

  getStaffDirectory: async (): Promise<StaffDirectoryResponse> => {
    await delay(300)
    return {
      staff: [...staffDirectoryStore],
      stats: {
        totalStaff: staffStats.totalStaff,
        active: staffStats.active,
        teachers: staffStats.teachers,
        supportStaff: staffStats.supportStaff,
      },
    }
  },
  createStaffMember: async (data: Omit<StaffRecord, "id">): Promise<StaffRecord> => {
    await delay(300)
    const record: StaffRecord = {
      ...data,
      id: nextId("STF", staffDirectoryStore, 3),
      initial: data.name.charAt(0).toUpperCase() || "S",
    }
    staffDirectoryStore.unshift(record)
    return record
  },
  deleteStaffMember: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = staffDirectoryStore.findIndex((s) => s.id === id)
    if (idx >= 0) staffDirectoryStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getPayroll: async (): Promise<PayrollRecord[]> => {
    await delay(300)
    return [...payrollStore]
  },
  createPayroll: async (data: Omit<PayrollRecord, "id">): Promise<PayrollRecord> => {
    await delay(300)
    const record: PayrollRecord = {
      ...data,
      id: nextId("STF", payrollStore, 3),
    }
    payrollStore.unshift(record)
    return record
  },
  deletePayroll: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = payrollStore.findIndex((p) => p.id === id)
    if (idx >= 0) payrollStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getLeaveRequests: async (): Promise<LeaveRequestRecord[]> => {
    await delay(300)
    return [...leaveRequestStore]
  },
  createLeaveRequest: async (data: Omit<LeaveRequestRecord, "id">): Promise<LeaveRequestRecord> => {
    await delay(300)
    const record: LeaveRequestRecord = {
      ...data,
      id: nextId("LR", leaveRequestStore, 3),
    }
    leaveRequestStore.unshift(record)
    return record
  },
  updateLeaveRequestStatus: async (
    id: string,
    status: "Approved" | "Rejected",
  ): Promise<{ success: boolean }> => {
    await delay(300)
    const item = leaveRequestStore.find((r) => r.id === id)
    if (item) {
      item.status = status
      return { success: true }
    }
    return { success: false }
  },
  deleteLeaveRequest: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = leaveRequestStore.findIndex((r) => r.id === id)
    if (idx >= 0) leaveRequestStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getLeaveTypes: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...leaveTypeStore]
  },
  createLeaveType: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(leaveTypeStore.length + 1) }
    leaveTypeStore.push(record)
    return record
  },
  deleteLeaveType: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = leaveTypeStore.findIndex((r) => r.id === id)
    if (idx >= 0) leaveTypeStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getTeachersRatings: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...teachersRatingStore]
  },
  createTeachersRating: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(teachersRatingStore.length + 1) }
    teachersRatingStore.push(record)
    return record
  },
  deleteTeachersRating: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = teachersRatingStore.findIndex((r) => r.id === id)
    if (idx >= 0) teachersRatingStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getDepartments: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...departmentStore]
  },
  createDepartment: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(departmentStore.length + 1) }
    departmentStore.push(record)
    return record
  },
  deleteDepartment: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = departmentStore.findIndex((r) => r.id === id)
    if (idx >= 0) departmentStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getDesignations: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...designationStore]
  },
  createDesignation: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(designationStore.length + 1) }
    designationStore.push(record)
    return record
  },
  deleteDesignation: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = designationStore.findIndex((r) => r.id === id)
    if (idx >= 0) designationStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getDisabledStaff: async (): Promise<GenericRecordItem[]> => {
    await delay(300)
    return [...disabledStaffStore]
  },
  createDisabledStaff: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(disabledStaffStore.length + 1) }
    disabledStaffStore.push(record)
    return record
  },
  deleteDisabledStaff: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = disabledStaffStore.findIndex((r) => r.id === id)
    if (idx >= 0) disabledStaffStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getTeacherRatingsOverview: async (): Promise<TeacherRatingRecord[]> => {
    await delay(300)
    return [...teacherRatingOverviewStore]
  },

  getDepartmentCards: async (): Promise<DepartmentCardRecord[]> => {
    await delay(300)
    return [...departmentCardStore]
  },
  createDepartmentCard: async (
    data: Omit<DepartmentCardRecord, "id">,
  ): Promise<DepartmentCardRecord> => {
    await delay(300)
    const record: DepartmentCardRecord = {
      ...data,
      id: nextId("DEP", departmentCardStore, 3),
    }
    departmentCardStore.push(record)
    return record
  },
  deleteDepartmentCard: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const idx = departmentCardStore.findIndex((r) => r.id === id)
    if (idx >= 0) departmentCardStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  // ---------------- Communication Module ----------------
  getNoticeBoard: async (): Promise<NoticeBoardResponse> => {
    await delay(250)
    return {
      notices: [...noticeStore],
      stats: {
        totalNotices: 24, // Matches screenshot total notices
        published: noticeStore.filter((n) => n.status === "Published").length || 20,
        drafts: noticeStore.filter((n) => n.status === "Draft").length || 4,
        highPriority: noticeStore.filter((n) => n.priority === "High").length || 6,
      },
    }
  },
  createNotice: async (data: Omit<NoticeRecord, "id">): Promise<NoticeRecord> => {
    await delay(300)
    const record: NoticeRecord = {
      ...data,
      id: nextId("NTC", noticeStore, 3),
    }
    noticeStore.unshift(record)
    return record
  },
  updateNotice: async (id: string, data: Partial<NoticeRecord>): Promise<NoticeRecord> => {
    await delay(300)
    const idx = noticeStore.findIndex((n) => n.id === id)
    if (idx >= 0) {
      noticeStore[idx] = { ...noticeStore[idx], ...data }
      return noticeStore[idx]
    }
    throw new Error("Notice not found")
  },
  deleteNotice: async (id: string): Promise<{ success: boolean }> => {
    await delay(250)
    const idx = noticeStore.findIndex((n) => n.id === id)
    if (idx >= 0) noticeStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getCommunicationStats: async (): Promise<CommunicationStats> => {
    await delay(200)
    return { ...communicationStats }
  },

  sendEmail: async (data: SendEmailRequest): Promise<{ success: boolean; log: CommunicationLogRecord }> => {
    await delay(400)
    const log: CommunicationLogRecord = {
      id: nextId("EML", emailLogStore, 3),
      type: "Email",
      subject: data.subject,
      recipients: data.recipients === "All Users" ? 2198 : data.recipients === "Students" ? 1342 : 312,
      sentAt: "Just now",
      opens: "0 (0%)",
      status: "Delivered",
    }
    emailLogStore.unshift(log)
    return { success: true, log }
  },

  sendSms: async (data: SendSmsRequest): Promise<{ success: boolean; log: CommunicationLogRecord }> => {
    await delay(400)
    const log: CommunicationLogRecord = {
      id: nextId("SMS", smsLogStore, 3),
      type: "SMS",
      subject: data.message.slice(0, 35) + (data.message.length > 35 ? "..." : ""),
      recipients: data.recipients === "All Users" ? 2198 : 450,
      sentAt: "Just now",
      opens: "100%",
      status: "Delivered",
    }
    smsLogStore.unshift(log)
    return { success: true, log }
  },

  getCommunicationLogs: async (type?: "Email" | "SMS"): Promise<CommunicationLogRecord[]> => {
    await delay(250)
    if (type === "Email") return [...emailLogStore]
    if (type === "SMS") return [...smsLogStore]
    return [...emailLogStore, ...smsLogStore]
  },
  createCommunicationLog: async (data: Omit<CommunicationLogRecord, "id">): Promise<CommunicationLogRecord> => {
    await delay(300)
    const prefix = data.type === "Email" ? "EML" : "SMS"
    const targetStore = data.type === "Email" ? emailLogStore : smsLogStore
    const record: CommunicationLogRecord = {
      ...data,
      id: nextId(prefix, targetStore, 3),
    }
    targetStore.unshift(record)
    return record
  },
  deleteCommunicationLog: async (id: string): Promise<{ success: boolean }> => {
    await delay(200)
    const emailIdx = emailLogStore.findIndex((l) => l.id === id)
    if (emailIdx >= 0) {
      emailLogStore.splice(emailIdx, 1)
      return { success: true }
    }
    const smsIdx = smsLogStore.findIndex((l) => l.id === id)
    if (smsIdx >= 0) {
      smsLogStore.splice(smsIdx, 1)
      return { success: true }
    }
    return { success: false }
  },

  getScheduledBroadcasts: async (): Promise<ScheduledBroadcastRecord[]> => {
    await delay(250)
    return [...scheduledBroadcastStore]
  },
  createScheduledBroadcast: async (data: Omit<ScheduledBroadcastRecord, "id">): Promise<ScheduledBroadcastRecord> => {
    await delay(300)
    const record: ScheduledBroadcastRecord = {
      ...data,
      id: nextId("SCH", scheduledBroadcastStore, 3),
    }
    scheduledBroadcastStore.unshift(record)
    return record
  },
  cancelScheduledBroadcast: async (id: string): Promise<{ success: boolean }> => {
    await delay(200)
    const idx = scheduledBroadcastStore.findIndex((s) => s.id === id)
    if (idx >= 0) {
      scheduledBroadcastStore[idx].status = "Cancelled"
      return { success: true }
    }
    return { success: false }
  },

  getCommunicationTemplates: async (type: "Email" | "SMS"): Promise<CommunicationTemplateRecord[]> => {
    await delay(250)
    return type === "Email" ? [...emailTemplateStore] : [...smsTemplateStore]
  },
  createCommunicationTemplate: async (data: Omit<CommunicationTemplateRecord, "id">): Promise<CommunicationTemplateRecord> => {
    await delay(300)
    const targetStore = data.type === "Email" ? emailTemplateStore : smsTemplateStore
    const prefix = data.type === "Email" ? "TMPL-EML" : "TMPL-SMS"
    const record: CommunicationTemplateRecord = {
      ...data,
      id: nextId(prefix, targetStore, 3),
    }
    targetStore.unshift(record)
    return record
  },
  deleteCommunicationTemplate: async (id: string): Promise<{ success: boolean }> => {
    await delay(200)
    const emailIdx = emailTemplateStore.findIndex((t) => t.id === id)
    if (emailIdx >= 0) {
      emailTemplateStore.splice(emailIdx, 1)
      return { success: true }
    }
    const smsIdx = smsTemplateStore.findIndex((t) => t.id === id)
    if (smsIdx >= 0) {
      smsTemplateStore.splice(smsIdx, 1)
      return { success: true }
    }
    return { success: false }
  },

  getLoginCredentials: async (): Promise<LoginCredentialRecord[]> => {
    await delay(250)
    return [...loginCredentialsStore]
  },
  sendLoginCredential: async (id: string): Promise<{ success: boolean }> => {
    await delay(300)
    const rec = loginCredentialsStore.find((c) => c.id === id)
    if (rec) {
      rec.lastSent = "Just now"
      rec.status = "Sent"
      return { success: true }
    }
    return { success: false }
  },
  bulkSendLoginCredentials: async (ids?: string[]): Promise<{ count: number }> => {
    await delay(500)
    let count = 0
    loginCredentialsStore.forEach((c) => {
      if (!ids || ids.includes(c.id)) {
        c.lastSent = "Just now"
        c.status = "Sent"
        count++
      }
    })
    return { count }
  },

  getCommunication: async () => {
    await delay(300)
    return {
      notices: [...noticeStore],
      announcements: [],
    }
  },

  // ---------------- Attendance Module ----------------
  getStudentAttendance: async (): Promise<StudentAttendanceResponse> => {
    await delay(250)
    return {
      records: [...studentAttendanceStore],
      stats: { ...studentAttendanceStats },
    }
  },
  createStudentAttendanceRecord: async (
    data: Omit<StudentAttendanceRecord, "id">,
  ): Promise<StudentAttendanceRecord> => {
    await delay(300)
    const record: StudentAttendanceRecord = {
      ...data,
      id: String(studentAttendanceStore.length + 1),
    }
    studentAttendanceStore.unshift(record)
    return record
  },
  updateStudentAttendanceRecord: async (
    id: string,
    data: Partial<StudentAttendanceRecord>,
  ): Promise<StudentAttendanceRecord> => {
    await delay(300)
    const idx = studentAttendanceStore.findIndex((r) => r.id === id)
    if (idx >= 0) {
      studentAttendanceStore[idx] = { ...studentAttendanceStore[idx], ...data }
      return studentAttendanceStore[idx]
    }
    throw new Error("Attendance record not found")
  },
  deleteStudentAttendanceRecord: async (id: string): Promise<{ success: boolean }> => {
    await delay(250)
    const idx = studentAttendanceStore.findIndex((r) => r.id === id)
    if (idx >= 0) studentAttendanceStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getStudentLeaveApprovals: async (): Promise<StudentLeaveApprovalRecord[]> => {
    await delay(250)
    return [...studentLeaveApprovalStore]
  },
  approveStudentLeave: async (id: string): Promise<{ success: boolean }> => {
    await delay(250)
    const rec = studentLeaveApprovalStore.find((r) => r.id === id)
    if (rec) {
      rec.status = "Approved"
      return { success: true }
    }
    return { success: false }
  },
  rejectStudentLeave: async (id: string): Promise<{ success: boolean }> => {
    await delay(250)
    const rec = studentLeaveApprovalStore.find((r) => r.id === id)
    if (rec) {
      rec.status = "Rejected"
      return { success: true }
    }
    return { success: false }
  },
  createStudentLeave: async (
    data: Omit<StudentLeaveApprovalRecord, "id">,
  ): Promise<StudentLeaveApprovalRecord> => {
    await delay(300)
    const record: StudentLeaveApprovalRecord = {
      ...data,
      id: nextId("LEV", studentLeaveApprovalStore, 3),
    }
    studentLeaveApprovalStore.unshift(record)
    return record
  },

  getAttendanceByDate: async (classId?: string, date?: string): Promise<AttendanceByDateRecord[]> => {
    await delay(250)
    return [...attendanceByDateStore]
  },
  saveAttendanceByDate: async (
    records: AttendanceByDateRecord[],
  ): Promise<{ success: boolean }> => {
    await delay(400)
    return { success: true }
  },

  getApproveLeaveRecords: async (): Promise<GenericRecordItem[]> => {
    await delay(250)
    return [...approveLeaveGenericStore]
  },
  createApproveLeaveRecord: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(approveLeaveGenericStore.length + 1) }
    approveLeaveGenericStore.push(record)
    return record
  },
  deleteApproveLeaveRecord: async (id: string): Promise<{ success: boolean }> => {
    await delay(250)
    const idx = approveLeaveGenericStore.findIndex((r) => r.id === id)
    if (idx >= 0) approveLeaveGenericStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getByDateRecords: async (): Promise<GenericRecordItem[]> => {
    await delay(250)
    return [...byDateGenericStore]
  },
  createByDateRecord: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(byDateGenericStore.length + 1) }
    byDateGenericStore.push(record)
    return record
  },
  deleteByDateRecord: async (id: string): Promise<{ success: boolean }> => {
    await delay(250)
    const idx = byDateGenericStore.findIndex((r) => r.id === id)
    if (idx >= 0) byDateGenericStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  // ---------------- Academics Module ----------------
  getClassTimetables: async (): Promise<GenericRecordItem[]> => {
    await delay(250)
    return [...classTimetableStore]
  },
  createClassTimetable: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(classTimetableStore.length + 1) }
    classTimetableStore.push(record)
    return record
  },
  deleteClassTimetable: async (id: string): Promise<{ success: boolean }> => {
    await delay(250)
    const idx = classTimetableStore.findIndex((r) => r.id === id)
    if (idx >= 0) classTimetableStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getTeachersTimetables: async (): Promise<GenericRecordItem[]> => {
    await delay(250)
    return [...teachersTimetableStore]
  },
  createTeachersTimetable: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(teachersTimetableStore.length + 1) }
    teachersTimetableStore.push(record)
    return record
  },
  deleteTeachersTimetable: async (id: string): Promise<{ success: boolean }> => {
    await delay(250)
    const idx = teachersTimetableStore.findIndex((r) => r.id === id)
    if (idx >= 0) teachersTimetableStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getAssignTeachers: async (): Promise<GenericRecordItem[]> => {
    await delay(250)
    return [...assignTeacherStore]
  },
  createAssignTeacher: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(assignTeacherStore.length + 1) }
    assignTeacherStore.push(record)
    return record
  },
  deleteAssignTeacher: async (id: string): Promise<{ success: boolean }> => {
    await delay(250)
    const idx = assignTeacherStore.findIndex((r) => r.id === id)
    if (idx >= 0) assignTeacherStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getPromoteStudents: async (): Promise<GenericRecordItem[]> => {
    await delay(250)
    return [...promoteStudentsStore]
  },
  createPromoteStudent: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(promoteStudentsStore.length + 1) }
    promoteStudentsStore.push(record)
    return record
  },
  deletePromoteStudent: async (id: string): Promise<{ success: boolean }> => {
    await delay(250)
    const idx = promoteStudentsStore.findIndex((r) => r.id === id)
    if (idx >= 0) promoteStudentsStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getSubjectGroups: async (): Promise<GenericRecordItem[]> => {
    await delay(250)
    return [...subjectGroupStore]
  },
  createSubjectGroup: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(subjectGroupStore.length + 1) }
    subjectGroupStore.push(record)
    return record
  },
  deleteSubjectGroup: async (id: string): Promise<{ success: boolean }> => {
    await delay(250)
    const idx = subjectGroupStore.findIndex((r) => r.id === id)
    if (idx >= 0) subjectGroupStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getSubjects: async (): Promise<AcademicSubjectRecord[]> => {
    await delay(250)
    return [...subjectsStore]
  },
  createSubject: async (
    data: Omit<AcademicSubjectRecord, "id">,
  ): Promise<AcademicSubjectRecord> => {
    await delay(300)
    const record: AcademicSubjectRecord = {
      ...data,
      id: nextId("SUB", subjectsStore, 3),
    }
    subjectsStore.push(record)
    return record
  },
  deleteSubject: async (id: string): Promise<{ success: boolean }> => {
    await delay(250)
    const idx = subjectsStore.findIndex((r) => r.id === id)
    if (idx >= 0) subjectsStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getClasses: async (): Promise<AcademicClassRecord[]> => {
    await delay(250)
    return [...classStore]
  },
  createClass: async (
    data: Omit<AcademicClassRecord, "id">,
  ): Promise<AcademicClassRecord> => {
    await delay(300)
    const record: AcademicClassRecord = {
      ...data,
      id: nextId("CLS", classStore, 3),
    }
    classStore.push(record)
    return record
  },
  deleteClass: async (id: string): Promise<{ success: boolean }> => {
    await delay(250)
    const idx = classStore.findIndex((r) => r.id === id)
    if (idx >= 0) classStore.splice(idx, 1)
    return { success: idx >= 0 }
  },

  getSections: async (): Promise<GenericRecordItem[]> => {
    await delay(250)
    return [...sectionsStore]
  },
  createSection: async (data: Omit<GenericRecordItem, "id">): Promise<GenericRecordItem> => {
    await delay(300)
    const record: GenericRecordItem = { ...data, id: String(sectionsStore.length + 1) }
    sectionsStore.push(record)
    return record
  },
  deleteSection: async (id: string): Promise<{ success: boolean }> => {
    await delay(250)
    const idx = sectionsStore.findIndex((r) => r.id === id)
    if (idx >= 0) sectionsStore.splice(idx, 1)
    return { success: idx >= 0 }
  },
}





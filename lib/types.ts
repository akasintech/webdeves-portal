export type UserRole = "student" | "instructor" | "admin" | "parent" | "superadmin"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  avatar?: string
  phone?: string
  createdAt: string
}

export interface Student extends User {
  role: "student"
  studentId: string
  enrollmentDate: string
  program: string
  cohort: string
  parentId?: string
}

export interface Instructor extends User {
  role: "instructor"
  instructorId: string
  department: string
  specialization: string[]
}

export interface Admin extends User {
  role: "admin"
  adminId: string
  permissions: string[]
}

export interface SuperAdmin extends User {
  role: "superadmin"
  adminId: string
  permissions: string[]
}

export interface Parent extends User {
  role: "parent"
  parentId: string
  studentIds: string[]
}

export interface SuperAdminDashboardData {
  stats: {
    students: {
      total: number
      active: number
      inactive: number
    }
    tutors: {
      total: number
      active: number
    }
    fees: {
      totalPaid: number
      studentsPaid: number
      totalStudents: number
      currency: string
    }
    debt: {
      totalDebt: number
      outstandingStudents: number
      currency: string
    }
  }
  metrics: {
    feesAwaitingPayment: { current: number; total: number }
    staffApprovedLeave: { current: number; total: number }
    studentApprovedLeave: { current: number; total: number }
    convertedLeads: { current: number; total: number }
    staffPresentToday: { current: number; total: number }
    studentPresentToday: { current: number; total: number }
  }
  feesOverview: {
    label: string
    count: number
    percentage: number
  }[]
  enquiryOverview: {
    label: string
    count: number
    percentage: number
  }[]
  staffTodayAttendance: {
    label: string
    count: number
    percentage: number
  }[]
  studentTodayAttendance: {
    label: string
    count: number
    percentage: number
  }[]
}

// ---- Superadmin module types (shape mirrors the expected backend responses) ----

export interface VisitorRecord {
  id: string
  name: string
  purpose: string
  meetWith: string
  idType: string
  timeIn: string
  timeOut: string
  /** ISO date (YYYY-MM-DD) */
  date: string
}

export type EnquiryStatus = "Active" | "Won" | "Passive" | "Lost" | "Dead"

export interface AdmissionEnquiry {
  id: string
  name: string
  phone: string
  source: string
  /** ISO dates (YYYY-MM-DD) */
  enquiryDate: string
  lastFollowUpDate: string | null
  nextFollowUpDate: string
  status: EnquiryStatus
}

export interface AdmissionEnquiryResponse {
  enquiries: AdmissionEnquiry[]
  stats: { total: number; newThisWeek: number; won: number; followUpDue: number }
}

export type ComplaintStatus = "Open" | "In-Progress" | "Resolved"

export interface ComplaintRecord {
  id: string
  complainant: string
  type: string
  subject: string
  /** ISO date (YYYY-MM-DD) */
  date: string
  assignedTo: string
  status: ComplaintStatus
}

export interface ComplaintResponse {
  complaints: ComplaintRecord[]
  stats: { open: number; inProgress: number; resolved: number }
}

export interface StudentRecord {
  id: string
  name: string
  /** ISO date (YYYY-MM-DD) */
  dob: string
  gender: "Male" | "Female"
  className: string
  rollNo: string
  parent: string
  phone: string
  category: string
  status: "active" | "inactive"
}

export interface StudentListResponse {
  students: StudentRecord[]
  stats: { total: number; active: number; inactive: number; newThisMonth: number }
  classes: string[]
}

export interface FeeReminderSettings {
  email: { sevenDaysBefore: boolean; onDueDate: boolean; threeDaysAfter: boolean }
  sms: { threeDaysBefore: boolean; onDueDate: boolean; overdue: boolean }
}

export interface StudentCategory {
  id: string
  name: string
  description: string
  totalStudents: number
}

export interface FeeGroup {
  id: string
  name: string
  includes: string[]
  totalAmount: number
  applicableClasses: string
  students: number
}

export type FeeFrequency = "Monthly" | "Per Exam" | "Termly" | "Yearly" | "One-time"

export interface FeeType {
  id: string
  name: string
  description: string
  amount: number
  frequency: FeeFrequency
}

export type FeeStatus = "Paid" | "Partial" | "Overdue" | "Pending"

export interface FeeRecord {
  /** Invoice id, e.g. FEE-2026-0841 */
  id: string
  /** Receipt number once any payment exists, otherwise null */
  receiptNo: string | null
  student: string
  className: string
  feeType: string
  amount: number
  paid: number
  balance: number
  /** ISO date (YYYY-MM-DD) */
  dueDate: string
  status: FeeStatus
}

export interface FeeRecordsResponse {
  records: FeeRecord[]
  stats: { totalCollected: number; pending: number; overdue: number; paidStudents: number }
}

export interface BranchOverviewRecord {
  id: string
  branch: string
  location: string
  principal: string
  students: number
  staff: number
  revenue: string
  status: "Active" | "Inactive"
}

export interface BranchOverviewResponse {
  branches: BranchOverviewRecord[]
  stats: {
    totalBranches: number
    totalStudents: number
    totalStaff: number
    monthlyRevenue: string
  }
}

export interface GenericRecordItem {
  id: string
  name: string
  details: string
  date: string
  status: "Active" | "Inactive"
}

export interface AcademicSubjectRecord {
  id: string
  name: string
  code: string
  type: "Core" | "Elective"
  classes: string
  teachersCount: number
}

export interface AcademicClassRecord {
  id: string
  name: string
  sectionsCount: number
  capacity: number
  enrolled: number
  classTeacher: string
}

export interface ExpenseOverviewRecord {
  id: string
  expenseHead: string
  amount: string
  date: string
  approvedBy: string
  category: string
  receipt: string
}

export interface ExpensesOverviewStats {
  totalExpenses: string
  staffSalaries: string
  operations: string
  miscellaneous: string
}

export interface ExpensesOverviewResponse {
  expenses: ExpenseOverviewRecord[]
  stats: ExpensesOverviewStats
}


export type OnlineCourseStatus = "Published" | "Draft"

export interface OnlineCourseItem {
  id: string
  name: string
  category: string
  instructor: string
  duration: string
  students: number
  status: OnlineCourseStatus
}

export interface OnlineCoursesResponse {
  courses: OnlineCourseItem[]
  stats: {
    totalCourses: number
    published: number
    draft: number
    enrolledStudents: number
  }
}

export interface MarksGradeRecord {
  id: string
  grade: string
  marksFrom: number
  marksTo: number
  gpa: number
  remarks: string
}

export interface ExamGroupRecord {
  id: string
  groupName: string
  session: string
  classes: string
  exams: number
  status: "Active" | "Upcoming" | "Completed"
}

export interface ExamScheduleRecord {
  id: string
  subject: string
  className: string
  examGroup: string
  date: string
  startTime: string
  endTime: string
  room: string
}

export interface ExamResultRecord {
  id: string
  student: string
  className: string
  examGroup: string
  totalMarks: number
  obtained: number
  percentage: string
  grade: string
  result: "Pass" | "Fail"
}

export interface LessonPlanRecord {
  id: string
  subject: string
  className: string
  teacher: string
  topic: string
  date: string
  status: "Approved" | "Pending" | "Rejected"
}

export interface Course {
  id: string
  name: string
  code: string
  description: string
  instructorId: string
  duration: string
  startDate: string
  endDate: string
  schedule: string
}

export interface Class {
  id: string
  courseId: string
  date: string
  time: string
  duration: number
  type: "live" | "recorded" | "hybrid"
  meetingLink?: string
  status: "scheduled" | "ongoing" | "completed" | "cancelled"
}

export interface Attendance {
  id: string
  studentId: string
  classId: string
  status: "present" | "absent" | "late" | "excused"
  markedAt: string
  markedBy: string
}

export interface Grade {
  id: string
  studentId: string
  courseId: string
  assignmentName: string
  score: number
  maxScore: number
  gradedAt: string
  gradedBy: string
}

export interface Payment {
  id: string
  studentId: string
  amount: number
  purpose: string
  status: "paid" | "pending" | "overdue"
  dueDate: string
  paidAt?: string
}

export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  enrolledAt: string
  status: "active" | "completed" | "dropped"
  progress: number
}

export interface StaffRecord {
  id: string
  name: string
  role: string
  initial: string
  initialColor?: string
  department: string
  email: string
  phone: string
  joined: string
  status: "active" | "inactive"
  type: "Teacher" | "Support Staff" | "Admin"
}

export interface StaffDirectoryResponse {
  staff: StaffRecord[]
  stats: {
    totalStaff: number
    active: number
    teachers: number
    supportStaff: number
  }
}

export interface PayrollRecord {
  id: string
  name: string
  role: string
  basicSalary: number
  allowances: number
  deductions: number
  netSalary: number
  status: "Processing" | "Paid" | "Pending"
}

export interface LeaveRequestRecord {
  id: string
  staffMember: string
  leaveType: string
  from: string
  to: string
  days: number
  reason: string
  status: "Pending" | "Approved" | "Rejected"
}

export interface TeacherRatingRecord {
  id: string
  name: string
  role: string
  initial: string
  initialColor?: string
  department: string
  rating: number
  reviewsCount: number
  status: "Active" | "Inactive"
}

export interface DepartmentCardRecord {
  id: string
  name: string
  head: string
  staffCount: number
  subjects: string[]
}

// ---------------- Communication Module Types ----------------

export type NoticeAudience = "All" | "Students" | "Parents" | "Staff"
export type NoticePriority = "High" | "Medium" | "Low"
export type NoticeStatus = "Published" | "Draft"

export interface NoticeRecord {
  id: string
  title: string
  audience: NoticeAudience
  date: string
  priority: NoticePriority
  status: NoticeStatus
  content?: string
}

export interface NoticeBoardResponse {
  notices: NoticeRecord[]
  stats: {
    totalNotices: number
    published: number
    drafts: number
    highPriority: number
  }
}

export interface CommunicationStats {
  emailsSent: string
  openRate: string
  smsSent: string
  deliveryRate: string
  totalRecipients: string
}

export interface SendEmailRequest {
  recipients: string
  subject: string
  message: string
  scheduleDate?: string
}

export interface SendSmsRequest {
  recipients: string
  message: string
  scheduleDate?: string
}

export interface CommunicationLogRecord {
  id: string
  type: "Email" | "SMS"
  subject: string
  recipients: string | number
  sentAt: string
  opens: string
  status: "Delivered" | "Partial" | "Failed"
}

export interface ScheduledBroadcastRecord {
  id: string
  type: "Email" | "SMS"
  title: string
  recipients: string
  scheduledFor: string
  status: "Scheduled" | "Processing" | "Cancelled"
}

export interface CommunicationTemplateRecord {
  id: string
  type: "Email" | "SMS"
  title: string
  subject?: string
  category?: string
  body: string
  variables: string[]
  lastUsed?: string
  updatedAt: string
}

export interface LoginCredentialRecord {
  id: string
  name: string
  userId: string
  role: "Student" | "Parent" | "Staff"
  email: string
  phone: string
  lastSent?: string
  status: "Sent" | "Pending" | "Failed"
}

// ---------------- Attendance Module Types ----------------

export interface StudentAttendanceRecord {
  id: string
  student: string
  class: string
  rollNo: string
  dateStatus: "Present" | "Absent" | "Late" | "Holiday" | "Half Day"
  monthlyPercent: string
  status: "Good" | "Warning" | "Critical"
}

export interface StudentAttendanceStats {
  presentToday: number
  absent: number
  late: number
  onLeave: number
}

export interface StudentAttendanceResponse {
  records: StudentAttendanceRecord[]
  stats: StudentAttendanceStats
}

export interface StudentLeaveApprovalRecord {
  id: string
  student: string
  class: string
  rollNo: string
  applyDate: string
  fromDate: string
  toDate: string
  reason: string
  status: "Pending" | "Approved" | "Rejected"
}

export interface AttendanceByDateRecord {
  id: string
  student: string
  class: string
  rollNo: string
  attendance: "Present" | "Absent" | "Late" | "Half Day"
  remark?: string
}

// ---------------- Income Module Types ----------------

export interface IncomeRecord {
  id: string
  incomeHead: string
  amount: string
  date: string
  paymentMode: string
  reference: string
  category: string
}

export interface IncomeStats {
  totalIncome: string
  feeCollection: string
  otherIncome: string
  vsLastMonth: string
}

export interface IncomeResponse {
  income: IncomeRecord[]
  stats: IncomeStats
}

// ---------------- Live Classes Module Types ----------------

export interface ZoomLiveClassRecord {
  id: string
  className: string
  subject: string
  teacher: string
  dateTime: string
  duration: string
  meetingId: string
  status: "Scheduled" | "Completed" | "Cancelled"
}

export interface GMeetLiveClassRecord {
  id: string
  className: string
  subject: string
  teacher: string
  dateTime: string
  duration: string
  meetLink: string
  status: "Scheduled" | "Completed" | "Cancelled"
}




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

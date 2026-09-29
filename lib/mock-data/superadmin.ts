import type { SuperAdminDashboardData } from "../types"

export const mockSuperAdminDashboard: SuperAdminDashboardData = {
  stats: {
    students: {
      total: 1245,
      active: 1198,
      inactive: 47,
    },
    tutors: {
      total: 35,
      active: 35,
    },
    fees: {
      totalPaid: 245000,
      studentsPaid: 287,
      totalStudents: 312,
      currency: "₹",
    },
    debt: {
      totalDebt: 27700,
      outstandingStudents: 25,
      currency: "₹",
    },
  },
  metrics: {
    feesAwaitingPayment: { current: 305, total: 312 },
    staffApprovedLeave: { current: 2, total: 14 },
    studentApprovedLeave: { current: 8, total: 23 },
    convertedLeads: { current: 19, total: 48 },
    staffPresentToday: { current: 98, total: 111 },
    studentPresentToday: { current: 1289, total: 1342 },
  },
  feesOverview: [
    { label: "UNPAID", count: 7, percentage: 2 },
    { label: "PARTIAL", count: 18, percentage: 6 },
    { label: "PAID", count: 287, percentage: 92 },
  ],
  enquiryOverview: [
    { label: "ACTIVE", count: 12, percentage: 25 },
    { label: "WON", count: 19, percentage: 40 },
    { label: "PASSIVE", count: 9, percentage: 19 },
    { label: "LOST", count: 6, percentage: 13 },
    { label: "DEAD", count: 2, percentage: 4 },
  ],
  staffTodayAttendance: [
    { label: "PRESENT", count: 98, percentage: 88 },
    { label: "LATE", count: 6, percentage: 5 },
    { label: "ABSENT", count: 5, percentage: 5 },
    { label: "HALF DAY", count: 2, percentage: 2 },
  ],
  studentTodayAttendance: [
    { label: "PRESENT", count: 1289, percentage: 96 },
    { label: "LATE", count: 22, percentage: 2 },
    { label: "ABSENT", count: 53, percentage: 4 },
    { label: "HALF DAY", count: 8, percentage: 1 },
  ],
}

// Module mock stubs for simulating the backend of other superadmin pages
export const mockFrontOfficeData = {
  enquiries: [
    { id: "ENQ001", name: "David Adeleke", phone: "+234 802 345 6789", source: "Website", status: "Active", date: "2026-08-01" },
    { id: "ENQ002", name: "Fatima Bello", phone: "+234 803 456 7890", source: "Walk-in", status: "Won", date: "2026-07-28" },
  ],
  visitorBook: [],
  phoneLogs: [],
  postalRecords: [],
}

export const mockFeeCollectionData = {
  recentTransactions: [
    { id: "TXN1001", studentName: "Edward Thomas", amount: 1200, mode: "Cash", date: "2026-08-01", status: "Success" },
    { id: "TXN1002", studentName: "Jane Smith", amount: 4500, mode: "Online", date: "2026-08-01", status: "Success" },
  ],
}

export const mockMultiBranchData = {
  branches: [
    { id: "BR01", name: "Main Campus (Lagos)", code: "LAG-01", address: "12 Innovation Way, Victoria Island", studentsCount: 840, staffCount: 75, status: "Active" },
    { id: "BR02", name: "Abuja Tech Hub", code: "ABJ-02", address: "44 Silicon Crescent, Maitama", studentsCount: 405, staffCount: 36, status: "Active" },
  ],
}

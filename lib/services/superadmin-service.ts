/**
 * Super Admin Service
 * 
 * Provides an abstraction layer between UI components and backend data.
 * Currently backed by `mockSuperAdminApi`. When ready to connect to real backend,
 * toggle `USE_MOCK` to false and configure the API endpoints.
 */

import { mockSuperAdminApi } from "@/lib/mock-api"
import type { SuperAdminDashboardData } from "@/lib/types"

const USE_MOCK = true
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/superadmin"

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

  /**
   * Live Classes module service
   */
  async getLiveClasses(platform: "zoom" | "gmeet") {
    if (USE_MOCK) return await mockSuperAdminApi.getLiveClasses(platform)
    const res = await fetch(`${API_BASE_URL}/live-classes?platform=${platform}`)
    return await res.json()
  },

  /**
   * Income module service
   */
  async getIncome() {
    if (USE_MOCK) return await mockSuperAdminApi.getIncome()
    const res = await fetch(`${API_BASE_URL}/income`)
    return await res.json()
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

  /**
   * Communication module service
   */
  async getCommunication() {
    if (USE_MOCK) return await mockSuperAdminApi.getCommunication()
    const res = await fetch(`${API_BASE_URL}/communication`)
    return await res.json()
  },
}

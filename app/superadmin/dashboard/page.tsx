"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Users,
  CreditCard,
  UserCheck,
  CalendarCheck,
  GraduationCap,
  Target,
  ArrowDownToLine,
  Check,
  X,
  Receipt,
  RotateCw,
} from "lucide-react"
import { superAdminService } from "@/lib/services/superadmin-service"
import type { SuperAdminDashboardData } from "@/lib/types"

export default function SuperAdminDashboardPage() {
  const [data, setData] = useState<SuperAdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [exportNotice, setExportNotice] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const result = await superAdminService.getDashboard()
        setData(result)
      } catch (error) {
        console.error("Failed to load SuperAdmin dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleExport = async () => {
    try {
      setExporting(true)
      const res = await superAdminService.exportReport()
      if (res.success) {
        setExportNotice("Report exported successfully!")
        setTimeout(() => setExportNotice(null), 3000)
      }
    } catch {
      setExportNotice("Failed to export report")
      setTimeout(() => setExportNotice(null), 3000)
    } finally {
      setExporting(false)
    }
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[450px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const { stats, metrics, feesOverview, enquiryOverview, staffTodayAttendance, studentTodayAttendance } = data

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Welcome back, Super Admin. Here&apos;s today&apos;s overview — Aug 1, 2026.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {exportNotice && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
              {exportNotice}
            </span>
          )}
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-[12.5px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
          >
            {exporting ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin text-gray-500" />
            ) : (
              <ArrowDownToLine className="w-3.5 h-3.5 text-gray-600" />
            )}
            Export Report
          </button>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Students */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:border-gray-200 transition-colors">
          <div className="flex items-start justify-between">
            <span className="text-[13px] font-medium text-gray-500">Students</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2 tracking-tight">
            {stats.students.total.toLocaleString()}
          </p>
          <div className="flex items-center gap-3 mt-3 text-[11.5px] font-medium">
            <span className="flex items-center gap-1 text-emerald-600">
              <Check className="w-3 h-3 stroke-[3]" />
              {stats.students.active.toLocaleString()} active
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <X className="w-3 h-3 stroke-[3]" />
              {stats.students.inactive} inactive
            </span>
          </div>
        </div>

        {/* Tutors */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:border-gray-200 transition-colors">
          <div className="flex items-start justify-between">
            <span className="text-[13px] font-medium text-gray-500">Tutors</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2 tracking-tight">
            {stats.tutors.total}
          </p>
          <div className="flex items-center gap-1 mt-3 text-[11.5px] font-medium text-emerald-600">
            <Check className="w-3 h-3 stroke-[3]" />
            {stats.tutors.active} active
          </div>
        </div>

        {/* Total Fees Paid */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:border-gray-200 transition-colors">
          <div className="flex items-start justify-between">
            <span className="text-[13px] font-medium text-gray-500">Total Fees Paid</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2 tracking-tight">
            {stats.fees.currency}
            {stats.fees.totalPaid.toLocaleString("en-IN")}
          </p>
          <p className="text-[11.5px] font-medium text-emerald-600 mt-3">
            {stats.fees.studentsPaid} of {stats.fees.totalStudents} students paid
          </p>
        </div>

        {/* Total Debt */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:border-gray-200 transition-colors">
          <div className="flex items-start justify-between">
            <span className="text-[13px] font-medium text-gray-500">Total Debt</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2 tracking-tight">
            {stats.debt.currency}
            {stats.debt.totalDebt.toLocaleString("en-IN")}
          </p>
          <p className="text-[11.5px] font-medium text-rose-500 mt-3">
            {stats.debt.outstandingStudents} students outstanding
          </p>
        </div>
      </div>

      {/* Progress Bars (6 cards arranged in 2 rows of 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fees Awaiting Payment */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <div className="flex items-center justify-between text-[13px] text-gray-700 mb-3">
            <div className="flex items-center gap-2 font-medium">
              <Receipt className="w-4 h-4 text-gray-400" />
              <span>Fees Awaiting Payment</span>
            </div>
            <span className="font-bold text-gray-900">
              {metrics.feesAwaitingPayment.current}/{metrics.feesAwaitingPayment.total}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{
                width: `${(metrics.feesAwaitingPayment.current / metrics.feesAwaitingPayment.total) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Staff Approved Leave */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <div className="flex items-center justify-between text-[13px] text-gray-700 mb-3">
            <div className="flex items-center gap-2 font-medium">
              <UserCheck className="w-4 h-4 text-gray-400" />
              <span>Staff Approved Leave</span>
            </div>
            <span className="font-bold text-gray-900">
              {metrics.staffApprovedLeave.current}/{metrics.staffApprovedLeave.total}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{
                width: `${(metrics.staffApprovedLeave.current / metrics.staffApprovedLeave.total) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Student Approved Leave */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <div className="flex items-center justify-between text-[13px] text-gray-700 mb-3">
            <div className="flex items-center gap-2 font-medium">
              <UserCheck className="w-4 h-4 text-gray-400" />
              <span>Student Approved Leave</span>
            </div>
            <span className="font-bold text-gray-900">
              {metrics.studentApprovedLeave.current}/{metrics.studentApprovedLeave.total}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{
                width: `${(metrics.studentApprovedLeave.current / metrics.studentApprovedLeave.total) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Converted Leads */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <div className="flex items-center justify-between text-[13px] text-gray-700 mb-3">
            <div className="flex items-center gap-2 font-medium">
              <Target className="w-4 h-4 text-gray-400" />
              <span>Converted Leads</span>
            </div>
            <span className="font-bold text-gray-900">
              {metrics.convertedLeads.current}/{metrics.convertedLeads.total}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{
                width: `${(metrics.convertedLeads.current / metrics.convertedLeads.total) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Staff Present Today */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <div className="flex items-center justify-between text-[13px] text-gray-700 mb-3">
            <div className="flex items-center gap-2 font-medium">
              <CalendarCheck className="w-4 h-4 text-gray-400" />
              <span>Staff Present Today</span>
            </div>
            <span className="font-bold text-gray-900">
              {metrics.staffPresentToday.current}/{metrics.staffPresentToday.total}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{
                width: `${(metrics.staffPresentToday.current / metrics.staffPresentToday.total) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Student Present Today */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <div className="flex items-center justify-between text-[13px] text-gray-700 mb-3">
            <div className="flex items-center gap-2 font-medium">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              <span>Student Present Today</span>
            </div>
            <span className="font-bold text-gray-900">
              {metrics.studentPresentToday.current.toLocaleString()}/
              {metrics.studentPresentToday.total.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{
                width: `${(metrics.studentPresentToday.current / metrics.studentPresentToday.total) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 4 Overview Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fees Overview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
          <h2 className="text-[13.5px] font-semibold text-gray-800 mb-4">Fees Overview</h2>
          <div className="space-y-3">
            {feesOverview.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-[12.5px]">
                <span className="font-bold text-gray-800">
                  {item.count} {item.label}
                </span>
                <span className="text-gray-400 font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiry Overview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
          <h2 className="text-[13.5px] font-semibold text-gray-800 mb-4">Enquiry Overview</h2>
          <div className="space-y-2.5">
            {enquiryOverview.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-[12.5px]">
                <span className="font-bold text-gray-800">
                  {item.count} {item.label}
                </span>
                <span className="text-gray-400 font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Today Attendance */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-[13.5px] font-semibold text-gray-800 mb-2">Staff Today Attendance</h2>
            <div className="w-full bg-blue-600 h-0.5 rounded-full mb-4" />
          </div>
          <div className="space-y-2.5">
            {staffTodayAttendance.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-[12.5px]">
                <span className="font-bold text-gray-800">
                  {item.count} {item.label}
                </span>
                <span className="text-gray-400 font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Today Attendance */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-[13.5px] font-semibold text-gray-800 mb-2">Student Today Attendance</h2>
            <div className="w-full bg-blue-600 h-0.5 rounded-full mb-4" />
          </div>
          <div className="space-y-2.5">
            {studentTodayAttendance.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-[12.5px]">
                <span className="font-bold text-gray-800">
                  {item.count.toLocaleString()} {item.label}
                </span>
                <span className="text-gray-400 font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Bottom Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
        <Link
          href="/superadmin/fee-collection"
          className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-100 rounded-xl text-[13px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-colors shadow-xs"
        >
          <CreditCard className="w-4 h-4 text-gray-500" />
          Collect Fee
        </Link>
        <Link
          href="/superadmin/student-info"
          className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-100 rounded-xl text-[13px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-colors shadow-xs"
        >
          <GraduationCap className="w-4 h-4 text-gray-500" />
          Add Student
        </Link>
        <Link
          href="/superadmin/attendance"
          className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-100 rounded-xl text-[13px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-colors shadow-xs"
        >
          <CalendarCheck className="w-4 h-4 text-gray-500" />
          Mark Attendance
        </Link>
        <Link
          href="/superadmin/human-resource"
          className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-100 rounded-xl text-[13px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-colors shadow-xs"
        >
          <Users className="w-4 h-4 text-gray-500" />
          Staff Directory
        </Link>
      </div>
    </div>
  )
}

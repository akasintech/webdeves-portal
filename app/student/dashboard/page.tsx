"use client"

import { useEffect, useState } from "react"
import { authUtils } from "@/lib/auth"
import { mockStudentApi } from "@/lib/mock-api"
import type { Student, Payment } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckSquare, X } from "lucide-react"

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null)
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAttendanceAlert, setShowAttendanceAlert] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const user = authUtils.getUser() as Student
      if (!user) return

      setStudent(user)

      try {
        const [classesData, paymentsData] = await Promise.all([
          mockStudentApi.getUpcomingClasses(user.id),
          mockStudentApi.getPayments(user.id),
        ])

        setUpcomingClasses(classesData)
        setPayments(paymentsData)
      } catch (error) {
        console.error("[v0] Failed to load student data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleTakeAttendance = async () => {
    // Mock attendance marking
    await mockStudentApi.markAttendance("CLS001", student?.id || "")
    setShowAttendanceAlert(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const paidAmount = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
  const remainingAmount = totalAmount - paidAmount

  return (
    <div className="space-y-6">
      {/* Attendance Alert */}
      {showAttendanceAlert && (
        <Card className="border-none bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Take your attendance!</h3>
              <p className="text-sm text-gray-600">Click the button to take your attendance today</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleTakeAttendance} className="bg-indigo-600 hover:bg-indigo-700">
                <CheckSquare className="w-4 h-4 mr-2" />
                Take attendance
              </Button>
              <button onClick={() => setShowAttendanceAlert(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Classes Card */}
        <Card className="overflow-hidden">
          <div className="aspect-video relative">
            <img src="/images/banner.png" alt="Upcoming classes" className="w-full h-full object-cover" />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Upcoming classes</h3>
            {upcomingClasses.length === 0 ? (
              <p className="text-sm text-gray-600">You do not have any upcoming classes yet.</p>
            ) : (
              <div className="space-y-2">
                {upcomingClasses.slice(0, 2).map((cls) => (
                  <div key={cls.id} className="text-sm">
                    <p className="font-medium">{cls.course?.name}</p>
                    <p className="text-gray-600">
                      {cls.date} at {cls.time}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Outline Card */}
        <Card className="overflow-hidden">
          <div className="aspect-video relative bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-50 flex items-center justify-center">
            <div className="relative">
              <div className="w-32 h-20 bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="w-0 h-0 border-l-[16px] border-l-transparent border-t-[24px] border-t-orange-500 border-r-[16px] border-r-transparent" />
              </div>
              <div className="absolute -right-4 -bottom-2">
                <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 3v18l8-6H7z" />
                </svg>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Course outline</h3>
            <p className="text-sm text-gray-600">Click to view your lesson outline & progress</p>
          </CardContent>
        </Card>

        {/* Payment Summary Card */}
        <Card className="overflow-hidden">
          <div className="aspect-video relative bg-gradient-to-br from-pink-200 to-pink-100 flex items-center justify-center p-4">
            <div className="relative w-full">
              <div className="bg-white rounded-lg px-3 py-2 mb-2 text-center">
                <p className="text-xs font-medium">PAY</p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs">
                    <p className="font-mono">1234 5678 1234 5678</p>
                    <p className="mt-1">my name</p>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded-full bg-white/30" />
                    <div className="w-6 h-6 rounded-full bg-white/30" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-white rounded p-2">
                <div className="w-16 h-16 grid grid-cols-3 gap-1">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-black rounded-sm" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Payment summary</h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-gray-600">Paid:</span>{" "}
                <span className="font-medium">₦{paidAmount.toLocaleString()}</span>
              </p>
              <p>
                <span className="text-gray-600">Balance:</span>{" "}
                <span className="font-medium text-red-600">₦{remainingAmount.toLocaleString()}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

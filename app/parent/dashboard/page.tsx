"use client"

import { useEffect, useState } from "react"
import { authUtils } from "@/lib/auth"
import { mockParentApi } from "@/lib/mock-api"
import type { Parent } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, TrendingUp, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"

export default function ParentDashboard() {
  const [parent, setParent] = useState<Parent | null>(null)
  const [children, setChildren] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const user = authUtils.getUser() as Parent
      if (!user) return

      setParent(user)

      try {
        const childrenData = await mockParentApi.getChildren(user.id)
        setChildren(childrenData)
      } catch (error) {
        console.error("[v0] Failed to load parent data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {parent?.firstName}!</h2>
          <p className="text-gray-600">Monitor your children's academic progress and activities</p>
        </div>
      </div>

      {/* Children Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child) => (
          <Card key={child.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-100 pb-12">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {child.firstName[0]}
                  {child.lastName[0]}
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {child.firstName} {child.lastName}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{child.program}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Current Cohort</p>
                  <p className="font-medium">{child.cohort}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Overall Progress</p>
                  <p className="font-medium">35% Complete</p>
                </div>
              </div>

              <Link href={`/parent/children/${child.id}`}>
                <Button className="w-full mt-4">View Full Report</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats for First Child */}
      {children.length > 0 && (
        <>
          <h3 className="text-xl font-bold mt-8">{children[0].firstName}'s Performance Overview</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">92%</p>
                    <p className="text-sm text-gray-600">Attendance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">88.5</p>
                    <p className="text-sm text-gray-600">Avg. Grade</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-gray-600">Active Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₦70k</p>
                    <p className="text-sm text-gray-600">Balance Due</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium">Assignment Submitted</p>
                <p className="text-xs text-gray-500">
                  {children[0]?.firstName} submitted "CSS Styling Project" - Grade: 92/100
                </p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium">Class Attended</p>
                <p className="text-xs text-gray-500">
                  {children[0]?.firstName} attended "Introduction to Web Development" class
                </p>
                <p className="text-xs text-gray-400 mt-1">Yesterday at 10:00 AM</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium">Payment Reminder</p>
                <p className="text-xs text-gray-500">Balance payment of ₦70,000 is due on March 15, 2024</p>
                <p className="text-xs text-gray-400 mt-1">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

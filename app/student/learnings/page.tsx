"use client"

import { useEffect, useState } from "react"
import { authUtils } from "@/lib/auth"
import { mockStudentApi } from "@/lib/mock-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export default function LearningsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEnrollments = async () => {
      const user = authUtils.getUser()
      if (!user) return

      try {
        const data = await mockStudentApi.getEnrollments(user.id)
        setEnrollments(data)
      } catch (error) {
        console.error("[v0] Failed to load enrollments:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEnrollments()
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
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{enrollment.course?.name}</h3>
                    <p className="text-sm text-gray-600">{enrollment.course?.code}</p>
                    <p className="text-xs text-gray-500 mt-1">{enrollment.course?.schedule}</p>
                  </div>
                  <Button size="sm">Continue Learning</Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{enrollment.progress}%</span>
                  </div>
                  <Progress value={enrollment.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

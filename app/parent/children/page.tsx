"use client"

import { useEffect, useState } from "react"
import { authUtils } from "@/lib/auth"
import { mockParentApi } from "@/lib/mock-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function ChildrenPage() {
  const [children, setChildren] = useState<any[]>([])
  const [selectedChild, setSelectedChild] = useState<any>(null)
  const [childProgress, setChildProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChildren = async () => {
      const user = authUtils.getUser()
      if (!user) return

      try {
        const childrenData = await mockParentApi.getChildren(user.id)
        setChildren(childrenData)

        if (childrenData.length > 0) {
          setSelectedChild(childrenData[0])
          const progressData = await mockParentApi.getChildProgress(childrenData[0].id)
          setChildProgress(progressData)
        }
      } catch (error) {
        console.error("[v0] Failed to load children:", error)
      } finally {
        setLoading(false)
      }
    }

    loadChildren()
  }, [])

  const handleSelectChild = async (child: any) => {
    setSelectedChild(child)
    const progressData = await mockParentApi.getChildProgress(child.id)
    setChildProgress(progressData)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Children</h2>

      {/* Children Selector */}
      {children.length > 1 && (
        <div className="flex gap-4">
          {children.map((child) => (
            <Card
              key={child.id}
              className={`cursor-pointer transition-all ${selectedChild?.id === child.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => handleSelectChild(child)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                  {child.firstName[0]}
                  {child.lastName[0]}
                </div>
                <div>
                  <p className="font-medium">
                    {child.firstName} {child.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{child.program}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Child Details */}
      {selectedChild && childProgress && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedChild.firstName} {selectedChild.lastName} - Academic Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="grades">Grades</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Student Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">Student ID:</span>{" "}
                        <span className="font-medium">{selectedChild.studentId}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Program:</span>{" "}
                        <span className="font-medium">{selectedChild.program}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Cohort:</span>{" "}
                        <span className="font-medium">{selectedChild.cohort}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Enrollment Date:</span>{" "}
                        <span className="font-medium">{selectedChild.enrollmentDate}</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">Email:</span>{" "}
                        <span className="font-medium">{selectedChild.email}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Phone:</span>{" "}
                        <span className="font-medium">{selectedChild.phone}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="courses" className="space-y-4">
                {childProgress.enrollments.map((enrollment: any) => (
                  <div key={enrollment.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{enrollment.course?.name}</h4>
                        <p className="text-sm text-gray-600">{enrollment.course?.code}</p>
                        <Badge variant="secondary" className="mt-2">
                          {enrollment.status}
                        </Badge>
                      </div>
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
              </TabsContent>

              <TabsContent value="attendance" className="space-y-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Overall Attendance Rate</p>
                    <p className="text-2xl font-bold text-green-600">92%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {childProgress.attendance.map((record: any) => (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Class Session</p>
                        <p className="text-sm text-gray-600">{record.markedAt.split("T")[0]}</p>
                      </div>
                      <Badge
                        variant={record.status === "present" ? "default" : "destructive"}
                        className={
                          record.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="grades" className="space-y-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Average Grade</p>
                    <p className="text-2xl font-bold text-blue-600">88.5%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {childProgress.grades.map((grade: any) => (
                    <div key={grade.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{grade.assignmentName}</h4>
                          <p className="text-sm text-gray-600 mt-1">Graded on: {grade.gradedAt.split("T")[0]}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {grade.score}/{grade.maxScore}
                          </p>
                          <p className="text-sm text-gray-600">{((grade.score / grade.maxScore) * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

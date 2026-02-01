"use client"

import { useEffect, useState } from "react"
import { authUtils } from "@/lib/auth"
import { mockInstructorApi } from "@/lib/mock-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      const user = authUtils.getUser()
      if (!user) return

      try {
        const coursesData = await mockInstructorApi.getCourses(user.id)
        setCourses(coursesData)
        if (coursesData.length > 0) {
          setSelectedCourse(coursesData[0])
          const studentsData = await mockInstructorApi.getStudents(coursesData[0].id)
          setStudents(studentsData)
        }
      } catch (error) {
        console.error("[v0] Failed to load courses:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  const handleSelectCourse = async (course: any) => {
    setSelectedCourse(course)
    const studentsData = await mockInstructorApi.getStudents(course.id)
    setStudents(studentsData)
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Button>Create New Course</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course List */}
        <div className="space-y-4">
          {courses.map((course) => (
            <Card
              key={course.id}
              className={`cursor-pointer transition-all ${
                selectedCourse?.id === course.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleSelectCourse(course)}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold">{course.name}</h3>
                <p className="text-sm text-gray-600">{course.code}</p>
                <p className="text-xs text-gray-500 mt-2">{course.duration}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Course Details */}
        {selectedCourse && (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{selectedCourse.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="students">Students</TabsTrigger>
                    <TabsTrigger value="assignments">Assignments</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-gray-600">{selectedCourse.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Schedule</h4>
                      <p className="text-gray-600">{selectedCourse.schedule}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Start Date</h4>
                        <p className="text-gray-600">{selectedCourse.startDate}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">End Date</h4>
                        <p className="text-gray-600">{selectedCourse.endDate}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="students" className="space-y-4">
                    <div className="space-y-4">
                      {students.map((student: any) => (
                        <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                              {student.firstName[0]}
                              {student.lastName[0]}
                            </div>
                            <div>
                              <p className="font-medium">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-sm text-gray-600">{student.email}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="assignments">
                    <p className="text-center text-gray-600 py-8">No assignments yet</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { authUtils } from "@/lib/auth"
import { mockInstructorApi } from "@/lib/mock-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function StudentsPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [allStudents, setAllStudents] = useState<any[]>([])
  const [filteredStudents, setFilteredStudents] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStudents = async () => {
      const user = authUtils.getUser()
      if (!user) return

      try {
        const coursesData = await mockInstructorApi.getCourses(user.id)
        setCourses(coursesData)

        // Load students from all courses
        const studentsPromises = coursesData.map((course) => mockInstructorApi.getStudents(course.id))
        const studentsArrays = await Promise.all(studentsPromises)
        const students = studentsArrays.flat()

        // Remove duplicates
        const uniqueStudents = students.filter(
          (student, index, self) => index === self.findIndex((s) => s.id === student.id),
        )

        setAllStudents(uniqueStudents)
        setFilteredStudents(uniqueStudents)
      } catch (error) {
        console.error("[v0] Failed to load students:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(allStudents)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = allStudents.filter(
        (student) =>
          student.firstName.toLowerCase().includes(query) ||
          student.lastName.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query),
      )
      setFilteredStudents(filtered)
    }
  }, [searchQuery, allStudents])

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
        <h2 className="text-2xl font-bold">Students</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student: any) => (
              <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </div>
                  <div>
                    <p className="font-medium">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{student.email}</p>
                    <p className="text-xs text-gray-500 mt-1">{student.program}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm">Grade</Button>
                </div>
              </div>
            ))}

            {filteredStudents.length === 0 && <p className="text-center text-gray-600 py-8">No students found</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

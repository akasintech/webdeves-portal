"use client"

import { useEffect, useState } from "react"
import { mockAdminApi } from "@/lib/mock-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, BookPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [filteredCourses, setFilteredCourses] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await mockAdminApi.getAllCourses()
        setCourses(coursesData)
        setFilteredCourses(coursesData)
      } catch (error) {
        console.error("[v0] Failed to load courses:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = courses.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.code.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query),
      )
      setFilteredCourses(filtered)
    }
  }, [searchQuery, courses])

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
        <h2 className="text-2xl font-bold">Courses Management</h2>
        <Button className="gap-2">
          <BookPlus className="w-4 h-4" />
          Create Course
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Courses ({filteredCourses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCourses.map((course) => (
              <div key={course.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{course.name}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {course.code}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-gray-600">
                      Instructor:{" "}
                      <span className="font-medium">
                        {course.instructor?.firstName} {course.instructor?.lastName}
                      </span>
                    </p>
                    <p className="text-gray-600 mt-1">Duration: {course.duration}</p>
                  </div>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

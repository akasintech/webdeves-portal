"use client"

import { useEffect, useState } from "react"
import { mockAdminApi } from "@/lib/mock-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<any[]>([])
  const [filteredInstructors, setFilteredInstructors] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const instructorsData = await mockAdminApi.getAllInstructors()
        setInstructors(instructorsData)
        setFilteredInstructors(instructorsData)
      } catch (error) {
        console.error("[v0] Failed to load instructors:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInstructors()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredInstructors(instructors)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = instructors.filter(
        (instructor) =>
          instructor.firstName.toLowerCase().includes(query) ||
          instructor.lastName.toLowerCase().includes(query) ||
          instructor.email.toLowerCase().includes(query) ||
          instructor.department.toLowerCase().includes(query),
      )
      setFilteredInstructors(filtered)
    }
  }, [searchQuery, instructors])

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
        <h2 className="text-2xl font-bold">Instructors Management</h2>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add Instructor
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search instructors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Instructors ({filteredInstructors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredInstructors.map((instructor) => (
              <div
                key={instructor.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                    {instructor.firstName[0]}
                    {instructor.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {instructor.firstName} {instructor.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{instructor.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {instructor.department}
                      </Badge>
                      {instructor.specialization.slice(0, 2).map((spec: string) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

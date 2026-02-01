import type { Enrollment } from "../types"

export const mockEnrollments: Enrollment[] = [
  {
    id: "ENR001",
    studentId: "STU001",
    courseId: "CRS001",
    enrolledAt: "2024-01-15T10:00:00Z",
    status: "active",
    progress: 35,
  },
  {
    id: "ENR002",
    studentId: "STU002",
    courseId: "CRS003",
    enrolledAt: "2024-01-15T10:00:00Z",
    status: "active",
    progress: 28,
  },
]

import type { Grade } from "../types"

export const mockGrades: Grade[] = [
  {
    id: "GRD001",
    studentId: "STU001",
    courseId: "CRS001",
    assignmentName: "HTML Basics Assignment",
    score: 85,
    maxScore: 100,
    gradedAt: "2024-01-20T14:30:00Z",
    gradedBy: "INS001",
  },
  {
    id: "GRD002",
    studentId: "STU001",
    courseId: "CRS001",
    assignmentName: "CSS Styling Project",
    score: 92,
    maxScore: 100,
    gradedAt: "2024-01-25T16:00:00Z",
    gradedBy: "INS001",
  },
]

import type { Attendance } from "../types"

export const mockAttendance: Attendance[] = [
  {
    id: "ATT001",
    studentId: "STU001",
    classId: "CLS001",
    status: "present",
    markedAt: "2024-01-17T10:05:00Z",
    markedBy: "INS001",
  },
  {
    id: "ATT002",
    studentId: "STU002",
    classId: "CLS001",
    status: "absent",
    markedAt: "2024-01-17T10:05:00Z",
    markedBy: "INS001",
  },
]

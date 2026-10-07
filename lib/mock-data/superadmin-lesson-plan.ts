import type { GenericRecordItem, LessonPlanRecord } from "../types"

// In-memory mock store for Lesson Plan module

export const lessonPlanStore: LessonPlanRecord[] = [
  {
    id: "LP-001",
    subject: "Mathematics",
    className: "Grade 10-A",
    teacher: "Dr. Amara Singh",
    topic: "Quadratic Equations",
    date: "Aug 3, 2026",
    status: "Approved",
  },
  {
    id: "LP-002",
    subject: "Physics",
    className: "Grade 11-B",
    teacher: "Mrs. Nadia Al-Farsi",
    topic: "Newton's Laws of Motion",
    date: "Aug 4, 2026",
    status: "Pending",
  },
  {
    id: "LP-003",
    subject: "English",
    className: "Grade 9-C",
    teacher: "Ms. Claire Fontaine",
    topic: "Essay Writing Techniques",
    date: "Aug 4, 2026",
    status: "Approved",
  },
]

export const syllabusStatusStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const lessonListStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const topicListStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const copyOldLessonsStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

import type {
  ExamGroupRecord,
  ExamResultRecord,
  ExamScheduleRecord,
  GenericRecordItem,
  MarksGradeRecord,
} from "../types"

// In-memory mock store for Examination module

export const marksGradeStore: MarksGradeRecord[] = [
  { id: "GRD-001", grade: "A+", marksFrom: 90, marksTo: 100, gpa: 4.0, remarks: "Outstanding" },
  { id: "GRD-002", grade: "A", marksFrom: 80, marksTo: 89, gpa: 3.7, remarks: "Excellent" },
  { id: "GRD-003", grade: "B+", marksFrom: 70, marksTo: 79, gpa: 3.3, remarks: "Very Good" },
  { id: "GRD-004", grade: "B", marksFrom: 60, marksTo: 69, gpa: 3.0, remarks: "Good" },
  { id: "GRD-005", grade: "C", marksFrom: 50, marksTo: 59, gpa: 2.0, remarks: "Average" },
  { id: "GRD-006", grade: "F", marksFrom: 0, marksTo: 49, gpa: 0.0, remarks: "Fail" },
]

export const examGroupStore: ExamGroupRecord[] = [
  { id: "GRP-001", groupName: "Mid-Term 2026", session: "2025-26", classes: "All", exams: 8, status: "Active" },
  { id: "GRP-002", groupName: "Final Term 2026", session: "2025-26", classes: "All", exams: 10, status: "Upcoming" },
  { id: "GRP-003", groupName: "Unit Test 1", session: "2025-26", classes: "Grade 9–12", exams: 5, status: "Completed" },
]

export const examScheduleStore: ExamScheduleRecord[] = [
  {
    id: "SCH-001",
    subject: "Mathematics",
    className: "Grade 10",
    examGroup: "Mid-Term 2026",
    date: "Aug 18, 2026",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    room: "Hall A",
  },
  {
    id: "SCH-002",
    subject: "Physics",
    className: "Grade 11",
    examGroup: "Mid-Term 2026",
    date: "Aug 19, 2026",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    room: "Hall B",
  },
  {
    id: "SCH-003",
    subject: "English",
    className: "Grade 9",
    examGroup: "Mid-Term 2026",
    date: "Aug 20, 2026",
    startTime: "01:00 PM",
    endTime: "03:00 PM",
    room: "Hall A",
  },
]

export const examResultStore: ExamResultRecord[] = [
  {
    id: "RES-001",
    student: "Priya Krishnamurthy",
    className: "Grade 10-A",
    examGroup: "Mid-Term 2026",
    totalMarks: 500,
    obtained: 462,
    percentage: "92.4%",
    grade: "A+",
    result: "Pass",
  },
  {
    id: "RES-002",
    student: "Lucas Ferreira",
    className: "Grade 8-B",
    examGroup: "Mid-Term 2026",
    totalMarks: 500,
    obtained: 389,
    percentage: "77.8%",
    grade: "B+",
    result: "Pass",
  },
  {
    id: "RES-003",
    student: "Aisha Ndiaye",
    className: "Grade 11-C",
    examGroup: "Mid-Term 2026",
    totalMarks: 500,
    obtained: 441,
    percentage: "88.2%",
    grade: "A",
    result: "Pass",
  },
]

export const marksDivisionStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const designAdmitCardStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const printAdmitCardStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const designMarksheetStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const printMarksheetStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

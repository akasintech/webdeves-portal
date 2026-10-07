import type { AcademicClassRecord, AcademicSubjectRecord, GenericRecordItem } from "../types"

// In-memory mock store for Academics module

export const classTimetableStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const teachersTimetableStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const assignTeacherStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const promoteStudentsStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const subjectGroupStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const subjectsStore: AcademicSubjectRecord[] = [
  { id: "SUB-001", name: "Mathematics", code: "MATH-01", type: "Core", classes: "Grade 7-12", teachersCount: 4 },
  { id: "SUB-002", name: "English Language", code: "ENG-01", type: "Core", classes: "Grade 7-12", teachersCount: 3 },
  { id: "SUB-003", name: "Physics", code: "PHY-01", type: "Core", classes: "Grade 9-12", teachersCount: 2 },
  { id: "SUB-004", name: "Chemistry", code: "CHEM-01", type: "Core", classes: "Grade 9-12", teachersCount: 2 },
  { id: "SUB-005", name: "Biology", code: "BIO-01", type: "Core", classes: "Grade 9-12", teachersCount: 2 },
  { id: "SUB-006", name: "History", code: "HIST-01", type: "Core", classes: "Grade 7-12", teachersCount: 2 },
  { id: "SUB-007", name: "Physical Education", code: "PE-01", type: "Elective", classes: "All", teachersCount: 1 },
]

export const classStore: AcademicClassRecord[] = [
  { id: "CLS-001", name: "Grade 7", sectionsCount: 2, capacity: 120, enrolled: 98, classTeacher: "Ms. Claire Fontaine" },
  { id: "CLS-002", name: "Grade 8", sectionsCount: 3, capacity: 120, enrolled: 112, classTeacher: "Mr. Emmanuel Obi" },
  { id: "CLS-003", name: "Grade 9", sectionsCount: 4, capacity: 160, enrolled: 155, classTeacher: "Dr. Amara Singh" },
  { id: "CLS-004", name: "Grade 10", sectionsCount: 4, capacity: 160, enrolled: 148, classTeacher: "Mrs. Nadia Al-Farsi" },
  { id: "CLS-005", name: "Grade 11", sectionsCount: 3, capacity: 120, enrolled: 118, classTeacher: "Ms. Yuki Tanaka" },
  { id: "CLS-006", name: "Grade 12", sectionsCount: 3, capacity: 120, enrolled: 109, classTeacher: "Mr. Tomás Rivera" },
]


export const sectionsStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

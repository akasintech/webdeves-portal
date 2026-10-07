import type {
  BranchOverviewRecord,
  GenericRecordItem,
  OnlineCourseItem,
} from "../types"

// In-memory mock stores for Multi-Branch and Online Course modules
// These simulate database tables and can be replaced with real backend API calls.

export const branchOverviewStore: BranchOverviewRecord[] = [
  {
    id: "BR-001",
    branch: "Main Campus",
    location: "45 School Ave, Downtown",
    principal: "Dr. Margaret Collins",
    students: 842,
    staff: 64,
    revenue: "$98,400",
    status: "Active",
  },
  {
    id: "BR-002",
    branch: "North Wing",
    location: "12 Oak Street, Northside",
    principal: "Mr. James Osei",
    students: 310,
    staff: 28,
    revenue: "$41,200",
    status: "Active",
  },
  {
    id: "BR-003",
    branch: "East Annex",
    location: "78 Pine Road, Eastgate",
    principal: "Ms. Fatima Malik",
    students: 190,
    staff: 19,
    revenue: "$25,800",
    status: "Active",
  },
]

export const branchServerStats = {
  totalBranches: 3,
  totalStudents: 1342,
  totalStaff: 111,
  monthlyRevenue: "$185k",
}

export const onlineCoursesStore: OnlineCourseItem[] = [
  {
    id: "CRS-001",
    name: "Advanced Mathematics",
    category: "Academic",
    instructor: "Dr. Amara Singh",
    duration: "48 hrs",
    students: 124,
    status: "Published",
  },
  {
    id: "CRS-002",
    name: "English Literature",
    category: "Academic",
    instructor: "Ms. Claire Fontaine",
    duration: "36 hrs",
    students: 98,
    status: "Published",
  },
  {
    id: "CRS-003",
    name: "Creative Art & Design",
    category: "Elective",
    instructor: "Ms. Yuki Tanaka",
    duration: "24 hrs",
    students: 67,
    status: "Published",
  },
  {
    id: "CRS-004",
    name: "Sports Science",
    category: "Elective",
    instructor: "Mr. Emmanuel Obi",
    duration: "20 hrs",
    students: 45,
    status: "Draft",
  },
]

export const onlineCoursesServerStats = {
  totalCourses: 48,
  published: 42,
  draft: 6,
  enrolledStudents: 1089,
}

export const courseCategoriesStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const certificateTemplatesStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const courseReportsStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const courseSettingsStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const branchReportsStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const branchSettingsStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

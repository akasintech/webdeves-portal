import type { Student, Instructor, Admin, Parent } from "../types"

// Mock Students
export const mockStudents: Student[] = [
  {
    id: "STU001",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "student",
    studentId: "WDA-2024-001",
    enrollmentDate: "2024-01-15",
    program: "Web Development",
    cohort: "Cohort 2024-A",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+234-801-234-5678",
    parentId: "PAR001",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "STU002",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "student",
    studentId: "WDA-2024-002",
    enrollmentDate: "2024-01-15",
    program: "Cybersecurity",
    cohort: "Cohort 2024-A",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+234-801-234-5679",
    createdAt: "2024-01-15T10:00:00Z",
  },
]

// Mock Instructors
export const mockInstructors: Instructor[] = [
  {
    id: "INS001",
    email: "michael.johnson@webdeves.com",
    firstName: "Michael",
    lastName: "Johnson",
    role: "instructor",
    instructorId: "WDA-INS-001",
    department: "Web Development",
    specialization: ["Frontend Development", "React", "Next.js"],
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+234-801-234-5680",
    createdAt: "2020-01-15T10:00:00Z",
  },
  {
    id: "INS002",
    email: "sarah.williams@webdeves.com",
    firstName: "Sarah",
    lastName: "Williams",
    role: "instructor",
    instructorId: "WDA-INS-002",
    department: "Cybersecurity",
    specialization: ["Network Security", "Ethical Hacking", "Penetration Testing"],
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+234-801-234-5681",
    createdAt: "2020-03-20T10:00:00Z",
  },
]

// Mock Admins
export const mockAdmins: Admin[] = [
  {
    id: "ADM001",
    email: "admin@webdeves.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    adminId: "WDA-ADM-001",
    permissions: ["all"],
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+234-801-234-5682",
    createdAt: "2014-01-01T10:00:00Z",
  },
]

// Mock Parents
export const mockParents: Parent[] = [
  {
    id: "PAR001",
    email: "parent.doe@example.com",
    firstName: "Robert",
    lastName: "Doe",
    role: "parent",
    parentId: "WDA-PAR-001",
    studentIds: ["STU001"],
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+234-801-234-5683",
    createdAt: "2024-01-15T10:00:00Z",
  },
]

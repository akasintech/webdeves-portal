import type { User, Student } from "./types"
import { mockStudents, mockInstructors, mockAdmins, mockParents } from "./mock-data/users"
import { mockCourses, mockClasses } from "./mock-data/courses"
import { mockAttendance } from "./mock-data/attendance"
import { mockGrades } from "./mock-data/grades"
import { mockPayments } from "./mock-data/payments"
import { mockEnrollments } from "./mock-data/enrollments"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Authentication APIs
export const mockAuthApi = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    await delay(500)

    // Find user across all user types
    const allUsers = [...mockStudents, ...mockInstructors, ...mockAdmins, ...mockParents]
    const user = allUsers.find((u) => u.email === email)

    if (user && password === "password123") {
      return {
        user,
        token: "mock-jwt-token-" + user.id,
      }
    }

    throw new Error("Invalid credentials")
  },

  signup: async (data: any): Promise<{ user: User; token: string }> => {
    await delay(500)

    const newUser: Student = {
      id: "STU" + Date.now(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: "student",
      studentId: "WDA-" + new Date().getFullYear() + "-" + Date.now(),
      enrollmentDate: new Date().toISOString().split("T")[0],
      program: data.program,
      cohort: data.cohort,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    }

    return {
      user: newUser,
      token: "mock-jwt-token-" + newUser.id,
    }
  },

  resetPassword: async (email: string): Promise<{ success: boolean }> => {
    await delay(500)
    return { success: true }
  },

  verifyEmail: async (code: string): Promise<{ success: boolean }> => {
    await delay(500)
    return { success: true }
  },
}

// Student APIs
export const mockStudentApi = {
  getProfile: async (studentId: string) => {
    await delay(300)
    return mockStudents.find((s) => s.id === studentId)
  },

  getEnrollments: async (studentId: string) => {
    await delay(300)
    const enrollments = mockEnrollments.filter((e) => e.studentId === studentId)
    return enrollments.map((enrollment) => ({
      ...enrollment,
      course: mockCourses.find((c) => c.id === enrollment.courseId),
    }))
  },

  getUpcomingClasses: async (studentId: string) => {
    await delay(300)
    const enrollments = mockEnrollments.filter((e) => e.studentId === studentId)
    const courseIds = enrollments.map((e) => e.courseId)

    return mockClasses
      .filter((c) => courseIds.includes(c.courseId) && c.status === "scheduled")
      .map((cls) => ({
        ...cls,
        course: mockCourses.find((c) => c.id === cls.courseId),
      }))
  },

  getAttendance: async (studentId: string) => {
    await delay(300)
    return mockAttendance.filter((a) => a.studentId === studentId)
  },

  getGrades: async (studentId: string) => {
    await delay(300)
    return mockGrades.filter((g) => g.studentId === studentId)
  },

  getPayments: async (studentId: string) => {
    await delay(300)
    return mockPayments.filter((p) => p.studentId === studentId)
  },

  markAttendance: async (classId: string, studentId: string) => {
    await delay(300)
    return { success: true }
  },
}

// Instructor APIs
export const mockInstructorApi = {
  getProfile: async (instructorId: string) => {
    await delay(300)
    return mockInstructors.find((i) => i.id === instructorId)
  },

  getCourses: async (instructorId: string) => {
    await delay(300)
    return mockCourses.filter((c) => c.instructorId === instructorId)
  },

  getClasses: async (instructorId: string) => {
    await delay(300)
    const courses = mockCourses.filter((c) => c.instructorId === instructorId)
    const courseIds = courses.map((c) => c.id)

    return mockClasses
      .filter((c) => courseIds.includes(c.courseId))
      .map((cls) => ({
        ...cls,
        course: mockCourses.find((c) => c.id === cls.courseId),
      }))
  },

  getStudents: async (courseId: string) => {
    await delay(300)
    const enrollments = mockEnrollments.filter((e) => e.courseId === courseId)
    return enrollments.map((enrollment) => mockStudents.find((s) => s.id === enrollment.studentId)).filter(Boolean)
  },

  markAttendance: async (classId: string, studentId: string, status: string) => {
    await delay(300)
    return { success: true }
  },

  submitGrade: async (data: any) => {
    await delay(300)
    return { success: true }
  },
}

// Admin APIs
export const mockAdminApi = {
  getAllStudents: async () => {
    await delay(300)
    return mockStudents
  },

  getAllInstructors: async () => {
    await delay(300)
    return mockInstructors
  },

  getAllCourses: async () => {
    await delay(300)
    return mockCourses.map((course) => ({
      ...course,
      instructor: mockInstructors.find((i) => i.id === course.instructorId),
    }))
  },

  getStats: async () => {
    await delay(300)
    return {
      totalStudents: mockStudents.length,
      totalInstructors: mockInstructors.length,
      totalCourses: mockCourses.length,
      activeEnrollments: mockEnrollments.filter((e) => e.status === "active").length,
    }
  },

  createUser: async (data: any) => {
    await delay(500)
    return { success: true, userId: "NEW" + Date.now() }
  },

  createCourse: async (data: any) => {
    await delay(500)
    return { success: true, courseId: "CRS" + Date.now() }
  },
}

// Parent APIs
export const mockParentApi = {
  getChildren: async (parentId: string) => {
    await delay(300)
    const parent = mockParents.find((p) => p.id === parentId)
    if (!parent) return []

    return mockStudents.filter((s) => parent.studentIds.includes(s.id))
  },

  getChildProgress: async (studentId: string) => {
    await delay(300)
    return {
      student: mockStudents.find((s) => s.id === studentId),
      enrollments: await mockStudentApi.getEnrollments(studentId),
      attendance: await mockStudentApi.getAttendance(studentId),
      grades: await mockStudentApi.getGrades(studentId),
    }
  },
}

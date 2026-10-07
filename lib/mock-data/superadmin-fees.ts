import type { FeeGroup, FeeRecord, FeeType, StudentCategory } from "../types"

// Mutable in-memory stores consumed only by lib/mock-api.ts.
// Delete together with the mock API when the real backend is connected.

export const categoryStore: StudentCategory[] = [
  { id: "CAT-001", name: "General", description: "Standard category for general enrollment", totalStudents: 892 },
  { id: "CAT-002", name: "Scholarship", description: "Standard category for scholarship enrollment", totalStudents: 198 },
  { id: "CAT-003", name: "Merit", description: "Standard category for merit enrollment", totalStudents: 156 },
  { id: "CAT-004", name: "Sports Quota", description: "Standard category for sports quota enrollment", totalStudents: 96 },
]

export const feeGroupStore: FeeGroup[] = [
  { id: "FG-001", name: "Standard Fee Package", includes: ["Tuition", "Library"], totalAmount: 4500, applicableClasses: "Grade 7–10", students: 842 },
  { id: "FG-002", name: "Premium Fee Package", includes: ["Tuition", "Lab", "Library"], totalAmount: 5200, applicableClasses: "Grade 11–12", students: 310 },
  { id: "FG-003", name: "Transport Add-on", includes: ["Bus Fee"], totalAmount: 800, applicableClasses: "All", students: 412 },
]

export const feeTypeStore: FeeType[] = [
  { id: "FT-001", name: "Tuition Fee", description: "Monthly academic fee", amount: 4000, frequency: "Monthly" },
  { id: "FT-002", name: "Laboratory Fee", description: "Science & computer lab usage", amount: 500, frequency: "Monthly" },
  { id: "FT-003", name: "Library Fee", description: "Library access and book issuance", amount: 300, frequency: "Monthly" },
  { id: "FT-004", name: "Transport Fee", description: "School bus service", amount: 800, frequency: "Monthly" },
  { id: "FT-005", name: "Exam Fee", description: "Semester exam registration", amount: 1200, frequency: "Per Exam" },
]

const seedRecords: FeeRecord[] = [
  { id: "FEE-2026-0841", receiptNo: "RCT-0841", student: "Priya Krishnamurthy", className: "Grade 10-A", feeType: "Tuition Fee", amount: 4500, paid: 4500, balance: 0, dueDate: "2026-08-15", status: "Paid" },
  { id: "FEE-2026-0840", receiptNo: "RCT-0840", student: "Lucas Ferreira", className: "Grade 8-B", feeType: "Tuition + Transport", amount: 5200, paid: 2600, balance: 2600, dueDate: "2026-08-15", status: "Partial" },
  { id: "FEE-2026-0839", receiptNo: null, student: "Aisha Ndiaye", className: "Grade 11-C", feeType: "Tuition Fee", amount: 4800, paid: 0, balance: 4800, dueDate: "2026-07-31", status: "Overdue" },
  { id: "FEE-2026-0838", receiptNo: "RCT-0838", student: "Omar Al-Rashid", className: "Grade 9-A", feeType: "Tuition + Lab", amount: 5100, paid: 5100, balance: 0, dueDate: "2026-08-15", status: "Paid" },
  { id: "FEE-2026-0837", receiptNo: null, student: "Sofia Bergmann", className: "Grade 12-B", feeType: "Tuition Fee", amount: 5000, paid: 0, balance: 5000, dueDate: "2026-08-15", status: "Pending" },
]

/** Collect Fee and Offline Bank Payments are separate resources, so each gets its own store. */
export const feeRecordStore: FeeRecord[] = seedRecords.map((r) => ({ ...r }))
export const offlinePaymentStore: FeeRecord[] = seedRecords.map((r) => ({ ...r }))

/** Server-computed totals the backend would return with the list. */
export const feeServerStats = { totalCollected: 148200, pending: 36800, overdue: 12400, paidStudents: 847 }

export const feeFrequencies = ["Monthly", "Per Exam", "Termly", "Yearly", "One-time"]

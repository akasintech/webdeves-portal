import type { Payment } from "../types"

export const mockPayments: Payment[] = [
  {
    id: "PAY001",
    studentId: "STU001",
    amount: 50000,
    purpose: "Tuition Fee - Web Development Program",
    status: "paid",
    dueDate: "2024-01-15",
    paidAt: "2024-01-10T09:30:00Z",
  },
  {
    id: "PAY002",
    studentId: "STU001",
    amount: 70000,
    purpose: "Balance Payment - Web Development Program",
    status: "pending",
    dueDate: "2024-03-15",
  },
]

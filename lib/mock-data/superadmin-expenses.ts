import type {
  ExpenseOverviewRecord,
  ExpensesOverviewStats,
  GenericRecordItem,
} from "../types"

// In-memory mock store for Expenses module

export const expenseHeadStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const addExpenseStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const expensesOverviewStatsStore: ExpensesOverviewStats = {
  totalExpenses: "$60,000",
  staffSalaries: "$42,000",
  operations: "$12,000",
  miscellaneous: "$6,000",
}

export const expensesOverviewStore: ExpenseOverviewRecord[] = [
  {
    id: "EXP-001",
    expenseHead: "Teaching Staff Salaries",
    amount: "$38,500",
    date: "Aug 1, 2026",
    approvedBy: "Super Admin",
    category: "Salaries",
    receipt: "EXP-001",
  },
  {
    id: "EXP-002",
    expenseHead: "Electricity & Utilities",
    amount: "$3,200",
    date: "Jul 31, 2026",
    approvedBy: "Admin",
    category: "Operations",
    receipt: "EXP-002",
  },
  {
    id: "EXP-003",
    expenseHead: "Maintenance & Repairs",
    amount: "$4,800",
    date: "Jul 30, 2026",
    approvedBy: "Admin",
    category: "Maintenance",
    receipt: "EXP-003",
  },
  {
    id: "EXP-004",
    expenseHead: "Lab Supplies",
    amount: "$2,100",
    date: "Jul 29, 2026",
    approvedBy: "Science Dept",
    category: "Academic",
    receipt: "EXP-004",
  },
]


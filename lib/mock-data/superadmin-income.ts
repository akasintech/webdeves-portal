import type { IncomeRecord, IncomeStats } from "../types"

export const incomeStore: IncomeRecord[] = [
  {
    id: "INC-001",
    incomeHead: "Tuition Fee — Grade 10",
    amount: "$42,000",
    date: "Aug 1, 2026",
    paymentMode: "Online",
    reference: "FEE-AUG-001",
    category: "Fee",
  },
  {
    id: "INC-002",
    incomeHead: "Transport Fee",
    amount: "$8,200",
    date: "Aug 1, 2026",
    paymentMode: "Bank Transfer",
    reference: "FEE-AUG-002",
    category: "Fee",
  },
  {
    id: "INC-003",
    incomeHead: "Online Course Revenue",
    amount: "$12,400",
    date: "Jul 31, 2026",
    paymentMode: "Online",
    reference: "OC-JUL-041",
    category: "Online",
  },
  {
    id: "INC-004",
    incomeHead: "Donation — Alumni Fund",
    amount: "$5,000",
    date: "Jul 30, 2026",
    paymentMode: "Cheque",
    reference: "DON-2026-18",
    category: "Donation",
  },
]

export const incomeStatsStore: IncomeStats = {
  totalIncome: "$185,000",
  feeCollection: "$148,200",
  otherIncome: "$36,800",
  vsLastMonth: "+12.4%",
}

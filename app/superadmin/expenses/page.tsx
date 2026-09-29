import { SuperAdminBlankPage } from "@/components/superadmin-blank-page"

export default function ExpensesPage() {
  return (
    <SuperAdminBlankPage
      title="Expenses"
      description="Record institution operational expenses, invoices, payroll deductions, and vendor payments."
      moduleKey="expenses"
    />
  )
}

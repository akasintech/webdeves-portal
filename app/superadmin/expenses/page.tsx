import { redirect } from "next/navigation"

export default function ExpensesRootPage() {
  redirect("/superadmin/expenses/overview")
}

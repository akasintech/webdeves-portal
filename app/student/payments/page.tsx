"use client"

import { useState } from "react"
import { FileText, CreditCard, Building2, Eye, Hash, Phone, BookOpen, User } from "lucide-react"

const student = {
  name: "Edward Thomas",
  admissionNumber: "2ksn27987",
  rollNumber: "101",
  mobileNumber: "(123) 456-7890",
  category: "GEN",
  classStandard: "Class 1",
}

const feeRecords = [
  { id: 1, feeName: "June Month Fees 2026-27", feeType: "Tuition Fees", dueDate: "04/11/2026", status: "Paid", amount: 1200, paymentId: "324967", mode: "Cash", paymentDate: "04/02/2026", discount: 0, fine: 0, paid: 360, balance: 0 },
  { id: 2, feeName: "Admission Fees", feeType: "Annual Fees", dueDate: "04/11/2026", status: "Paid", amount: 4500, paymentId: "-", mode: "-", paymentDate: "-", discount: 0, fine: 0, paid: 3240, balance: 0 },
  { id: 3, feeName: "March Fees", feeType: "April Month Fees", dueDate: "04/11/2026", status: "Paid", amount: 300, paymentId: "324968", mode: "Email", paymentDate: "04/02/2026", discount: 0, fine: 0, paid: 360, balance: 0 },
  { id: 4, feeName: "Class Mount Fees other", feeType: "Tuition Fees", dueDate: "04/11/2026", status: "Paid", amount: 300, paymentId: "324971", mode: "Email", paymentDate: "04/02/2026", discount: 0, fine: 0, paid: 780, balance: 0 },
  { id: 5, feeName: "June Mount Fees other", feeType: "", dueDate: "04/11/2026", status: "Paid", amount: 0, paymentId: "324972", mode: "Cash", paymentDate: "04/02/2026", discount: 0, fine: 0, paid: 350, balance: 0 },
  { id: 6, feeName: "July Mount Fees 2026", feeType: "Month Fees", dueDate: "04/11/2026", status: "Partial", amount: 300, paymentId: "-", mode: "-", paymentDate: "-", discount: 0, fine: 0, paid: 300, balance: 300 },
  { id: 7, feeName: "August Mount Fees 2026", feeType: "Month Fees", dueDate: "04/11/2026", status: "Unpaid", amount: 360, paymentId: "-", mode: "-", paymentDate: "-", discount: 0, fine: 0, paid: 0, balance: 360 },
]

const statusStyles: Record<string, string> = {
  Paid: "bg-green-500 text-white",
  Partial: "bg-orange-500 text-white",
  Unpaid: "bg-red-500 text-white",
}

const rowBg: Record<string, string> = {
  Paid: "",
  Partial: "bg-orange-50/40",
  Unpaid: "bg-red-50/40",
}

export default function PaymentsPage() {
  const [session, setSession] = useState("2026-27")

  return (
    <div className="space-y-5">
      <h1 className="text-[22px] font-bold text-gray-900">Student Fees</h1>

      {/* Student Info Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="grid grid-cols-3 gap-5">
          {[
            { label: "Name", value: student.name, icon: User, iconBg: "bg-blue-50", iconColor: "text-blue-400", labelColor: "text-blue-500" },
            { label: "Admission Number", value: student.admissionNumber, icon: Hash, iconBg: "bg-purple-50", iconColor: "text-purple-400", labelColor: "text-purple-500" },
            { label: "Class Standard", value: student.classStandard, icon: BookOpen, iconBg: "bg-green-50", iconColor: "text-green-400", labelColor: "text-green-500" },
            { label: "Roll Number", value: student.rollNumber, icon: Hash, iconBg: "bg-orange-50", iconColor: "text-orange-400", labelColor: "text-orange-500" },
            { label: "Mobile Number", value: student.mobileNumber, icon: Phone, iconBg: "bg-teal-50", iconColor: "text-teal-400", labelColor: "text-teal-500" },
            { label: "Category", value: null, badge: student.category, icon: FileText, iconBg: "bg-pink-50", iconColor: "text-pink-400", labelColor: "text-pink-500" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                <item.icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              <div>
                <p className={`text-[11px] font-medium ${item.labelColor}`}>{item.label}</p>
                {item.value ? (
                  <p className="text-[14px] font-bold text-gray-900">{item.value}</p>
                ) : (
                  <span className="text-[12px] font-bold bg-green-100 text-green-700 px-2.5 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-[13px] font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          <FileText className="w-4 h-4" /> All Fee Invoice
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white text-[13px] font-semibold rounded-lg hover:bg-orange-600 transition-colors">
          <CreditCard className="w-4 h-4" /> Pay Fee Online
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#8C2453] text-white text-[13px] font-semibold rounded-lg hover:opacity-90 transition-opacity">
          <Building2 className="w-4 h-4" /> 10 Offline Bank Payments
        </button>
      </div>

      {/* Fee Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-600 font-medium">Session:</span>
            <select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="border border-gray-200 rounded-lg text-[13px] px-2.5 py-1.5 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300"
            >
              <option value="2026-27">2026-27</option>
              <option value="2025-26">2025-26</option>
            </select>
          </div>
          <p className="text-[12.5px] text-gray-400">Date: 04-09-2026</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="w-8 px-4 py-3"></th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Fees</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Due Date</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-3 py-3 font-semibold text-gray-600">Amount ($)</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Payment ID</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Mode</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-right px-3 py-3 font-semibold text-gray-600">Discount</th>
                <th className="text-right px-3 py-3 font-semibold text-gray-600">Fine ($)</th>
                <th className="text-right px-3 py-3 font-semibold text-gray-600">Paid ($)</th>
                <th className="text-right px-3 py-3 font-semibold text-gray-600">Balance ($)</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {feeRecords.map((fee) => (
                <tr key={fee.id} className={`hover:bg-gray-50/50 transition-colors ${rowBg[fee.status]}`}>
                  <td className="px-4 py-3.5">
                    <input type="checkbox" className="rounded w-3.5 h-3.5 accent-[#8C2453]" />
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="font-semibold text-gray-900 leading-tight">{fee.feeName}</p>
                    {fee.feeType && <p className="text-[11px] text-gray-400 mt-0.5">{fee.feeType}</p>}
                  </td>
                  <td className="px-3 py-3.5 text-gray-600">{fee.dueDate}</td>
                  <td className="px-3 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusStyles[fee.status]}`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right font-medium text-gray-900">${fee.amount.toFixed(2)}</td>
                  <td className="px-3 py-3.5 text-gray-600">{fee.paymentId}</td>
                  <td className="px-3 py-3.5 text-gray-600">{fee.mode}</td>
                  <td className="px-3 py-3.5 text-gray-600">{fee.paymentDate}</td>
                  <td className="px-3 py-3.5 text-right text-gray-600">${fee.discount.toFixed(2)}</td>
                  <td className="px-3 py-3.5 text-right text-gray-600">${fee.fine.toFixed(2)}</td>
                  <td className="px-3 py-3.5 text-right font-medium text-green-600">${fee.paid.toFixed(2)}</td>
                  <td className="px-3 py-3.5 text-right font-medium text-red-500">${fee.balance.toFixed(2)}</td>
                  <td className="px-3 py-3.5 text-center">
                    <button className="text-gray-400 hover:text-[#8C2453] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

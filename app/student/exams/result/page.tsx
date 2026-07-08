import { mockExamResults } from "@/lib/mock-data/exams"
import { Eye, Download, Award, TrendingUp, CheckCircle2 } from "lucide-react"

const gradeColors: Record<string, string> = {
  "A+": "bg-green-500 text-white",
  "A": "bg-green-400 text-white",
  "B+": "bg-blue-500 text-white",
  "B": "bg-yellow-500 text-white",
  "C+": "bg-orange-400 text-white",
  "C": "bg-orange-500 text-white",
  "D": "bg-red-400 text-white",
  "F": "bg-red-600 text-white",
}

function getBarColor(pct: number) {
  if (pct >= 90) return "bg-green-500"
  if (pct >= 75) return "bg-blue-500"
  return "bg-yellow-500"
}

const totalExams = mockExamResults.length
const passedExams = mockExamResults.filter((r) => r.status === "Passed").length
const avgScore = Math.round(mockExamResults.reduce((s, r) => s + r.percentage, 0) / mockExamResults.length)

export default function ExamResultPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Exam Results</h1>
          <p className="text-[14px] text-gray-500 mt-0.5">View your complete exam performance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-[13px] font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" /> Download Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <p className="text-[12px] text-gray-500 mb-1">Total Exams</p>
            <p className="text-[34px] font-bold text-gray-900">{totalExams}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Award className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <p className="text-[12px] text-gray-500 mb-1">Passed Exams</p>
            <p className="text-[34px] font-bold text-gray-900">{passedExams}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <p className="text-[12px] text-gray-500 mb-1">Average Score</p>
            <p className="text-[34px] font-bold text-primary">{avgScore}%</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-[14px] font-semibold text-gray-900">Detailed Results</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-gray-600">Subject</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-gray-600">Course</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-gray-600">Date</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-gray-600">Marks</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-gray-600">Percentage</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-gray-600">Grade</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-gray-600">Remarks</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockExamResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-[13px] font-bold text-gray-900 leading-tight">{result.subject}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12.5px] text-blue-600 font-medium leading-tight">{result.course}</p>
                  </td>
                  <td className="px-4 py-4 text-[12.5px] text-gray-600">{result.date}</td>
                  <td className="px-4 py-4 text-[13px] font-semibold text-gray-900">{result.marks} / {result.totalMarks}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${getBarColor(result.percentage)}`} style={{ width: `${result.percentage}%` }} />
                      </div>
                      <span className="text-[12.5px] font-semibold text-gray-700">{result.percentage}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[11.5px] font-bold px-2.5 py-1 rounded-md ${gradeColors[result.grade] || "bg-gray-100 text-gray-700"}`}>
                      {result.grade}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-green-500 text-white">
                      {result.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[12.5px] text-gray-500">{result.remarks}</td>
                  <td className="px-4 py-4">
                    <button className="text-gray-400 hover:text-primary transition-colors">
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

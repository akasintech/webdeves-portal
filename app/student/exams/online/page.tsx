import { mockExamStats, mockUpcomingExams } from "@/lib/mock-data/exams"
import { Calendar, Award, TrendingUp } from "lucide-react"

export default function OnlineExamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">Examinations</h1>
        <p className="text-[14px] text-gray-500 mt-0.5">View exam schedules and results</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <p className="text-[12px] text-gray-500 mb-1">Upcoming Exams</p>
            <p className="text-[34px] font-bold text-gray-900">{mockExamStats.upcomingExams}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <p className="text-[12px] text-gray-500 mb-1">Completed Exams</p>
            <p className="text-[34px] font-bold text-gray-900">{mockExamStats.completedExams}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <Award className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <p className="text-[12px] text-gray-500 mb-1">Average Score</p>
            <p className="text-[34px] font-bold text-gray-900">{mockExamStats.averageScore}%</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Upcoming Exams
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {mockUpcomingExams.map((exam) => (
            <div key={exam.id} className="px-5 py-5">
              <div className="flex items-center gap-2.5 mb-1">
                <h3 className="text-[15px] font-bold text-gray-900">{exam.title}</h3>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${exam.mode === "Online" ? "bg-blue-600 text-white" : "bg-orange-500 text-white"}`}>
                  {exam.mode}
                </span>
              </div>
              <p className="text-[12.5px] text-blue-600 font-medium mb-4">{exam.subject}</p>
              <div className="grid grid-cols-4 gap-6 mb-4">
                <div>
                  <p className="text-[11px] text-gray-400 mb-1">Date</p>
                  <p className="text-[13.5px] font-bold text-gray-900">{exam.date}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 mb-1">Time</p>
                  <p className="text-[13.5px] font-bold text-gray-900">{exam.time}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 mb-1">Duration</p>
                  <p className="text-[13.5px] font-bold text-gray-900">{exam.duration}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 mb-1">Total Marks</p>
                  <p className="text-[13.5px] font-bold text-gray-900">{exam.totalMarks}</p>
                </div>
              </div>
              <button className="bg-gray-900 text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors">
                Start Exam
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

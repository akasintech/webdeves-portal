import { mockExamSchedule } from "@/lib/mock-data/exams"
import { Calendar, Clock, MapPin } from "lucide-react"

export default function ExamSchedulePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">Exam Schedule</h1>
        <p className="text-[14px] text-gray-500 mt-0.5">View all upcoming exam schedules</p>
      </div>

      <div className="space-y-3">
        {mockExamSchedule.map((exam) => (
          <div key={exam.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2.5 mb-1">
              <h3 className="text-[15px] font-bold text-gray-900">{exam.title}</h3>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${exam.mode === "Online" ? "bg-blue-600 text-white" : "bg-orange-500 text-white"}`}>
                {exam.mode}
              </span>
            </div>
            <p className="text-[12.5px] text-blue-600 font-medium mb-4">{exam.subject}</p>
            <div className="grid grid-cols-4 gap-0 divide-x divide-gray-100">
              <div className="pr-6">
                <p className="text-[11px] text-gray-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date
                </p>
                <p className="text-[14px] font-bold text-gray-900">{exam.date}</p>
              </div>
              <div className="px-6">
                <p className="text-[11px] text-gray-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Time
                </p>
                <p className="text-[14px] font-bold text-gray-900">{exam.time}</p>
              </div>
              <div className="px-6">
                <p className="text-[11px] text-gray-400 mb-1">Duration</p>
                <p className="text-[14px] font-bold text-gray-900">{exam.duration}</p>
              </div>
              <div className="pl-6">
                <p className="text-[11px] text-gray-400 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Location
                </p>
                <p className="text-[14px] font-bold text-gray-900">{exam.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

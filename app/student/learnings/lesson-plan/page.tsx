import { BookOpen, FileText, Download } from "lucide-react"

const lessonPlans = [
  {
    id: 1,
    subject: "Full Stack Web Development",
    week: "Week 1-4",
    topic: "HTML, CSS & JavaScript Fundamentals",
    instructor: "Prof. Smith",
    status: "Completed",
  },
  {
    id: 2,
    subject: "Full Stack Web Development",
    week: "Week 5-8",
    topic: "React.js & State Management",
    instructor: "Prof. Smith",
    status: "In Progress",
  },
  {
    id: 3,
    subject: "Full Stack Web Development",
    week: "Week 9-12",
    topic: "Node.js & Express Backend",
    instructor: "Prof. Smith",
    status: "Upcoming",
  },
  {
    id: 4,
    subject: "Mobile App Development",
    week: "Week 1-4",
    topic: "Dart & Flutter Basics",
    instructor: "Prof. Johnson",
    status: "Completed",
  },
  {
    id: 5,
    subject: "Mobile App Development",
    week: "Week 5-8",
    topic: "Flutter Widgets & Navigation",
    instructor: "Prof. Johnson",
    status: "In Progress",
  },
  {
    id: 6,
    subject: "Database Management",
    week: "Week 1-4",
    topic: "SQL & Relational Databases",
    instructor: "Prof. Williams",
    status: "Completed",
  },
]

const statusStyles: Record<string, string> = {
  Completed: "bg-green-50 text-green-700 border border-green-200",
  "In Progress": "bg-blue-50 text-blue-700 border border-blue-200",
  Upcoming: "bg-gray-100 text-gray-500",
}

export default function LessonPlanPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">Lesson Plan</h1>
        <p className="text-[14px] text-gray-500 mt-0.5">View your weekly lesson plans and topics</p>
      </div>

      <div className="space-y-3">
        {lessonPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between hover:border-gray-200 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-[13px] text-blue-500 font-semibold mb-0.5">{plan.subject}</p>
                <h3 className="text-[14.5px] font-bold text-gray-900">{plan.topic}</h3>
                <div className="flex items-center gap-3 mt-1 text-[12px] text-gray-400">
                  <span>{plan.week}</span>
                  <span>·</span>
                  <span>Instructor: {plan.instructor}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${statusStyles[plan.status]}`}>
                {plan.status}
              </span>
              <button className="text-gray-400 hover:text-primary transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

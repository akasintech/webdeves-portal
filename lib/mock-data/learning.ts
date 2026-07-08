export const mockZoomClasses = [
  {
    id: 1,
    type: "Scheduled & Exam Preparation",
    subject: "React Advanced Patterns & Testing",
    time: "10:00 AM - 12:00 PM",
    tutor: "Prof. Smith",
    link: "#",
  },
  {
    id: 2,
    type: "Study Material & Lesson",
    subject: "Node.js & Express Framework",
    time: "2:00 PM - 4:00 PM",
    tutor: "Prof. Johnson",
    link: "#",
  },
]

export const mockMeetClasses = [
  {
    id: 1,
    type: "Scheduled & Exam Preparation",
    subject: "Database Design & Optimization",
    time: "9:00 AM - 11:00 AM",
    tutor: "Prof. Williams",
    link: "#",
  },
  {
    id: 2,
    type: "Study Material & Lesson",
    subject: "Cloud Computing Fundamentals",
    time: "1:00 PM - 3:00 PM",
    tutor: "Prof. Davis",
    link: "#",
  },
]

export const mockAssignments = [
  {
    id: 1,
    title: "Calculus Problem Set",
    status: "Pending",
    subject: "Mathematics",
    class: "Class 1 - Section A",
    description: "Complete exercises 1-10 from Chapter 5",
    assignedDate: "2026-04-23",
    dueDate: "2026-04-30",
    maxMarks: 10,
    category: "Math",
    type: "Problem Set"
  },
  {
    id: 2,
    title: "Lab Report - Chemical Reactions",
    status: "Pending",
    subject: "Science",
    class: "Class 1 - Section A",
    description: "Document the chemical reaction experiment conducted in class",
    assignedDate: "2026-04-20",
    dueDate: "2026-04-28",
    maxMarks: 20,
    category: "Science",
    type: "Lab Report"
  },
  {
    id: 3,
    title: "Build a React E-commerce App",
    status: "Submitted",
    subject: "Web Development",
    class: "Class 1 - Section A",
    description: "Create a fully functional e-commerce application using React",
    assignedDate: "2026-04-15",
    dueDate: "2026-04-27",
    maxMarks: 10,
    category: "Web Dev",
    type: "Project"
  },
  {
    id: 4,
    title: "Essay Writing",
    status: "Overdue",
    subject: "Hindi",
    class: "Class 1 - Section A",
    description: 'Write an essay on "Digital India" (500 words)',
    assignedDate: "2026-04-18",
    dueDate: "2026-04-25",
    maxMarks: 25,
    category: "Language",
    type: "Essay"
  },
  {
    id: 5,
    title: "Literature Analysis",
    status: "Pending",
    subject: "English",
    class: "Class 1 - Section A",
    description: "Analyze the themes in Shakespeare's Macbeth",
    assignedDate: "2026-04-22",
    dueDate: "2026-05-01",
    maxMarks: 25,
    category: "Literature",
    type: "Analysis"
  },
  {
    id: 6,
    title: "MERN Stack E-commerce App",
    status: "Pending",
    subject: "Full Stack",
    class: "Class 1 - Section A",
    description: "Build a MERN app.",
    assignedDate: "2026-05-01",
    dueDate: "2026-05-15",
    maxMarks: 100,
    category: "Final Project",
    type: "Submission"
  },
  {
    id: 7,
    title: "Create Online Weather App",
    status: "Pending",
    subject: "Frontend",
    class: "Class 1 - Section A",
    description: "Build a weather app.",
    assignedDate: "2026-05-01",
    dueDate: "2026-05-18",
    maxMarks: 50,
    category: "API Integration",
    type: "Assignment"
  }
]

export const mockLessonPlans = [
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

export const mockSyllabuses = [
  {
    id: 1,
    subject: "Full Stack Web Development",
    totalTopics: 24,
    completedTopics: 14,
    units: [
      { name: "Unit 1: HTML & CSS", topics: 6, completed: 6 },
      { name: "Unit 2: JavaScript", topics: 6, completed: 5 },
      { name: "Unit 3: React.js", topics: 6, completed: 3 },
      { name: "Unit 4: Node.js & Express", topics: 6, completed: 0 },
    ],
  },
  {
    id: 2,
    subject: "Mobile App Development",
    totalTopics: 20,
    completedTopics: 10,
    units: [
      { name: "Unit 1: Dart Language", topics: 5, completed: 5 },
      { name: "Unit 2: Flutter Basics", topics: 5, completed: 5 },
      { name: "Unit 3: State Management", topics: 5, completed: 0 },
      { name: "Unit 4: App Deployment", topics: 5, completed: 0 },
    ],
  },
  {
    id: 3,
    subject: "Database Management",
    totalTopics: 16,
    completedTopics: 12,
    units: [
      { name: "Unit 1: SQL Basics", topics: 4, completed: 4 },
      { name: "Unit 2: Advanced Queries", topics: 4, completed: 4 },
      { name: "Unit 3: Database Design", topics: 4, completed: 4 },
      { name: "Unit 4: NoSQL", topics: 4, completed: 0 },
    ],
  },
]

export const mockCourseProgress = [
  { name: "Full Stack Web Development", progress: 75, completed: 30, total: 40 },
  { name: "Mobile App Development", progress: 50, completed: 15, total: 30 },
  { name: "Database Management", progress: 60, completed: 15, total: 25 },
]

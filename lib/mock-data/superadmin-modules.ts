import type {
  AdmissionEnquiry,
  ComplaintRecord,
  FeeReminderSettings,
  StudentRecord,
  VisitorRecord,
} from "../types"

// NOTE: these are mutable in-memory stores so create/delete work during a session.
// They are only consumed by lib/mock-api.ts — remove together with the mock API.

export const visitorStore: VisitorRecord[] = [
  { id: "VIS-001", name: "Mr. Anil Kumar", purpose: "Parent-Teacher Meeting", meetWith: "Ms. Patel (Class 8)", idType: "National ID", timeIn: "10:15 AM", timeOut: "11:30 AM", date: "2026-08-01" },
  { id: "VIS-002", name: "Ms. Claire Dubois", purpose: "Document Submission", meetWith: "Admin Office", idType: "Passport", timeIn: "09:00 AM", timeOut: "09:45 AM", date: "2026-08-01" },
  { id: "VIS-003", name: "Dr. Samuel Eze", purpose: "Health Checkup", meetWith: "School Nurse", idType: "Driver's License", timeIn: "01:00 PM", timeOut: "04:00 PM", date: "2026-07-31" },
  { id: "VIS-004", name: "Fatima Al-Hassan", purpose: "Fee Payment", meetWith: "Finance Dept", idType: "National ID", timeIn: "11:00 AM", timeOut: "11:25 AM", date: "2026-07-31" },
]

export const enquiryStore: AdmissionEnquiry[] = [
  { id: "ENQ-001", name: "Asshok", phone: "78675467786", source: "Online Front Site", enquiryDate: "2026-07-25", lastFollowUpDate: "2026-07-27", nextFollowUpDate: "2026-07-30", status: "Active" },
  { id: "ENQ-002", name: "Jaya", phone: "7875665878", source: "Admission Campaign", enquiryDate: "2026-07-20", lastFollowUpDate: null, nextFollowUpDate: "2026-08-24", status: "Active" },
  { id: "ENQ-003", name: "Nidhi", phone: "78664358678", source: "Online Front Site", enquiryDate: "2026-07-06", lastFollowUpDate: null, nextFollowUpDate: "2026-08-13", status: "Active" },
  { id: "ENQ-004", name: "Aryman", phone: "78643767837", source: "Advertisement", enquiryDate: "2026-07-01", lastFollowUpDate: null, nextFollowUpDate: "2026-08-06", status: "Active" },
  { id: "ENQ-005", name: "Asshok", phone: "78675467786", source: "Online Front Site", enquiryDate: "2026-06-25", lastFollowUpDate: null, nextFollowUpDate: "2026-06-30", status: "Active" },
  { id: "ENQ-006", name: "Jaya", phone: "7875665878", source: "Admission Campaign", enquiryDate: "2026-06-19", lastFollowUpDate: null, nextFollowUpDate: "2026-06-24", status: "Active" },
  { id: "ENQ-007", name: "Nidhi", phone: "78664358678", source: "Online Front Site", enquiryDate: "2026-06-06", lastFollowUpDate: null, nextFollowUpDate: "2026-06-12", status: "Active" },
  { id: "ENQ-008", name: "Aryman", phone: "78643767837", source: "Advertisement", enquiryDate: "2026-06-01", lastFollowUpDate: "2026-06-01", nextFollowUpDate: "2026-06-05", status: "Active" },
  { id: "ENQ-009", name: "Nidhi", phone: "6765556676", source: "Front Office", enquiryDate: "2026-05-27", lastFollowUpDate: "2026-05-01", nextFollowUpDate: "2026-05-30", status: "Active" },
  { id: "ENQ-010", name: "Priyal", phone: "7674374276", source: "Front Office", enquiryDate: "2026-05-16", lastFollowUpDate: null, nextFollowUpDate: "2026-05-21", status: "Active" },
  { id: "ENQ-011", name: "Vivek Patel", phone: "67473463487", source: "Admission Campaign", enquiryDate: "2026-05-15", lastFollowUpDate: null, nextFollowUpDate: "2026-05-19", status: "Active" },
  { id: "ENQ-012", name: "Jiya", phone: "9787737377736", source: "Google Ads", enquiryDate: "2026-05-07", lastFollowUpDate: null, nextFollowUpDate: "2026-05-13", status: "Active" },
]

/** Server-computed figures the backend would normally return alongside the list. */
export const enquiryServerStats = { newThisWeek: 12, followUpDue: 12 }

export const enquirySources = ["Online Front Site", "Admission Campaign", "Advertisement", "Front Office", "Google Ads"]

export const complaintStore: ComplaintRecord[] = [
  { id: "CMP-001", complainant: "Mrs. Thompson", type: "Academic", subject: "Unfair grading in Science exam", date: "2026-08-01", assignedTo: "Principal", status: "Open" },
  { id: "CMP-002", complainant: "Mr. Patel", type: "Facility", subject: "Broken classroom furniture in Room 12", date: "2026-07-30", assignedTo: "Maintenance", status: "In-Progress" },
  { id: "CMP-003", complainant: "Ms. Robinson", type: "Staff Conduct", subject: "Concern about teacher punctuality", date: "2026-07-28", assignedTo: "HR Dept", status: "Resolved" },
  { id: "CMP-004", complainant: "Anonymous", type: "Safety", subject: "Gate security not checking IDs properly", date: "2026-07-26", assignedTo: "Security Head", status: "Open" },
]

export const studentStore: StudentRecord[] = [
  { id: "STU-2026-001", name: "Priya Krishnamurthy", dob: "2011-03-12", gender: "Female", className: "Grade 10-A", rollNo: "A-101", parent: "Ravi Krishnamurthy", phone: "+91 98765 43210", category: "General", status: "active" },
  { id: "STU-2026-002", name: "Lucas Ferreira", dob: "2013-07-05", gender: "Male", className: "Grade 8-B", rollNo: "B-204", parent: "Ana Ferreira", phone: "+63 917 123 4567", category: "Scholarship", status: "active" },
  { id: "STU-2026-003", name: "Aisha Ndiaye", dob: "2010-11-19", gender: "Female", className: "Grade 11-C", rollNo: "C-311", parent: "Moussa Ndiaye", phone: "+221 77 123 4567", category: "General", status: "active" },
  { id: "STU-2026-004", name: "Omar Al-Rashid", dob: "2012-02-28", gender: "Male", className: "Grade 9-A", rollNo: "A-203", parent: "Khalid Al-Rashid", phone: "+971 50 123 4567", category: "General", status: "inactive" },
  { id: "STU-2026-005", name: "Sofia Bergmann", dob: "2009-09-07", gender: "Female", className: "Grade 12-B", rollNo: "B-401", parent: "Klaus Bergmann", phone: "+49 151 1234 5678", category: "Merit", status: "active" },
  { id: "STU-2026-006", name: "Kwame Asante", dob: "2014-04-03", gender: "Male", className: "Grade 7-A", rollNo: "A-701", parent: "Ama Asante", phone: "+233 24 123 4567", category: "General", status: "active" },
  { id: "STU-2026-007", name: "Mei Lin Zhang", dob: "2010-12-15", gender: "Female", className: "Grade 10-B", rollNo: "B-102", parent: "Wei Zhang", phone: "+86 138 9876 5432", category: "Scholarship", status: "active" },
]

export const studentServerStats = { total: 1342, active: 1298, inactive: 44, newThisMonth: 38 }

export const studentCategories = ["General", "Scholarship", "Merit"]

export const feeReminderStore: { current: FeeReminderSettings } = {
  current: {
    email: { sevenDaysBefore: true, onDueDate: true, threeDaysAfter: false },
    sms: { threeDaysBefore: true, onDueDate: false, overdue: true },
  },
}

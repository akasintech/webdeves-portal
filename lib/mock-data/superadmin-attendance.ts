import type {
  StudentAttendanceRecord,
  StudentAttendanceStats,
  StudentLeaveApprovalRecord,
  AttendanceByDateRecord,
  GenericRecordItem,
} from "../types"

export const studentAttendanceStats: StudentAttendanceStats = {
  presentToday: 1289,
  absent: 53,
  late: 22,
  onLeave: 18,
}

export const studentAttendanceStore: StudentAttendanceRecord[] = [
  {
    id: "1",
    student: "Priya Krishnamurthy",
    class: "Grade 10-A",
    rollNo: "A-101",
    dateStatus: "Present",
    monthlyPercent: "96.2%",
    status: "Good",
  },
  {
    id: "2",
    student: "Lucas Ferreira",
    class: "Grade 8-B",
    rollNo: "B-204",
    dateStatus: "Present",
    monthlyPercent: "88.4%",
    status: "Good",
  },
  {
    id: "3",
    student: "Aisha Ndiaye",
    class: "Grade 11-C",
    rollNo: "C-311",
    dateStatus: "Absent",
    monthlyPercent: "74.1%",
    status: "Warning",
  },
  {
    id: "4",
    student: "Omar Al-Rashid",
    class: "Grade 9-A",
    rollNo: "A-203",
    dateStatus: "Late",
    monthlyPercent: "81.3%",
    status: "Good",
  },
  {
    id: "5",
    student: "Chen Wei",
    class: "Grade 12-A",
    rollNo: "A-012",
    dateStatus: "Present",
    monthlyPercent: "98.5%",
    status: "Good",
  },
  {
    id: "6",
    student: "Fatima Zahra",
    class: "Grade 10-B",
    rollNo: "B-105",
    dateStatus: "Absent",
    monthlyPercent: "68.2%",
    status: "Critical",
  },
]

export const studentLeaveApprovalStore: StudentLeaveApprovalRecord[] = [
  {
    id: "LEV-001",
    student: "Priya Krishnamurthy",
    class: "Grade 10-A",
    rollNo: "A-101",
    applyDate: "Aug 2, 2026",
    fromDate: "Aug 5, 2026",
    toDate: "Aug 6, 2026",
    reason: "Family wedding ceremony",
    status: "Pending",
  },
  {
    id: "LEV-002",
    student: "Lucas Ferreira",
    class: "Grade 8-B",
    rollNo: "B-204",
    applyDate: "Jul 30, 2026",
    fromDate: "Aug 1, 2026",
    toDate: "Aug 3, 2026",
    reason: "Medical appointment & recovery",
    status: "Approved",
  },
  {
    id: "LEV-003",
    student: "Aisha Ndiaye",
    class: "Grade 11-C",
    rollNo: "C-311",
    applyDate: "Jul 28, 2026",
    fromDate: "Jul 29, 2026",
    toDate: "Jul 30, 2026",
    reason: "High fever and viral infection",
    status: "Approved",
  },
]

export const attendanceByDateStore: AttendanceByDateRecord[] = [
  {
    id: "1",
    student: "Priya Krishnamurthy",
    class: "Grade 10-A",
    rollNo: "A-101",
    attendance: "Present",
    remark: "On time",
  },
  {
    id: "2",
    student: "Lucas Ferreira",
    class: "Grade 10-A",
    rollNo: "A-102",
    attendance: "Present",
    remark: "On time",
  },
  {
    id: "3",
    student: "Aisha Ndiaye",
    class: "Grade 10-A",
    rollNo: "A-103",
    attendance: "Absent",
    remark: "Unexcused",
  },
  {
    id: "4",
    student: "Omar Al-Rashid",
    class: "Grade 10-A",
    rollNo: "A-104",
    attendance: "Late",
    remark: "15 mins late",
  },
  {
    id: "5",
    student: "Chen Wei",
    class: "Grade 10-A",
    rollNo: "A-105",
    attendance: "Present",
    remark: "On time",
  },
]

export const approveLeaveGenericStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]

export const byDateGenericStore: GenericRecordItem[] = [
  { id: "1", name: "Record 1", details: "Sample record", date: "Aug 1, 2026", status: "Active" },
  { id: "2", name: "Record 2", details: "Sample record", date: "Jul 31, 2026", status: "Active" },
]



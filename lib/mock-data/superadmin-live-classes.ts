import type { GMeetLiveClassRecord, ZoomLiveClassRecord } from "../types"

export const zoomLiveClassesStore: ZoomLiveClassRecord[] = [
  {
    id: "ZM-001",
    className: "Grade 12 Chemistry",
    subject: "Organic Chemistry",
    teacher: "Mrs. Nadia Al-Farsi",
    dateTime: "Aug 4, 2026 10:00 AM",
    duration: "60 min",
    meetingId: "842 9934 1027",
    status: "Scheduled",
  },
  {
    id: "ZM-002",
    className: "Grade 8 Art",
    subject: "Watercolor Techniques",
    teacher: "Ms. Yuki Tanaka",
    dateTime: "Aug 4, 2026 01:00 PM",
    duration: "45 min",
    meetingId: "713 4421 8839",
    status: "Scheduled",
  },
]

export const gmeetLiveClassesStore: GMeetLiveClassRecord[] = [
  {
    id: "GM-001",
    className: "Grade 10 Mathematics",
    subject: "Calculus",
    teacher: "Dr. Amara Singh",
    dateTime: "Aug 3, 2026 09:00 AM",
    duration: "60 min",
    meetLink: "meet.google.com/abc-defg-hij",
    status: "Scheduled",
  },
  {
    id: "GM-002",
    className: "Grade 11 Physics",
    subject: "Thermodynamics",
    teacher: "Mrs. Nadia Al-Farsi",
    dateTime: "Aug 3, 2026 11:00 AM",
    duration: "60 min",
    meetLink: "meet.google.com/xyz-uvwx-yz1",
    status: "Scheduled",
  },
  {
    id: "GM-003",
    className: "Grade 9 English",
    subject: "Essay Writing",
    teacher: "Ms. Claire Fontaine",
    dateTime: "Aug 2, 2026 02:00 PM",
    duration: "45 min",
    meetLink: "meet.google.com/qrs-tuvw-xyz",
    status: "Completed",
  },
]

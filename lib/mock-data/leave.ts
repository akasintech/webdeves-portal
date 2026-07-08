export const mockLeaveApplications = [
  {
    id: "L001",
    type: "Medical Leave",
    fromDate: "2026-03-10",
    toDate: "2026-03-12",
    days: 3,
    reason: "Fever and flu symptoms",
    status: "Approved",
    appliedOn: "2026-03-09",
    approvedBy: "Prof. Smith",
  },
  {
    id: "L002",
    type: "Personal Leave",
    fromDate: "2026-04-01",
    toDate: "2026-04-01",
    days: 1,
    reason: "Family function",
    status: "Approved",
    appliedOn: "2026-03-28",
    approvedBy: "Prof. Johnson",
  },
  {
    id: "L003",
    type: "Emergency Leave",
    fromDate: "2026-04-22",
    toDate: "2026-04-23",
    days: 2,
    reason: "Family emergency",
    status: "Pending",
    appliedOn: "2026-04-21",
    approvedBy: null,
  },
]

export const leaveTypes = [
  "Medical Leave",
  "Personal Leave",
  "Emergency Leave",
  "Vacation Leave",
  "Family Leave",
  "Study Leave",
]

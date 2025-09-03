// Mock teacher data
export const mockTeachers = [
  {
    id: "t1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    subject: "Mathematics",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    classes: ["10A", "11B", "12C"],
  },
  {
    id: "t2",
    name: "Robert Wilson",
    email: "robert@example.com", 
    subject: "Physics",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    classes: ["10B", "11A"],
  },
];

// Mock student data
export const mockStudents = [
  {
    id: "s1",
    name: "Emma Thompson",
    class: "10A",
    roll: "1001",
    gender: "Female",
    dob: "2007-05-12",
    email: "emma.t@example.com",
    parentEmail: "thompson.parent@example.com",
    avatar: "https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    attendance: 92,
    grades: {
      mathematics: 85,
      physics: 78,
      chemistry: 90,
      biology: 88,
      english: 92,
    },
  },
  {
    id: "s2",
    name: "James Wilson",
    class: "10A",
    roll: "1002",
    gender: "Male",
    dob: "2008-02-18",
    email: "james.w@example.com",
    parentEmail: "wilson.parent@example.com",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    attendance: 88,
    grades: {
      mathematics: 92,
      physics: 95,
      chemistry: 85,
      biology: 75,
      english: 80,
    },
  },
  {
    id: "s3",
    name: "Olivia Davis",
    class: "10A",
    roll: "1003",
    gender: "Female",
    dob: "2007-11-30",
    email: "olivia.d@example.com",
    parentEmail: "davis.parent@example.com",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    attendance: 95,
    grades: {
      mathematics: 78,
      physics: 72,
      chemistry: 85,
      biology: 92,
      english: 95,
    },
  },
  {
    id: "s4",
    name: "Liam Johnson",
    class: "10A",
    roll: "1004",
    gender: "Male",
    dob: "2008-04-05",
    email: "liam.j@example.com",
    parentEmail: "johnson.parent@example.com",
    avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    attendance: 90,
    grades: {
      mathematics: 90,
      physics: 85,
      chemistry: 82,
      biology: 90,
      english: 85,
    },
  },
  {
    id: "s5",
    name: "Sophia Martinez",
    class: "10B",
    roll: "1005",
    gender: "Female",
    dob: "2007-09-22",
    email: "sophia.m@example.com",
    parentEmail: "martinez.parent@example.com",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    attendance: 98,
    grades: {
      mathematics: 98,
      physics: 92,
      chemistry: 95,
      biology: 96,
      english: 90,
    },
  },
];

// Mock class schedule data
export const mockSchedule = [
  {
    id: "sch1",
    day: "Monday",
    slots: [
      { time: "08:00 - 09:00", subject: "Mathematics", class: "10A", room: "101" },
      { time: "09:15 - 10:15", subject: "Physics", class: "11B", room: "201" },
      { time: "10:30 - 11:30", subject: "Mathematics", class: "12C", room: "301" },
      { time: "12:30 - 13:30", subject: "Physics", class: "10B", room: "202" },
      { time: "13:45 - 14:45", subject: "Mathematics", class: "11A", room: "101" },
    ],
  },
  {
    id: "sch2",
    day: "Tuesday",
    slots: [
      { time: "08:00 - 09:00", subject: "Physics", class: "10A", room: "201" },
      { time: "09:15 - 10:15", subject: "Mathematics", class: "11B", room: "101" },
      { time: "10:30 - 11:30", subject: "Free Period", class: "", room: "" },
      { time: "12:30 - 13:30", subject: "Mathematics", class: "10B", room: "101" },
      { time: "13:45 - 14:45", subject: "Physics", class: "11A", room: "201" },
    ],
  },
  {
    id: "sch3",
    day: "Wednesday",
    slots: [
      { time: "08:00 - 09:00", subject: "Mathematics", class: "10A", room: "101" },
      { time: "09:15 - 10:15", subject: "Physics", class: "11B", room: "201" },
      { time: "10:30 - 11:30", subject: "Mathematics", class: "12C", room: "301" },
      { time: "12:30 - 13:30", subject: "Free Period", class: "", room: "" },
      { time: "13:45 - 14:45", subject: "Physics", class: "11A", room: "201" },
    ],
  },
  {
    id: "sch4",
    day: "Thursday",
    slots: [
      { time: "08:00 - 09:00", subject: "Physics", class: "10A", room: "201" },
      { time: "09:15 - 10:15", subject: "Mathematics", class: "11B", room: "101" },
      { time: "10:30 - 11:30", subject: "Physics", class: "12C", room: "201" },
      { time: "12:30 - 13:30", subject: "Mathematics", class: "10B", room: "101" },
      { time: "13:45 - 14:45", subject: "Free Period", class: "", room: "" },
    ],
  },
  {
    id: "sch5",
    day: "Friday",
    slots: [
      { time: "08:00 - 09:00", subject: "Mathematics", class: "10A", room: "101" },
      { time: "09:15 - 10:15", subject: "Physics", class: "11B", room: "201" },
      { time: "10:30 - 11:30", subject: "Mathematics", class: "12C", room: "301" },
      { time: "12:30 - 13:30", subject: "Physics", class: "10B", room: "202" },
      { time: "13:45 - 14:45", subject: "Mathematics", class: "11A", room: "101" },
    ],
  },
];

// Mock lesson plans
export const mockLessonPlans = [
  {
    id: "lp1",
    title: "Introduction to Quadratic Equations",
    subject: "Mathematics",
    class: "10A",
    date: "2025-04-18",
    objectives: [
      "Understand the standard form of quadratic equations",
      "Identify the coefficients a, b, and c in quadratic equations",
      "Solve simple quadratic equations by factoring",
    ],
    resources: ["Textbook Chapter 5", "Worksheet on factoring", "Interactive whiteboard"],
    homework: "Practice problems 5.1 to 5.10",
    notes: "Focus on ensuring students understand the relationship between factors and roots",
  },
  {
    id: "lp2",
    title: "Newton's Laws of Motion",
    subject: "Physics",
    class: "11B",
    date: "2025-04-19",
    objectives: [
      "State Newton's three laws of motion",
      "Apply Newton's second law to calculate force, mass, and acceleration",
      "Understand the concept of action and reaction forces",
    ],
    resources: ["Physics textbook Chapter 3", "Video demonstration", "Lab equipment for force experiments"],
    homework: "Complete the force diagram worksheet and problems 3.12 to 3.15",
    notes: "Prepare demonstrations for inertia and action-reaction pairs",
  },
];

// Mock evaluations and assessments
export const mockEvaluations = [
  {
    id: "ev1",
    title: "Mid-Term Mathematics Test",
    subject: "Mathematics",
    class: "10A",
    date: "2025-04-25",
    maxMarks: 50,
    duration: 60, // minutes
    topics: [
      "Quadratic Equations",
      "Polynomials",
      "Coordinate Geometry",
    ],
    status: "upcoming",
  },
  {
    id: "ev2",
    title: "Physics Monthly Assessment",
    subject: "Physics",
    class: "11B",
    date: "2025-04-22",
    maxMarks: 30,
    duration: 45, // minutes
    topics: [
      "Newton's Laws",
      "Forces and Motion",
      "Work, Energy and Power",
    ],
    status: "upcoming",
  },
  {
    id: "ev3",
    title: "Mathematics Quiz - Algebra",
    subject: "Mathematics",
    class: "10A",
    date: "2025-04-10",
    maxMarks: 20,
    duration: 30, // minutes
    topics: [
      "Algebraic Expressions",
      "Linear Equations",
    ],
    status: "completed",
    results: [
      { studentId: "s1", marks: 18 },
      { studentId: "s2", marks: 16 },
      { studentId: "s3", marks: 15 },
      { studentId: "s4", marks: 17 },
    ],
  },
];

// Mock recent activity for dashboard
export const mockRecentActivity = [
  {
    id: "act1",
    type: "grade",
    description: "Graded Mathematics Quiz for Class 10A",
    timestamp: "2025-04-10T15:30:00",
  },
  {
    id: "act2",
    type: "attendance",
    description: "Marked attendance for Class 11B",
    timestamp: "2025-04-10T09:15:00",
  },
  {
    id: "act3",
    type: "lesson",
    description: "Added new lesson plan for Physics",
    timestamp: "2025-04-09T18:45:00",
  },
  {
    id: "act4",
    type: "message",
    description: "Sent message to parents of Class 10A regarding upcoming test",
    timestamp: "2025-04-09T14:20:00",
  },
  {
    id: "act5",
    type: "evaluation",
    description: "Created new Mid-Term Mathematics Test",
    timestamp: "2025-04-08T11:05:00",
  },
];

// Mock upcoming events for dashboard
export const mockUpcomingEvents = [
  {
    id: "evt1",
    title: "Parent-Teacher Meeting",
    date: "2025-04-20",
    time: "15:00 - 18:00",
    location: "School Auditorium",
    description: "Individual meetings with parents to discuss student progress",
  },
  {
    id: "evt2",
    title: "Science Fair",
    date: "2025-04-28",
    time: "09:00 - 15:00",
    location: "School Grounds",
    description: "Annual science fair with student projects and exhibitions",
  },
  {
    id: "evt3",
    title: "Staff Development Workshop",
    date: "2025-05-02",
    time: "14:00 - 17:00",
    location: "Conference Room",
    description: "Workshop on modern teaching methodologies",
  },
];
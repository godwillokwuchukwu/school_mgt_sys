/**
 * Riverside College Parent Portal Sample and Seed Data
 * Perfectly aligns with institutional design specifications and reference mockups.
 */

export const DEFAULT_PARENT_PROFILE = {
  id: 101,
  firstName: 'Sarah',
  lastName: 'Johnson',
  fullName: 'Mrs. Sarah Johnson',
  displayName: 'Mrs. Johnson',
  role: 'Parent',
  email: 'mrs.johnson@parent.riversideacademy.com',
  phone: '+1 (555) 234-5678',
  address: '742 Evergreen Terrace, Riverside Metro District',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  notifications: {
    email: true,
    sms: true,
    push: false,
  },
  twoFactorEnabled: true,
}

export const DEFAULT_CHILDREN = [
  {
    id: 'child-1',
    studentId: 'RS-2025-104',
    firstName: 'Daniel',
    lastName: 'Johnson',
    name: 'Daniel Johnson',
    grade: 'Grade 10 - CS',
    department: 'Computer Science & STEM',
    classTeacher: 'Mr. James Davis',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    gpa: 3.80,
    gpaTrend: '+0.2',
    totalCredits: 6,
    completedCredits: 6,
    inProgressCredits: 0,
    attendanceRate: 93,
    daysPresent: 18,
    daysAbsent: 2,
    daysLate: 0,
    attendanceWeek: [90, 100, 95, 88, 92],
    averageScore: 91.5,
    feesTotal: 4500,
    feesPaid: 4050,
    feesDue: 450,
    subjects: [
      { id: 'math', code: 'MTH201', name: 'Mathematics', teacher: 'Mr. Davis', grade: 'A-', score: 92, status: 'Excellent', room: 'Room 101', credits: 1 },
      { id: 'eng', code: 'ENG201', name: 'English', teacher: 'Ms. Patel', grade: 'B+', score: 87, status: 'Good', room: 'Room 203', credits: 1 },
      { id: 'sci', code: 'SCI201', name: 'Science', teacher: 'Ms. Carter', grade: 'A-', score: 91, status: 'Excellent', room: 'Sci Lab 1', credits: 1 },
      { id: 'his', code: 'HIS201', name: 'History', teacher: 'Mrs. Wilson', grade: 'B+', score: 88, status: 'Good', room: 'Room 201', credits: 1 },
      { id: 'cs', code: 'CSC201', name: 'Computer Science', teacher: 'Mr. Akinola', grade: 'A', score: 95, status: 'Excellent', room: 'Room 301', credits: 1 },
      { id: 'fr', code: 'FRE201', name: 'French', teacher: 'Madame Ibe', grade: 'A-', score: 90, status: 'Excellent', room: 'Room 105', credits: 1 },
    ],
    gradeTrends: [
      { term: 'Term 1', gpa: 3.4 },
      { term: 'Term 2', gpa: 3.6 },
      { term: 'Term 3', gpa: 3.8 },
    ],
    attendanceRecords: [
      { date: 'Sep 22, 2025', status: 'Present', remarks: 'On time for assembly' },
      { date: 'Sep 19, 2025', status: 'Present', remarks: 'Class representative duties' },
      { date: 'Sep 18, 2025', status: 'Absent', remarks: 'Medical Note verified' },
      { date: 'Sep 16, 2025', status: 'Present', remarks: 'Lab session attended' },
      { date: 'Sep 15, 2025', status: 'Present', remarks: 'Regular class' },
      { date: 'Sep 12, 2025', status: 'Present', remarks: 'Physics practical' },
      { date: 'Sep 11, 2025', status: 'Present', remarks: 'Regular class' },
      { date: 'Sep 10, 2025', status: 'Absent', remarks: 'Dentist appointment' },
    ],
    feesBreakdown: [
      { id: 'f1', description: 'Tuition Fee - First Term', amount: 2500, status: 'Paid', dueDate: 'Sep 05, 2025' },
      { id: 'f2', description: 'STEM & Computer Lab Levy', amount: 750, status: 'Paid', dueDate: 'Sep 10, 2025' },
      { id: 'f3', description: 'Activity & Sports Fee', amount: 350, status: 'Paid', dueDate: 'Sep 15, 2025' },
      { id: 'f4', description: 'Textbook & Digital Resources', amount: 450, status: 'Paid', dueDate: 'Sep 20, 2025' },
      { id: 'f5', description: 'Annual Technology Infrastructure', amount: 450, status: 'Pending', dueDate: 'Oct 15, 2025' },
    ],
    documents: [
      { id: 'doc-1', name: 'Midterm Results.pdf', type: 'Academic', date: 'Sep 20, 2025', size: '1.2 MB' },
      { id: 'doc-2', name: 'Fee Receipt_Sep2025.pdf', type: 'Financial', date: 'Sep 15, 2025', size: '240 KB' },
      { id: 'doc-3', name: 'Medical Report.pdf', type: 'Medical', date: 'Aug 30, 2025', size: '850 KB' },
      { id: 'doc-4', name: 'Student Handbook.pdf', type: 'Others', date: 'Aug 15, 2025', size: '3.4 MB' },
      { id: 'doc-5', name: 'Term Schedule.pdf', type: 'Academic', date: 'Aug 10, 2025', size: '512 KB' },
    ],
    notes: [
      { id: 'note-1', title: 'Parent-Teacher Conference', date: 'Sep 14, 2025', content: "Don't forget the upcoming meeting with Mr. Davis on Sep 25, 2025." },
      { id: 'note-2', title: 'Science Project Due Date', date: 'Sep 13, 2025', content: 'Robotics sensor experiment report due on Oct 14, 2025.' },
      { id: 'note-3', title: 'School Holiday Notice', date: 'Sep 10, 2025', content: 'Mid-term break scheduled; school closed on Oct 14, 2025.' },
      { id: 'note-4', title: 'Uniform Reminder', date: 'Sep 05, 2025', content: 'Purchase blazer patch for ceremonial assemblies next term.' },
    ],
  },
  {
    id: 'child-2',
    studentId: 'RS-2025-082',
    firstName: 'Emily',
    lastName: 'Johnson',
    name: 'Emily Johnson',
    grade: 'Grade 8 - ENG',
    department: 'Junior Secondary Arts & Humanities',
    classTeacher: 'Ms. Angela Patel',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    gpa: 3.62,
    gpaTrend: '+0.1',
    totalCredits: 6,
    completedCredits: 6,
    inProgressCredits: 0,
    attendanceRate: 95,
    daysPresent: 19,
    daysAbsent: 1,
    daysLate: 0,
    attendanceWeek: [95, 100, 100, 90, 95],
    averageScore: 88.0,
    feesTotal: 4500,
    feesPaid: 3250,
    feesDue: 1250,
    subjects: [
      { id: 'math', code: 'MTH101', name: 'Mathematics', teacher: 'Mr. Okafor', grade: 'B+', score: 88, status: 'Good', room: 'Room 102', credits: 1 },
      { id: 'eng', code: 'ENG101', name: 'English', teacher: 'Ms. Patel', grade: 'A', score: 94, status: 'Excellent', room: 'Room 203', credits: 1 },
      { id: 'sci', code: 'SCI101', name: 'Science', teacher: 'Ms. Carter', grade: 'A-', score: 91, status: 'Excellent', room: 'Sci Lab 2', credits: 1 },
      { id: 'his', code: 'HIS101', name: 'History', teacher: 'Mrs. Wilson', grade: 'B+', score: 88, status: 'Good', room: 'Room 202', credits: 1 },
      { id: 'art', code: 'ART101', name: 'Art', teacher: 'Mr. Davis', grade: 'A-', score: 90, status: 'Excellent', room: 'Studio 3', credits: 1 },
      { id: 'lit', code: 'LIT101', name: 'Literature', teacher: 'Ms. Okoye', grade: 'A', score: 93, status: 'Excellent', room: 'Room 104', credits: 1 },
    ],
    gradeTrends: [
      { term: 'Term 1', gpa: 3.2 },
      { term: 'Term 2', gpa: 3.5 },
      { term: 'Term 3', gpa: 3.62 },
    ],
    attendanceRecords: [
      { date: 'Sep 22, 2025', status: 'Present', remarks: 'English debate participant' },
      { date: 'Sep 19, 2025', status: 'Present', remarks: 'Art studio session' },
      { date: 'Sep 18, 2025', status: 'Present', remarks: 'Regular class' },
      { date: 'Sep 16, 2025', status: 'Present', remarks: 'Choir practice' },
      { date: 'Sep 15, 2025', status: 'Present', remarks: 'Regular class' },
      { date: 'Sep 12, 2025', status: 'Absent', remarks: 'Family travel leave excused' },
      { date: 'Sep 11, 2025', status: 'Present', remarks: 'Regular class' },
      { date: 'Sep 10, 2025', status: 'Present', remarks: 'Regular class' },
    ],
    feesBreakdown: [
      { id: 'ef1', description: 'Tuition Fee - Junior Secondary', amount: 2000, status: 'Paid', dueDate: 'Sep 05, 2025' },
      { id: 'ef2', description: 'Library & Learning Hub Fee', amount: 200, status: 'Paid', dueDate: 'Sep 10, 2025' },
      { id: 'ef3', description: 'Activity & Excursion Levy', amount: 150, status: 'Paid', dueDate: 'Sep 30, 2025' },
      { id: 'ef4', description: 'National Assessment & Exam Fee', amount: 300, status: 'Pending', dueDate: 'Oct 15, 2025' },
      { id: 'ef5', description: 'Digital Tablet & Tech Service', amount: 600, status: 'Pending', dueDate: 'Oct 30, 2025' },
    ],
    documents: [
      { id: 'edoc-1', name: 'Emily_Term1_Report_Card.pdf', type: 'Academic', date: 'Sep 21, 2025', size: '1.1 MB' },
      { id: 'edoc-2', name: 'Junior_Sports_Consent_Form.pdf', type: 'Others', date: 'Sep 14, 2025', size: '180 KB' },
      { id: 'edoc-3', name: 'Immunization_Record_Emily.pdf', type: 'Medical', date: 'Aug 28, 2025', size: '640 KB' },
      { id: 'edoc-4', name: 'Bursary_Payment_Receipt_3250.pdf', type: 'Financial', date: 'Sep 06, 2025', size: '210 KB' },
    ],
    notes: [
      { id: 'enote-1', title: 'Parent-Teacher Conference', date: 'Sep 14, 2025', content: 'Scheduled for 11:30 AM with Ms. Angela Patel.' },
      { id: 'enote-2', title: 'Art Exhibition Submission', date: 'Sep 12, 2025', content: 'Submit landscape watercolor painting by Friday.' },
      { id: 'enote-3', title: 'School Holiday Notice', date: 'Sep 10, 2025', content: 'Mid-term break on Oct 14, 2025.' },
    ],
  },
]

export const UPCOMING_EVENTS = [
  { id: 'ev-1', month: 'SEP', day: '25', title: 'Parent-Teacher Conference', time: '10:00 AM - 12:00 PM', location: 'Main Academic Quad & Halls', type: 'Meeting' },
  { id: 'ev-2', month: 'SEP', day: '28', title: 'School Open House', time: '9:00 AM - 1:00 PM', location: 'Campus Grounds & Classrooms', type: 'Event' },
  { id: 'ev-3', month: 'OCT', day: '03', title: 'Midterm Exam (Math)', time: 'All Day', location: 'Auditorium Exam Centers', type: 'Academic' },
  { id: 'ev-4', month: 'OCT', day: '10', title: 'Science Fair', time: '8:00 AM - 3:00 PM', location: 'Science Complex & Hub', type: 'Exhibition' },
]

export const LATEST_NOTICES = [
  { id: 'not-1', title: 'School Holiday on October 14', date: 'Sep 20, 2025', category: 'Holiday', icon: 'calendar' },
  { id: 'not-2', title: 'Updated Fee Structure for 2025/2026', date: 'Sep 18, 2025', category: 'Finance', icon: 'finance' },
  { id: 'not-3', title: 'Parent Survey - We Value Your Feedback', date: 'Sep 15, 2025', category: 'Survey', icon: 'survey' },
]

export const RECENT_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'Teacher - Mr. Davis (Math)',
    role: 'Mathematics Faculty',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    snippet: 'Daniel did very well in today’s class. Keep up the good work!',
    time: '10:24 AM',
    date: 'Today',
    unread: 1,
    chat: [
      { sender: 'them', text: 'Good morning Mrs. Johnson. I wanted to share that Daniel did exceptionally well in today’s calculus problem-solving session.', time: '10:15 AM' },
      { sender: 'them', text: 'Daniel did very well in today’s class. Keep up the good work!', time: '10:24 AM' },
      { sender: 'me', text: 'Thank you so much for the update! We really appreciate your guidance and support.', time: '10:35 AM' },
    ]
  },
  {
    id: 'msg-2',
    sender: 'School Administration',
    role: 'Principal’s Office',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    snippet: 'Reminder: Parent-Teacher Conference scheduled for Sep 25...',
    time: 'Yesterday',
    date: 'Sep 23, 2025',
    unread: 0,
    chat: [
      { sender: 'them', text: 'Dear Parents, please be reminded that our annual Parent-Teacher Conference will take place on Sep 25. Looking forward to seeing you.', time: 'Yesterday 04:00 PM' }
    ]
  },
  {
    id: 'msg-3',
    sender: 'Teacher - Ms. Carter (Science)',
    role: 'Science Teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    snippet: 'Emily has shown great improvement in her recent lab report...',
    time: 'Sep 20',
    date: 'Sep 20, 2025',
    unread: 0,
    chat: [
      { sender: 'them', text: 'Emily has shown great improvement in her recent lab report on chemical titration!', time: 'Sep 20, 02:15 PM' },
      { sender: 'me', text: 'That is wonderful news, Ms. Carter! Thank you.', time: 'Sep 20, 02:45 PM' }
    ]
  },
  {
    id: 'msg-4',
    sender: 'Finance Office',
    role: 'Bursary & Accounts',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80',
    snippet: 'Your fee payment has been received. Thank you!',
    time: 'Sep 18',
    date: 'Sep 18, 2025',
    unread: 0,
    chat: [
      { sender: 'them', text: 'Your fee payment of $3,250.00 for Emily Johnson has been verified. Official receipt #RC-B-2025-992 is now generated.', time: 'Sep 18, 11:00 AM' }
    ]
  },
  {
    id: 'msg-5',
    sender: 'Ms. Patel (English Teacher)',
    role: 'English Faculty',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    snippet: 'Homework reminder: Creative writing chapter due Friday.',
    time: 'Sep 12',
    date: 'Sep 12, 2025',
    unread: 0,
    chat: [
      { sender: 'them', text: 'Homework reminder: Creative writing chapter draft due Friday.', time: 'Sep 12, 09:10 AM' }
    ]
  }
]

export const TIMETABLE_DATA = {
  Monday: [
    { time: '08:00 - 09:00 AM', subject: 'Mathematics', room: 'Room 101', teacher: 'Mr. Davis', color: 'blue' },
    { time: '09:30 - 10:30 AM', subject: 'English', room: 'Room 203', teacher: 'Ms. Patel', color: 'purple' },
    { time: '11:00 - 12:00 PM', subject: 'Computer Science', room: 'Room 301', teacher: 'Mr. Akinola', color: 'teal' },
    { time: '01:00 - 02:00 PM', subject: 'Science', room: 'Lab 1', teacher: 'Ms. Carter', color: 'amber' },
    { time: '02:30 - 03:30 PM', subject: 'History', room: 'Room 201', teacher: 'Mrs. Wilson', color: 'purple' },
  ],
  Tuesday: [
    { time: '08:00 - 09:00 AM', subject: 'French', room: 'Room 105', teacher: 'Madame Ibe', color: 'teal' },
    { time: '09:30 - 10:30 AM', subject: 'Mathematics', room: 'Room 101', teacher: 'Mr. Davis', color: 'blue' },
    { time: '11:00 - 12:00 PM', subject: 'Science', room: 'Lab 1', teacher: 'Ms. Carter', color: 'amber' },
    { time: '01:00 - 02:00 PM', subject: 'Computer Science', room: 'Room 301', teacher: 'Mr. Akinola', color: 'teal' },
  ],
  Wednesday: [
    { time: '08:00 - 09:00 AM', subject: 'Mathematics', room: 'Room 101', teacher: 'Mr. Davis', color: 'blue' },
    { time: '09:30 - 10:30 AM', subject: 'Computer Science', room: 'Room 301', teacher: 'Mr. Akinola', color: 'teal' },
    { time: '11:00 - 12:00 PM', subject: 'English', room: 'Room 203', teacher: 'Ms. Patel', color: 'purple' },
    { time: '01:00 - 02:00 PM', subject: 'History', room: 'Room 201', teacher: 'Mrs. Wilson', color: 'purple' },
  ],
  Thursday: [
    { time: '08:00 - 09:00 AM', subject: 'Science', room: 'Lab 1', teacher: 'Ms. Carter', color: 'amber' },
    { time: '09:30 - 10:30 AM', subject: 'Mathematics', room: 'Room 101', teacher: 'Mr. Davis', color: 'blue' },
    { time: '11:00 - 12:00 PM', subject: 'French', room: 'Room 105', teacher: 'Madame Ibe', color: 'teal' },
    { time: '01:00 - 02:00 PM', subject: 'History', room: 'Room 201', teacher: 'Mrs. Wilson', color: 'purple' },
  ],
  Friday: [
    { time: '08:00 - 09:00 AM', subject: 'Computer Science', room: 'Room 301', teacher: 'Mr. Akinola', color: 'teal' },
    { time: '09:30 - 10:30 AM', subject: 'English', room: 'Room 203', teacher: 'Ms. Patel', color: 'purple' },
    { time: '11:00 - 12:00 PM', subject: 'Physical Education', room: 'Sports Complex', teacher: 'Coach Bello', color: 'amber' },
  ]
}

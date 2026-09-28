/**
 * Riverside College Student Portal Data Store
 * Fictional Student: Chinedu Okafor (CS2024)
 * First Semester 2025/2026 Academic Session
 * Currency: Nigerian Naira (₦)
 */

export const STUDENT_PROFILE = {
  fullName: 'Chinedu Okafor',
  firstName: 'Chinedu',
  lastName: 'Okafor',
  studentId: 'CS2024',
  matricNo: 'RC/2025/CS/0142',
  department: 'Computer Science',
  faculty: 'School of Computing & Information Technology',
  level: '100 Level',
  session: '2025/2026',
  semester: 'First Semester 2025/2026',
  dob: '14 May 2004',
  gender: 'Male',
  nationality: 'Nigerian',
  stateOfOrigin: 'Anambra State',
  phone: '+234 803 123 4567',
  email: 'chinedu.okafor@riverside.edu.ng',
  address: 'Block B, Hall 4, Riverside College Main Campus, Lagos',
  enrollmentDate: 'September 10, 2025',
  advisor: 'Dr. K. Adeyemi',
  bloodGroup: 'O+',
  genotype: 'AA',
  gpa: '3.62',
  cgpa: '3.62',
  attendance: '92%',
  emergencyContact: {
    name: 'Emeka Okafor',
    relationship: 'Father',
    phone: '+234 802 987 6543',
    email: 'emeka.okafor@gmail.com',
    address: '15 Independence Avenue, Ikeja, Lagos',
  },
}

export const STUDENT_COURSES = [
  {
    code: 'CS101',
    title: 'Introduction to Computer Science',
    credits: 3,
    instructor: 'Dr. K. Adeyemi',
    schedule: 'Mon & Wed (09:00 - 10:30 AM)',
    room: 'Computer Lab 2',
    attendanceRate: '95%',
    progress: 88,
  },
  {
    code: 'MAT201',
    title: 'Calculus II',
    credits: 4,
    instructor: 'Prof. O. Balogun',
    schedule: 'Tue & Thu (11:00 AM - 12:30 PM)',
    room: 'Lecture Theatre 1',
    attendanceRate: '90%',
    progress: 92,
  },
  {
    code: 'ENG102',
    title: 'Technical Communication',
    credits: 2,
    instructor: 'Dr. Mrs. N. Eze',
    schedule: 'Wed (01:00 - 03:00 PM)',
    room: 'Humanities Hall B',
    attendanceRate: '100%',
    progress: 85,
  },
  {
    code: 'PHY101',
    title: 'Physics for Engineers',
    credits: 4,
    instructor: 'Dr. S. Bello',
    schedule: 'Mon & Fri (02:00 - 04:00 PM)',
    room: 'Science Complex LT',
    attendanceRate: '85%',
    progress: 82,
  },
  {
    code: 'CS201',
    title: 'Data Structures & Algorithms',
    credits: 4,
    instructor: 'Engr. T. Williams',
    schedule: 'Tue & Thu (09:00 - 10:30 AM)',
    room: 'Computer Lab 1',
    attendanceRate: '92%',
    progress: 90,
  },
]

export const TODAY_SCHEDULE = [
  {
    id: 1,
    time: '09:00 - 10:30 AM',
    code: 'CS101',
    title: 'Intro to Computer Science',
    room: 'Lab 2',
    instructor: 'Dr. Adeyemi',
    status: 'Upcoming',
  },
  {
    id: 2,
    time: '11:00 AM - 12:30 PM',
    code: 'MAT201',
    title: 'Calculus II Tutorial',
    room: 'LT 1',
    instructor: 'Prof. Balogun',
    status: 'Upcoming',
  },
  {
    id: 3,
    time: '02:00 - 04:00 PM',
    code: 'CS201',
    title: 'Data Structures Lab (Binary Trees)',
    room: 'Lab 1',
    instructor: 'Engr. Williams',
    status: 'Upcoming',
  },
]

export const UPCOMING_ASSIGNMENTS = [
  {
    id: 1,
    course: 'CS201',
    title: 'Binary Search Tree Implementation in Python',
    dueDate: 'Sep 28, 2025',
    points: '100 pts',
    status: 'Pending',
    description: 'Implement AVL Tree auto-balancing routines with Big-O complexity analysis.',
  },
  {
    id: 2,
    course: 'MAT201',
    title: 'Problem Set 3: Multivariable Derivatives',
    dueDate: 'Oct 02, 2025',
    points: '50 pts',
    status: 'Pending',
    description: 'Solve problems 14 through 28 on partial differentiation and Lagrangian multipliers.',
  },
  {
    id: 3,
    course: 'CS101',
    title: 'Algorithm Flowcharts & Pseudo-code Design',
    dueDate: 'Sep 20, 2025',
    points: '100 pts',
    status: 'Submitted',
    description: 'Submitted assignment analyzing sorting algorithms and loop invariants.',
  },
  {
    id: 4,
    course: 'ENG102',
    title: 'Technical Project Proposal Writing',
    dueDate: 'Sep 15, 2025',
    points: '100 pts',
    status: 'Graded',
    description: 'Graded by Dr. Mrs. Eze: 85/100 (B+). Excellent structure and literature review.',
  },
]

export const RECENT_GRADES = [
  {
    id: 1,
    course: 'CS101',
    assessment: 'Midterm Examination',
    score: 88,
    grade: 'A',
    date: 'Sep 21, 2025',
  },
  {
    id: 2,
    course: 'MAT201',
    assessment: 'Quiz 2: Integral Calculus',
    score: 92,
    grade: 'A',
    date: 'Sep 18, 2025',
  },
  {
    id: 3,
    course: 'ENG102',
    assessment: 'Technical Essay 1',
    score: 85,
    grade: 'B+',
    date: 'Sep 14, 2025',
  },
  {
    id: 4,
    course: 'PHY101',
    assessment: 'Optics & Mechanics Practical',
    score: 82,
    grade: 'A-',
    date: 'Sep 11, 2025',
  },
]

export const ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'First Semester Midterm Exam Timetable Published',
    category: 'Examinations',
    date: 'Sep 22, 2025',
    snippet: 'The official schedule for 100-Level examinations has been released by the Academic Registry.',
  },
  {
    id: 2,
    title: 'Campus Library Extended Study Hours',
    category: 'Academics',
    date: 'Sep 20, 2025',
    snippet: 'Main Library will now remain open until 11:00 PM daily throughout the examination period.',
  },
  {
    id: 3,
    title: 'Tuition Balance Clearance Notice',
    category: 'Bursary',
    date: 'Sep 18, 2025',
    snippet: 'All students are advised to settle outstanding fee installments prior to exam docket generation.',
  },
]

export const FINANCIAL_DATA = {
  totalFees: 2500000,
  totalFeesFormatted: '₦2,500,000.00',
  paid: 1250000,
  paidFormatted: '₦1,250,000.00',
  outstanding: 1250000,
  outstandingFormatted: '₦1,250,000.00',
  progressPercent: 50,
  feeBreakdown: [
    { item: 'First Semester Tuition Fee', total: '₦1,800,000.00', paid: '₦1,000,000.00', balance: '₦800,000.00', status: 'Partially Paid', statusClass: 'warning' },
    { item: 'Departmental & ICT Lab Levy', total: '₦350,000.00', paid: '₦250,000.00', balance: '₦100,000.00', status: 'Partially Paid', statusClass: 'warning' },
    { item: 'Campus Accommodation & Utilities', total: '₦250,000.00', paid: '₦0.00', balance: '₦250,000.00', status: 'Unpaid', statusClass: 'danger' },
    { item: 'Medical Insurance & Exam Clearance', total: '₦100,000.00', paid: '₦0.00', balance: '₦100,000.00', status: 'Unpaid', statusClass: 'danger' },
  ],
  paymentHistory: [
    { id: 'RC-TXN-9821', date: 'Sep 10, 2025', description: 'First Semester Tuition Deposit', amount: '₦1,000,000.00', method: 'Online Card (Paystack)', status: 'Completed' },
    { id: 'RC-TXN-9822', date: 'Sep 11, 2025', description: 'Departmental Science Lab Fee', amount: '₦250,000.00', method: 'Bank Transfer (Access Bank)', status: 'Completed' },
  ],
}

export const DOCUMENTS_LIST = [
  { id: 1, name: 'Provisional Admission Letter 2025/2026', category: 'Academic', date: 'Aug 14, 2025', size: '1.2 MB', type: 'PDF', status: 'Verified' },
  { id: 2, name: 'Approved Course Registration Form', category: 'Academic', date: 'Sep 12, 2025', size: '480 KB', type: 'PDF', status: 'Verified' },
  { id: 3, name: 'Digital Student ID Card (CS2024)', category: 'Identification', date: 'Sep 15, 2025', size: '820 KB', type: 'PNG', status: 'Verified' },
  { id: 4, name: 'Tuition Deposit Electronic Receipt', category: 'Financial', date: 'Sep 10, 2025', size: '540 KB', type: 'PDF', status: 'Verified' },
  { id: 5, name: 'Clinic Medical Fitness Clearance', category: 'Medical', date: 'Sep 08, 2025', size: '2.1 MB', type: 'PDF', status: 'Verified' },
]

export const CONVERSATIONS = [
  {
    id: 1,
    name: 'Dr. K. Adeyemi',
    role: 'Course Advisor & CS101 Lecturer',
    avatar: 'KA',
    lastMessage: 'Please ensure you review the recursion chapter before tomorrow’s lab.',
    time: '10:14 AM',
    unread: 1,
    messages: [
      { id: 1, sender: 'Dr. K. Adeyemi', text: 'Hello Chinedu, how are your preparations for the mid-semester lab?', time: '10:05 AM', fromMe: false },
      { id: 2, sender: 'Chinedu Okafor', text: 'Good morning Sir! Preparations are going very well. I just finished implementing the binary search exercises.', time: '10:10 AM', fromMe: true },
      { id: 3, sender: 'Dr. K. Adeyemi', text: 'Excellent work. Please ensure you review the recursion chapter before tomorrow’s lab.', time: '10:14 AM', fromMe: false },
    ],
  },
  {
    id: 2,
    name: 'Prof. O. Balogun',
    role: 'MAT201 Lecturer',
    avatar: 'OB',
    lastMessage: 'Tutorial problem set 3 solutions are now posted on the notice board.',
    time: 'Yesterday',
    unread: 0,
    messages: [
      { id: 1, sender: 'Prof. O. Balogun', text: 'Tutorial problem set 3 solutions are now posted on the notice board.', time: 'Yesterday', fromMe: false },
    ],
  },
  {
    id: 3,
    name: 'Engr. T. Williams',
    role: 'CS201 Lecturer',
    avatar: 'TW',
    lastMessage: 'Great job on the linked list assignment.',
    time: 'Sep 20',
    unread: 0,
    messages: [
      { id: 1, sender: 'Engr. T. Williams', text: 'Great job on the linked list assignment. Your Big-O complexity analysis was spot on.', time: 'Sep 20', fromMe: false },
      { id: 2, sender: 'Chinedu Okafor', text: 'Thank you very much, Engr. Williams!', time: 'Sep 20', fromMe: true },
    ],
  },
]

export const NOTIFICATIONS_LIST = [
  { id: 1, title: 'Midterm Examination Schedule Published', category: 'Academic', date: '2 hours ago', read: false, message: 'The First Semester 2025/2026 examination timetable has been posted. Verify your examination halls.' },
  { id: 2, title: 'Tuition Balance Reminder (Due Oct 15)', category: 'Financial', date: 'Yesterday', read: false, message: 'Please ensure your outstanding balance of ₦1,250,000 is settled to secure exam clearance.' },
  { id: 3, title: 'CS201 Assignment 1 Graded', category: 'Academic', date: 'Sep 21, 2025', read: true, message: 'Engr. Williams has graded your assignment: 90/100 (A). Excellent implementation.' },
  { id: 4, title: 'Riverside ICT Portal Scheduled Upgrade', category: 'General', date: 'Sep 19, 2025', read: true, message: 'Campus WiFi and student portal will undergo maintenance this Sunday from 2 AM to 4 AM.' },
]

export const TIMETABLE_WEEK = {
  Monday: [
    { time: '09:00 - 10:30 AM', code: 'CS101', title: 'Intro to Computer Science', room: 'Computer Lab 2', instructor: 'Dr. Adeyemi', type: 'Lecture' },
    { time: '11:00 - 01:00 PM', code: 'PHY101', title: 'Physics for Engineers', room: 'Science Complex', instructor: 'Dr. Bello', type: 'Lab' },
    { time: '02:00 - 03:30 PM', code: 'MAT201', title: 'Calculus II', room: 'Lecture Theatre 1', instructor: 'Prof. Balogun', type: 'Lecture' },
  ],
  Tuesday: [
    { time: '09:00 - 10:30 AM', code: 'CS201', title: 'Data Structures & Algorithms', room: 'Computer Lab 1', instructor: 'Engr. Williams', type: 'Lecture' },
    { time: '11:00 - 12:30 PM', code: 'ENG102', title: 'Technical Communication', room: 'Hall B', instructor: 'Dr. Mrs. Eze', type: 'Seminar' },
  ],
  Wednesday: [
    { time: '09:00 - 10:30 AM', code: 'CS101', title: 'Intro to Computer Science', room: 'Computer Lab 2', instructor: 'Dr. Adeyemi', type: 'Practical' },
    { time: '01:00 - 03:00 PM', code: 'ENG102', title: 'Technical Communication', room: 'Hall B', instructor: 'Dr. Mrs. Eze', type: 'Workshop' },
  ],
  Thursday: [
    { time: '09:00 - 10:30 AM', code: 'CS201', title: 'Data Structures & Algorithms', room: 'Computer Lab 1', instructor: 'Engr. Williams', type: 'Lab' },
    { time: '11:00 - 12:30 PM', code: 'MAT201', title: 'Calculus II (Tutorial)', room: 'Lecture Theatre 1', instructor: 'Prof. Balogun', type: 'Tutorial' },
  ],
  Friday: [
    { time: '09:00 - 11:00 AM', code: 'PHY101', title: 'Physics Lab Experiments', room: 'Physics Lab 3', instructor: 'Dr. Bello', type: 'Practical' },
    { time: '02:00 - 04:00 PM', code: 'CS201', title: 'Coding Bootcamp / Project Review', room: 'Software Dev Studio', instructor: 'Engr. Williams', type: 'Review' },
  ],
}

export const ATTENDANCE_RECORDS = [
  { id: 1, date: 'Sep 22, 2025', course: 'CS101', session: 'Lecture', status: 'Present' },
  { id: 2, date: 'Sep 21, 2025', course: 'MAT201', session: 'Tutorial', status: 'Present' },
  { id: 3, date: 'Sep 19, 2025', course: 'PHY101', session: 'Practical Lab', status: 'Absent' },
  { id: 4, date: 'Sep 18, 2025', course: 'CS201', session: 'Lab Session', status: 'Present' },
  { id: 5, date: 'Sep 16, 2025', course: 'ENG102', session: 'Seminar', status: 'Present' },
]

export const EXAMS_LIST = [
  { code: 'CS101', title: 'Intro to Computer Science', date: 'Nov 10, 2025', time: '09:00 AM - 12:00 PM', hall: 'CBT Complex A', seat: 'Seat A-42', invigilator: 'Dr. Adeyemi' },
  { code: 'MAT201', title: 'Calculus II', date: 'Nov 12, 2025', time: '01:00 PM - 04:00 PM', hall: 'Main Auditorium', seat: 'Seat AUD-118', invigilator: 'Prof. Balogun' },
  { code: 'ENG102', title: 'Technical Communication', date: 'Nov 15, 2025', time: '09:00 AM - 11:00 AM', hall: 'New Exam Hall', seat: 'Seat NEH-89', invigilator: 'Dr. Eze' },
  { code: 'PHY101', title: 'Physics for Engineers', date: 'Nov 18, 2025', time: '09:00 AM - 12:00 PM', hall: 'Science Complex LT', seat: 'Seat SC-34', invigilator: 'Dr. Bello' },
  { code: 'CS201', title: 'Data Structures & Algorithms', date: 'Nov 21, 2025', time: '01:00 PM - 04:00 PM', hall: 'CBT Complex B', seat: 'Seat B-12', invigilator: 'Engr. Williams' },
]

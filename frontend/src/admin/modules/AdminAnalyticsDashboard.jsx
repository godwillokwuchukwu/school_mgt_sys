import React, { useState, useMemo, useEffect } from 'react'

const DEFAULT_ML_DATA = {
  supervised_classification: {
    models: {
      logistic_regression: {
        name: 'Multinomial Logistic Regression (L2 Regularized)',
        accuracy: 92.4,
        precision: 91.8,
        recall: 92.0,
        f1_score: 91.9,
        auc_roc: 0.942,
        solver: 'lbfgs',
      },
      random_forest: {
        name: 'Random Forest Ensemble Classifier (100 Trees)',
        accuracy: 95.2,
        precision: 94.7,
        recall: 95.5,
        f1_score: 95.1,
        auc_roc: 0.981,
        max_depth: 8,
      },
    },
    confusion_matrix: {
      classes: ['Distinction', 'Pass', 'At-Risk'],
      matrix: [
        [112, 6, 1],
        [4, 185, 8],
        [1, 5, 83],
      ],
      total_samples: 405,
    },
    feature_importance: [
      { feature: 'Attendance Rate (%)', importance: 38.2, color: '#09261d' },
      { feature: 'Continuous Assessment (CA)', importance: 28.4, color: '#10b981' },
      { feature: 'Assignment Submission Rate', importance: 18.1, color: '#3b82f6' },
      { feature: 'Prior Term Baseline GPA', importance: 11.5, color: '#f59e0b' },
      { feature: 'Class Participation', importance: 3.8, color: '#8b5cf6' },
    ],
  },
  supervised_regression: {
    model_name: 'Multi-variable Ridge & Polynomial Degree-2 Score Regressor',
    r2_score: 0.887,
    rmse: 4.12,
    mae: 3.05,
    coefficients: [
      { feature: 'Continuous Assessment (CA)', coefficient: 0.412, impact: '+0.41% score per CA point' },
      { feature: 'Attendance Percentage', coefficient: 0.345, impact: '+0.35% score per attendance %' },
      { feature: 'Homework Completion', coefficient: 0.188, impact: '+0.19% score per homework %' },
      { feature: 'Weekly Study Hours', coefficient: 0.092, impact: '+0.09% score per hour' },
      { feature: 'Late Arrival Penalty', coefficient: -0.154, impact: '-0.15% score per late day' },
    ],
    actual_vs_predicted: [
      { id: 1, student: 'Amina Bello', actual: 88.5, predicted: 87.2, residual: -1.3, class: 'SS 3A' },
      { id: 2, student: 'Chinedu Eze', actual: 74.0, predicted: 75.8, residual: 1.8, class: 'SS 2B' },
      { id: 3, student: 'David Adeleke', actual: 48.0, predicted: 49.5, residual: 1.5, class: 'JSS 3A' },
      { id: 4, student: 'Fatima Umar', actual: 92.0, predicted: 90.8, residual: -1.2, class: 'SS 1A' },
      { id: 5, student: 'Grace Okafor', actual: 63.5, predicted: 61.2, residual: -2.3, class: 'JSS 2C' },
      { id: 6, student: 'Ibrahim Sani', actual: 51.0, predicted: 53.4, residual: 2.4, class: 'SS 2A' },
      { id: 7, student: 'Kelechi Nwosu', actual: 82.0, predicted: 83.1, residual: 1.1, class: 'SS 3B' },
      { id: 8, student: 'Zainab Aliyu', actual: 42.0, predicted: 40.5, residual: -1.5, class: 'JSS 1B' },
      { id: 9, student: 'Samuel Oladipo', actual: 69.0, predicted: 70.2, residual: 1.2, class: 'SS 1C' },
      { id: 10, student: 'Tolu Adebayo', actual: 95.0, predicted: 94.1, residual: -0.9, class: 'SS 3A' },
    ],
  },
  unsupervised_clustering: {
    algorithm: 'K-Means Clustering (k=4)',
    optimal_k: 4,
    silhouette_score: 0.714,
    clusters: [
      {
        id: 0,
        name: 'Cluster 0: Scholastic Leaders',
        count: 234,
        percentage: 32.0,
        color: '#10b981',
        avg_academic: 89.2,
        avg_attendance: 96.8,
        action: 'Fast-track honors curriculum & peer leadership mentoring.',
      },
      {
        id: 1,
        name: 'Cluster 1: Diligent Attenders with Learning Gaps',
        count: 205,
        percentage: 28.0,
        color: '#3b82f6',
        avg_academic: 54.1,
        avg_attendance: 93.4,
        action: 'Subject-specific remedial clinics (Maths/Sciences) to bridge comprehension gaps.',
      },
      {
        id: 2,
        name: 'Cluster 2: High-Potential Disengaged',
        count: 161,
        percentage: 22.0,
        color: '#8b5cf6',
        avg_academic: 76.8,
        avg_attendance: 67.2,
        action: 'Attendance counseling, morning transit checks, and guardian check-ins.',
      },
      {
        id: 3,
        name: 'Cluster 3: Critically At-Risk Multi-Factor',
        count: 132,
        percentage: 18.0,
        color: '#ef4444',
        avg_academic: 41.5,
        avg_attendance: 61.0,
        action: 'Urgent intervention: academic counselor, bursar fee plan & remedial tutor.',
      },
    ],
    pca_scatter: [
      { id: 101, x: 2.6, y: 1.9, cluster: 0, name: 'Amina B.', class: 'SS 3A', score: 91, att: 98 },
      { id: 102, x: 2.2, y: 1.7, cluster: 0, name: 'Emeka O.', class: 'SS 3B', score: 88, att: 96 },
      { id: 103, x: 2.8, y: 2.1, cluster: 0, name: 'Fatima U.', class: 'SS 1A', score: 94, att: 99 },
      { id: 104, x: 2.1, y: 1.5, cluster: 0, name: 'Kelechi N.', class: 'SS 2A', score: 86, att: 95 },
      { id: 105, x: 2.5, y: 1.8, cluster: 0, name: 'Tolu A.', class: 'SS 3A', score: 95, att: 97 },
      { id: 106, x: -1.1, y: 1.8, cluster: 1, name: 'Chinedu E.', class: 'SS 2B', score: 56, att: 94 },
      { id: 107, x: -1.4, y: 1.5, cluster: 1, name: 'Grace O.', class: 'JSS 2C', score: 52, att: 92 },
      { id: 108, x: -1.0, y: 1.7, cluster: 1, name: 'Ibrahim S.', class: 'SS 2A', score: 55, att: 95 },
      { id: 109, x: -1.5, y: 1.4, cluster: 1, name: 'Samuel O.', class: 'SS 1C', score: 51, att: 91 },
      { id: 110, x: -0.9, y: 1.9, cluster: 1, name: 'Ngozi K.', class: 'JSS 3B', score: 58, att: 96 },
      { id: 111, x: 1.6, y: -2.0, cluster: 2, name: 'David A.', class: 'JSS 3A', score: 79, att: 68 },
      { id: 112, x: 1.4, y: -2.3, cluster: 2, name: 'Babatunde R.', class: 'SS 2C', score: 75, att: 65 },
      { id: 113, x: 1.8, y: -1.9, cluster: 2, name: 'Folake M.', class: 'SS 1B', score: 81, att: 70 },
      { id: 114, x: 1.3, y: -2.2, cluster: 2, name: 'Victor J.', class: 'SS 3B', score: 74, att: 66 },
      { id: 115, x: -2.4, y: -1.8, cluster: 3, name: 'Zainab A.', class: 'JSS 1B', score: 38, att: 59 },
      { id: 116, x: -2.7, y: -2.1, cluster: 3, name: 'Uche D.', class: 'JSS 2A', score: 42, att: 62 },
      { id: 117, x: -2.3, y: -1.7, cluster: 3, name: 'Sadiq H.', class: 'SS 1A', score: 40, att: 60 },
      { id: 118, x: -2.6, y: -2.0, cluster: 3, name: 'Blessing O.', class: 'JSS 3C', score: 44, att: 63 },
    ],
  },
}

export default function AdminAnalyticsDashboard({
  dashboardData = {},
  onLaunchSimulator,
}) {
  // Navigation & High-level State
  const [activeTab, setActiveTab] = useState('descriptive') // 'descriptive' | 'diagnostic' | 'predictive' | 'prescriptive'
  const [mlSubTab, setMlSubTab] = useState('supervised_classification') // 'supervised_classification' | 'supervised_regression' | 'unsupervised_clustering' | 'time_series'
  const [toastMessage, setToastMessage] = useState(null)
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Live database figures from props
  const kpis = dashboardData?.kpis || {}
  const totalStudents = kpis?.students?.count ?? (dashboardData?.students?.length || 50)
  const totalTeachers = kpis?.teachers?.count ?? (dashboardData?.teachers?.length || 12)
  const totalStaff = kpis?.staff?.count ?? (dashboardData?.staff?.length || 8)
  const attendanceRate = kpis?.attendance?.rate || '94.3%'
  const finance = dashboardData?.finance_reconciliation || {}
  const invoicedRev = finance?.invoiced_revenue ?? 1750000
  const collectedRev = finance?.collected_revenue ?? 1050000
  const outstandingRev = finance?.outstanding_fees ?? 700000
  const monthlyPayroll = finance?.monthly_payroll ?? 7327000
  const totalExpenses = finance?.total_expenses ?? 2445000

  // =========================================================================
  // CHART 1: Enrollment Trend (Dynamic Slicers: Year & Granularity)
  // =========================================================================
  const [enrollYear, setEnrollYear] = useState('all') // 'all' | '2026' | '2025' | '2024' | '2023'
  const [enrollGranularity, setEnrollGranularity] = useState('annual') // 'annual' | 'termly' | 'monthly'

  const enrollmentData = useMemo(() => {
    // 1. ALL YEARS MACRO VIEW
    if (enrollYear === 'all') {
      if (enrollGranularity === 'termly') {
        return {
          title: 'Macro Term-by-Term Enrollment Progression (3-Term Average)',
          badge: 'Average 722 / Term',
          points: [
            { label: '1st Term', val: 712, detail: '1st Term: 712 active enrollments' },
            { label: '2nd Term', val: 724, detail: '2nd Term: 724 active enrollments (+1.7%)' },
            { label: '3rd Term', val: 732, detail: '3rd Term: 732 active enrollments (+1.1%)' },
          ],
          min: 680,
          max: 760,
        }
      }
      if (enrollGranularity === 'monthly') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const monthlyAverages = [680, 686, 692, 698, 705, 712, 716, 722, 728, 732, 735, 738]
        return {
          title: 'Macro 12-Month Rolling Enrollment Index (All Sessions)',
          badge: '+8.5% Annual Growth',
          points: months.map((m, i) => ({
            label: m,
            val: monthlyAverages[i],
            detail: `${m}: ${monthlyAverages[i]} average enrollments`,
          })),
          min: 660,
          max: 750,
        }
      }
      return {
        title: '5-Year Macro Growth Trajectory (2022 - 2026)',
        badge: '+26.2% 5-Yr Growth',
        points: [
          { label: '2022', val: 580, detail: '2022: 580 students' },
          { label: '2023', val: 620, detail: '2023: 620 students (+6.9%)' },
          { label: '2024', val: 670, detail: '2024: 670 students (+8.1%)' },
          { label: '2025', val: 705, detail: '2025: 705 students (+5.2%)' },
          { label: '2026', val: 732, detail: '2026: 732 students (+3.8%)' },
        ],
        min: 520,
        max: 780,
      }
    }

    // 2. SPECIFIC YEAR SELECTED
    const yearConfig = {
      '2026': {
        annual: [{ label: 'Baseline', val: 705 }, { label: 'Target', val: 750 }, { label: 'Enrolled (Live)', val: 732 }],
        annualMin: 680,
        annualMax: 770,
        termly: [
          { label: '1st Term', val: 712, detail: '712 active intakes' },
          { label: '2nd Term', val: 724, detail: '724 active intakes' },
          { label: '3rd Term', val: 732, detail: '732 active intakes' },
        ],
        monthly: [706, 710, 714, 718, 720, 722, 725, 728, 732, 735, 738, 740],
        badge: '732 Live Students',
      },
      '2025': {
        annual: [{ label: 'Baseline', val: 670 }, { label: 'Target', val: 710 }, { label: 'Enrolled', val: 705 }],
        annualMin: 640,
        annualMax: 730,
        termly: [
          { label: '1st Term', val: 678, detail: '678 enrolled' },
          { label: '2nd Term', val: 692, detail: '692 enrolled' },
          { label: '3rd Term', val: 705, detail: '705 completed' },
        ],
        monthly: [672, 675, 680, 684, 688, 691, 695, 698, 702, 705, 705, 705],
        badge: '705 Completed',
      },
      '2024': {
        annual: [{ label: 'Baseline', val: 620 }, { label: 'Target', val: 680 }, { label: 'Enrolled', val: 670 }],
        annualMin: 600,
        annualMax: 700,
        termly: [
          { label: '1st Term', val: 635, detail: '635 enrolled' },
          { label: '2nd Term', val: 654, detail: '654 enrolled' },
          { label: '3rd Term', val: 670, detail: '670 completed' },
        ],
        monthly: [625, 630, 635, 642, 648, 653, 658, 662, 667, 670, 670, 670],
        badge: '670 Completed',
      },
      '2023': {
        annual: [{ label: 'Baseline', val: 580 }, { label: 'Target', val: 630 }, { label: 'Enrolled', val: 620 }],
        annualMin: 550,
        annualMax: 650,
        termly: [
          { label: '1st Term', val: 590, detail: '590 enrolled' },
          { label: '2nd Term', val: 608, detail: '608 enrolled' },
          { label: '3rd Term', val: 620, detail: '620 completed' },
        ],
        monthly: [584, 588, 592, 598, 604, 608, 612, 615, 618, 620, 620, 620],
        badge: '620 Completed',
      },
    }

    const cfg = yearConfig[enrollYear] || yearConfig['2026']

    if (enrollGranularity === 'termly') {
      return {
        title: `Academic Year ${enrollYear} Termly Progression`,
        badge: cfg.badge,
        points: cfg.termly,
        min: Math.min(...cfg.termly.map((p) => p.val)) - 25,
        max: Math.max(...cfg.termly.map((p) => p.val)) + 25,
      }
    }

    if (enrollGranularity === 'monthly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return {
        title: `Academic Year ${enrollYear} Month-by-Month Enrollment`,
        badge: `${enrollYear} Monthly Analysis`,
        points: months.map((m, i) => ({
          label: m,
          val: cfg.monthly[i],
          detail: `${m} ${enrollYear}: ${cfg.monthly[i]} students`,
        })),
        min: Math.min(...cfg.monthly) - 20,
        max: Math.max(...cfg.monthly) + 20,
      }
    }

    // Default Annual view for selected year
    return {
      title: `Academic Year ${enrollYear} Target vs. Final Intake`,
      badge: cfg.badge,
      points: cfg.annual.map((a) => ({ ...a, detail: `${a.label}: ${a.val} students` })),
      min: cfg.annualMin,
      max: cfg.annualMax,
    }
  }, [enrollYear, enrollGranularity])

  // =========================================================================
  // CHART 2: Class Cohort Breakdown (Division & Metric Slicers)
  // =========================================================================
  const [cohortDivision, setCohortDivision] = useState('all') // 'all' | 'junior' | 'senior'
  const [cohortMetric, setCohortMetric] = useState('count') // 'count' | 'capacity'

  const cohortData = useMemo(() => {
    let classes = [
      { name: 'JSS 1', count: 128, cap: 140, type: 'junior', male: 66, female: 62 },
      { name: 'JSS 2', count: 134, cap: 140, type: 'junior', male: 70, female: 64 },
      { name: 'JSS 3', count: 118, cap: 130, type: 'junior', male: 60, female: 58 },
      { name: 'SS 1', count: 142, cap: 150, type: 'senior', male: 74, female: 68 },
      { name: 'SS 2', count: 112, cap: 120, type: 'senior', male: 59, female: 53 },
      { name: 'SS 3', count: 98, cap: 110, type: 'senior', male: 52, female: 46 },
    ]
    if (cohortDivision === 'junior') classes = classes.filter((c) => c.type === 'junior')
    if (cohortDivision === 'senior') classes = classes.filter((c) => c.type === 'senior')
    return classes
  }, [cohortDivision])

  // =========================================================================
  // CHART 3: Gender & Demographics (Cohort Slicer)
  // =========================================================================
  const [genderCohort, setGenderCohort] = useState('all') // 'all' | 'junior' | 'senior'
  const genderStats = useMemo(() => {
    if (genderCohort === 'junior') return { male: 196, female: 184, total: 380, malePct: 51.6, femalePct: 48.4 }
    if (genderCohort === 'senior') return { male: 185, female: 167, total: 352, malePct: 52.6, femalePct: 47.4 }
    return { male: 381, female: 351, total: 732, malePct: 52.1, femalePct: 47.9 }
  }, [genderCohort])

  // =========================================================================
  // CHART 4: Student Attendance Trend (Period & Cohort Slicers)
  // =========================================================================
  const [attendancePeriod, setAttendancePeriod] = useState('30days') // '30days' | 'term' | 'weekly'
  const [attendanceCohort, setAttendanceCohort] = useState('all') // 'all' | 'junior' | 'senior'

  const attendanceCurve = useMemo(() => {
    const base = attendanceCohort === 'senior' ? 93.4 : attendanceCohort === 'junior' ? 91.8 : 92.6
    if (attendancePeriod === 'weekly') {
      return [
        { label: 'Mon', val: Number((base - 1.2).toFixed(1)) },
        { label: 'Tue', val: Number((base + 0.8).toFixed(1)) },
        { label: 'Wed', val: Number((base + 1.4).toFixed(1)) },
        { label: 'Thu', val: Number((base + 0.2).toFixed(1)) },
        { label: 'Fri', val: Number((base - 1.8).toFixed(1)) },
      ]
    }
    if (attendancePeriod === 'term') {
      return [
        { label: 'Wk 1', val: 94.2 },
        { label: 'Wk 2', val: 93.8 },
        { label: 'Wk 3', val: 92.5 },
        { label: 'Wk 4', val: 91.9 },
        { label: 'Wk 5', val: 93.1 },
        { label: 'Wk 6', val: 92.6 },
      ]
    }
    // 30 Days sample curve
    return [
      { label: 'Day 1', val: 91.5 },
      { label: 'Day 5', val: 92.8 },
      { label: 'Day 10', val: 90.9 },
      { label: 'Day 15', val: 93.7 },
      { label: 'Day 20', val: 92.2 },
      { label: 'Day 25', val: 94.0 },
      { label: 'Day 30', val: 92.6 },
    ]
  }, [attendancePeriod, attendanceCohort])

  // =========================================================================
  // CHART 5: Faculty vs Staff Punctuality (Group Slicer)
  // =========================================================================
  const [punctualityGroup, setPunctualityGroup] = useState('all') // 'all' | 'faculty' | 'staff'

  // =========================================================================
  // CHART 6: Grade Distribution (Subject Slicer)
  // =========================================================================
  const [gradeSubject, setGradeSubject] = useState('composite') // 'composite' | 'math' | 'english' | 'science'

  const gradeHistogram = useMemo(() => {
    if (gradeSubject === 'math') {
      return [
        { grade: 'A (75%+)', pct: 32, count: 234, color: '#10b981' },
        { grade: 'B (65-74)', pct: 30, count: 220, color: '#3b82f6' },
        { grade: 'C (50-64)', pct: 24, count: 176, color: '#f59e0b' },
        { grade: 'D (40-49)', pct: 10, count: 73, color: '#f97316' },
        { grade: 'F (<40)', pct: 4, count: 29, color: '#ef4444' },
      ]
    }
    if (gradeSubject === 'english') {
      return [
        { grade: 'A (75%+)', pct: 41, count: 300, color: '#10b981' },
        { grade: 'B (65-74)', pct: 36, count: 264, color: '#3b82f6' },
        { grade: 'C (50-64)', pct: 17, count: 124, color: '#f59e0b' },
        { grade: 'D (40-49)', pct: 5, count: 37, color: '#f97316' },
        { grade: 'F (<40)', pct: 1, count: 7, color: '#ef4444' },
      ]
    }
    if (gradeSubject === 'science') {
      return [
        { grade: 'A (75%+)', pct: 35, count: 256, color: '#10b981' },
        { grade: 'B (65-74)', pct: 32, count: 234, color: '#3b82f6' },
        { grade: 'C (50-64)', pct: 22, count: 161, color: '#f59e0b' },
        { grade: 'D (40-49)', pct: 8, count: 59, color: '#f97316' },
        { grade: 'F (<40)', pct: 3, count: 22, color: '#ef4444' },
      ]
    }
    // Composite
    return [
      { grade: 'A (75%+)', pct: 38, count: 278, color: '#10b981' },
      { grade: 'B (65-74)', pct: 34, count: 249, color: '#3b82f6' },
      { grade: 'C (50-64)', pct: 20, count: 146, color: '#f59e0b' },
      { grade: 'D (40-49)', pct: 6, count: 44, color: '#f97316' },
      { grade: 'F (<40)', pct: 2, count: 15, color: '#ef4444' },
    ]
  }, [gradeSubject])

  // =========================================================================
  // CHART 7: Fee Invoicing vs Collection (Term Slicer)
  // =========================================================================
  const [feeTerm, setFeeTerm] = useState('current') // 'current' | 'past_term' | 'annual'

  const feeComparison = useMemo(() => {
    if (feeTerm === 'past_term') {
      return { invoiced: 2400000, collected: 2280000, outstanding: 120000, rate: '95.0%', termName: 'Previous Term (3rd Term 2024/25)' }
    }
    if (feeTerm === 'annual') {
      return { invoiced: 6850000, collected: 5900000, outstanding: 950000, rate: '86.1%', termName: 'Full Academic Year 2024/25' }
    }
    return {
      invoiced: invoicedRev,
      collected: collectedRev,
      outstanding: outstandingRev,
      rate: `${Math.round((collectedRev / invoicedRev) * 100)}%`,
      termName: 'Current Session (1st Term 2025/26)',
    }
  }, [feeTerm, invoicedRev, collectedRev, outstandingRev])

  // =========================================================================
  // CHART 8: Expenditure Allocation (Timeframe Slicer: Monthly vs Quarterly)
  // =========================================================================
  const [expensePeriod, setExpensePeriod] = useState('monthly') // 'monthly' | 'quarterly' | 'annual'

  const expenseData = useMemo(() => {
    if (expensePeriod === 'quarterly') {
      return {
        total: '₦29.31M',
        totalNum: 29310000,
        subLabel: 'Quarterly Outflow (Q3)',
        segments: [
          { label: 'Payroll', amount: '₦21.10M', pct: 72, color: '#09261d' },
          { label: 'Facilities & Labs', amount: '₦5.28M', pct: 18, color: '#10b981' },
          { label: 'Utilities & Tech', amount: '₦2.93M', pct: 10, color: '#3b82f6' },
        ],
      }
    }
    if (expensePeriod === 'annual') {
      return {
        total: '₦117.26M',
        totalNum: 117260000,
        subLabel: 'Annual OpEx Budget',
        segments: [
          { label: 'Staff Salaries', amount: '₦76.22M', pct: 65, color: '#09261d' },
          { label: 'Campus Dev & CapEx', amount: '₦25.80M', pct: 22, color: '#10b981' },
          { label: 'Operations & Tech', amount: '₦15.24M', pct: 13, color: '#3b82f6' },
        ],
      }
    }
    return {
      total: '₦9.77M',
      totalNum: 9772000,
      subLabel: 'Monthly Outflow',
      segments: [
        { label: 'Payroll', amount: '₦7.33M', pct: 75, color: '#09261d' },
        { label: 'Supplies & OpEx', amount: '₦2.44M', pct: 25, color: '#10b981' },
      ],
    }
  }, [expensePeriod])

  // =========================================================================
  // CHART 9: Admission Funnel (Intake Cycle Slicer)
  // =========================================================================
  const [intakeCycle, setIntakeCycle] = useState('2026') // '2026' | '2025'

  const funnelData = useMemo(() => {
    if (intakeCycle === '2025') {
      return {
        title: '2025/26 Completed Cycle',
        stages: [
          { stage: 'Inquiries & Leads', val: 125, pct: '100%', w: '100%', col: '#09261d' },
          { stage: 'Entrance Exam Sat', val: 80, pct: '64.0%', w: '64%', col: '#047857' },
          { stage: 'Admission Offered', val: 48, pct: '38.4%', w: '38.4%', col: '#10b981' },
          { stage: 'Enrolled & Paid', val: 36, pct: '28.8%', w: '28.8%', col: '#34d399' },
        ],
        conversionRate: '28.8%',
        enrolledCount: 36,
        targetNote: 'Target: 35 (Achieved)',
      }
    }
    return {
      title: '2026/27 Live Intake',
      stages: [
        { stage: 'Inquiries & Leads', val: 142, pct: '100%', w: '100%', col: '#09261d' },
        { stage: 'Entrance Exam Sat', val: 86, pct: '60.5%', w: '60.5%', col: '#047857' },
        { stage: 'Admission Offered', val: 54, pct: '38.0%', w: '38.0%', col: '#10b981' },
        { stage: 'Enrolled & Paid', val: 41, pct: '28.8%', w: '28.8%', col: '#34d399' },
      ],
      conversionRate: '28.8%',
      enrolledCount: 41,
      targetNote: 'Target: 50 (In Progress)',
    }
  }, [intakeCycle])

  // =========================================================================
  // CHART 10: Digital Traffic (User Role Slicer)
  // =========================================================================
  const [trafficRole, setTrafficRole] = useState('all') // 'all' | 'parents' | 'students'

  const trafficData = useMemo(() => {
    if (trafficRole === 'parents') {
      return {
        label: 'Parent Portal Traffic',
        peakSummary: 'Peak Session: 2.5k Concurrent (Evening)',
        avgResponse: '38ms Response',
        points: [
          { time: '6am', val: 410 },
          { time: '9am', val: 320 },
          { time: '12pm', val: 890 },
          { time: '3pm', val: 540 },
          { time: '6pm', val: 1940 },
          { time: '9pm', val: 2480 },
          { time: 'Now', val: 2150 },
        ],
        min: 200,
        max: 2700,
      }
    }
    if (trafficRole === 'students') {
      return {
        label: 'Student LMS Traffic',
        peakSummary: 'Peak Session: 1.6k Concurrent (Midday)',
        avgResponse: '45ms Response',
        points: [
          { time: '6am', val: 210 },
          { time: '9am', val: 1520 },
          { time: '12pm', val: 1560 },
          { time: '3pm', val: 1580 },
          { time: '6pm', val: 950 },
          { time: '9pm', val: 730 },
          { time: 'Now', val: 680 },
        ],
        min: 150,
        max: 1800,
      }
    }
    return {
      label: 'All Active Users',
      peakSummary: 'Peak Session: 3.2k Concurrent (Overall)',
      avgResponse: '42ms Response',
      points: [
        { time: '6am', val: 620 },
        { time: '9am', val: 1840 },
        { time: '12pm', val: 2450 },
        { time: '3pm', val: 2120 },
        { time: '6pm', val: 2890 },
        { time: '9pm', val: 3210 },
        { time: 'Now', val: 2830 },
      ],
      min: 500,
      max: 3500,
    }
  }, [trafficRole])

  // =========================================================================
  // CHART 11: Subject Competency Heatmap (Class Tier Slicer)
  // =========================================================================
  const [masteryClass, setMasteryClass] = useState('all') // 'all' | 'junior' | 'senior'

  const masteryData = useMemo(() => {
    const raw = [
      { subj: 'Mathematics', jss: 78, ss: 72, avg: 75, col: '#10b981' },
      { subj: 'English Lang', jss: 84, ss: 82, avg: 83, col: '#10b981' },
      { subj: 'Sciences (Bio/Phys/Chem)', jss: 74, ss: 68, avg: 71, col: '#3b82f6' },
      { subj: 'ICT & Coding', jss: 91, ss: 88, avg: 90, col: '#10b981' },
      { subj: 'Economics & Commerce', jss: 76, ss: 70, avg: 73, col: '#3b82f6' },
    ]

    const processed = raw.map((item) => {
      let activeScore = item.avg
      if (masteryClass === 'junior') activeScore = item.jss
      if (masteryClass === 'senior') activeScore = item.ss
      return {
        subj: item.subj,
        score: activeScore,
        col: activeScore >= 75 ? '#10b981' : activeScore >= 65 ? '#3b82f6' : '#f59e0b',
      }
    })

    const totalScore = processed.reduce((acc, curr) => acc + curr.score, 0)
    const overallAvg = (totalScore / processed.length).toFixed(1)

    return {
      items: processed,
      overallAvg,
      tierTitle: masteryClass === 'junior' ? 'Junior Secondary (JSS 1-3)' : masteryClass === 'senior' ? 'Senior Secondary (SS 1-3)' : 'Whole School Composite',
    }
  }, [masteryClass])

  // =========================================================================
  // SECTION 2: DIAGNOSTIC SLICERS & DYNAMIC DATA
  // =========================================================================
  const [diagAbsenceCohort, setDiagAbsenceCohort] = useState('all') // 'all' | 'junior' | 'senior'
  const [diagAcademicFocus, setDiagAcademicFocus] = useState('all') // 'all' | 'stem' | 'arts'
  const [diagFeeAgingHead, setDiagFeeAgingHead] = useState('all') // 'all' | 'tuition' | 'boarding' | 'transport'
  const [diagDropoffChannel, setDiagDropoffChannel] = useState('all') // 'all' | 'portal' | 'referral'

  const diagAbsenceData = useMemo(() => {
    if (diagAbsenceCohort === 'junior') {
      return [
        { cause: 'Medical & Seasonal Flu / Malaria', pct: 56, count: '92 days', color: '#10b981' },
        { cause: 'Transit Delay & School Bus Logistics', pct: 22, count: '36 days', color: '#f59e0b' },
        { cause: 'Family Travel & Personal Commitments', pct: 16, count: '26 days', color: '#3b82f6' },
        { cause: 'Unexcused Absence & Truancy', pct: 6, count: '10 days', color: '#ef4444' },
      ]
    }
    if (diagAbsenceCohort === 'senior') {
      return [
        { cause: 'Transit Delay & Lekki Expressway Bottlenecks', pct: 36, count: '48 days', color: '#f59e0b' },
        { cause: 'Medical & Seasonal Flu / Malaria', pct: 34, count: '45 days', color: '#10b981' },
        { cause: 'Family Travel & External Exams Preparation', pct: 18, count: '24 days', color: '#3b82f6' },
        { cause: 'Unexcused Absence & Truancy', pct: 12, count: '16 days', color: '#ef4444' },
      ]
    }
    return [
      { cause: 'Medical & Seasonal Flu / Malaria', pct: 48, count: '138 days', color: '#10b981' },
      { cause: 'Transit Delay & Lekki Expressway Work', pct: 24, count: '69 days', color: '#f59e0b' },
      { cause: 'Family Travel & Personal Commitments', pct: 18, count: '52 days', color: '#3b82f6' },
      { cause: 'Unexcused Absence & Truancy', pct: 10, count: '29 days', color: '#ef4444' },
    ]
  }, [diagAbsenceCohort])

  const diagAcademicData = useMemo(() => {
    if (diagAcademicFocus === 'stem') {
      return [
        { factor: 'Physics/Chem Laboratory Session Deficit', impact: 'Very Strong Correlation (r = 0.86)', color: '#dc2626' },
        { factor: 'Advanced Mathematics Homework Gaps', impact: 'Strong Impact (r = 0.79)', color: '#ea580c' },
        { factor: 'Numeracy Prerequisite Readiness Gap', impact: 'Moderate Impact (r = 0.64)', color: '#f59e0b' },
        { factor: 'Practice Problem Repetition Frequency', impact: 'Moderate Impact (r = 0.55)', color: '#3b82f6' },
      ]
    }
    if (diagAcademicFocus === 'arts') {
      return [
        { factor: 'Essay Composition & Literacy Latency', impact: 'Strong Correlation (r = 0.81)', color: '#dc2626' },
        { factor: 'Library Reading & Comprehension Deficit', impact: 'High Impact (r = 0.75)', color: '#ea580c' },
        { factor: 'Oral Presentation & Rhetoric Anxiety', impact: 'Moderate Impact (r = 0.62)', color: '#f59e0b' },
        { factor: 'Termly Project Submission Adherence', impact: 'Moderate Impact (r = 0.50)', color: '#3b82f6' },
      ]
    }
    return [
      { factor: 'Homework Non-Submission Rate', impact: 'Strong Correlation (r = 0.82)', color: '#dc2626' },
      { factor: 'Term Absence Rate Exceeding 10%', impact: 'High Impact (r = 0.74)', color: '#ea580c' },
      { factor: 'Teacher Student Ratio in SS 2 (> 25:1)', impact: 'Moderate Impact (r = 0.58)', color: '#f59e0b' },
      { factor: 'Lack of Practical Lab Sessions', impact: 'Moderate Impact (r = 0.51)', color: '#3b82f6' },
    ]
  }, [diagAcademicFocus])

  const diagFeeAgingData = useMemo(() => {
    if (diagFeeAgingHead === 'tuition') {
      return {
        total: '₦500k',
        note: 'Primary Tuition Fee Balances',
        bars: [
          { label: '0-15 Days', val: '₦240k', h: 120, color: '#10b981' },
          { label: '16-30 Days', val: '₦150k', h: 80, color: '#3b82f6' },
          { label: '31-60 Days', val: '₦75k', h: 42, color: '#f59e0b' },
          { label: '60+ Days', val: '₦35k', h: 22, color: '#ef4444' },
        ],
      }
    }
    if (diagFeeAgingHead === 'boarding') {
      return {
        total: '₦145k',
        note: 'Boarding House Meal & Laundry Dues',
        bars: [
          { label: '0-15 Days', val: '₦60k', h: 100, color: '#10b981' },
          { label: '16-30 Days', val: '₦45k', h: 75, color: '#3b82f6' },
          { label: '31-60 Days', val: '₦25k', h: 45, color: '#f59e0b' },
          { label: '60+ Days', val: '₦15k', h: 28, color: '#ef4444' },
        ],
      }
    }
    if (diagFeeAgingHead === 'transport') {
      return {
        total: '₦55k',
        note: 'School Bus Route Subscriptions',
        bars: [
          { label: '0-15 Days', val: '₦20k', h: 90, color: '#10b981' },
          { label: '16-30 Days', val: '₦15k', h: 70, color: '#3b82f6' },
          { label: '31-60 Days', val: '₦10k', h: 50, color: '#f59e0b' },
          { label: '60+ Days', val: '₦10k', h: 50, color: '#ef4444' },
        ],
      }
    }
    return {
      total: '₦700k',
      note: '₦700,000 pending accounts receivable breakdown',
      bars: [
        { label: '0-15 Days', val: '₦320k', h: 110, color: '#10b981' },
        { label: '16-30 Days', val: '₦210k', h: 80, color: '#3b82f6' },
        { label: '31-60 Days', val: '₦110k', h: 48, color: '#f59e0b' },
        { label: '60+ Days', val: '₦60k', h: 28, color: '#ef4444' },
      ],
    }
  }, [diagFeeAgingHead])

  const diagDropoffData = useMemo(() => {
    if (diagDropoffChannel === 'portal') {
      return [
        { stage: 'Mobile Document Upload Format Friction', drop: '48% Drop-off rate', reason: 'Non-PDF mobile camera image sizing failure' },
        { stage: 'Online Debit Card Gateway Timeout', drop: '32% Drop-off rate', reason: 'Interswitch/Paystack OTP delivery latency' },
        { stage: 'Application Session Expiry on Resume', drop: '14% Drop-off rate', reason: 'Draft form state not saved automatically' },
      ]
    }
    if (diagDropoffChannel === 'referral') {
      return [
        { stage: 'Entrance Exam Scheduling Conflict', drop: '35% Drop-off rate', reason: 'Clashes with other private school test dates' },
        { stage: 'Family Relocation Decision Uncertainty', drop: '30% Drop-off rate', reason: 'Awaiting corporate job transfer letters' },
        { stage: 'Sibling Fee Discount Negotiations', drop: '20% Drop-off rate', reason: 'Awaiting bursar multi-child waiver approval' },
      ]
    }
    return [
      { stage: 'Document Upload (Birth Certificate / Transcripts)', drop: '42% Drop-off rate', reason: 'Mobile upload file format friction' },
      { stage: 'Entrance Exam Fee Payment', drop: '28% Drop-off rate', reason: 'Awaiting multiple entrance exams' },
      { stage: 'Acceptance Deposit (Post-Offer)', drop: '16% Drop-off rate', reason: 'Evaluating relocation/boarding options' },
    ]
  }, [diagDropoffChannel])

  // =========================================================================
  // MACHINE LEARNING MODELS STATE & SIMULATOR
  // =========================================================================
  const [mlData, setMlData] = useState(DEFAULT_ML_DATA)
  const [selectedClust, setSelectedClust] = useState('all') // 'all' | 0 | 1 | 2 | 3
  const [selectedClassifier, setSelectedClassifier] = useState('random_forest') // 'logistic_regression' | 'random_forest'
  const [scenarioGrowth, setScenarioGrowth] = useState('moderate') // 'conservative' | 'moderate' | 'aggressive'

  // What-If Simulator Inputs
  const [simAttendance, setSimAttendance] = useState(85)
  const [simCA, setSimCA] = useState(72)
  const [simAssignment, setSimAssignment] = useState(80)
  const [simStudyHours, setSimStudyHours] = useState(12)

  // Fetch or populate ML Model Benchmarks
  useEffect(() => {
    fetch('/api/reporting/analytics/models/')
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error('API offline')
      })
      .then((data) => {
        const confMatrix =
          data.supervised_classification?.confusion_matrix ||
          data.confusion_matrix ||
          DEFAULT_ML_DATA.supervised_classification.confusion_matrix
        const featImp =
          data.supervised_classification?.feature_importance ||
          data.feature_importance ||
          DEFAULT_ML_DATA.supervised_classification.feature_importance

        setMlData({
          ...DEFAULT_ML_DATA,
          ...data,
          confusion_matrix: confMatrix,
          feature_importance: featImp,
          supervised_classification: {
            ...DEFAULT_ML_DATA.supervised_classification,
            ...(data.supervised_classification || {}),
            confusion_matrix: confMatrix,
            feature_importance: featImp,
          },
          supervised_regression: {
            ...DEFAULT_ML_DATA.supervised_regression,
            ...(data.supervised_regression || {}),
          },
          unsupervised_clustering: {
            ...DEFAULT_ML_DATA.unsupervised_clustering,
            ...(data.unsupervised_clustering || {}),
          },
        })
      })
      .catch(() => {
        setMlData(DEFAULT_ML_DATA)
      })
  }, [])

  // Live calculation for the ML What-If Simulator
  const simResult = useMemo(() => {
    const studyFactor = Math.min(100.0, simStudyHours * 7.5)
    let score =
      simAttendance * 0.38 +
      simCA * 0.32 +
      simAssignment * 0.20 +
      studyFactor * 0.10
    score = Math.round(Math.min(100.0, Math.max(0.0, score)) * 10) / 10

    if (score >= 70) {
      const pDist = Math.round((0.70 + (score - 70) * 0.01) * 100)
      const pPass = Math.max(1, 100 - pDist - 2)
      return {
        score,
        grade: 'A (Distinction / First Class)',
        riskLevel: 'Low Academic Risk',
        badgeColor: '#10b981',
        bg: '#ecfdf5',
        probDist: pDist,
        probPass: pPass,
        probRisk: 2,
        prescription: 'Recommend enrollment in Advanced Honors Seminar and peer tutoring program.',
      }
    } else if (score >= 50) {
      const pPass = Math.round((0.72 + (score - 50) * 0.008) * 100)
      const pDist = Math.round((score - 50) * 0.9)
      const pRisk = Math.max(2, 100 - pPass - pDist)
      return {
        score,
        grade: 'B/C (Credit / Pass)',
        riskLevel: 'Moderate Risk (Requires Support)',
        badgeColor: '#f59e0b',
        bg: '#fffbeb',
        probDist: pDist,
        probPass: pPass,
        probRisk: pRisk,
        prescription: 'Assign bi-weekly Continuous Assessment revision and homework tracking.',
      }
    } else {
      const pRisk = Math.min(96, Math.round((0.75 + (50 - score) * 0.005) * 100))
      const pPass = Math.max(3, 100 - pRisk - 1)
      return {
        score,
        grade: 'F (At-Risk of Academic Failure)',
        riskLevel: 'Critical Risk (Immediate Action)',
        badgeColor: '#ef4444',
        bg: '#fef2f2',
        probDist: 1,
        probPass: pPass,
        probRisk: pRisk,
        prescription: 'Urgent Counselor Consultation + Mandatory After-School Remedial Clinic.',
      }
    }
  }, [simAttendance, simCA, simAssignment, simStudyHours])

  // Prescriptive Interventions State
  const [interventions, setInterventions] = useState([
    {
      id: 'REC-001',
      title: 'Deploy Automated Fee Installment Reminders',
      dept: 'Bursary & Finance',
      impact: '₦450k cash flow acceleration in 14 days',
      priority: 'High',
      status: 'Ready to Deploy',
    },
    {
      id: 'REC-002',
      title: 'Conduct Mathematics Support Clinic for SS 2',
      dept: 'Academics',
      impact: 'Mitigate risk of 8 students failing term exams',
      priority: 'High',
      status: 'Scheduled',
    },
    {
      id: 'REC-003',
      title: 'Implement Lekki Morning Bus Shuttle Route',
      dept: 'Operations & Fleet',
      impact: 'Reduce teacher and student late check-ins by 72%',
      priority: 'Medium',
      status: 'Under Review',
    },
    {
      id: 'REC-004',
      title: 'Fast-track Secondary School Admission Offer Letters',
      dept: 'Admissions Office',
      impact: 'Secure 14 high-probability enrollments before term start',
      priority: 'High',
      status: 'Ready to Deploy',
    },
    {
      id: 'REC-005',
      title: 'Solar Inverter Capacity Expansion for ICT Lab',
      dept: 'Estate & Infrastructure',
      impact: 'Save ₦380,000/month on diesel generator fuel expenses',
      priority: 'Medium',
      status: 'Approved',
    },
  ])

  const handleExecuteIntervention = (id) => {
    setInterventions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Executed ✓' } : item))
    )
    showToast(`Institutional intervention ${id} triggered successfully!`)
  }

  // Export Analytics CSV
  const handleExportAnalytics = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Category,Metric,Value,Period\n' +
      `Enrollment,Total Active,${totalStudents},2025/2026\n` +
      `Finance,Invoiced Revenue,${invoicedRev},1st Term\n` +
      `Finance,Collected Revenue,${collectedRev},1st Term\n` +
      `Finance,Outstanding Fees,${outstandingRev},1st Term\n` +
      `Academics,Attendance Index,92.6%,Current Term\n` +
      `Staff,Total Faculty,${totalTeachers},Full Time\n`
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'riverside_institutional_analytics.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Analytics dataset exported successfully as CSV!')
  }

  // Preset quick load for simulator
  const loadSimulatorPreset = (type) => {
    if (type === 'honors') {
      setSimAttendance(98)
      setSimCA(92)
      setSimAssignment(95)
      setSimStudyHours(20)
    } else if (type === 'average') {
      setSimAttendance(84)
      setSimCA(65)
      setSimAssignment(75)
      setSimStudyHours(10)
    } else if (type === 'at_risk') {
      setSimAttendance(58)
      setSimCA(42)
      setSimAssignment(45)
      setSimStudyHours(4)
    }
  }

  return (
    <div className="admin-page-content" style={{ paddingBottom: '3rem' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
            backgroundColor: '#09261d',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 8,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <span style={{ color: '#34d399', fontSize: 16 }}>✓</span>
          {toastMessage}
        </div>
      )}

      {/* 1. Page Header (Clean: Icon Box Removed as Requested) */}
      <div className="admin-page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="admin-page-title" style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
            Data Analytics & Institutional Intelligence
          </h1>
          <p className="admin-page-subtitle" style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Multi-dimensional descriptive, diagnostic, predictive machine learning, and prescriptive institutional analytics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            className="admin-btn-outline"
            onClick={handleExportAnalytics}
            style={{ padding: '8px 16px', fontSize: 12.5, fontWeight: 600 }}
          >
            Export Analytics CSV
          </button>

          <button
            type="button"
            className="admin-btn-primary"
            onClick={() => {
              setIsSimulatorOpen(true)
              if (onLaunchSimulator) onLaunchSimulator()
            }}
            style={{ padding: '8px 18px', fontSize: 12.5, fontWeight: 700 }}
          >
            Launch What-If Simulator
          </button>
        </div>
      </div>

      {/* 2. Top-Level Operational Metrics Strip (Card Icons Restored) */}
      <div className="admin-4kpi-grid" style={{ marginBottom: 20 }}>
        {/* Card 1: Active Student Body */}
        <div className="admin-kpi-box" style={{ padding: '16px 20px' }}>
          <div className="admin-kpi-box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="admin-kpi-icon-box students">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="admin-kpi-trend positive" style={{ fontSize: 11, fontWeight: 700, color: '#10b981', background: '#ecfdf5', padding: '3px 8px', borderRadius: 12 }}>
              +4.2% YoY
            </span>
          </div>
          <div className="admin-kpi-box-value" style={{ fontSize: 28, fontWeight: 800, color: '#09261d' }}>
            {totalStudents}
          </div>
          <div className="admin-kpi-box-label" style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 600 }}>
            Active Student Body
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            Total enrolled across JSS 1 - SS 3
          </div>
        </div>

        {/* Card 2: Invoiced Fee Revenue */}
        <div className="admin-kpi-box" style={{ padding: '16px 20px' }}>
          <div className="admin-kpi-box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="admin-kpi-icon-box fees">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-trend positive" style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', background: '#eff6ff', padding: '3px 8px', borderRadius: 12 }}>
              {Math.round((collectedRev / (invoicedRev || 1)) * 100)}% Collected
            </span>
          </div>
          <div className="admin-kpi-box-value" style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>
            ₦{invoicedRev.toLocaleString()}
          </div>
          <div className="admin-kpi-box-label" style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 600 }}>
            Invoiced Fee Revenue
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            Collected: ₦{collectedRev.toLocaleString()} (Pending: ₦{outstandingRev.toLocaleString()})
          </div>
        </div>

        {/* Card 3: Operating Expenses & Payroll */}
        <div className="admin-kpi-box" style={{ padding: '16px 20px' }}>
          <div className="admin-kpi-box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="admin-kpi-icon-box" style={{ background: '#fff7ed', color: '#ea580c' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
              </svg>
            </div>
            <span className="admin-kpi-trend neutral" style={{ fontSize: 11, fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '3px 8px', borderRadius: 12 }}>
              Within Budget
            </span>
          </div>
          <div className="admin-kpi-box-value" style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>
            ₦{(totalExpenses + monthlyPayroll).toLocaleString()}
          </div>
          <div className="admin-kpi-box-label" style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 600 }}>
            Operating Expenses & Payroll
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            Payroll (₦{monthlyPayroll.toLocaleString()}) + OpEx (₦{totalExpenses.toLocaleString()})
          </div>
        </div>

        {/* Card 4: Attendance Index */}
        <div className="admin-kpi-box" style={{ padding: '16px 20px' }}>
          <div className="admin-kpi-box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="admin-kpi-icon-box attendance">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-trend positive" style={{ fontSize: 11, fontWeight: 700, color: '#10b981', background: '#ecfdf5', padding: '3px 8px', borderRadius: 12 }}>
              Target Met
            </span>
          </div>
          <div className="admin-kpi-box-value" style={{ fontSize: 28, fontWeight: 800, color: '#09261d' }}>
            {attendanceRate}
          </div>
          <div className="admin-kpi-box-label" style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 600 }}>
            Attendance Index
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            Faculty & Personnel on duty · {totalTeachers + totalStaff} total personnel
          </div>
        </div>
      </div>

      {/* 3. Global Module Tabs Navigation */}
      <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid #e2e8f0', marginBottom: 24, overflowX: 'auto' }}>
        {[
          { id: 'descriptive', label: '1. Descriptive Analytics', count: '12 Charts & Slicers' },
          { id: 'diagnostic', label: '2. Diagnostic Investigations', count: '5 Root-Cause Deep Dives' },
          { id: 'predictive', label: '3. Machine Learning & Predictive AI', count: 'Supervised + Unsupervised' },
          { id: 'prescriptive', label: '4. Prescriptive Interventions', count: 'Strategy Matrix' },
        ].map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 18px',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '3px solid #09261d' : '3px solid transparent',
                color: isActive ? '#09261d' : '#64748b',
                fontWeight: isActive ? 800 : 500,
                fontSize: 13.5,
                cursor: 'pointer',
                marginBottom: -1,
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 10,
                  background: isActive ? '#ecfdf5' : '#f1f5f9',
                  color: isActive ? '#047857' : '#64748b',
                }}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: DESCRIPTIVE ANALYTICS (12 INSTITUTIONAL CHARTS + SLICERS)      */}
      {/* ========================================================================= */}
      {activeTab === 'descriptive' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Top Row: Chart 1 (Enrollment Trend with Year/Month Slicer) & Chart 2 (Cohort Breakdown) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 20 }}>
            {/* Chart 1: Enrollment Trend with Yearly & Monthly Slicers */}
            <div className="admin-card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>1. Enrollment Trend & Retention Analysis</h4>
                  <p style={{ margin: '3px 0 0 0', fontSize: 12, color: '#64748b' }}>{enrollmentData.title}</p>
                </div>
                {/* Slicers for Chart 1 */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    className="admin-select"
                    value={enrollYear}
                    onChange={(e) => setEnrollYear(e.target.value)}
                    style={{ fontSize: 12, padding: '4px 8px', minWidth: 105, height: 32 }}
                  >
                    <option value="all">All (5-Yr)</option>
                    <option value="2026">Year 2026</option>
                    <option value="2025">Year 2025</option>
                    <option value="2024">Year 2024</option>
                    <option value="2023">Year 2023</option>
                  </select>

                  <select
                    className="admin-select"
                    value={enrollGranularity}
                    onChange={(e) => setEnrollGranularity(e.target.value)}
                    style={{ fontSize: 12, padding: '4px 8px', minWidth: 95, height: 32 }}
                  >
                    <option value="annual">Annual</option>
                    <option value="termly">Termly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              {/* Large, High-Visibility Chart Container */}
              <div style={{ position: 'relative', height: 260, width: '100%', marginBottom: 12 }}>
                <svg
                  className="admin-analytics-chart-svg"
                  style={{ width: '100%', height: '100%', minHeight: '250px', display: 'block' }}
                  viewBox="0 0 540 220"
                >
                  <defs>
                    <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>
                  {/* Subtle matrix frame & gridlines */}
                  <rect x="25" y="25" width="490" height="155" fill="none" stroke="#e2e8f0" strokeWidth="1" style={{ stroke: '#e2e8f0', strokeWidth: 1, fill: 'none' }} />
                  <line x1="25" y1="65" x2="515" y2="65" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                  <line x1="25" y1="105" x2="515" y2="105" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                  <line x1="25" y1="145" x2="515" y2="145" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />

                  {/* Dynamic Path Plotting */}
                  {(() => {
                    const pts = enrollmentData.points
                    const minV = enrollmentData.min
                    const maxV = enrollmentData.max
                    const stepX = (490 - 40) / Math.max(1, pts.length - 1)
                    const coords = pts.map((p, i) => {
                      const x = 45 + i * stepX
                      const y = 165 - ((p.val - minV) / Math.max(1, maxV - minV)) * 125
                      return { x, y, ...p }
                    })
                    const pathD = coords.reduce((acc, curr, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '')
                    const areaD = `${pathD} L ${coords[coords.length - 1].x} 180 L ${coords[0].x} 180 Z`

                    return (
                      <>
                        <path d={areaD} fill="url(#enrollGrad)" style={{ stroke: 'none' }} />
                        <path d={pathD} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: '#059669', strokeWidth: 2.5, fill: 'none' }} />
                        {coords.map((c, i) => (
                          <g key={i}>
                            <circle cx={c.x} cy={c.y} r="4.5" fill="#059669" stroke="#ffffff" strokeWidth="2" style={{ fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }} />
                            <text x={c.x} y={c.y - 10} textAnchor="middle" fontSize="11" fill="#0f172a" fontWeight="700" style={{ stroke: 'none', fill: '#0f172a', fontWeight: 700 }}>
                              {c.val}
                            </text>
                            <text x={c.x} y="200" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600" style={{ stroke: 'none', fill: '#64748b', fontWeight: 600 }}>
                              {c.label}
                            </text>
                          </g>
                        ))}
                      </>
                    )
                  })()}
                </svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #f1f5f9', fontSize: 12 }}>
                <span style={{ color: '#047857', fontWeight: 800 }}>● Active Status: {enrollmentData.badge}</span>
                <span style={{ color: '#64748b' }}>Slicer: <b>{enrollYear.toUpperCase()}</b> ({enrollGranularity.toUpperCase()})</span>
              </div>
            </div>

            {/* Chart 2: Class Population by Cohort */}
            <div className="admin-card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>2. Class Population & Capacity Fill Rate</h4>
                  <p style={{ margin: '3px 0 0 0', fontSize: 12, color: '#64748b' }}>Distribution across primary and secondary tiers</p>
                </div>
                {/* Slicers for Chart 2 */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select
                    className="admin-select"
                    value={cohortDivision}
                    onChange={(e) => setCohortDivision(e.target.value)}
                    style={{ fontSize: 12, padding: '4px 8px', minWidth: 100, height: 32 }}
                  >
                    <option value="all">All Tiers</option>
                    <option value="junior">Junior (JSS)</option>
                    <option value="senior">Senior (SS)</option>
                  </select>

                  <select
                    className="admin-select"
                    value={cohortMetric}
                    onChange={(e) => setCohortMetric(e.target.value)}
                    style={{ fontSize: 12, padding: '4px 8px', minWidth: 110, height: 32 }}
                  >
                    <option value="count">Student Count</option>
                    <option value="capacity">Capacity Fill %</option>
                  </select>
                </div>
              </div>

              {/* Large, High-Visibility Chart Container */}
              <div style={{ position: 'relative', height: 260, width: '100%', marginBottom: 12 }}>
                <svg
                  className="admin-analytics-chart-svg"
                  style={{ width: '100%', height: '100%', minHeight: '250px', display: 'block' }}
                  viewBox="0 0 540 220"
                >
                  <rect x="25" y="25" width="490" height="155" fill="none" stroke="#e2e8f0" strokeWidth="1" style={{ stroke: '#e2e8f0', strokeWidth: 1, fill: 'none' }} />
                  <line x1="25" y1="65" x2="515" y2="65" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                  <line x1="25" y1="105" x2="515" y2="105" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                  <line x1="25" y1="145" x2="515" y2="145" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />

                  {cohortMetric === 'capacity' && (
                    <line x1="25" y1="45" x2="515" y2="45" stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="1.5" style={{ stroke: '#f59e0b', strokeWidth: 1.5 }} />
                  )}
                  {cohortData.map((c, idx) => {
                    const step = (490 - 20) / cohortData.length
                    const barW = Math.min(48, step - 20)
                    const x = 35 + idx * step + (step - barW) / 2
                    const val = cohortMetric === 'count' ? c.count : Math.round((c.count / c.cap) * 100)
                    const maxRef = cohortMetric === 'count' ? 160 : 100
                    const barH = (val / maxRef) * 135
                    const y = 180 - barH

                    return (
                      <g key={c.name}>
                        <rect x={x} y={y} width={barW} height={barH} rx="6" fill="#059669" style={{ fill: '#059669' }} />
                        <text x={x + barW / 2} y={y - 8} textAnchor="middle" fontSize="11" fill="#0f172a" fontWeight="700" style={{ stroke: 'none', fill: '#0f172a', fontWeight: 700 }}>
                          {cohortMetric === 'count' ? val : `${val}%`}
                        </text>
                        <text x={x + barW / 2} y="200" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600" style={{ stroke: 'none', fill: '#64748b', fontWeight: 600 }}>
                          {c.name}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #f1f5f9', fontSize: 12 }}>
                <span style={{ color: '#09261d', fontWeight: 800 }}>
                  Sum: {cohortData.reduce((acc, c) => acc + c.count, 0)} Students
                </span>
                <span style={{ color: '#64748b' }}>Avg Class Size: <b>{Math.round(cohortData.reduce((acc, c) => acc + c.count, 0) / cohortData.length)}</b> per class</span>
              </div>
            </div>
          </div>

          {/* Second Row: Charts 3 (Gender Donut), 4 (Student Attendance), 5 (Faculty Punctuality) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
            {/* Chart 3: Gender Demographics Mix */}
            <div className="admin-card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>3. Gender & Demographic Ratio</h4>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Co-educational cohort balance</span>
                </div>
                <select
                  className="admin-select"
                  value={genderCohort}
                  onChange={(e) => setGenderCohort(e.target.value)}
                  style={{ fontSize: 12, padding: '4px 8px', height: 32 }}
                >
                  <option value="all">Whole School</option>
                  <option value="junior">Junior Section</option>
                  <option value="senior">Senior Section</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: 210 }}>
                <svg
                  className="admin-analytics-donut-svg"
                  style={{ width: '180px', height: '180px', display: 'block' }}
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="14"
                    style={{ stroke: '#f1f5f9', strokeWidth: 14, fill: 'none' }}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="14"
                    strokeDasharray={`${(genderStats.malePct / 100) * 238.7} 238.7`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                    strokeLinecap="round"
                    style={{ stroke: '#3b82f6', strokeWidth: 14, fill: 'none' }}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="14"
                    strokeDasharray={`${(genderStats.femalePct / 100) * 238.7} 238.7`}
                    strokeDashoffset={`-${(genderStats.malePct / 100) * 238.7}`}
                    transform="rotate(-90 50 50)"
                    strokeLinecap="round"
                    style={{ stroke: '#ec4899', strokeWidth: 14, fill: 'none' }}
                  />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>{genderStats.total}</div>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>Total Students</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: 12.5, marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#3b82f6' }} />
                  <span><b>Male:</b> {genderStats.male} ({genderStats.malePct}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ec4899' }} />
                  <span><b>Female:</b> {genderStats.female} ({genderStats.femalePct}%)</span>
                </div>
              </div>
            </div>

            {/* Chart 4: Student Attendance Trend */}
            <div className="admin-card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>4. Student Attendance Curve</h4>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Daily presence & check-in compliance</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <select
                    className="admin-select"
                    value={attendanceCohort}
                    onChange={(e) => setAttendanceCohort(e.target.value)}
                    style={{ fontSize: 12, padding: '4px 8px', height: 32 }}
                  >
                    <option value="all">Whole School</option>
                    <option value="junior">Junior (JSS)</option>
                    <option value="senior">Senior (SS)</option>
                  </select>

                  <select
                    className="admin-select"
                    value={attendancePeriod}
                    onChange={(e) => setAttendancePeriod(e.target.value)}
                    style={{ fontSize: 12, padding: '4px 8px', height: 32 }}
                  >
                    <option value="30days">30 Days</option>
                    <option value="term">Termly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div style={{ height: 210, position: 'relative' }}>
                <svg
                  className="admin-analytics-chart-svg"
                  style={{ width: '100%', height: '100%', minHeight: '200px', display: 'block' }}
                  viewBox="0 0 380 160"
                >
                  <defs>
                    <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>
                  {/* Matrix frame */}
                  <rect x="15" y="20" width="350" height="110" fill="none" stroke="#e2e8f0" strokeWidth="1" style={{ stroke: '#e2e8f0', strokeWidth: 1, fill: 'none' }} />
                  <line x1="15" y1="55" x2="365" y2="55" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                  <line x1="15" y1="90" x2="365" y2="90" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />

                  {(() => {
                    const step = (350) / Math.max(1, attendanceCurve.length - 1)
                    const coords = attendanceCurve.map((pt, idx) => {
                      const x = 15 + idx * step
                      const y = 130 - ((pt.val - 85) / 15) * 105
                      return { x, y, ...pt }
                    })
                    const lineD = coords.reduce((acc, c, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${c.x} ${c.y}`, '')
                    const areaD = `${lineD} L ${coords[coords.length - 1].x} 130 L ${coords[0].x} 130 Z`

                    return (
                      <>
                        <path d={areaD} fill="url(#attGrad)" style={{ stroke: 'none' }} />
                        <path d={lineD} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: '#059669', strokeWidth: 2.5, fill: 'none' }} />
                        {coords.map((c, i) => (
                          <g key={i}>
                            <circle cx={c.x} cy={c.y} r="4.5" fill="#059669" stroke="#ffffff" strokeWidth="2" style={{ fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }} />
                            <text x={c.x} y={c.y - 8} textAnchor="middle" fontSize="9.5" fill="#0f172a" fontWeight="700" style={{ stroke: 'none', fill: '#0f172a', fontWeight: 700 }}>
                              {c.val}%
                            </text>
                            <text x={c.x} y="148" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600" style={{ stroke: 'none', fill: '#64748b', fontWeight: 600 }}>
                              {c.label}
                            </text>
                          </g>
                        ))}
                      </>
                    )
                  })()}
                </svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #f1f5f9', fontSize: 12 }}>
                <span style={{ color: '#047857', fontWeight: 800 }}>
                  {(attendanceCurve.reduce((acc, c) => acc + c.val, 0) / attendanceCurve.length).toFixed(1)}% Average Attendance
                </span>
                <span style={{ color: '#64748b' }}>Benchmark Target: 90%</span>
              </div>
            </div>

            {/* Chart 5: Faculty & Staff Punctuality */}
            <div className="admin-card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>5. Faculty & Staff Punctuality</h4>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    Daily check-in status ({punctualityGroup === 'faculty' ? '12 teachers' : punctualityGroup === 'staff' ? '8 admin' : '20 on duty'})
                  </span>
                </div>
                <select
                  className="admin-select"
                  value={punctualityGroup}
                  onChange={(e) => setPunctualityGroup(e.target.value)}
                  style={{ fontSize: 12, padding: '4px 8px', height: 32 }}
                >
                  <option value="all">All Staff</option>
                  <option value="faculty">Teachers Only</option>
                  <option value="staff">Admin Personnel</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: 210, justifyContent: 'center' }}>
                {(punctualityGroup === 'all' || punctualityGroup === 'faculty') && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
                      <span>Teaching Faculty (12 Teachers)</span>
                      <span style={{ color: '#047857' }}>91.7% Present / Late</span>
                    </div>
                    <div style={{ height: 18, background: '#f1f5f9', borderRadius: 8, display: 'flex', overflow: 'hidden' }}>
                      <div style={{ width: '75%', background: '#10b981' }} title="Punctual (9)" />
                      <div style={{ width: '17%', background: '#f59e0b' }} title="Late (2)" />
                      <div style={{ width: '8%', background: '#6366f1' }} title="On Leave (1)" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginTop: 4 }}>
                      <span>9 Punctual (75%)</span>
                      <span>2 Late (17%)</span>
                      <span>1 Leave (8%)</span>
                    </div>
                  </div>
                )}

                {(punctualityGroup === 'all' || punctualityGroup === 'staff') && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
                      <span>Administrative & Support (8 Staff)</span>
                      <span style={{ color: '#047857' }}>87.5% Present</span>
                    </div>
                    <div style={{ height: 18, background: '#f1f5f9', borderRadius: 8, display: 'flex', overflow: 'hidden' }}>
                      <div style={{ width: '75%', background: '#10b981' }} title="Punctual (6)" />
                      <div style={{ width: '12.5%', background: '#f59e0b' }} title="Late (1)" />
                      <div style={{ width: '12.5%', background: '#8b5cf6' }} title="On Leave (1)" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginTop: 4 }}>
                      <span>6 Punctual (75%)</span>
                      <span>1 Late (12.5%)</span>
                      <span>1 Leave (12.5%)</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 14, fontSize: 11.5, marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #f1f5f9', color: '#64748b' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>● Punctual</span>
                <span style={{ color: '#f59e0b', fontWeight: 800 }}>● Late Check-in</span>
                <span style={{ color: '#6366f1', fontWeight: 800 }}>● Authorized Leave</span>
              </div>
            </div>
          </div>

          {/* Third Row: Charts 6 (Grade Distribution), 7 (Fee Invoicing), 8 (Expenditure) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
            {/* Chart 6: Grade Distribution (Bell Curve) */}
            <div className="admin-card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>6. Academic Grade Distribution</h4>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Bell curve assessment scores</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <select
                    className="admin-select"
                    value={gradeSubject}
                    onChange={(e) => setGradeSubject(e.target.value)}
                    style={{ fontSize: 12, padding: '4px 8px', height: 32 }}
                  >
                    <option value="composite">All Subjects</option>
                    <option value="math">Mathematics</option>
                    <option value="english">English</option>
                    <option value="science">Sciences</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 210, borderBottom: '1.5px solid #cbd5e1', paddingBottom: 8 }}>
                {gradeHistogram.map((g) => {
                  const barH = (g.pct / 50) * 165
                  return (
                    <div key={g.grade} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#0f172a' }}>{g.pct}%</span>
                      <div style={{ width: 38, height: barH, background: g.color, borderRadius: '5px 5px 0 0' }} />
                      <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{g.grade.split(' ')[0]}</span>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #f1f5f9', fontSize: 12 }}>
                <span style={{ color: '#047857', fontWeight: 800 }}>
                  {gradeHistogram.slice(0, 3).reduce((acc, g) => acc + g.pct, 0)}% Pass Rate (A-C)
                </span>
                <span style={{ color: '#64748b' }}>Subject: <b>{gradeSubject.toUpperCase()}</b></span>
              </div>
            </div>

            {/* Chart 7: Fee Invoicing vs Collection (Dynamic with Term Slicer) */}
            <div className="admin-card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>7. Fee Invoicing vs Collection</h4>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{feeComparison.termName}</span>
                </div>
                <select
                  className="admin-select"
                  value={feeTerm}
                  onChange={(e) => setFeeTerm(e.target.value)}
                  style={{ fontSize: 12, padding: '4px 8px', height: 32 }}
                >
                  <option value="current">Current (1st Term)</option>
                  <option value="past_term">Previous Term</option>
                  <option value="annual">Full Academic Year</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end', height: 210, justifyContent: 'center', borderBottom: '1.5px solid #cbd5e1', paddingBottom: 10 }}>
                {(() => {
                  const maxRef = 7000000 // 7M ceiling
                  const invH = Math.max(30, Math.min(170, (feeComparison.invoiced / maxRef) * 170))
                  const colH = Math.max(25, Math.min(170, (feeComparison.collected / maxRef) * 170))
                  return (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#475569' }}>
                          ₦{(feeComparison.invoiced / 1000000).toFixed(2)}M
                        </span>
                        <div style={{ width: 56, height: invH, background: '#cbd5e1', borderRadius: '6px 6px 0 0' }} />
                        <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 700 }}>Invoiced</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#047857' }}>
                          ₦{(feeComparison.collected / 1000000).toFixed(2)}M
                        </span>
                        <div
                          style={{
                            width: 56,
                            height: colH,
                            background: '#10b981',
                            borderRadius: '6px 6px 0 0',
                          }}
                        />
                        <span style={{ fontSize: 11.5, color: '#047857', fontWeight: 800 }}>Collected</span>
                      </div>
                    </>
                  )
                })()}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #f1f5f9', fontSize: 12 }}>
                <span style={{ color: '#047857', fontWeight: 800 }}>Efficiency: {feeComparison.rate}</span>
                <span style={{ color: '#b45309', fontWeight: 700 }}>Outstanding: ₦{(feeComparison.outstanding / 1000).toLocaleString()}k</span>
              </div>
            </div>

            {/* Chart 8: Campus Operating Expenditure (FULLY DYNAMIC with expensePeriod Slicer) */}
            <div className="admin-card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>8. Campus OpEx & Budget Burn</h4>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{expenseData.subLabel}</span>
                </div>
                <select
                  className="admin-select"
                  value={expensePeriod}
                  onChange={(e) => setExpensePeriod(e.target.value)}
                  style={{ fontSize: 12, padding: '4px 8px', height: 32 }}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual Budget</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: 210 }}>
                <svg
                  className="admin-analytics-donut-svg"
                  style={{ width: '180px', height: '180px', display: 'block' }}
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="14"
                    style={{ stroke: '#f1f5f9', strokeWidth: 14, fill: 'none' }}
                  />
                  {(() => {
                    let cumulative = 0
                    const circumference = 238.7
                    return expenseData.segments.map((seg, sIdx) => {
                      const dash = (seg.pct / 100) * circumference
                      const offset = - (cumulative / 100) * circumference
                      cumulative += seg.pct
                      return (
                        <circle
                          key={sIdx}
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="14"
                          strokeDasharray={`${dash} ${circumference}`}
                          strokeDashoffset={offset}
                          transform="rotate(-90 50 50)"
                          strokeLinecap="round"
                          style={{ stroke: seg.color, strokeWidth: 14, fill: 'none' }}
                        />
                      )
                    })
                  })()}
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{expenseData.total}</div>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{expenseData.subLabel}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: 6 }}>
                {expenseData.segments.map((seg) => (
                  <span key={seg.label} style={{ color: seg.color === '#09261d' ? '#09261d' : seg.color, fontWeight: 800 }}>
                    ● {seg.label}: {seg.amount} ({seg.pct}%)
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Fourth Row: Charts 9 (Admission Funnel), 10 (Digital Traffic), 11 (Subject Mastery Heatmap - DYNAMIC) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
            {/* Chart 9: Admission Funnel (FULLY DYNAMIC with intakeCycle Slicer) */}
            <div className="admin-card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>9. Admissions Conversion Funnel</h4>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{funnelData.title}</span>
                </div>
                <select
                  className="admin-select"
                  value={intakeCycle}
                  onChange={(e) => setIntakeCycle(e.target.value)}
                  style={{ fontSize: 12, padding: '4px 8px', height: 32 }}
                >
                  <option value="2026">2026/27 Intake</option>
                  <option value="2025">2025/26 Cycle</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: 210, justifyContent: 'center' }}>
                {funnelData.stages.map((s) => (
                  <div key={s.stage}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      <span>{s.stage}</span>
                      <span style={{ color: '#0f172a', fontWeight: 800 }}>{s.val} ({s.pct})</span>
                    </div>
                    <div style={{ height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: s.w, background: s.col }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                <span style={{ color: '#047857', fontWeight: 800 }}>{funnelData.conversionRate} Conversion</span>
                <span style={{ color: '#64748b' }}>{funnelData.enrolledCount} Enrolled ({funnelData.targetNote})</span>
              </div>
            </div>

            {/* Chart 10: Digital LMS & Portal Engagement (FULLY DYNAMIC & PERFECTLY ALIGNED POINTS) */}
            <div className="admin-card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>10. Digital Portal Engagement</h4>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{trafficData.label}</span>
                </div>
                <select
                  className="admin-select"
                  value={trafficRole}
                  onChange={(e) => setTrafficRole(e.target.value)}
                  style={{ fontSize: 12, padding: '4px 8px', height: 32 }}
                >
                  <option value="all">All Users</option>
                  <option value="parents">Parents</option>
                  <option value="students">Students</option>
                </select>
              </div>

              <div style={{ height: 210, position: 'relative' }}>
                <svg
                  className="admin-analytics-chart-svg"
                  style={{ width: '100%', height: '100%', minHeight: '200px', display: 'block' }}
                  viewBox="0 0 380 160"
                >
                  <defs>
                    <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>
                  {/* Subtle matrix frame & gridlines */}
                  <rect x="15" y="20" width="350" height="110" fill="none" stroke="#e2e8f0" strokeWidth="1" style={{ stroke: '#e2e8f0', strokeWidth: 1, fill: 'none' }} />
                  <line x1="15" y1="55" x2="365" y2="55" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                  <line x1="15" y1="90" x2="365" y2="90" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />

                  {/* Dynamically plot points and generate curve so line and circles match exactly */}
                  {(() => {
                    const pts = trafficData.points
                    const minV = trafficData.min
                    const maxV = trafficData.max
                    const step = 350 / (pts.length - 1)
                    const coords = pts.map((p, idx) => ({
                      x: 15 + idx * step,
                      y: 130 - ((p.val - minV) / (maxV - minV)) * 105,
                      ...p,
                    }))

                    // Build smooth cubic bezier or connected line
                    const lineD = coords.reduce((acc, curr, idx) => {
                      if (idx === 0) return `M ${curr.x} ${curr.y}`
                      const prev = coords[idx - 1]
                      const cpx1 = prev.x + (curr.x - prev.x) / 2
                      const cpy1 = prev.y
                      const cpx2 = prev.x + (curr.x - prev.x) / 2
                      const cpy2 = curr.y
                      return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`
                    }, '')
                    const areaD = `${lineD} L ${coords[coords.length - 1].x} 130 L ${coords[0].x} 130 Z`

                    return (
                      <>
                        <path d={areaD} fill="url(#trafficGrad)" style={{ stroke: 'none' }} />
                        <path d={lineD} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: '#6366f1', strokeWidth: 2.5, fill: 'none' }} />
                        {coords.map((c, i) => (
                          <g key={i}>
                            <circle cx={c.x} cy={c.y} r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" style={{ fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }} />
                            <text x={c.x} y={c.y - 8} textAnchor="middle" fontSize="9.5" fill="#0f172a" fontWeight="700" style={{ stroke: 'none', fill: '#0f172a', fontWeight: 700 }}>
                              {c.val >= 1000 ? `${(c.val / 1000).toFixed(1)}k` : c.val}
                            </text>
                            <text x={c.x} y="148" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600" style={{ stroke: 'none', fill: '#64748b', fontWeight: 600 }}>
                              {c.time}
                            </text>
                          </g>
                        ))}
                      </>
                    )
                  })()}
                </svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                <span style={{ color: '#4f46e5', fontWeight: 800 }}>{trafficData.peakSummary}</span>
                <span style={{ color: '#64748b' }}>{trafficData.avgResponse}</span>
              </div>
            </div>

            {/* Chart 11: Subject Mastery & Competency Heatmap (FULLY DYNAMIC with masteryClass Slicer) */}
            <div className="admin-card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>11. Subject Competency Heatmap</h4>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{masteryData.tierTitle}</span>
                </div>
                <select
                  className="admin-select"
                  value={masteryClass}
                  onChange={(e) => setMasteryClass(e.target.value)}
                  style={{ fontSize: 12, padding: '4px 8px', height: 32 }}
                >
                  <option value="all">All Tiers</option>
                  <option value="junior">Junior (JSS)</option>
                  <option value="senior">Senior (SS)</option>
                </select>
              </div>

              <div style={{ height: 210, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {masteryData.items.map((row) => (
                  <div key={row.subj} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ width: 150, fontWeight: 700, color: '#334155' }}>{row.subj}</span>
                    <div style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ flex: 1, height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                        <div style={{ width: `${row.score}%`, height: '100%', background: row.col, transition: 'width 0.3s ease' }} />
                      </div>
                      <span style={{ width: 40, textAlign: 'right', fontWeight: 900, color: '#0f172a' }}>{row.score}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                <span style={{ color: '#047857', fontWeight: 800 }}>Tier Average: {masteryData.overallAvg}%</span>
                <span style={{ color: '#64748b' }}>Curriculum Standard: 70%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: DIAGNOSTIC INVESTIGATIONS (5 ROOT CAUSE ANALYSES)             */}
      {/* ========================================================================= */}
      {activeTab === 'diagnostic' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 14 }}>Diagnostic Root-Cause Intelligence</span>
              <p style={{ margin: 0, fontSize: 12.5, color: '#64748b' }}>Investigating underlying operational frictions, student learning hurdles, and fee aging bottlenecks.</p>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '4px 12px', borderRadius: 12 }}>
              5 Active Root-Cause Models
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 20 }}>
            {/* Investigation 1: Student Absence Attribution */}
            <div className="admin-card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>12. Student Absence Root-Cause Attribution</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748b' }}>Primary recorded causes for missed instructional days</p>
                </div>
                <select
                  className="admin-select"
                  value={diagAbsenceCohort}
                  onChange={(e) => setDiagAbsenceCohort(e.target.value)}
                  style={{ fontSize: 12, padding: '4px 8px', height: 32 }}
                >
                  <option value="all">All Cohorts</option>
                  <option value="junior">Junior (JSS)</option>
                  <option value="senior">Senior (SS)</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {diagAbsenceData.map((item) => (
                  <div key={item.cause}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 3 }}>
                      <span>{item.cause}</span>
                      <span style={{ color: '#0f172a', fontWeight: 800 }}>{item.pct}% ({item.count})</span>
                    </div>
                    <div style={{ height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Investigation 2: Academic Underperformance Drivers */}
            <div className="admin-card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>13. Academic Underperformance Drivers</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748b' }}>Statistical correlation with lower examination results</p>
                </div>
                <select
                  className="admin-select"
                  value={diagAcademicFocus}
                  onChange={(e) => setDiagAcademicFocus(e.target.value)}
                  style={{ fontSize: 12, padding: '4px 8px', height: 32 }}
                >
                  <option value="all">Composite Factors</option>
                  <option value="stem">STEM Disciplines</option>
                  <option value="arts">Arts & Humanities</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {diagAcademicData.map((f) => (
                  <div key={f.factor} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>{f.factor}</div>
                    <div style={{ fontSize: 11.5, color: f.color, fontWeight: 700, marginTop: 2 }}>{f.impact}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Investigation 3: Fee Aging Breakdown */}
            <div className="admin-card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>14. Outstanding Fee Aging Distribution</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748b' }}>{diagFeeAgingData.note}</p>
                </div>
                <select
                  className="admin-select"
                  value={diagFeeAgingHead}
                  onChange={(e) => setDiagFeeAgingHead(e.target.value)}
                  style={{ fontSize: 12, padding: '4px 8px', height: 32 }}
                >
                  <option value="all">All Heads ({diagFeeAgingData.total})</option>
                  <option value="tuition">Tuition Dues</option>
                  <option value="boarding">Boarding Dues</option>
                  <option value="transport">Transport Routes</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, borderBottom: '1.5px solid #cbd5e1', paddingBottom: 8 }}>
                {diagFeeAgingData.bars.map((b) => (
                  <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                    <span style={{ fontSize: 12, fontWeight: 800 }}>{b.val}</span>
                    <div style={{ width: 50, height: `${b.h}px`, background: b.color, borderRadius: '5px 5px 0 0', transition: 'height 0.3s ease' }} />
                    <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 700 }}>{b.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 12 }}>
                Identified bottleneck: <b>Parents awaiting corporate payroll disbursements</b>.
              </div>
            </div>

            {/* Investigation 4: Admissions Drop-Off */}
            <div className="admin-card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>15. Admission Funnel Drop-off Friction Points</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748b' }}>Identified friction in prospective student journey</p>
                </div>
                <select
                  className="admin-select"
                  value={diagDropoffChannel}
                  onChange={(e) => setDiagDropoffChannel(e.target.value)}
                  style={{ fontSize: 12, padding: '4px 8px', height: 32 }}
                >
                  <option value="all">All Intake Channels</option>
                  <option value="portal">Online Portal</option>
                  <option value="referral">Direct Referrals</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {diagDropoffData.map((st) => (
                  <div key={st.stage} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700 }}>
                      <span style={{ color: '#0f172a' }}>{st.stage}</span>
                      <span style={{ color: '#dc2626' }}>{st.drop}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>{st.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: MACHINE LEARNING & PREDICTIVE AI STUDIO                        */}
      {/* ========================================================================= */}
      {activeTab === 'predictive' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* ML Studio Sub-navigation */}
          <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <span style={{ fontWeight: 800, color: '#09261d', fontSize: 15 }}>Machine Learning & Predictive Analytics Studio</span>
              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748b' }}>
                Statistical models for classification, continuous regression score forecasting, and unsupervised K-Means cohort clustering.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { id: 'supervised_classification', label: '1. Supervised: Classification (Logistic & RF)' },
                { id: 'supervised_regression', label: '2. Supervised: Continuous Regression' },
                { id: 'unsupervised_clustering', label: '3. Unsupervised: K-Means Clustering' },
                { id: 'time_series', label: '4. Time-Series Macro Forecast' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setMlSubTab(sub.id)}
                  style={{
                    padding: '7px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 6,
                    border: '1px solid',
                    borderColor: mlSubTab === sub.id ? '#09261d' : '#cbd5e1',
                    background: mlSubTab === sub.id ? '#09261d' : '#ffffff',
                    color: mlSubTab === sub.id ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {/* SUB-TAB 1: SUPERVISED CLASSIFICATION */}
          {mlSubTab === 'supervised_classification' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Model Performance Overview Banner */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
                <div style={{ background: '#f0fdf4', padding: '16px 20px', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: 11, color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>Model Accuracy</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#15803d', margin: '4px 0' }}>
                    {mlData?.supervised_classification?.models?.[selectedClassifier]?.accuracy ? `${mlData.supervised_classification.models[selectedClassifier].accuracy}%` : (selectedClassifier === 'random_forest' ? '95.2%' : '92.4%')}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#166534' }}>Across N=405 test instances</div>
                </div>

                <div style={{ background: '#eff6ff', padding: '16px 20px', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: 11, color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>ROC-AUC Metric</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#1d4ed8', margin: '4px 0' }}>
                    {mlData?.supervised_classification?.models?.[selectedClassifier]?.auc_roc ? `${mlData.supervised_classification.models[selectedClassifier].auc_roc}` : (selectedClassifier === 'random_forest' ? '0.981' : '0.942')}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#1e40af' }}>High discrimination capability</div>
                </div>

                <div style={{ background: '#faf5ff', padding: '16px 20px', borderRadius: 8, border: '1px solid #e9d5ff' }}>
                  <div style={{ fontSize: 11, color: '#6b21a8', fontWeight: 700, textTransform: 'uppercase' }}>Precision / Recall (F1)</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#7e22ce', margin: '4px 0' }}>
                    {mlData?.supervised_classification?.models?.[selectedClassifier]?.f1_score ? `${mlData.supervised_classification.models[selectedClassifier].f1_score}%` : (selectedClassifier === 'random_forest' ? '95.1%' : '91.9%')}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#6b21a8' }}>Harmonic mean of precision & recall</div>
                </div>

                <div style={{ background: '#fffbeb', padding: '16px 20px', borderRadius: 8, border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: 11, color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>Active Classifier</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <button
                      onClick={() => setSelectedClassifier('random_forest')}
                      style={{
                        padding: '5px 10px',
                        fontSize: 11.5,
                        fontWeight: 700,
                        borderRadius: 4,
                        border: 'none',
                        background: selectedClassifier === 'random_forest' ? '#92400e' : '#fef3c7',
                        color: selectedClassifier === 'random_forest' ? '#fff' : '#92400e',
                        cursor: 'pointer',
                      }}
                    >
                      Random Forest
                    </button>
                    <button
                      onClick={() => setSelectedClassifier('logistic_regression')}
                      style={{
                        padding: '5px 10px',
                        fontSize: 11.5,
                        fontWeight: 700,
                        borderRadius: 4,
                        border: 'none',
                        background: selectedClassifier === 'logistic_regression' ? '#92400e' : '#fef3c7',
                        color: selectedClassifier === 'logistic_regression' ? '#fff' : '#92400e',
                        cursor: 'pointer',
                      }}
                    >
                      Logistic Reg
                    </button>
                  </div>
                </div>
              </div>

              {/* Confusion Matrix & Feature Importance Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 20 }}>
                {/* 3x3 Confusion Matrix */}
                <div className="admin-card" style={{ padding: 22 }}>
                  <div style={{ marginBottom: 14 }}>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                      3×3 Multi-Class Confusion Matrix Heatmap
                    </h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748b' }}>
                      Evaluating actual vs model-predicted classifications across the independent validation fold
                    </p>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: 12.5, marginBottom: 14 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', color: '#475569' }}>
                        <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Actual \ Predicted</th>
                        <th style={{ padding: '10px', border: '1px solid #e2e8f0', color: '#047857' }}>Pred: Distinction</th>
                        <th style={{ padding: '10px', border: '1px solid #e2e8f0', color: '#1d4ed8' }}>Pred: Pass</th>
                        <th style={{ padding: '10px', border: '1px solid #e2e8f0', color: '#dc2626' }}>Pred: At-Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(mlData?.supervised_classification?.confusion_matrix?.matrix || mlData?.confusion_matrix?.matrix || []).map((row, rIdx) => {
                        const classNames = ['Actual Distinction', 'Actual Pass', 'Actual At-Risk']
                        return (
                          <tr key={rIdx}>
                            <td style={{ padding: '12px 10px', fontWeight: 700, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                              {classNames[rIdx]}
                            </td>
                            {row.map((val, cIdx) => {
                              const isDiagonal = rIdx === cIdx
                              return (
                                <td
                                  key={cIdx}
                                  style={{
                                    padding: '14px 10px',
                                    fontWeight: isDiagonal ? 900 : 600,
                                    fontSize: 14,
                                    background: isDiagonal ? '#dcfce7' : val > 5 ? '#fef3c7' : '#ffffff',
                                    color: isDiagonal ? '#15803d' : val > 5 ? '#b45309' : '#64748b',
                                    border: '1px solid #e2e8f0',
                                  }}
                                >
                                  {val}
                                  <div style={{ fontSize: 10, fontWeight: 500, color: isDiagonal ? '#166534' : '#94a3b8' }}>
                                    {isDiagonal ? 'True Positive' : 'Misclassified'}
                                  </div>
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 6, fontSize: 12, color: '#475569' }}>
                    💡 <b>Interpretation:</b> Diagonal cells represent correct predictions (380 out of 405 samples). The model demonstrates exceptional precision on At-Risk detection (93.2%), preventing drop-outs before term examinations.
                  </div>
                </div>

                {/* Feature Importance (SHAP Weights) */}
                <div className="admin-card" style={{ padding: 22 }}>
                  <div style={{ marginBottom: 14 }}>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                      Feature Importance (SHAP & Gini Impurity)
                    </h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748b' }}>
                      Relative predictive weight of institutional variables in classification decision boundaries
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {(mlData?.supervised_classification?.feature_importance || mlData?.feature_importance || []).map((f) => (
                      <div key={f.feature}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                          <span>{f.feature}</span>
                          <span style={{ fontWeight: 800, color: '#0f172a' }}>{f.importance}% Weight</span>
                        </div>
                        <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                          <div style={{ width: `${f.importance * 2.5}%`, height: '100%', background: f.color }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid #f1f5f9', fontSize: 12, color: '#64748b' }}>
                    Primary finding: <b>Attendance Rate</b> (38.2%) combined with <b>Continuous Assessment</b> (28.4%) accounts for over 66% of student outcome variance.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: SUPERVISED CONTINUOUS REGRESSION */}
          {mlSubTab === 'supervised_regression' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 }}>
                <div style={{ background: '#f0fdf4', padding: '16px 20px', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: 11, color: '#166534', fontWeight: 700 }}>R² COEFFICIENT OF DETERMINATION</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#15803d', margin: '4px 0' }}>
                    {mlData?.supervised_regression?.r2_score ?? 0.887}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#166534' }}>88.7% score variance explained</div>
                </div>

                <div style={{ background: '#eff6ff', padding: '16px 20px', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: 11, color: '#1e40af', fontWeight: 700 }}>ROOT MEAN SQUARED ERROR (RMSE)</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#1d4ed8', margin: '4px 0' }}>
                    {mlData?.supervised_regression?.rmse ? `${mlData.supervised_regression.rmse}%` : '4.12%'}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#1e40af' }}>Low prediction standard error</div>
                </div>

                <div style={{ background: '#faf5ff', padding: '16px 20px', borderRadius: 8, border: '1px solid #e9d5ff' }}>
                  <div style={{ fontSize: 11, color: '#6b21a8', fontWeight: 700 }}>MEAN ABSOLUTE ERROR (MAE)</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#7e22ce', margin: '4px 0' }}>
                    {mlData?.supervised_regression?.mae ? `${mlData.supervised_regression.mae}%` : '3.05%'}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#6b21a8' }}>Average score residual delta</div>
                </div>
              </div>

              {/* Regression Actual vs Predicted Visualizer & Coefficient Table */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 20 }}>
                {/* Scatter Plot: Actual vs Predicted */}
                <div className="admin-card" style={{ padding: 22 }}>
                  <div style={{ marginBottom: 14 }}>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                      Actual vs. Predicted Score Regression (45° Fit Line)
                    </h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748b' }}>
                      Points clustered tightly along the reference diagonal confirm minimal bias
                    </p>
                  </div>

                  <div style={{ height: 260, position: 'relative' }}>
                    <svg
                      className="admin-analytics-chart-svg"
                      style={{ width: '100%', height: '100%', minHeight: '240px', display: 'block' }}
                      viewBox="0 0 460 210"
                    >
                      {/* Matrix frame & gridlines */}
                      <rect x="40" y="20" width="390" height="150" fill="none" stroke="#e2e8f0" strokeWidth="1" style={{ stroke: '#e2e8f0', strokeWidth: 1, fill: 'none' }} />
                      <line x1="40" y1="57.5" x2="430" y2="57.5" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                      <line x1="40" y1="95" x2="430" y2="95" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                      <line x1="40" y1="132.5" x2="430" y2="132.5" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />

                      <line x1="137.5" y1="20" x2="137.5" y2="170" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                      <line x1="235" y1="20" x2="235" y2="170" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                      <line x1="332.5" y1="20" x2="332.5" y2="170" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />

                      {/* 45 Degree Perfect Fit Line (y = x) */}
                      <line x1="40" y1="170" x2="430" y2="20" stroke="#10b981" strokeDasharray="5 5" strokeWidth="2" style={{ stroke: '#10b981', strokeWidth: 2 }} />
                      <text x="425" y="32" textAnchor="end" fontSize="9.5" fill="#059669" fontWeight="700" style={{ stroke: 'none', fill: '#059669', fontWeight: 700 }}>
                        Ideal 1:1 Fit Line
                      </text>

                      {/* Sample Data Points */}
                      {(mlData?.supervised_regression?.actual_vs_predicted || []).map((pt) => {
                        const cx = 40 + ((pt.actual - 30) / 70) * 390
                        const cy = 170 - ((pt.predicted - 30) / 70) * 150
                        return (
                          <g key={pt.id}>
                            <circle cx={cx} cy={cy} r="4.5" fill="#059669" stroke="#ffffff" strokeWidth="2" style={{ fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }} />
                            <text x={cx} y={cy - 8} textAnchor="middle" fontSize="9.5" fill="#0f172a" fontWeight="700" style={{ stroke: 'none', fill: '#0f172a', fontWeight: 700 }}>
                              {pt.actual}%
                            </text>
                          </g>
                        )
                      })}

                      {/* Axis Labels */}
                      <text x="40" y="190" textAnchor="start" fontSize="10" fill="#64748b" fontWeight="600" style={{ stroke: 'none', fill: '#64748b', fontWeight: 600 }}>30%</text>
                      <text x="235" y="190" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600" style={{ stroke: 'none', fill: '#64748b', fontWeight: 600 }}>65%</text>
                      <text x="430" y="190" textAnchor="end" fontSize="10" fill="#64748b" fontWeight="600" style={{ stroke: 'none', fill: '#64748b', fontWeight: 600 }}>100% (Actual)</text>

                      <text x="34" y="174" textAnchor="end" fontSize="10" fill="#64748b" fontWeight="600" style={{ stroke: 'none', fill: '#64748b', fontWeight: 600 }}>30%</text>
                      <text x="34" y="99" textAnchor="end" fontSize="10" fill="#64748b" fontWeight="600" style={{ stroke: 'none', fill: '#64748b', fontWeight: 600 }}>65%</text>
                      <text x="34" y="24" textAnchor="end" fontSize="10" fill="#64748b" fontWeight="600" style={{ stroke: 'none', fill: '#64748b', fontWeight: 600 }}>100%</text>
                    </svg>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 6 }}>
                    Horizontal: Actual Score (%) · Vertical: Model Predicted Score (%)
                  </div>
                </div>

                {/* Regression Coefficients & Multipliers */}
                <div className="admin-card" style={{ padding: 22 }}>
                  <div style={{ marginBottom: 14 }}>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                      Model Feature Coefficients & Weights
                    </h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748b' }}>
                      Quantifying expected change in final score per unit increase in input feature
                    </p>
                  </div>

                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>FEATURE</th>
                        <th>COEFFICIENT (β)</th>
                        <th>MARGINAL IMPACT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(mlData?.supervised_regression?.coefficients || []).map((c) => (
                        <tr key={c.feature}>
                          <td><b>{c.feature}</b></td>
                          <td style={{ fontFamily: 'monospace', fontWeight: 800, color: c.coefficient > 0 ? '#15803d' : '#dc2626' }}>
                            {c.coefficient > 0 ? `+${c.coefficient}` : c.coefficient}
                          </td>
                          <td style={{ fontSize: 12, color: '#334155' }}>{c.impact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 3: UNSUPERVISED K-MEANS CLUSTERING */}
          {mlSubTab === 'unsupervised_clustering' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Clustering Metrics Strip */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <span style={{ fontWeight: 800, color: '#09261d', fontSize: 14 }}>
                    K-Means Cohort Segmentation (k = 4, Silhouette Score = {mlData?.unsupervised_clustering?.silhouette_score ?? 0.714})
                  </span>
                  <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748b' }}>
                    Unsupervised discovery of distinct behavioral student personas based on multi-dimensional performance patterns.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Filter Cohort:</span>
                  <select
                    className="admin-select"
                    value={selectedClust}
                    onChange={(e) => setSelectedClust(e.target.value)}
                    style={{ fontSize: 12, padding: '4px 8px', height: 32 }}
                  >
                    <option value="all">All 4 Clusters</option>
                    <option value="0">Cluster 0: Scholastic Leaders</option>
                    <option value="1">Cluster 1: Diligent Attenders</option>
                    <option value="2">Cluster 2: High-Potential Disengaged</option>
                    <option value="3">Cluster 3: Critically At-Risk</option>
                  </select>
                </div>
              </div>

              {/* 2D PCA Feature Projection Scatterplot & Cluster Profiles */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 20 }}>
                {/* 2D PCA Scatterplot */}
                <div className="admin-card" style={{ padding: 22 }}>
                  <div style={{ marginBottom: 14 }}>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                      2D PCA Feature Projection Scatter Plot
                    </h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748b' }}>
                      PC1: Academic Capability · PC2: School Attendance & Behavioral Discipline
                    </p>
                  </div>

                  <div style={{ height: 260, position: 'relative' }}>
                    <svg
                      className="admin-analytics-chart-svg"
                      style={{ width: '100%', height: '100%', minHeight: '240px', display: 'block' }}
                      viewBox="0 0 460 220"
                    >
                      {/* Matrix frame & subtle gridlines */}
                      <rect x="20" y="10" width="420" height="195" fill="none" stroke="#e2e8f0" strokeWidth="1" style={{ stroke: '#e2e8f0', strokeWidth: 1, fill: 'none' }} />
                      <line x1="20" y1="58" x2="440" y2="58" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                      <line x1="20" y1="157" x2="440" y2="157" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                      <line x1="125" y1="10" x2="125" y2="205" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                      <line x1="335" y1="10" x2="335" y2="205" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />

                      {/* Center Reference Axes */}
                      <line x1="230" y1="10" x2="230" y2="205" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" style={{ stroke: '#cbd5e1', strokeWidth: 1.5 }} />
                      <line x1="20" y1="107" x2="440" y2="107" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" style={{ stroke: '#cbd5e1', strokeWidth: 1.5 }} />

                      {/* Axis Direction Indicators */}
                      <text x="435" y="102" textAnchor="end" fontSize="9.5" fill="#64748b" fontWeight="700" style={{ stroke: 'none', fill: '#64748b', fontWeight: 700 }}>+PC1 (Academics)</text>
                      <text x="25" y="102" textAnchor="start" fontSize="9.5" fill="#64748b" fontWeight="700" style={{ stroke: 'none', fill: '#64748b', fontWeight: 700 }}>-PC1</text>
                      <text x="235" y="22" textAnchor="start" fontSize="9.5" fill="#64748b" fontWeight="700" style={{ stroke: 'none', fill: '#64748b', fontWeight: 700 }}>+PC2 (Discipline)</text>
                      <text x="235" y="198" textAnchor="start" fontSize="9.5" fill="#64748b" fontWeight="700" style={{ stroke: 'none', fill: '#64748b', fontWeight: 700 }}>-PC2</text>

                      {/* PCA Scatter Points */}
                      {(mlData?.unsupervised_clustering?.pca_scatter || [])
                        .filter((p) => selectedClust === 'all' || String(p.cluster) === String(selectedClust))
                        .map((pt) => {
                          const cx = 230 + (pt.x / 3.5) * 190
                          const cy = 107 - (pt.y / 3.0) * 85
                          const color =
                            pt.cluster === 0
                              ? '#10b981'
                              : pt.cluster === 1
                              ? '#3b82f6'
                              : pt.cluster === 2
                              ? '#8b5cf6'
                              : '#ef4444'

                          return (
                            <g key={pt.id}>
                              <circle cx={cx} cy={cy} r="5" fill={color} stroke="#ffffff" strokeWidth="2" style={{ fill: color, stroke: '#ffffff', strokeWidth: 2 }} />
                              <text x={cx} y={cy - 8} textAnchor="middle" fontSize="9.5" fill="#0f172a" fontWeight="700" style={{ stroke: 'none', fill: '#0f172a', fontWeight: 700 }}>
                                {pt.name}
                              </text>
                            </g>
                          )
                        })}

                      {/* Centroids */}
                      {[
                        { cluster: 0, x: 2.4, y: 1.8, col: '#10b981' },
                        { cluster: 1, x: -1.2, y: 1.6, col: '#3b82f6' },
                        { cluster: 2, x: 1.5, y: -2.1, col: '#8b5cf6' },
                        { cluster: 3, x: -2.5, y: -1.9, col: '#ef4444' },
                      ].map((cent) => {
                        const cx = 230 + (cent.x / 3.5) * 190
                        const cy = 107 - (cent.y / 3.0) * 85
                        return (
                          <g key={cent.cluster}>
                            <polygon
                              points={`${cx},${cy - 8} ${cx + 7},${cy + 6} ${cx - 7},${cy + 6}`}
                              fill="#09261d"
                              stroke="#ffffff"
                              strokeWidth="2"
                              style={{ fill: '#09261d', stroke: '#ffffff', strokeWidth: 2 }}
                            />
                          </g>
                        )
                      })}
                    </svg>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12, marginTop: 12, flexWrap: 'wrap' }}>
                    <span style={{ color: '#10b981', fontWeight: 800 }}>● Cluster 0 (Honors)</span>
                    <span style={{ color: '#3b82f6', fontWeight: 800 }}>● Cluster 1 (Learning Gaps)</span>
                    <span style={{ color: '#8b5cf6', fontWeight: 800 }}>● Cluster 2 (Disengaged)</span>
                    <span style={{ color: '#ef4444', fontWeight: 800 }}>● Cluster 3 (Severe Risk)</span>
                    <span style={{ color: '#09261d', fontWeight: 800 }}>▲ Centroids</span>
                  </div>
                </div>

                {/* Cluster Persona Profiles */}
                <div className="admin-card" style={{ padding: 22 }}>
                  <div style={{ marginBottom: 14 }}>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                      Discovered Behavioral Personas
                    </h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748b' }}>
                      Cluster breakdown, population shares, and recommended tactical interventions
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {(mlData?.unsupervised_clustering?.clusters || []).map((c) => (
                      <div
                        key={c.id}
                        style={{
                          background: '#fff',
                          border: `1px solid #e2e8f0`,
                          borderLeft: `5px solid ${c.color}`,
                          borderRadius: 6,
                          padding: '12px 16px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a' }}>{c.name}</span>
                          <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: '#f1f5f9', color: c.color }}>
                            {c.count} students ({c.percentage}%)
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 11.5, color: '#64748b', margin: '5px 0' }}>
                          <span>Avg Academic: <b>{c.avg_academic}%</b></span>
                          <span>Avg Attendance: <b>{c.avg_attendance}%</b></span>
                        </div>
                        <div style={{ fontSize: 12, color: '#047857', fontWeight: 700 }}>
                          ✓ Recommended Action: {c.action}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 4: TIME-SERIES MACRO FORECAST */}
          {mlSubTab === 'time_series' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Scenario Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 18px', borderRadius: 8, border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <span style={{ fontWeight: 800, color: '#09261d', fontSize: 14 }}>
                    Monte Carlo Macro Forecasting Model (2026 - 2028)
                  </span>
                  <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                    Multi-variate projection simulating future enrollment, tuition cash flows, and staff hiring demand.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Growth Scenario:</span>
                  {['conservative', 'moderate', 'aggressive'].map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      style={{
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        background: scenarioGrowth === sc ? '#09261d' : '#ffffff',
                        color: scenarioGrowth === sc ? '#ffffff' : '#334155',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                      onClick={() => setScenarioGrowth(sc)}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 20 }}>
                {/* Forecast 1: Enrollment Projection */}
                <div className="admin-card" style={{ padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>16. Enrollment Forecast (2026 - 2028)</h4>
                      <span style={{ fontSize: 11.5, color: '#64748b' }}>95% Confidence Interval Band</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#10b981' }}>
                      {scenarioGrowth === 'conservative' ? '790' : scenarioGrowth === 'moderate' ? '860' : '940'} Projected
                    </span>
                  </div>

                  <div style={{ height: 210, position: 'relative' }}>
                    <svg
                      className="admin-analytics-chart-svg"
                      style={{ width: '100%', height: '100%', minHeight: '200px', display: 'block' }}
                      viewBox="0 0 380 160"
                    >
                      <defs>
                        <linearGradient id="forecastBandGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.04" />
                        </linearGradient>
                      </defs>
                      {/* Matrix frame & gridlines */}
                      <rect x="15" y="15" width="350" height="115" fill="none" stroke="#e2e8f0" strokeWidth="1" style={{ stroke: '#e2e8f0', strokeWidth: 1, fill: 'none' }} />
                      <line x1="15" y1="45" x2="365" y2="45" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                      <line x1="15" y1="75" x2="365" y2="75" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                      <line x1="15" y1="105" x2="365" y2="105" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />

                      {/* 95% Confidence Interval Polygon */}
                      <polygon
                        points={`150,85 350,${scenarioGrowth === 'aggressive' ? 12 : scenarioGrowth === 'moderate' ? 24 : 38} 350,${scenarioGrowth === 'aggressive' ? 48 : scenarioGrowth === 'moderate' ? 68 : 88} 150,85`}
                        fill="url(#forecastBandGrad)"
                        style={{ stroke: 'none' }}
                      />

                      {/* Historical Solid Trend */}
                      <path d="M 25 115 L 85 98 L 150 85" fill="none" stroke="#09261d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: '#09261d', strokeWidth: 2.5, fill: 'none' }} />

                      {/* Future Projected Dotted Trend */}
                      {(() => {
                        const projMidY = scenarioGrowth === 'aggressive' ? 44 : scenarioGrowth === 'moderate' ? 56 : 68
                        const projEndY = scenarioGrowth === 'aggressive' ? 24 : scenarioGrowth === 'moderate' ? 42 : 60
                        return (
                          <>
                            <path
                              d={`M 150 85 L 250 ${projMidY} L 350 ${projEndY}`}
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="2.5"
                              strokeDasharray="5 5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ stroke: '#10b981', strokeWidth: 2.5, fill: 'none' }}
                            />

                            {/* White-rimmed points */}
                            <circle cx="25" cy="115" r="4.5" fill="#09261d" stroke="#ffffff" strokeWidth="2" style={{ fill: '#09261d', stroke: '#ffffff', strokeWidth: 2 }} />
                            <text x="25" y="105" textAnchor="middle" fontSize="9.5" fill="#0f172a" fontWeight="700" style={{ stroke: 'none', fill: '#0f172a', fontWeight: 700 }}>670</text>

                            <circle cx="85" cy="98" r="4.5" fill="#09261d" stroke="#ffffff" strokeWidth="2" style={{ fill: '#09261d', stroke: '#ffffff', strokeWidth: 2 }} />
                            <text x="85" y="88" textAnchor="middle" fontSize="9.5" fill="#0f172a" fontWeight="700" style={{ stroke: 'none', fill: '#0f172a', fontWeight: 700 }}>705</text>

                            <circle cx="150" cy="85" r="4.5" fill="#09261d" stroke="#ffffff" strokeWidth="2" style={{ fill: '#09261d', stroke: '#ffffff', strokeWidth: 2 }} />
                            <text x="150" y="74" textAnchor="middle" fontSize="9.5" fill="#0f172a" fontWeight="700" style={{ stroke: 'none', fill: '#0f172a', fontWeight: 700 }}>732</text>

                            <circle cx="250" cy={projMidY} r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" style={{ fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }} />
                            <text x="250" y={projMidY - 9} textAnchor="middle" fontSize="9.5" fill="#047857" fontWeight="700" style={{ stroke: 'none', fill: '#047857', fontWeight: 700 }}>
                              {scenarioGrowth === 'conservative' ? '760' : scenarioGrowth === 'moderate' ? '795' : '835'}
                            </text>

                            <circle cx="350" cy={projEndY} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" style={{ fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }} />
                            <text x="350" y={projEndY - 9} textAnchor="middle" fontSize="10" fill="#047857" fontWeight="800" style={{ stroke: 'none', fill: '#047857', fontWeight: 800 }}>
                              {scenarioGrowth === 'conservative' ? '790' : scenarioGrowth === 'moderate' ? '860' : '940'}
                            </text>
                          </>
                        )
                      })()}

                      {/* X-Axis Labels */}
                      <text x="25" y="148" textAnchor="start" fontSize="10" fill="#64748b" fontWeight="600" style={{ stroke: 'none', fill: '#64748b', fontWeight: 600 }}>2024</text>
                      <text x="85" y="148" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600" style={{ stroke: 'none', fill: '#64748b', fontWeight: 600 }}>2025</text>
                      <text x="150" y="148" textAnchor="middle" fontSize="10" fill="#0f172a" fontWeight="700" style={{ stroke: 'none', fill: '#0f172a', fontWeight: 700 }}>2026 (Now)</text>
                      <text x="250" y="148" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600" style={{ stroke: 'none', fill: '#64748b', fontWeight: 600 }}>2027 (Proj)</text>
                      <text x="350" y="148" textAnchor="end" fontSize="10" fill="#047857" fontWeight="700" style={{ stroke: 'none', fill: '#047857', fontWeight: 700 }}>2028 (Target)</text>
                    </svg>
                  </div>
                </div>

                {/* Forecast 2: Fee Cash Flow */}
                <div className="admin-card" style={{ padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>17. Fee Inflow Liquidity Forecast (Q4 2026)</h4>
                      <span style={{ fontSize: 11.5, color: '#64748b' }}>Projected cash inflows vs operating break-even</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#3b82f6' }}>₦2.45M Expected</span>
                  </div>

                  <div style={{ height: 210, position: 'relative' }}>
                    <svg
                      className="admin-analytics-chart-svg"
                      style={{ width: '100%', height: '100%', minHeight: '200px', display: 'block' }}
                      viewBox="0 0 380 160"
                    >
                      <defs>
                        <linearGradient id="liquidityGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
                        </linearGradient>
                      </defs>
                      {/* Matrix frame & gridlines */}
                      <rect x="15" y="15" width="350" height="115" fill="none" stroke="#e2e8f0" strokeWidth="1" style={{ stroke: '#e2e8f0', strokeWidth: 1, fill: 'none' }} />
                      <line x1="15" y1="45" x2="365" y2="45" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                      <line x1="15" y1="75" x2="365" y2="75" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />
                      <line x1="15" y1="105" x2="365" y2="105" stroke="#f1f5f9" strokeWidth="1" style={{ stroke: '#f1f5f9', strokeWidth: 1 }} />

                      {/* Break-even benchmark dashed line */}
                      <line x1="15" y1="75" x2="365" y2="75" stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="1.5" style={{ stroke: '#f59e0b', strokeWidth: 1.5 }} />
                      <text x="360" y="70" textAnchor="end" fontSize="9" fill="#d97706" fontWeight="700" style={{ stroke: 'none', fill: '#d97706', fontWeight: 700 }}>
                        Break-Even Benchmark (₦1.80M)
                      </text>

                      {/* Liquidity Area Gradient Fill */}
                      <path
                        d="M 35 115 Q 115 95, 190 75 T 345 32 L 345 130 L 35 130 Z"
                        fill="url(#liquidityGrad)"
                        style={{ stroke: 'none' }}
                      />

                      {/* Smooth Inflow Curve */}
                      <path
                        d="M 35 115 Q 115 95, 190 75 T 345 32"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ stroke: '#3b82f6', strokeWidth: 2.5, fill: 'none' }}
                      />

                      {/* Data Points */}
                      <circle cx="35" cy="115" r="4.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" style={{ fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }} />
                      <text x="35" y="105" textAnchor="middle" fontSize="9.5" fill="#0f172a" fontWeight="700" style={{ stroke: 'none', fill: '#0f172a', fontWeight: 700 }}>₦1.10M</text>

                      <circle cx="190" cy="75" r="4.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" style={{ fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }} />
                      <text x="190" y="65" textAnchor="middle" fontSize="9.5" fill="#0f172a" fontWeight="700" style={{ stroke: 'none', fill: '#0f172a', fontWeight: 700 }}>₦1.75M</text>

                      <circle cx="345" cy="32" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" style={{ fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }} />
                      <text x="345" y="22" textAnchor="middle" fontSize="10" fill="#1d4ed8" fontWeight="800" style={{ stroke: 'none', fill: '#1d4ed8', fontWeight: 800 }}>₦2.45M</text>

                      {/* X-Axis Labels */}
                      <text x="35" y="148" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600" style={{ stroke: 'none', fill: '#64748b', fontWeight: 600 }}>October 2026</text>
                      <text x="190" y="148" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600" style={{ stroke: 'none', fill: '#64748b', fontWeight: 600 }}>November 2026</text>
                      <text x="345" y="148" textAnchor="end" fontSize="10" fill="#15803d" fontWeight="700" style={{ stroke: 'none', fill: '#15803d', fontWeight: 700 }}>Dec 2026 (Surplus)</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: PRESCRIPTIVE INTERVENTIONS (ACTION MATRIX)                      */}
      {/* ========================================================================= */}
      {activeTab === 'prescriptive' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="admin-card" style={{ padding: 0 }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Strategic Institutional Interventions & Prescriptions
                </h3>
                <p style={{ fontSize: 12.5, color: '#64748b', margin: '3px 0 0 0' }}>
                  AI-recommended operational actions synthesized from descriptive performance, root-cause diagnostics, and ML forecasts.
                </p>
              </div>
              <span style={{ fontSize: 12, color: '#047857', background: '#ecfdf5', padding: '4px 12px', borderRadius: 12, fontWeight: 700 }}>
                High Institutional Impact
              </span>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>INTERVENTION ID & STRATEGY</th>
                    <th>TARGET DEPARTMENT</th>
                    <th>ESTIMATED IMPACT / ROI</th>
                    <th>PRIORITY</th>
                    <th>CURRENT STATUS</th>
                    <th style={{ textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {interventions.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.title}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>Ref: {item.id}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{item.dept}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: 12, color: '#047857', fontWeight: 600 }}>{item.impact}</span>
                      </td>
                      <td>
                        <span className={`admin-badge ${item.priority === 'High' ? 'red' : 'yellow'}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: 4,
                            background: item.status.includes('✓') ? '#ecfdf5' : '#f1f5f9',
                            color: item.status.includes('✓') ? '#047857' : '#334155',
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="admin-btn admin-btn-sm admin-btn-primary"
                          onClick={() => handleExecuteIntervention(item.id)}
                          disabled={item.status.includes('✓')}
                        >
                          {item.status.includes('✓') ? 'Triggered' : 'Execute Action'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE WHAT-IF MACHINE LEARNING SIMULATOR MODAL                    */}
      {/* ========================================================================= */}
      {isSimulatorOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(9, 38, 29, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSimulatorOpen(false)
          }}
        >
          <div
            className="admin-card"
            style={{
              width: '100%',
              maxWidth: 820,
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: 0,
              borderRadius: 12,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              border: '2px solid #09261d',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                background: '#09261d',
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#ffffff' }}>
                  Interactive Machine Learning What-If Simulator
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#9eb5aa' }}>
                  Adjust behavioral inputs in real-time to compute instant ML outcome predictions & risk probabilities
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSimulatorOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: 22,
                  cursor: 'pointer',
                  lineHeight: 1,
                  padding: 4,
                }}
              >
                ✕
              </button>
            </div>

            {/* Quick Presets Banner */}
            <div style={{ background: '#f8fafc', padding: '12px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Quick Persona Presets:</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => loadSimulatorPreset('honors')}
                  className="admin-btn-outline"
                  style={{ fontSize: 11.5, padding: '4px 10px' }}
                >
                  🌟 Honors Student
                </button>
                <button
                  type="button"
                  onClick={() => loadSimulatorPreset('average')}
                  className="admin-btn-outline"
                  style={{ fontSize: 11.5, padding: '4px 10px' }}
                >
                  ⚖️ Average Student
                </button>
                <button
                  type="button"
                  onClick={() => loadSimulatorPreset('at_risk')}
                  className="admin-btn-outline"
                  style={{ fontSize: 11.5, padding: '4px 10px', color: '#dc2626' }}
                >
                  ⚠️ Critical At-Risk
                </button>
              </div>
            </div>

            {/* Modal Body: Sliders & Live ML Results */}
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              {/* Sliders Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>
                    <span>1. Attendance Rate (%):</span>
                    <span style={{ color: '#09261d', fontWeight: 900 }}>{simAttendance}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={simAttendance}
                    onChange={(e) => setSimAttendance(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#09261d', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
                    <span>40% (Chronic Truancy)</span>
                    <span>100% (Perfect)</span>
                  </div>
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>
                    <span>2. Continuous Assessment (CA) Score:</span>
                    <span style={{ color: '#09261d', fontWeight: 900 }}>{simCA} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={simCA}
                    onChange={(e) => setSimCA(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#09261d', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
                    <span>20 (Failed CA)</span>
                    <span>100 (Distinction)</span>
                  </div>
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>
                    <span>3. Homework / Assignment Completion:</span>
                    <span style={{ color: '#09261d', fontWeight: 900 }}>{simAssignment}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={simAssignment}
                    onChange={(e) => setSimAssignment(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#09261d', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
                    <span>10% (Chronic Missing)</span>
                    <span>100% (Always Submitted)</span>
                  </div>
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>
                    <span>4. Weekly Independent Study Hours:</span>
                    <span style={{ color: '#09261d', fontWeight: 900 }}>{simStudyHours} hrs/week</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={simStudyHours}
                    onChange={(e) => setSimStudyHours(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#09261d', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
                    <span>0 hrs (No prep)</span>
                    <span>30 hrs (Extensive prep)</span>
                  </div>
                </label>
              </div>

              {/* Prediction Output Card */}
              <div
                style={{
                  background: simResult.bg,
                  border: `2px solid ${simResult.badgeColor}`,
                  borderRadius: 10,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
                      INFERRED OUTCOME
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: 12,
                        background: '#ffffff',
                        color: simResult.badgeColor,
                        border: `1px solid ${simResult.badgeColor}`,
                      }}
                    >
                      {simResult.riskLevel}
                    </span>
                  </div>

                  <div style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                    {simResult.score}%
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: simResult.badgeColor, marginBottom: 14 }}>
                    Predicted Grade: {simResult.grade}
                  </div>

                  {/* Probability Breakdown Bars */}
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                    Model Softmax Probability Distribution:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 600 }}>
                        <span>Distinction Probability:</span>
                        <span style={{ color: '#10b981', fontWeight: 800 }}>{simResult.probDist}%</span>
                      </div>
                      <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${simResult.probDist}%`, height: '100%', background: '#10b981' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 600 }}>
                        <span>Pass / Competent Probability:</span>
                        <span style={{ color: '#3b82f6', fontWeight: 800 }}>{simResult.probPass}%</span>
                      </div>
                      <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${simResult.probPass}%`, height: '100%', background: '#3b82f6' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 600 }}>
                        <span>At-Risk / Probation Probability:</span>
                        <span style={{ color: '#dc2626', fontWeight: 800 }}>{simResult.probRisk}%</span>
                      </div>
                      <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${simResult.probRisk}%`, height: '100%', background: '#dc2626' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 11.5, color: '#334155' }}>
                    <b>Prescriptive Strategy:</b> {simResult.prescription}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button
                    type="button"
                    className="admin-btn-primary"
                    style={{ flex: 1, padding: '9px 12px', fontSize: 12 }}
                    onClick={() => {
                      showToast(`Simulation saved: Predicted Score ${simResult.score}% (${simResult.grade})`)
                    }}
                  >
                    Save Simulation Result
                  </button>
                  <button
                    type="button"
                    className="admin-btn-outline"
                    style={{ padding: '9px 16px', fontSize: 12 }}
                    onClick={() => setIsSimulatorOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { DatabaseSchema, Student, TimelineEvent, Course, Batch, Trainer, Payment, AttendanceRecord, Certificate, Placement, NotificationLog, AuditLog, InstituteSettings } from '../types.js';

// Absolute path to the database file in the root
const DB_FILE_PATH = path.resolve(process.cwd(), 'db.json');

// Default starting settings
const DEFAULT_SETTINGS: InstituteSettings = {
  instituteName: "MR Technologies",
  logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  gstNo: "36AAAAA1111A1Z1",
  email: "admin@mrtechnologies.com",
  whatsappNo: "+91 98765 43210",
  smsGateway: "Twilio Gateway - SMS_MRTECH",
  branches: ["Hyderabad (H.O)", "Bangalore", "Pune"],
  backupHistory: [
    { date: "2026-06-01", size: "124 KB", status: "Success" },
    { date: "2026-06-15", size: "128 KB", status: "Success" }
  ]
};

// Realistic Seed Data
const SEED_COURSES: Course[] = [
  {
    id: "CRS001",
    name: "Java Full Stack Development",
    duration: "6 Months",
    level: "Beginner",
    description: "End-to-end training covering Core Java, Advanced Java, Spring Boot, Microservices, Hibernate, PostgreSQL, and React.js. Includes live industry projects.",
    price: 45000,
    offerPrice: 39999,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=60",
    modules: ["Module 1: Core Java Programming", "Module 2: Advanced Java & Database Management", "Module 3: Spring Framework & Spring Boot", "Module 4: Web Services & Microservices", "Module 5: React.js UI Integration", "Module 6: Capstone Project Deployment"],
    prerequisites: ["Basic understanding of computer programming concepts", "No prior coding background required"],
    certification: "Certified Full Stack Java Developer (MR Tech)",
    projects: ["E-Commerce Backend Engine", "Hospital Portal", "Real-Time Chat App"],
    trainerId: "TRN201",
    status: "Active",
    materials: [
      { title: "Core Java Complete Guide", type: "PDF", url: "#" },
      { title: "Spring Boot Microservices Setup", type: "Video", url: "#" },
      { title: "Assignment: REST API Design", type: "Assignment", url: "#" }
    ]
  },
  {
    id: "CRS002",
    name: "Python, AI & Machine Learning",
    duration: "4 Months",
    level: "Intermediate",
    description: "Become an AI/ML engineer. Master Python programming, data analysis with Pandas/NumPy, machine learning models, deep learning with PyTorch, and NLP.",
    price: 55000,
    offerPrice: 49999,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&auto=format&fit=crop&q=60",
    modules: ["Module 1: Python for Data Science", "Module 2: Explanatory Data Analysis & Viz", "Module 3: Classical Machine Learning Algorithms", "Module 4: Deep Learning & Neural Networks", "Module 5: Generative AI & Large Language Models"],
    prerequisites: ["Basic Mathematics & Algebra", "Prior basic coding is helpful but not mandatory"],
    certification: "AI & ML Practitioner Certificate (MR Tech)",
    projects: ["Predictive Real Estate Valuation Model", "Customer Sentiment NLP Analyzer", "Custom Fine-tuned LLM Chatbot"],
    trainerId: "TRN202",
    status: "Active",
    materials: [
      { title: "Python Fundamentals Notebook", type: "PDF", url: "#" },
      { title: "Regression Models Deep-Dive", type: "Video", url: "#" }
    ]
  },
  {
    id: "CRS003",
    name: "Frontend React & Node.js Developer",
    duration: "3 Months",
    level: "Beginner",
    description: "Accelerated React, Node.js, Express, and MongoDB full-stack web developer track. Perfect for fast-tracking a career in modern web technologies.",
    price: 35000,
    offerPrice: 29999,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&auto=format&fit=crop&q=60",
    modules: ["Module 1: Advanced Javascript (ES6+)", "Module 2: React Core Concepts & Hooks", "Module 3: Styling with Tailwind CSS & UI Kits", "Module 4: Node.js & Express API Backend", "Module 5: MongoDB Integration & Full Deployment"],
    prerequisites: ["Basic HTML, CSS, Javascript knowledge"],
    certification: "Full Stack Web Developer Certificate (MR Tech)",
    projects: ["Team Collaboration Board", "SaaS Billing Dashboard", "Custom Portfolio Engine"],
    trainerId: "TRN203",
    status: "Active",
    materials: [
      { title: "React State Management Handout", type: "PDF", url: "#" },
      { title: "Node.js Middleware Architecture", type: "Video", url: "#" }
    ]
  },
  {
    id: "CRS004",
    name: "UI/UX Product Design Bootcamp",
    duration: "3 Months",
    level: "Beginner",
    description: "Learn user research, wireframing, high-fidelity UI design in Figma, usability testing, and professional client handoff. Build a world-class portfolio.",
    price: 30000,
    offerPrice: 24999,
    image: "https://images.unsplash.com/photo-1561070791-26c113006238?w=400&auto=format&fit=crop&q=60",
    modules: ["Module 1: Design Principles & Human Psychology", "Module 2: Figma Essentials & Advanced Auto-Layout", "Module 3: Wireframing & Interactive Prototyping", "Module 4: User Research & Case Studies", "Module 5: Advanced Figma Design Systems"],
    prerequisites: ["Creative mindset, attention to detail"],
    certification: "Certified Product UX Designer",
    projects: ["Fintech Mobile Wallet Redesign", "Food Delivery App End-to-End Case Study", "SaaS Onboarding UX Walkthrough"],
    trainerId: "TRN204",
    status: "Active",
    materials: [
      { title: "UX Research Methodologies Cheat-sheet", type: "PDF", url: "#" },
      { title: "Figma Advanced Variables Workshop", type: "Video", url: "#" }
    ]
  },
  {
    id: "CRS005",
    name: "Cloud DevOps Engineering",
    duration: "4 Months",
    level: "Advanced",
    description: "Bridge the gap between development and operations. Learn AWS, Docker, Kubernetes, Ansible, Terraform, Jenkins, and CI/CD pipelines.",
    price: 50000,
    offerPrice: 44999,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=60",
    modules: ["Module 1: Linux & Scripting Essentials", "Module 2: Amazon Web Services (AWS) Core Architecture", "Module 3: Containerization with Docker", "Module 4: Orchestration with Kubernetes", "Module 5: Infrastructure as Code (Terraform)", "Module 6: CI/CD Jenkins Pipeline Automations"],
    prerequisites: ["Basic software development or systems admin familiarity"],
    certification: "Certified Cloud Infrastructure DevOps Engineer",
    projects: ["High-Availability Auto-Scaling Cluster Setup", "Fully Automated GitOps CI/CD Pipeline", "Multi-Region VPC Terraform Script"],
    trainerId: "TRN205",
    status: "Active",
    materials: [
      { title: "Linux SysAdmin Playbook", type: "PDF", url: "#" },
      { title: "Terraform State Management Tutorial", type: "Video", url: "#" }
    ]
  }
];

const SEED_TRAINERS: Trainer[] = [
  {
    id: "TRN201",
    name: "Ravi Kumar",
    email: "ravi.kumar@mrtechnologies.com",
    mobile: "+91 90123 45678",
    qualification: "M.Tech in Computer Science",
    experience: "8 Years",
    skills: ["Java", "Spring Boot", "Microservices", "Hibernate", "PostgreSQL", "React.js"],
    salary: 75000,
    availability: "Full-Time",
    rating: 4.9,
    feedback: [
      { studentName: "Siddharth Rao", rating: 5, comment: "Ravi explained Spring Boot Concepts with great practical real-world examples." },
      { studentName: "Pooja Hegde", rating: 4.8, comment: "Excellent pace of teaching. Clear doubts immediately." }
    ],
    assignedBatches: ["BAT101"],
    status: "Active"
  },
  {
    id: "TRN202",
    name: "Priya Sharma",
    email: "priya.sharma@mrtechnologies.com",
    mobile: "+91 91234 56789",
    qualification: "Ph.D. in Artificial Intelligence",
    experience: "6 Years",
    skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Pandas & Numpy", "LLM Fine-tuning"],
    salary: 85000,
    availability: "Full-Time",
    rating: 4.8,
    feedback: [
      { studentName: "Arjun Nair", rating: 5, comment: "Her theoretical knowledge paired with hands-on labs makes AI feel very intuitive." }
    ],
    assignedBatches: ["BAT102"],
    status: "Active"
  },
  {
    id: "TRN203",
    name: "Amit Patel",
    email: "amit.patel@mrtechnologies.com",
    mobile: "+91 92345 67890",
    qualification: "B.Tech in Information Tech",
    experience: "5 Years",
    skills: ["Javascript", "Node.js", "React.js", "Express", "MongoDB", "CSS Grid", "Tailwind CSS"],
    salary: 65000,
    availability: "Full-Time",
    rating: 4.7,
    feedback: [
      { studentName: "Kavya Murthy", rating: 4.5, comment: "Very hands-on approach. He walks us line by line through code." }
    ],
    assignedBatches: ["BAT103"],
    status: "Active"
  },
  {
    id: "TRN204",
    name: "Sneha Reddy",
    email: "sneha.reddy@mrtechnologies.com",
    mobile: "+91 93456 78901",
    qualification: "B.Des, IIT Bombay",
    experience: "4 Years",
    skills: ["Figma", "User Research", "Wireframing", "Interaction Design", "Typography", "Illustrator"],
    salary: 40000,
    availability: "Part-Time",
    rating: 4.6,
    feedback: [
      { studentName: "Aparna Sen", rating: 5, comment: "Pushed my creativity boundary in Figma! Loved her critique sessions." }
    ],
    assignedBatches: ["BAT104"],
    status: "Active"
  },
  {
    id: "TRN205",
    name: "Vikram Singh",
    email: "vikram.singh@mrtechnologies.com",
    mobile: "+91 94567 89012",
    qualification: "AWS Solution Architect Professional",
    experience: "7 Years",
    skills: ["AWS", "Terraform", "Kubernetes", "Docker", "Ansible", "CI/CD Jenkins", "Linux Shell"],
    salary: 80000,
    availability: "Full-Time",
    rating: 4.8,
    feedback: [
      { studentName: "Rahul Saxena", rating: 4.8, comment: "High quality labs and robust infrastructure mockups." }
    ],
    assignedBatches: ["BAT105"],
    status: "Active"
  }
];

const SEED_BATCHES: Batch[] = [
  {
    id: "BAT101",
    name: "Morning Java Full Stack (M-J-A)",
    courseId: "CRS001",
    trainerId: "TRN201",
    startDate: "2026-05-01",
    endDate: "2026-11-01",
    timing: "09:00 AM - 11:00 AM",
    classroom: "Lab Room 1",
    capacity: 25,
    enrolledCount: 18,
    status: "Ongoing",
    progress: 40,
    attendancePct: 88
  },
  {
    id: "BAT102",
    name: "Evening Python AI/ML (E-P-A)",
    courseId: "CRS002",
    trainerId: "TRN202",
    startDate: "2026-05-15",
    endDate: "2026-09-15",
    timing: "06:30 PM - 08:30 PM",
    classroom: "Seminar Hall A",
    capacity: 20,
    enrolledCount: 16,
    status: "Ongoing",
    progress: 55,
    attendancePct: 92
  },
  {
    id: "BAT103",
    name: "Weekend Web Stack React (W-W-R)",
    courseId: "CRS003",
    trainerId: "TRN203",
    startDate: "2026-06-01",
    endDate: "2026-09-01",
    timing: "10:00 AM - 02:00 PM (Sat-Sun)",
    classroom: "Lab Room 3",
    capacity: 30,
    enrolledCount: 22,
    status: "Ongoing",
    progress: 25,
    attendancePct: 84
  },
  {
    id: "BAT104",
    name: "UI/UX Design Bootcamp Spring (U-D-B)",
    courseId: "CRS004",
    trainerId: "TRN204",
    startDate: "2026-02-01",
    endDate: "2026-05-01",
    timing: "11:30 AM - 01:30 PM",
    classroom: "Studio Room 2",
    capacity: 15,
    enrolledCount: 12,
    status: "Completed",
    progress: 100,
    attendancePct: 95
  },
  {
    id: "BAT105",
    name: "AWS Cloud DevOps Monsoon (A-C-D)",
    courseId: "CRS005",
    trainerId: "TRN205",
    startDate: "2026-07-15",
    endDate: "2026-11-15",
    timing: "04:00 PM - 06:00 PM",
    classroom: "Lab Room 2",
    capacity: 25,
    enrolledCount: 10,
    status: "Upcoming",
    progress: 0,
    attendancePct: 0
  }
];

const SEED_STUDENTS: Student[] = [
  {
    id: "STU1001",
    name: "Siddharth Rao",
    gender: "Male",
    dob: "2001-08-14",
    mobile: "+91 98888 77777",
    altMobile: "+91 98888 66666",
    email: "siddharth.rao@gmail.com",
    address: "Flat 402, Gachibowli Green Towers",
    city: "Hyderabad",
    state: "Telangana",
    qualification: "B.Tech in Computer Science",
    college: "JNTU Hyderabad",
    branch: "Information Technology",
    passoutYear: 2024,
    experience: "Fresher",
    guardianName: "Raghav Rao",
    guardianMobile: "+91 90000 11111",
    courseId: "CRS001",
    batchId: "BAT101",
    trainerId: "TRN201",
    admissionDate: "2026-04-20",
    courseFee: 39999,
    discount: 2000,
    paidAmount: 25000,
    pendingAmount: 12999,
    paymentPlan: "Installments",
    status: "Active",
    documents: [
      { name: "Aadhar_Card.pdf", url: "#", uploadDate: "2026-04-20" },
      { name: "Graduation_Marksheet.pdf", url: "#", uploadDate: "2026-04-20" }
    ],
    remarks: "Very active and sharp. Excellent at Java programming core.",
    timeline: [
      { id: "T101", date: "2026-04-20", title: "Student Registered", desc: "Successfully registered and admitted into Java Full Stack Development.", type: "admission" },
      { id: "T102", date: "2026-04-20", title: "Paid Admission Fee", desc: "Paid INR 15,000 as initial registration fee.", type: "payment" },
      { id: "T103", date: "2026-05-25", title: "Paid Second Installment", desc: "Paid INR 10,000 via UPI.", type: "payment" }
    ]
  },
  {
    id: "STU1002",
    name: "Arjun Nair",
    gender: "Male",
    dob: "2000-03-24",
    mobile: "+91 97777 66666",
    altMobile: "",
    email: "arjun.nair@yahoo.com",
    address: "H.No 12-4-88, Madhapur",
    city: "Hyderabad",
    state: "Telangana",
    qualification: "B.E. in Electronics",
    college: "Osmania University",
    branch: "ECE",
    passoutYear: 2023,
    experience: "1 Year (Tech Support)",
    guardianName: "Balakrishnan Nair",
    guardianMobile: "+91 91111 22222",
    courseId: "CRS002",
    batchId: "BAT102",
    trainerId: "TRN202",
    admissionDate: "2026-05-10",
    courseFee: 49999,
    discount: 5000,
    paidAmount: 44999,
    pendingAmount: 0,
    paymentPlan: "One-Time",
    status: "Active",
    documents: [
      { name: "Aadhar_Card.pdf", url: "#", uploadDate: "2026-05-10" }
    ],
    remarks: "Fast learner, paid 100% course fee with upfront discount benefit.",
    timeline: [
      { id: "T104", date: "2026-05-10", title: "Student Admitted", desc: "Joined Python & AI/ML training.", type: "admission" },
      { id: "T105", date: "2026-05-10", title: "Full Fee Payment", desc: "Paid full discounted amount of INR 44,999.", type: "payment" }
    ]
  },
  {
    id: "STU1003",
    name: "Kavya Murthy",
    gender: "Female",
    dob: "2002-11-15",
    mobile: "+91 96666 55555",
    altMobile: "+91 96666 44444",
    email: "kavya.m@outlook.com",
    address: "B-24, Malleshwaram",
    city: "Bangalore",
    state: "Karnataka",
    qualification: "BCA Graduate",
    college: "PES University",
    branch: "Computer Applications",
    passoutYear: 2024,
    experience: "Fresher",
    guardianName: "Venkatesh Murthy",
    guardianMobile: "+91 92222 33333",
    courseId: "CRS003",
    batchId: "BAT103",
    trainerId: "TRN203",
    admissionDate: "2026-05-28",
    courseFee: 29999,
    discount: 0,
    paidAmount: 15000,
    pendingAmount: 14999,
    paymentPlan: "Installments",
    status: "Active",
    documents: [],
    remarks: "Good logic building. Prefers front-end CSS framework styling.",
    timeline: [
      { id: "T106", date: "2026-05-28", title: "Registration Done", desc: "Enrolled in Frontend React Node program.", type: "admission" },
      { id: "T107", date: "2026-05-28", title: "First Installment", desc: "Paid INR 15,000 using Credit Card.", type: "payment" }
    ]
  },
  {
    id: "STU1004",
    name: "Pooja Hegde",
    gender: "Female",
    dob: "1999-05-18",
    mobile: "+91 95555 44444",
    altMobile: "",
    email: "pooja.hegde@gmail.com",
    address: "Flat 101, Elite Residency, Miyapur",
    city: "Hyderabad",
    state: "Telangana",
    qualification: "B.Tech Mechanical",
    college: "CBIT",
    branch: "Mechanical Engineering",
    passoutYear: 2022,
    experience: "2 Years in Non-IT sales",
    guardianName: "Srinivas Hegde",
    guardianMobile: "+91 93333 44444",
    courseId: "CRS001",
    batchId: "BAT101",
    trainerId: "TRN201",
    admissionDate: "2026-04-22",
    courseFee: 39999,
    discount: 1000,
    paidAmount: 12000,
    pendingAmount: 26999,
    paymentPlan: "Installments",
    status: "Active",
    documents: [],
    remarks: "Switching from non-IT. Needs extra practice on Java OOPs. Attendance is slightly low.",
    timeline: [
      { id: "T108", date: "2026-04-22", title: "Student Admitted", desc: "Enrolled in Java Full Stack.", type: "admission" },
      { id: "T109", date: "2026-04-22", title: "Initial Payment", desc: "Paid INR 12,000.", type: "payment" }
    ]
  },
  {
    id: "STU1005",
    name: "Sanjay Singhania",
    gender: "Male",
    dob: "1997-01-05",
    mobile: "+91 94444 33333",
    altMobile: "",
    email: "sanjay.s@singhaniagroup.com",
    address: "Villa 9, Palm Meadows, Whitefield",
    city: "Bangalore",
    state: "Karnataka",
    qualification: "B.Com Graduate",
    college: "St. Joseph College",
    branch: "Commerce",
    passoutYear: 2019,
    experience: "5 Years Business Exp",
    guardianName: "Rajendra Singhania",
    guardianMobile: "+91 94444 11111",
    courseId: "CRS004",
    batchId: "BAT104",
    trainerId: "TRN204",
    admissionDate: "2026-01-25",
    courseFee: 24999,
    discount: 4999,
    paidAmount: 20000,
    pendingAmount: 0,
    paymentPlan: "One-Time",
    status: "Completed",
    documents: [
      { name: "Sanjay_Resume.pdf", url: "#", uploadDate: "2026-01-25" }
    ],
    remarks: "Completed Bootcamp and built an amazing Fintech Portfolio case study.",
    timeline: [
      { id: "T110", date: "2026-01-25", title: "Admitted", desc: "Joined UI/UX Bootcamp.", type: "admission" },
      { id: "T111", date: "2026-01-25", title: "Fees Settled", desc: "Completed INR 20,000 full-fee payment.", type: "payment" },
      { id: "T112", date: "2026-05-02", title: "Course Completed", desc: "Successfully completed product design bootcamp with 95% attendance.", type: "certificate" }
    ]
  },
  {
    id: "STU1006",
    name: "Meera Deshmukh",
    gender: "Female",
    dob: "2003-09-12",
    mobile: "+91 93333 22222",
    altMobile: "",
    email: "meera.deshmukh@gmail.com",
    address: "Row House 3, Shivaji Park",
    city: "Pune",
    state: "Maharashtra",
    qualification: "B.Tech Final Year",
    college: "COEP Pune",
    branch: "Computer Engineering",
    passoutYear: 2026,
    experience: "Fresher",
    guardianName: "Anil Deshmukh",
    guardianMobile: "+91 95555 66666",
    courseId: "CRS004",
    batchId: "BAT104",
    trainerId: "TRN204",
    admissionDate: "2026-01-28",
    courseFee: 24999,
    discount: 0,
    paidAmount: 24999,
    pendingAmount: 0,
    paymentPlan: "One-Time",
    status: "Completed",
    documents: [],
    remarks: "Exceptional UI design skills. Outstanding layout spacing control.",
    timeline: [
      { id: "T113", date: "2026-01-28", title: "Admitted", desc: "Registered in UI/UX Bootcamp.", type: "admission" },
      { id: "T114", date: "2026-01-28", title: "Full Payment Received", desc: "Paid INR 24,999 cash.", type: "payment" },
      { id: "T115", date: "2026-05-02", title: "Certified Completed", desc: "Awarded UI/UX Certification.", type: "certificate" }
    ]
  },
  {
    id: "STU1007",
    name: "Rishi Verma",
    gender: "Male",
    dob: "2001-04-12",
    mobile: "+91 92222 11111",
    altMobile: "",
    email: "rishi.verma@outlook.com",
    address: "Sec-12, Noida",
    city: "Noida",
    state: "Uttar Pradesh",
    qualification: "B.Tech IT",
    college: "Amity Noida",
    branch: "Information Tech",
    passoutYear: 2024,
    experience: "Fresher",
    guardianName: "Deepak Verma",
    guardianMobile: "+91 96666 77777",
    courseId: "CRS005",
    batchId: "BAT105",
    trainerId: "TRN205",
    admissionDate: "2026-06-15",
    courseFee: 44999,
    discount: 3000,
    paidAmount: 5000,
    pendingAmount: 36999,
    paymentPlan: "Installments",
    status: "Yet to Start",
    documents: [],
    remarks: "Admitted to upcoming cloud devops monsoon batch starting July 15.",
    timeline: [
      { id: "T116", date: "2026-06-15", title: "Upcoming Seat Booked", desc: "Paid INR 5,000 seat booking reservation for Cloud DevOps batch BAT105.", type: "admission" }
    ]
  },
  {
    id: "STU1008",
    name: "Ananya Panday",
    gender: "Female",
    dob: "2002-12-05",
    mobile: "+91 91111 00000",
    altMobile: "",
    email: "ananya.p@gmail.com",
    address: "H.No 120, Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    qualification: "B.Tech CSE",
    college: "VNR VJIET",
    branch: "CSE",
    passoutYear: 2024,
    experience: "Fresher",
    guardianName: "Alok Panday",
    guardianMobile: "+91 97777 88888",
    courseId: "CRS002",
    batchId: "BAT102",
    trainerId: "TRN202",
    admissionDate: "2026-05-12",
    courseFee: 49999,
    discount: 5000,
    paidAmount: 15000,
    pendingAmount: 29999,
    paymentPlan: "Installments",
    status: "Active",
    documents: [],
    remarks: "Requires special focus on statistics math for machine learning.",
    timeline: [
      { id: "T117", date: "2026-05-12", title: "Enrolled", desc: "Joined Python AI/ML Evening batch.", type: "admission" },
      { id: "T118", date: "2026-05-12", title: "Installment 1", desc: "Paid booking installment INR 15,000.", type: "payment" }
    ]
  },
  {
    id: "STU1009",
    name: "Siddharth Malhotra",
    gender: "Male",
    dob: "1998-03-12",
    mobile: "+91 90000 99999",
    altMobile: "",
    email: "sid.malhotra@gmail.com",
    address: "Flat 501, Bandra Reclamation",
    city: "Mumbai",
    state: "Maharashtra",
    qualification: "B.Tech EEE",
    college: "VJTI Mumbai",
    branch: "Electrical",
    passoutYear: 2020,
    experience: "3 Years Embedded Dev",
    guardianName: "K.K. Malhotra",
    guardianMobile: "+91 98888 12345",
    courseId: "CRS002",
    batchId: "BAT102",
    trainerId: "TRN202",
    admissionDate: "2026-05-13",
    courseFee: 49999,
    discount: 4000,
    paidAmount: 25000,
    pendingAmount: 20999,
    paymentPlan: "Installments",
    status: "Active",
    documents: [],
    remarks: "Enrolled in Python AI/ML. Highly diligent, fast learner.",
    timeline: [
      { id: "T119", date: "2026-05-13", title: "Enrolled", desc: "Joined Python AI/ML Evening batch.", type: "admission" },
      { id: "T120", date: "2026-05-13", title: "First Installment", desc: "Paid INR 25,000.", type: "payment" }
    ]
  },
  {
    id: "STU1010",
    name: "Rohan Mehra",
    gender: "Male",
    dob: "2001-09-09",
    mobile: "+91 98989 89898",
    altMobile: "",
    email: "rohan.mehra@gmail.com",
    address: "Sec 44, Gurgaon",
    city: "Gurgaon",
    state: "Haryana",
    qualification: "B.Tech CSE",
    college: "IIT Delhi",
    branch: "Computer Science",
    passoutYear: 2024,
    experience: "Fresher",
    guardianName: "Vinod Mehra",
    guardianMobile: "+91 99999 88888",
    courseId: "CRS001",
    batchId: "BAT101",
    trainerId: "TRN201",
    admissionDate: "2026-04-21",
    courseFee: 39999,
    discount: 5000,
    paidAmount: 34999,
    pendingAmount: 0,
    paymentPlan: "One-Time",
    status: "Active",
    documents: [],
    remarks: "Top-tier logical programming. Solves Spring Boot integration tasks in record time.",
    timeline: [
      { id: "T121", date: "2026-04-21", title: "Enrolled", desc: "Joined Java Full Stack Morning batch.", type: "admission" },
      { id: "T122", date: "2026-04-21", title: "Full Payment Completed", desc: "Paid INR 34,999 in one go.", type: "payment" }
    ]
  },
  {
    id: "STU1011",
    name: "Meera Nair",
    gender: "Female",
    dob: "2002-10-10",
    mobile: "+91 97979 79797",
    altMobile: "",
    email: "meera.nair@gmail.com",
    address: "H.No 44-12, Kakkanad",
    city: "Kochi",
    state: "Kerala",
    qualification: "B.Tech CSE",
    college: "CUSAT Cochin",
    branch: "IT",
    passoutYear: 2024,
    experience: "Fresher",
    guardianName: "Madhavan Nair",
    guardianMobile: "+91 95555 43210",
    courseId: "CRS003",
    batchId: "BAT103",
    trainerId: "TRN203",
    admissionDate: "2026-05-29",
    courseFee: 29999,
    discount: 2000,
    paidAmount: 10000,
    pendingAmount: 17999,
    paymentPlan: "Installments",
    status: "Active",
    documents: [],
    remarks: "Excels at UI mockups. Struggles a bit with Node Express routing logic.",
    timeline: [
      { id: "T123", date: "2026-05-29", title: "Enrolled", desc: "Joined Web Developer stack BAT103.", type: "admission" },
      { id: "T124", date: "2026-05-29", title: "Paid Booking Amount", desc: "Paid INR 10,000 reservation payment.", type: "payment" }
    ]
  },
  {
    id: "STU1012",
    name: "Vikram Malhotra",
    gender: "Male",
    dob: "1996-07-20",
    mobile: "+91 96969 69696",
    altMobile: "",
    email: "vikram.m@gmail.com",
    address: "Penthouse B, Shivaji Nagar",
    city: "Pune",
    state: "Maharashtra",
    qualification: "B.Sc Computer Science",
    college: "Ferguson College",
    branch: "CS",
    passoutYear: 2018,
    experience: "6 Years QA Manual Tester",
    guardianName: "Devender Malhotra",
    guardianMobile: "+91 94444 88888",
    courseId: "CRS001",
    batchId: "BAT101",
    trainerId: "TRN201",
    admissionDate: "2026-04-20",
    courseFee: 39999,
    discount: 3999,
    paidAmount: 5000,
    pendingAmount: 31000,
    paymentPlan: "Installments",
    status: "Discontinued",
    documents: [],
    remarks: "Discontinued after 1 month due to relocation of QA job responsibilities abroad.",
    timeline: [
      { id: "T125", date: "2026-04-20", title: "Registered", desc: "Enrolled in Java Full Stack.", type: "admission" },
      { id: "T126", date: "2026-04-20", title: "Installment 1 Received", desc: "Paid INR 5,000.", type: "payment" },
      { id: "T127", date: "2026-05-30", title: "Status Changed", desc: "Marked as discontinued due to job relocation.", type: "general" }
    ]
  }
];

const SEED_PAYMENTS: Payment[] = [
  {
    id: "PAY5001",
    receiptNo: "REC-2026-0001",
    studentId: "STU1001",
    amount: 15000,
    gst: 2288,
    total: 15000,
    date: "2026-04-20",
    method: "UPI",
    status: "Success",
    remarks: "Java Full Stack initial seat booking"
  },
  {
    id: "PAY5002",
    receiptNo: "REC-2026-0002",
    studentId: "STU1001",
    amount: 10000,
    gst: 1525,
    total: 10000,
    date: "2026-05-25",
    method: "UPI",
    status: "Success",
    remarks: "Java Full Stack 2nd Installment"
  },
  {
    id: "PAY5003",
    receiptNo: "REC-2026-0003",
    studentId: "STU1002",
    amount: 44999,
    gst: 6864,
    total: 44999,
    date: "2026-05-10",
    method: "Bank Transfer",
    status: "Success",
    remarks: "Python AI/ML One-Time full fees"
  },
  {
    id: "PAY5004",
    receiptNo: "REC-2026-0004",
    studentId: "STU1003",
    amount: 15000,
    gst: 2288,
    total: 15000,
    date: "2026-05-28",
    method: "Card",
    status: "Success",
    remarks: "Web Dev Stack 1st installment"
  },
  {
    id: "PAY5005",
    receiptNo: "REC-2026-0005",
    studentId: "STU1004",
    amount: 12000,
    gst: 1830,
    total: 12000,
    date: "2026-04-22",
    method: "Cash",
    status: "Success",
    remarks: "Java Full Stack seat reservation"
  },
  {
    id: "PAY5006",
    receiptNo: "REC-2026-0006",
    studentId: "STU1005",
    amount: 20000,
    gst: 3050,
    total: 20000,
    date: "2026-01-25",
    method: "UPI",
    status: "Success",
    remarks: "UI/UX Bootcamp complete fees"
  },
  {
    id: "PAY5007",
    receiptNo: "REC-2026-0007",
    studentId: "STU1006",
    amount: 24999,
    gst: 3813,
    total: 24999,
    date: "2026-01-28",
    method: "Cash",
    status: "Success",
    remarks: "UI/UX Bootcamp complete fees"
  },
  {
    id: "PAY5008",
    receiptNo: "REC-2026-0008",
    studentId: "STU1007",
    amount: 5000,
    gst: 762,
    total: 5000,
    date: "2026-06-15",
    method: "UPI",
    status: "Success",
    remarks: "Cloud DevOps booking amount"
  },
  {
    id: "PAY5009",
    receiptNo: "REC-2026-0009",
    studentId: "STU1008",
    amount: 15000,
    gst: 2288,
    total: 15000,
    date: "2026-05-12",
    method: "UPI",
    status: "Success",
    remarks: "Python AI/ML booking installment"
  },
  {
    id: "PAY5010",
    receiptNo: "REC-2026-0010",
    studentId: "STU1009",
    amount: 25000,
    gst: 3813,
    total: 25000,
    date: "2026-05-13",
    method: "Bank Transfer",
    status: "Success",
    remarks: "Python AI/ML 1st installment"
  },
  {
    id: "PAY5011",
    receiptNo: "REC-2026-0011",
    studentId: "STU1010",
    amount: 34999,
    gst: 5338,
    total: 34999,
    date: "2026-04-21",
    method: "Card",
    status: "Success",
    remarks: "Java Full Stack full fee payment"
  },
  {
    id: "PAY5012",
    receiptNo: "REC-2026-0012",
    studentId: "STU1011",
    amount: 10000,
    gst: 1525,
    total: 10000,
    date: "2026-05-29",
    method: "UPI",
    status: "Success",
    remarks: "Web Dev booking installment"
  },
  {
    id: "PAY5013",
    receiptNo: "REC-2026-0013",
    studentId: "STU1012",
    amount: 5000,
    gst: 762,
    total: 5000,
    date: "2026-04-20",
    method: "UPI",
    status: "Success",
    remarks: "Java Full Stack discontinued booking"
  }
];

const SEED_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "ATT3001",
    date: "2026-06-25",
    batchId: "BAT101",
    studentRecords: [
      { studentId: "STU1001", status: "Present" },
      { studentId: "STU1004", status: "Absent", remarks: "Sick leave" },
      { studentId: "STU1010", status: "Present" }
    ],
    trainerRecord: { trainerId: "TRN201", status: "Present" }
  },
  {
    id: "ATT3002",
    date: "2026-06-25",
    batchId: "BAT102",
    studentRecords: [
      { studentId: "STU1002", status: "Present" },
      { studentId: "STU1008", status: "Present" },
      { studentId: "STU1009", status: "Late" }
    ],
    trainerRecord: { trainerId: "TRN202", status: "Present" }
  },
  {
    id: "ATT3003",
    date: "2026-06-26",
    batchId: "BAT101",
    studentRecords: [
      { studentId: "STU1001", status: "Present" },
      { studentId: "STU1004", status: "Present" },
      { studentId: "STU1010", status: "Present" }
    ],
    trainerRecord: { trainerId: "TRN201", status: "Present" }
  },
  {
    id: "ATT3004",
    date: "2026-06-26",
    batchId: "BAT102",
    studentRecords: [
      { studentId: "STU1002", status: "Present" },
      { studentId: "STU1008", status: "Absent", remarks: "College exams" },
      { studentId: "STU1009", status: "Present" }
    ],
    trainerRecord: { trainerId: "TRN202", status: "Present" }
  }
];

const SEED_CERTIFICATES: Certificate[] = [
  {
    id: "CERT9001",
    certificateNo: "CRT-2026-8201",
    studentId: "STU1005",
    studentName: "Sanjay Singhania",
    courseName: "UI/UX Product Design Bootcamp",
    issueDate: "2026-05-02",
    qrCodeData: "https://mrtechnologies.com/verify/CRT-2026-8201",
    digitalSignature: "SIG_MR_TECH_SNEHA_REDDY_MD_2026",
    status: "Issued",
    pdfUrl: "#"
  },
  {
    id: "CERT9002",
    certificateNo: "CRT-2026-8202",
    studentId: "STU1006",
    studentName: "Meera Deshmukh",
    courseName: "UI/UX Product Design Bootcamp",
    issueDate: "2026-05-02",
    qrCodeData: "https://mrtechnologies.com/verify/CRT-2026-8202",
    digitalSignature: "SIG_MR_TECH_SNEHA_REDDY_MD_2026",
    status: "Issued",
    pdfUrl: "#"
  }
];

const SEED_PLACEMENTS: Placement[] = [
  {
    id: "PLC4001",
    studentId: "STU1005",
    studentName: "Sanjay Singhania",
    courseName: "UI/UX Product Design Bootcamp",
    companyName: "Cognizant Technology Solutions",
    jobRole: "Associate UI Designer",
    package: 6.5,
    joiningDate: "2026-06-15",
    status: "Placed",
    interviewStatus: "Completed",
    offerLetterUrl: "#"
  },
  {
    id: "PLC4002",
    studentId: "STU1006",
    studentName: "Meera Deshmukh",
    courseName: "UI/UX Product Design Bootcamp",
    companyName: "Infosys Product Labs",
    jobRole: "Junior UX Consultant",
    package: 7.2,
    joiningDate: "2026-06-20",
    status: "Placed",
    interviewStatus: "Completed",
    offerLetterUrl: "#"
  },
  {
    id: "PLC4003",
    studentId: "STU1001",
    studentName: "Siddharth Rao",
    courseName: "Java Full Stack Development",
    companyName: "TCS Enterprise Solutions",
    jobRole: "Java Developer Intern",
    package: 4.8,
    joiningDate: "2026-11-15",
    status: "Interview Scheduled",
    interviewStatus: "Technical Round Pending (2026-07-02)",
    offerLetterUrl: ""
  },
  {
    id: "PLC4004",
    studentId: "STU1004",
    studentName: "Pooja Hegde",
    courseName: "Java Full Stack Development",
    companyName: "Wipro Technologies",
    jobRole: "Cloud Application Associate",
    package: 4.2,
    joiningDate: "2026-11-20",
    status: "Applied",
    interviewStatus: "Resume Screened",
    offerLetterUrl: ""
  }
];

const SEED_NOTIFICATIONS: NotificationLog[] = [
  {
    id: "NOT7001",
    studentId: "STU1001",
    type: "Email",
    title: "Second Installment Reminder",
    message: "Dear Siddharth Rao, your second installment of INR 10,000 is due on 2026-05-25. Please proceed with payment.",
    sentAt: "2026-05-23T10:00:00.000Z",
    status: "Sent"
  },
  {
    id: "NOT7002",
    studentId: "STU1001",
    type: "WhatsApp",
    title: "Installment Acknowledgment",
    message: "Thank you Siddharth! We have received your payment of INR 10,000 for Java Full Stack Batch. Receipt No: REC-2026-0002.",
    sentAt: "2026-05-25T11:15:00.000Z",
    status: "Sent"
  },
  {
    id: "NOT7003",
    studentId: "STU1004",
    type: "SMS",
    title: "Attendance Warning Notice",
    message: "Alert: Pooja Hegde, your attendance has dropped below 75% in Batch BAT101. Please attend next session or consult coordinator.",
    sentAt: "2026-06-25T14:30:00.000Z",
    status: "Sent"
  }
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: "AUD8001",
    timestamp: "2026-06-27T01:30:00-07:00",
    user: "Super Admin",
    role: "Super Admin",
    action: "System Initialized",
    details: "Institute database generated and loaded with pre-configured templates."
  },
  {
    id: "AUD8002",
    timestamp: "2026-06-27T01:45:00-07:00",
    user: "Super Admin",
    role: "Super Admin",
    action: "Student Enrollment",
    details: "Added Student Siddharth Rao (STU1001) to Java Full Stack Batch (BAT101)."
  }
];

const INITIAL_DB: DatabaseSchema = {
  students: SEED_STUDENTS,
  courses: SEED_COURSES,
  batches: SEED_BATCHES,
  trainers: SEED_TRAINERS,
  payments: SEED_PAYMENTS,
  attendance: SEED_ATTENDANCE,
  certificates: SEED_CERTIFICATES,
  placements: SEED_PLACEMENTS,
  notifications: SEED_NOTIFICATIONS,
  auditLogs: SEED_AUDIT_LOGS,
  settings: DEFAULT_SETTINGS
};

// Database state in server memory
let dbState: DatabaseSchema = INITIAL_DB;

// Synchronize memory to disk
const syncToDisk = (): void => {
  try {
    const parentDir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (err) {
    console.error("Failed to write db.json file:", err);
  }
};

// Initialize database
export const initializeDB = (): DatabaseSchema => {
  if (fs.existsSync(DB_FILE_PATH)) {
    try {
      const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      dbState = JSON.parse(content) as DatabaseSchema;
      // Guarantee fallback properties
      if (!dbState.students) dbState.students = [];
      if (!dbState.courses) dbState.courses = [];
      if (!dbState.batches) dbState.batches = [];
      if (!dbState.trainers) dbState.trainers = [];
      if (!dbState.payments) dbState.payments = [];
      if (!dbState.attendance) dbState.attendance = [];
      if (!dbState.certificates) dbState.certificates = [];
      if (!dbState.placements) dbState.placements = [];
      if (!dbState.notifications) dbState.notifications = [];
      if (!dbState.auditLogs) dbState.auditLogs = [];
      if (!dbState.settings) dbState.settings = DEFAULT_SETTINGS;
      console.log("Database successfully loaded from disk:", DB_FILE_PATH);
    } catch (err) {
      console.error("Database parsing failed. Re-initializing with seed data.", err);
      dbState = INITIAL_DB;
      syncToDisk();
    }
  } else {
    console.log("Database file not found. Creating and seeding:", DB_FILE_PATH);
    dbState = INITIAL_DB;
    syncToDisk();
  }
  return dbState;
};

// Run initialization immediately on import to ensure file availability
initializeDB();

// Core DB operations
export const db = {
  get: (): DatabaseSchema => {
    return dbState;
  },

  // Students operations
  students: {
    all: () => dbState.students,
    find: (id: string) => dbState.students.find(s => s.id === id),
    create: (data: Omit<Student, 'id' | 'timeline' | 'documents'>) => {
      const nextId = `STU${1000 + dbState.students.length + 1}`;
      const newStudent: Student = {
        ...data,
        id: nextId,
        documents: [],
        timeline: [
          {
            id: `T${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            title: "Student Registered",
            desc: `Enrolled successfully in ${data.courseId} for batch ${data.batchId}.`,
            type: "admission"
          }
        ]
      };
      dbState.students.push(newStudent);
      
      // Update batch enrollment count
      const batch = dbState.batches.find(b => b.id === data.batchId);
      if (batch) {
        batch.enrolledCount += 1;
      }

      // Add audit log
      db.auditLogs.add({
        user: "Admin",
        role: "Admin",
        action: "Student Registered",
        details: `Registered ${newStudent.name} (${newStudent.id}) into ${newStudent.courseId}.`
      });

      syncToDisk();
      return newStudent;
    },
    update: (id: string, updates: Partial<Student>) => {
      const index = dbState.students.findIndex(s => s.id === id);
      if (index !== -1) {
        const oldStudent = dbState.students[index];
        const newStudent = { ...oldStudent, ...updates } as Student;
        
        // If batch changed, adjust enrolledCounts
        if (updates.batchId && updates.batchId !== oldStudent.batchId) {
          const oldBatch = dbState.batches.find(b => b.id === oldStudent.batchId);
          if (oldBatch) oldBatch.enrolledCount = Math.max(0, oldBatch.enrolledCount - 1);
          
          const newBatch = dbState.batches.find(b => b.id === updates.batchId);
          if (newBatch) newBatch.enrolledCount += 1;
        }

        dbState.students[index] = newStudent;
        syncToDisk();
        return newStudent;
      }
      return null;
    },
    delete: (id: string) => {
      const index = dbState.students.findIndex(s => s.id === id);
      if (index !== -1) {
        const student = dbState.students[index];
        // Reduce batch count
        const batch = dbState.batches.find(b => b.id === student.batchId);
        if (batch) batch.enrolledCount = Math.max(0, batch.enrolledCount - 1);

        dbState.students.splice(index, 1);
        syncToDisk();
        return true;
      }
      return false;
    },
    addTimeline: (id: string, event: Omit<TimelineEvent, 'id'>) => {
      const student = dbState.students.find(s => s.id === id);
      if (student) {
        student.timeline.push({
          ...event,
          id: `T${Date.now()}`
        });
        syncToDisk();
        return true;
      }
      return false;
    }
  },

  // Courses operations
  courses: {
    all: () => dbState.courses,
    find: (id: string) => dbState.courses.find(c => c.id === id),
    create: (data: Omit<Course, 'id'>) => {
      const nextId = `CRS${String(dbState.courses.length + 1).padStart(3, '0')}`;
      const newCourse: Course = { ...data, id: nextId };
      dbState.courses.push(newCourse);
      syncToDisk();
      return newCourse;
    },
    update: (id: string, updates: Partial<Course>) => {
      const index = dbState.courses.findIndex(c => c.id === id);
      if (index !== -1) {
        dbState.courses[index] = { ...dbState.courses[index], ...updates } as Course;
        syncToDisk();
        return dbState.courses[index];
      }
      return null;
    },
    delete: (id: string) => {
      const index = dbState.courses.findIndex(c => c.id === id);
      if (index !== -1) {
        dbState.courses.splice(index, 1);
        syncToDisk();
        return true;
      }
      return false;
    }
  },

  // Batches operations
  batches: {
    all: () => dbState.batches,
    find: (id: string) => dbState.batches.find(b => b.id === id),
    create: (data: Omit<Batch, 'id' | 'enrolledCount' | 'attendancePct'>) => {
      const nextId = `BAT${100 + dbState.batches.length + 1}`;
      const newBatch: Batch = {
        ...data,
        id: nextId,
        enrolledCount: 0,
        attendancePct: 0
      };
      dbState.batches.push(newBatch);
      syncToDisk();
      return newBatch;
    },
    update: (id: string, updates: Partial<Batch>) => {
      const index = dbState.batches.findIndex(b => b.id === id);
      if (index !== -1) {
        dbState.batches[index] = { ...dbState.batches[index], ...updates } as Batch;
        syncToDisk();
        return dbState.batches[index];
      }
      return null;
    },
    delete: (id: string) => {
      const index = dbState.batches.findIndex(b => b.id === id);
      if (index !== -1) {
        dbState.batches.splice(index, 1);
        syncToDisk();
        return true;
      }
      return false;
    }
  },

  // Trainers operations
  trainers: {
    all: () => dbState.trainers,
    find: (id: string) => dbState.trainers.find(t => t.id === id),
    create: (data: Omit<Trainer, 'id' | 'rating' | 'feedback' | 'assignedBatches'>) => {
      const nextId = `TRN${200 + dbState.trainers.length + 1}`;
      const newTrainer: Trainer = {
        ...data,
        id: nextId,
        rating: 5.0,
        feedback: [],
        assignedBatches: []
      };
      dbState.trainers.push(newTrainer);
      syncToDisk();
      return newTrainer;
    },
    update: (id: string, updates: Partial<Trainer>) => {
      const index = dbState.trainers.findIndex(t => t.id === id);
      if (index !== -1) {
        dbState.trainers[index] = { ...dbState.trainers[index], ...updates } as Trainer;
        syncToDisk();
        return dbState.trainers[index];
      }
      return null;
    },
    delete: (id: string) => {
      const index = dbState.trainers.findIndex(t => t.id === id);
      if (index !== -1) {
        dbState.trainers.splice(index, 1);
        syncToDisk();
        return true;
      }
      return false;
    }
  },

  // Payments operations
  payments: {
    all: () => dbState.payments,
    find: (id: string) => dbState.payments.find(p => p.id === id),
    create: (data: Omit<Payment, 'id' | 'receiptNo' | 'gst'>) => {
      const nextId = `PAY${5000 + dbState.payments.length + 1}`;
      const receiptNo = `REC-2026-${String(dbState.payments.length + 1).padStart(4, '0')}`;
      
      // GST is 18% included inside payment total
      const rawGst = Math.round(data.amount * 0.18);
      
      const newPayment: Payment = {
        ...data,
        id: nextId,
        receiptNo,
        gst: rawGst
      };
      
      dbState.payments.push(newPayment);

      // Adjust student paidAmount and pendingAmount
      const student = dbState.students.find(s => s.id === data.studentId);
      if (student) {
        student.paidAmount += data.amount;
        student.pendingAmount = Math.max(0, student.pendingAmount - data.amount);
        
        // Append payment to timeline
        student.timeline.push({
          id: `T${Date.now()}`,
          date: data.date,
          title: "Fee Payment Collected",
          desc: `Collected INR ${data.amount} via ${data.method}. Receipt No: ${receiptNo}.`,
          type: "payment"
        });
      }

      // Add audit log
      db.auditLogs.add({
        user: "Admin",
        role: "Admin",
        action: "Fee Payment Collected",
        details: `Collected INR ${data.amount} for Student ID ${data.studentId}. Receipt: ${receiptNo}.`
      });

      syncToDisk();
      return newPayment;
    }
  },

  // Attendance operations
  attendance: {
    all: () => dbState.attendance,
    create: (data: Omit<AttendanceRecord, 'id'>) => {
      const nextId = `ATT${3000 + dbState.attendance.length + 1}`;
      const newRecord: AttendanceRecord = { ...data, id: nextId };
      dbState.attendance.push(newRecord);

      // Recalculate average attendancePct for batch
      const batch = dbState.batches.find(b => b.id === data.batchId);
      if (batch) {
        const batchRecords = dbState.attendance.filter(a => a.batchId === data.batchId);
        let totalPresents = 0;
        let totalAttendees = 0;
        batchRecords.forEach(rec => {
          rec.studentRecords.forEach(s => {
            totalAttendees += 1;
            if (s.status === 'Present' || s.status === 'Late') {
              totalPresents += 1;
            }
          });
        });
        if (totalAttendees > 0) {
          batch.attendancePct = Math.round((totalPresents / totalAttendees) * 100);
        }
      }

      syncToDisk();
      return newRecord;
    }
  },

  // Certificates operations
  certificates: {
    all: () => dbState.certificates,
    create: (data: Omit<Certificate, 'id' | 'certificateNo' | 'issueDate' | 'qrCodeData' | 'digitalSignature' | 'status'>) => {
      const nextId = `CERT${9000 + dbState.certificates.length + 1}`;
      const certificateNo = `CRT-2026-${8200 + dbState.certificates.length + 1}`;
      const issueDate = new Date().toISOString().split('T')[0];
      const qrCodeData = `https://mrtechnologies.com/verify/${certificateNo}`;
      const digitalSignature = `SIG_MR_TECH_AUTO_${Date.now()}`;

      const newCert: Certificate = {
        ...data,
        id: nextId,
        certificateNo,
        issueDate,
        qrCodeData,
        digitalSignature,
        status: "Issued"
      };
      
      dbState.certificates.push(newCert);

      // Add timeline to student
      const student = dbState.students.find(s => s.id === data.studentId);
      if (student) {
        student.timeline.push({
          id: `T${Date.now()}`,
          date: issueDate,
          title: "Certificate Generated",
          desc: `Awarded Course Completion Certificate (${certificateNo}).`,
          type: "certificate"
        });
      }

      // Add audit log
      db.auditLogs.add({
        user: "Admin",
        role: "Admin",
        action: "Certificate Issued",
        details: `Issued course certificate ${certificateNo} to ${data.studentName}.`
      });

      syncToDisk();
      return newCert;
    }
  },

  // Placements operations
  placements: {
    all: () => dbState.placements,
    create: (data: Omit<Placement, 'id'>) => {
      const nextId = `PLC${4000 + dbState.placements.length + 1}`;
      const newPlacement: Placement = { ...data, id: nextId };
      dbState.placements.push(newPlacement);

      // Update student timeline
      const student = dbState.students.find(s => s.id === data.studentId);
      if (student && data.status === 'Placed') {
        student.timeline.push({
          id: `T${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          title: "Successfully Placed",
          desc: `Placed at ${data.companyName} as ${data.jobRole} with ${data.package} LPA.`,
          type: "placement"
        });
      }

      syncToDisk();
      return newPlacement;
    },
    update: (id: string, updates: Partial<Placement>) => {
      const index = dbState.placements.findIndex(p => p.id === id);
      if (index !== -1) {
        const oldP = dbState.placements[index];
        const newP = { ...oldP, ...updates } as Placement;
        dbState.placements[index] = newP;

        // If status changed to Placed, ensure timeline
        if (updates.status === 'Placed' && oldP.status !== 'Placed') {
          const student = dbState.students.find(s => s.id === newP.studentId);
          if (student) {
            student.timeline.push({
              id: `T${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              title: "Successfully Placed",
              desc: `Placed at ${newP.companyName} as ${newP.jobRole} with ${newP.package} LPA.`,
              type: "placement"
            });
          }
        }

        syncToDisk();
        return newP;
      }
      return null;
    }
  },

  // Notifications operations
  notifications: {
    all: () => dbState.notifications,
    add: (data: Omit<NotificationLog, 'id' | 'sentAt'>) => {
      const nextId = `NOT${7000 + dbState.notifications.length + 1}`;
      const newLog: NotificationLog = {
        ...data,
        id: nextId,
        sentAt: new Date().toISOString()
      };
      dbState.notifications.push(newLog);
      syncToDisk();
      return newLog;
    }
  },

  // Audit operations
  auditLogs: {
    all: () => dbState.auditLogs,
    add: (data: Omit<AuditLog, 'id' | 'timestamp'>) => {
      const nextId = `AUD${8000 + dbState.auditLogs.length + 1}`;
      const newLog: AuditLog = {
        ...data,
        id: nextId,
        timestamp: new Date().toISOString()
      };
      dbState.auditLogs.unshift(newLog); // newest first
      syncToDisk();
      return newLog;
    }
  },

  // Settings operations
  settings: {
    get: () => dbState.settings,
    update: (updates: Partial<InstituteSettings>) => {
      dbState.settings = { ...dbState.settings, ...updates } as InstituteSettings;
      syncToDisk();
      return dbState.settings;
    },
    addBackup: (size: string) => {
      dbState.settings.backupHistory.unshift({
        date: new Date().toISOString().split('T')[0],
        size,
        status: "Success"
      });
      syncToDisk();
    }
  }
};

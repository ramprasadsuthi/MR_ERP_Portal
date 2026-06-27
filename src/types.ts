/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  id: string;
  photo?: string;
  name: string;
  gender: string;
  dob: string;
  mobile: string;
  altMobile?: string;
  email: string;
  address: string;
  city: string;
  state: string;
  qualification: string;
  college: string;
  branch: string;
  passoutYear: number;
  experience: string;
  guardianName: string;
  guardianMobile: string;
  courseId: string;
  batchId: string;
  trainerId: string;
  admissionDate: string;
  courseFee: number;
  discount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentPlan: 'One-Time' | 'Installments';
  status: 'Active' | 'Completed' | 'Discontinued' | 'Yet to Start';
  documents: { name: string; url: string; uploadDate: string }[];
  remarks: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  desc: string;
  type: 'admission' | 'payment' | 'attendance' | 'certificate' | 'placement' | 'general';
}

export interface Course {
  id: string;
  name: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  price: number;
  offerPrice: number;
  image: string;
  modules: string[];
  prerequisites: string[];
  certification: string;
  projects: string[];
  trainerId: string;
  status: 'Active' | 'Inactive';
  materials: { title: string; type: 'PDF' | 'Video' | 'Assignment'; url: string }[];
}

export interface Batch {
  id: string;
  name: string;
  courseId: string;
  trainerId: string;
  startDate: string;
  endDate: string;
  timing: string;
  classroom: string;
  capacity: number;
  enrolledCount: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  progress: number; // percentage (0 - 100)
  attendancePct: number; // average attendance (0 - 100)
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  mobile: string;
  qualification: string;
  experience: string;
  skills: string[];
  salary: number;
  availability: 'Full-Time' | 'Part-Time';
  rating: number;
  feedback: { studentName: string; rating: number; comment: string }[];
  assignedBatches: string[];
  status: 'Active' | 'Inactive';
}

export interface Payment {
  id: string;
  receiptNo: string;
  studentId: string;
  amount: number;
  gst: number;
  total: number;
  date: string;
  method: 'UPI' | 'Cash' | 'Card' | 'Bank Transfer' | 'Cheque';
  status: 'Success' | 'Pending' | 'Refunded';
  remarks: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  batchId: string;
  studentRecords: { studentId: string; status: 'Present' | 'Absent' | 'Late'; remarks?: string }[];
  trainerRecord?: { trainerId: string; status: 'Present' | 'Absent' | 'Late'; remarks?: string };
}

export interface Certificate {
  id: string;
  certificateNo?: string;
  studentId: string;
  studentName?: string;
  courseName?: string;
  issueDate: string;
  qrCodeData?: string;
  digitalSignature?: string;
  status: 'Pending' | 'Generated' | 'Issued' | 'Active';
  pdfUrl?: string;
  certTitle?: string;
  grade?: string;
}

export interface Placement {
  id: string;
  studentId: string;
  studentName?: string;
  courseName?: string;
  companyName?: string;
  jobRole?: string;
  package?: number; // LPA
  joiningDate?: string;
  status: 'Placed' | 'Interview Scheduled' | 'Rejected' | 'Applied' | 'Offered' | 'In Process';
  interviewStatus?: string;
  offerLetterUrl?: string;
  company?: string;
  designation?: string;
  packageLpa?: number;
  interviewDate?: string;
}

export interface NotificationLog {
  id: string;
  studentId?: string;
  type: 'Email' | 'SMS' | 'WhatsApp';
  title: string;
  message: string;
  sentAt: string;
  status: 'Sent' | 'Failed' | 'Pending';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
  module?: string;
  ipAddress?: string;
}

export interface InstituteSettings {
  instituteName: string;
  logo: string;
  gstNo: string;
  email: string;
  whatsappNo: string;
  smsGateway: string;
  branches: string[];
  backupHistory: { date: string; size: string; status: string }[];
  name?: string;
  phone?: string;
  address?: string;
  currency?: string;
}

export interface DatabaseSchema {
  students: Student[];
  courses: Course[];
  batches: Batch[];
  trainers: Trainer[];
  payments: Payment[];
  attendance: AttendanceRecord[];
  certificates: Certificate[];
  placements: Placement[];
  notifications: NotificationLog[];
  auditLogs: AuditLog[];
  settings: InstituteSettings;
}

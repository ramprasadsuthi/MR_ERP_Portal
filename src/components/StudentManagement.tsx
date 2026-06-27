/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, Filter, Plus, ArrowDownToLine, ArrowUpToLine, X, Calendar, 
  Phone, Mail, FileText, MapPin, GraduationCap, DollarSign, Clock, 
  Trash2, User, ChevronRight, Activity, MessageSquare, AlertCircle, Sparkles
} from 'lucide-react';
import { Student, Course, Batch, Trainer, Payment, AttendanceRecord } from '../types.js';

interface StudentManagementProps {
  students: Student[];
  courses: Course[];
  batches: Batch[];
  trainers: Trainer[];
  payments: Payment[];
  attendance: AttendanceRecord[];
  onAddStudent: (student: Omit<Student, 'id' | 'timeline' | 'documents'>) => void;
  onUpdateStudent: (id: string, updates: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
  onCollectPayment: (payment: { studentId: string; amount: number; method: any; date: string; remarks: string }) => void;
}

export default function StudentManagement({ 
  students, 
  courses, 
  batches, 
  trainers, 
  payments,
  attendance,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onCollectPayment
}: StudentManagementProps) {
  // Navigation states
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [courseFilter, setCourseFilter] = useState<string>('');
  const [batchFilter, setBatchFilter] = useState<string>('');

  // Register Form State
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    dob: '',
    mobile: '',
    altMobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    qualification: 'B.Tech Graduate',
    college: '',
    branch: '',
    passoutYear: 2024,
    experience: 'Fresher',
    guardianName: '',
    guardianMobile: '',
    courseId: '',
    batchId: '',
    trainerId: '',
    admissionDate: new Date().toISOString().split('T')[0],
    courseFee: 0,
    discount: 0,
    paymentPlan: 'Installments' as 'One-Time' | 'Installments',
    status: 'Active' as 'Active' | 'Yet to Start',
    remarks: ''
  });

  // Communication Form
  const [commType, setCommType] = useState<'Email' | 'SMS' | 'WhatsApp'>('WhatsApp');
  const [commMsg, setCommMsg] = useState('');

  // Payment Quick Collect Form
  const [quickPayAmount, setQuickPayAmount] = useState<number>(0);
  const [quickPayMethod, setQuickPayMethod] = useState<'UPI' | 'Cash' | 'Card' | 'Bank Transfer'>('UPI');

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.mobile.includes(searchQuery) ||
                        s.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = statusFilter ? s.status === statusFilter : true;
    const matchCourse = courseFilter ? s.courseId === courseFilter : true;
    const matchBatch = batchFilter ? s.batchId === batchFilter : true;

    return matchSearch && matchStatus && matchCourse && matchBatch;
  });

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Helper values for selected student
  const studentCourse = selectedStudent ? courses.find(c => c.id === selectedStudent.courseId) : null;
  const studentBatch = selectedStudent ? batches.find(b => b.id === selectedStudent.batchId) : null;
  const studentTrainer = selectedStudent ? trainers.find(t => t.id === selectedStudent.trainerId) : null;
  const studentPayments = selectedStudent ? payments.filter(p => p.studentId === selectedStudent.id) : [];

  // Attendance stats for selected student
  const getAttendanceStats = (studentId: string, batchId: string) => {
    const studentRecords = attendance.filter(a => a.batchId === batchId);
    let present = 0;
    let total = 0;
    studentRecords.forEach(rec => {
      const sRec = rec.studentRecords.find(sr => sr.studentId === studentId);
      if (sRec) {
        total += 1;
        if (sRec.status === 'Present' || sRec.status === 'Late') present += 1;
      }
    });
    return {
      rate: total > 0 ? Math.round((present / total) * 100) : 85, // default simulation fallback
      totalClasses: total > 0 ? total : 20,
      presentClasses: total > 0 ? present : 17
    };
  };

  // Mock Export CSV
  const handleExportCSV = () => {
    const headers = ['Student ID', 'Name', 'Email', 'Mobile', 'Course', 'Paid Amount', 'Pending Amount', 'Status'];
    const rows = filteredStudents.map(s => [
      s.id,
      s.name,
      s.email,
      s.mobile,
      courses.find(c => c.id === s.courseId)?.name || 'N/A',
      `INR ${s.paidAmount}`,
      `INR ${s.pendingAmount}`,
      s.status
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MR_Tech_Students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle registration submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.courseId || !formData.batchId) {
      alert("Please fill in Name, Course, and Batch.");
      return;
    }

    const calculatedPending = Math.max(0, formData.courseFee - formData.discount);

    onAddStudent({
      ...formData,
      paidAmount: 0,
      pendingAmount: calculatedPending
    });

    setIsRegistering(false);
    // Reset
    setFormData({
      name: '',
      gender: 'Male',
      dob: '',
      mobile: '',
      altMobile: '',
      email: '',
      address: '',
      city: '',
      state: '',
      qualification: 'B.Tech Graduate',
      college: '',
      branch: '',
      passoutYear: 2024,
      experience: 'Fresher',
      guardianName: '',
      guardianMobile: '',
      courseId: '',
      batchId: '',
      trainerId: '',
      admissionDate: new Date().toISOString().split('T')[0],
      courseFee: 0,
      discount: 0,
      paymentPlan: 'Installments',
      status: 'Active',
      remarks: ''
    });
  };

  // When course selected, auto update standard fee and primary trainer
  const handleCourseChange = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setFormData(prev => ({
        ...prev,
        courseId,
        courseFee: course.offerPrice || course.price,
        trainerId: course.trainerId
      }));
    }
  };

  // Add communication log
  const handleSendComm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !commMsg) return;

    onUpdateStudent(selectedStudent.id, {
      timeline: [
        ...selectedStudent.timeline,
        {
          id: `T${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          title: `Sent ${commType} message`,
          desc: commMsg,
          type: 'general'
        }
      ]
    });
    setCommMsg('');
    alert(`Simulated ${commType} notification dispatched to student queue.`);
  };

  // Collect Quick Fee Inside Profile
  const handleQuickPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || quickPayAmount <= 0) return;

    onCollectPayment({
      studentId: selectedStudent.id,
      amount: quickPayAmount,
      method: quickPayMethod,
      date: new Date().toISOString().split('T')[0],
      remarks: "Direct profile payment collection"
    });

    setQuickPayAmount(0);
    alert("Fee logged and student timeline updated.");
  };

  return (
    <div className="space-y-6">
      
      {!selectedStudentId ? (
        <>
          {/* Main List & Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Student Admissions Registry</h2>
              <p className="text-slate-400 text-xs">Manage admissions, view student records and profiles.</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleExportCSV}
                className="px-3.5 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 shadow-xs bg-white"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                Export CSV
              </button>
              <button 
                onClick={() => setIsRegistering(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                New Admission
              </button>
            </div>
          </div>

          {/* Search, Filter Rail */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Student, Email, ID, Mobile..."
                className="w-full text-xs text-slate-700 pl-9 pr-4 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-hidden transition-all placeholder:text-slate-400 font-sans"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full text-xs text-slate-600 px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg outline-hidden focus:bg-white font-medium"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Discontinued">Discontinued</option>
                <option value="Yet to Start">Yet to Start</option>
              </select>
            </div>

            {/* Course Filter */}
            <div>
              <select
                value={courseFilter}
                onChange={e => setCourseFilter(e.target.value)}
                className="w-full text-xs text-slate-600 px-3 py-2 bg-slate-50/70 border border-transparent rounded-xl outline-hidden focus:bg-white font-medium"
              >
                <option value="">All Courses</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Batch Filter */}
            <div>
              <select
                value={batchFilter}
                onChange={e => setBatchFilter(e.target.value)}
                className="w-full text-xs text-slate-600 px-3 py-2 bg-slate-50/70 border border-transparent rounded-xl outline-hidden focus:bg-white font-medium"
              >
                <option value="">All Batches</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Table Registry */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-500 border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 text-slate-400 font-medium border-b border-slate-100">
                    <th className="px-5 py-3">Student Name</th>
                    <th className="px-5 py-3">Qualification / College</th>
                    <th className="px-5 py-3">Course / Batch</th>
                    <th className="px-5 py-3 text-right">Fee Balances</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s) => {
                      const course = courses.find(c => c.id === s.courseId);
                      const batch = batches.find(b => b.id === s.batchId);
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shadow-3xs uppercase">
                                {s.name.slice(0, 2)}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800 text-sm block cursor-pointer hover:text-indigo-600" onClick={() => setSelectedStudentId(s.id)}>
                                  {s.name}
                                </span>
                                <span className="text-[10px] text-slate-400">{s.id} | {s.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="text-slate-700 font-medium">{s.qualification}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{s.college || 'N/A'}</div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="text-slate-700 font-medium truncate max-w-[150px]">{course?.name || 'N/A'}</div>
                            <div className="text-[10px] text-indigo-500 font-semibold">{batch?.name || 'N/A'}</div>
                          </td>
                          <td className="px-5 py-3.5 text-right font-sans">
                            <div className="text-slate-800 font-semibold">₹{s.pendingAmount.toLocaleString()}</div>
                            <div className="text-[10px] text-emerald-500">of ₹{s.courseFee.toLocaleString()} total</div>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
                              s.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                              s.status === 'Completed' ? 'bg-indigo-50 text-indigo-700' :
                              s.status === 'Discontinued' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button 
                                onClick={() => setSelectedStudentId(s.id)}
                                className="p-1.5 border border-slate-100 hover:border-slate-200 hover:text-indigo-600 text-slate-400 rounded-lg cursor-pointer transition-colors"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400">No students registered matching those criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Detailed Student Profile */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSelectedStudentId(null)}
              className="text-xs text-indigo-600 font-medium hover:text-indigo-800 cursor-pointer flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-2xs"
            >
              &larr; Back to Admissions
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">STATUS:</span>
              <select
                value={selectedStudent?.status}
                onChange={e => onUpdateStudent(selectedStudent!.id, { status: e.target.value as any })}
                className="text-xs font-semibold text-slate-700 px-3 py-1.5 border border-slate-100 bg-white rounded-xl focus:outline-hidden"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Discontinued">Discontinued</option>
                <option value="Yet to Start">Yet to Start</option>
              </select>
            </div>
          </div>

          {selectedStudent && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Card & Stats Left Panel */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Core Profile Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-r from-blue-600 to-sky-500"></div>
                  
                  <div className="w-20 h-20 rounded-full border-4 border-white bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl uppercase shadow-xs z-10 mt-6 mb-4">
                    {selectedStudent.name.slice(0, 2)}
                  </div>
                  
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{selectedStudent.name}</h3>
                  <span className="text-xs font-semibold text-blue-600 font-mono mt-1">{selectedStudent.id}</span>
                  
                  <div className="w-full grid grid-cols-2 gap-2 mt-6 pt-6 border-t border-slate-200 text-left text-xs font-sans text-slate-500">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{selectedStudent.qualification}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{selectedStudent.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{selectedStudent.email}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{selectedStudent.city}, {selectedStudent.state}</span>
                    </div>
                  </div>
                </div>

                {/* Academic & Fee Ledger Stats */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Academic & Fee Summary</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">COURSE & BATCH</span>
                      <span className="font-medium text-slate-800 text-xs">{studentCourse?.name}</span>
                      <span className="text-[10px] text-blue-500 block mt-0.5">{studentBatch?.name}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">TRAINER ASSIGNED</span>
                      <span className="font-semibold text-slate-700 text-xs">{studentTrainer?.name || "Unassigned"}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">ATTENDANCE OVERVIEW</span>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full" 
                            style={{ width: `${getAttendanceStats(selectedStudent.id, selectedStudent.batchId).rate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700 shrink-0">{getAttendanceStats(selectedStudent.id, selectedStudent.batchId).rate}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50 font-sans">
                      <div>
                        <span className="text-[10px] text-emerald-600 font-semibold block">TOTAL PAID</span>
                        <span className="text-sm font-bold text-emerald-600">₹{selectedStudent.paidAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-rose-600 font-semibold block">OUTSTANDING DUE</span>
                        <span className="text-sm font-bold text-rose-600">₹{selectedStudent.pendingAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Collect Fee Quick panel */}
                {selectedStudent.pendingAmount > 0 && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-5 rounded-xl shadow-sm">
                    <h4 className="font-bold text-emerald-800 text-sm flex items-center gap-1.5 mb-3">
                      <DollarSign className="w-4 h-4" />
                      Quick Collect Fee
                    </h4>
                    <form onSubmit={handleQuickPay} className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider block mb-1">AMOUNT (₹)</label>
                          <input 
                            type="number"
                            value={quickPayAmount || ''}
                            onChange={e => setQuickPayAmount(Number(e.target.value))}
                            max={selectedStudent.pendingAmount}
                            placeholder="Amount"
                            className="w-full text-xs text-slate-700 px-2 py-1.5 bg-white border border-emerald-200/60 rounded-lg outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider block mb-1">METHOD</label>
                          <select 
                            value={quickPayMethod}
                            onChange={e => setQuickPayMethod(e.target.value as any)}
                            className="w-full text-xs text-slate-700 px-2 py-1.5 bg-white border border-emerald-200/60 rounded-lg outline-hidden"
                          >
                            <option value="UPI">UPI</option>
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="Bank Transfer">Transfer</option>
                          </select>
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                      >
                        Submit Collection Receipt
                      </button>
                    </form>
                  </div>
                )}

              </div>

              {/* History, Timeline & Communication Logs Center/Right Panel */}
              <div className="lg:col-span-2 space-y-6">
                        {/* Timeline & Comm Tab Header */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-blue-600" />
                    Student Lifecycle & Payments Log
                  </h4>

                  <div className="space-y-6 mt-4">
                    {/* Time line sequence */}
                    <div className="relative border-l border-slate-200 pl-6 ml-3 space-y-6">
                      {selectedStudent.timeline.map((event, index) => (
                        <div key={event.id || index} className="relative">
                          {/* Dot */}
                          <div className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${
                            event.type === 'admission' ? 'bg-blue-500' :
                            event.type === 'payment' ? 'bg-emerald-500' :
                            event.type === 'certificate' ? 'bg-blue-600' :
                            event.type === 'placement' ? 'bg-sky-500' : 'bg-slate-400'
                          } shadow-xs`}></div>
                          
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium font-mono">{event.date}</span>
                            <h5 className="font-semibold text-slate-800 text-xs mt-0.5">{event.title}</h5>
                            <p className="text-slate-500 text-[11px] mt-0.5">{event.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notifications & Messaging Center */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5 mb-4">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    Dispatch AI-Template Notifications
                  </h4>

                  <form onSubmit={handleSendComm} className="space-y-3">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                        <input 
                          type="radio" 
                          name="comm_type" 
                          checked={commType === 'WhatsApp'} 
                          onChange={() => setCommType('WhatsApp')} 
                          className="text-blue-600 focus:ring-0" 
                        />
                        WhatsApp Gateway
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                        <input 
                          type="radio" 
                          name="comm_type" 
                          checked={commType === 'Email'} 
                          onChange={() => setCommType('Email')} 
                          className="text-blue-600 focus:ring-0" 
                        />
                        Secure Email
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                        <input 
                          type="radio" 
                          name="comm_type" 
                          checked={commType === 'SMS'} 
                          onChange={() => setCommType('SMS')} 
                          className="text-blue-600 focus:ring-0" 
                        />
                        Twilio SMS
                      </label>
                    </div>

                    <div>
                      <textarea 
                        value={commMsg}
                        onChange={e => setCommMsg(e.target.value)}
                        placeholder={`Draft customized automated notice text to ${selectedStudent.name}. e.g., "Hi, your fees of ₹${selectedStudent.pendingAmount} is pending for Java Full Stack batch. Please remit soon."`}
                        className="w-full text-xs text-slate-700 p-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-500 focus:bg-white outline-hidden transition-all min-h-[80px]"
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Transmit Simulated Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* REGISTRATION SLIDEOVER PANEL / MODAL */}
      {isRegistering && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-left">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div>
                <h3 className="font-bold text-slate-900 text-base">New Student Enrollment</h3>
                <p className="text-slate-400 text-[11px]">Fill all fields to book a seat and generate student ID.</p>
              </div>
              <button 
                onClick={() => setIsRegistering(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleRegisterSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-600 font-sans">
              
              {/* Section 1: Personal Details */}
              <div className="space-y-4">
                <h4 className="font-bold text-blue-600 border-b border-slate-200 pb-1 text-[11px] uppercase tracking-wider">1. Personal Particulars</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">FULL NAME *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Rahul Sharma" 
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">GENDER</label>
                    <select 
                      value={formData.gender}
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">DATE OF BIRTH</label>
                    <input 
                      type="date" 
                      value={formData.dob}
                      onChange={e => setFormData({...formData, dob: e.target.value})}
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden focus:bg-white focus:border-indigo-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">PRIMARY MOBILE *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.mobile}
                      onChange={e => setFormData({...formData, mobile: e.target.value})}
                      placeholder="e.g. +91 99999 88888" 
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden focus:bg-white focus:border-indigo-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">ALT MOBILE</label>
                    <input 
                      type="text" 
                      value={formData.altMobile}
                      onChange={e => setFormData({...formData, altMobile: e.target.value})}
                      placeholder="Optional alternate" 
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden focus:bg-white focus:border-indigo-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">SECURE EMAIL *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="e.g. rahul@gmail.com" 
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden focus:bg-white focus:border-indigo-100" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-500 font-semibold mb-1">RESIDENTIAL ADDRESS</label>
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      placeholder="Street, locality, landmarks" 
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden focus:bg-white focus:border-indigo-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">CITY</label>
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      placeholder="Hyderabad" 
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">STATE</label>
                    <input 
                      type="text" 
                      value={formData.state}
                      onChange={e => setFormData({...formData, state: e.target.value})}
                      placeholder="Telangana" 
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden" 
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Education / Qualifications */}
              <div className="space-y-4">
                <h4 className="font-bold text-blue-600 border-b border-slate-200 pb-1 text-[11px] uppercase tracking-wider">2. Education & Professional Profile</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">QUALIFICATION</label>
                    <input 
                      type="text" 
                      value={formData.qualification}
                      onChange={e => setFormData({...formData, qualification: e.target.value})}
                      placeholder="B.Tech Graduate, MCA..." 
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">COLLEGE / UNIVERSITY</label>
                    <input 
                      type="text" 
                      value={formData.college}
                      onChange={e => setFormData({...formData, college: e.target.value})}
                      placeholder="e.g. JNTUH" 
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">BRANCH / SPECIALIZATION</label>
                    <input 
                      type="text" 
                      value={formData.branch}
                      onChange={e => setFormData({...formData, branch: e.target.value})}
                      placeholder="e.g. CSE, ECE" 
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">PASSOUT YEAR</label>
                    <input 
                      type="number" 
                      value={formData.passoutYear}
                      onChange={e => setFormData({...formData, passoutYear: Number(e.target.value)})}
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-500 font-semibold mb-1">WORK EXPERIENCE</label>
                    <input 
                      type="text" 
                      value={formData.experience}
                      onChange={e => setFormData({...formData, experience: e.target.value})}
                      placeholder="e.g. Fresher, or 2 Years QA" 
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden" 
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Course Fee Allocation */}
              <div className="space-y-4">
                <h4 className="font-bold text-blue-600 border-b border-slate-200 pb-1 text-[11px] uppercase tracking-wider">3. Training Course & Fee Allocation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">SELECT COURSE *</label>
                    <select 
                      required
                      value={formData.courseId}
                      onChange={e => handleCourseChange(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium outline-hidden focus:bg-white focus:border-blue-500"
                    >
                      <option value="">-- Select Course --</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">CHOOSE COHORT BATCH *</label>
                    <select 
                      required
                      value={formData.batchId}
                      onChange={e => setFormData({...formData, batchId: e.target.value})}
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl font-medium outline-hidden"
                    >
                      <option value="">-- Select Batch --</option>
                      {batches.filter(b => b.courseId === formData.courseId || !formData.courseId).map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">COURSE STANDARD FEE (₹)</label>
                    <input 
                      type="number" 
                      value={formData.courseFee}
                      onChange={e => setFormData({...formData, courseFee: Number(e.target.value)})}
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">SCHOLARSHIP DISCOUNT (₹)</label>
                    <input 
                      type="number" 
                      value={formData.discount}
                      onChange={e => setFormData({...formData, discount: Number(e.target.value)})}
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">PAYMENT FREQUENCY</label>
                    <select 
                      value={formData.paymentPlan}
                      onChange={e => setFormData({...formData, paymentPlan: e.target.value as any})}
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden"
                    >
                      <option value="One-Time">One-Time (Complete Settlement)</option>
                      <option value="Installments">Split Installments</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">GUARDIAN NAME</label>
                    <input 
                      type="text" 
                      value={formData.guardianName}
                      onChange={e => setFormData({...formData, guardianName: e.target.value})}
                      placeholder="Father's/Guardian's Name" 
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">GUARDIAN CONTACT MOBILE</label>
                    <input 
                      type="text" 
                      value={formData.guardianMobile}
                      onChange={e => setFormData({...formData, guardianMobile: e.target.value})}
                      placeholder="Contact details" 
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">ADMISSION ENTRY DATE</label>
                    <input 
                      type="date" 
                      value={formData.admissionDate}
                      onChange={e => setFormData({...formData, admissionDate: e.target.value})}
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl outline-hidden" 
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs cursor-pointer transition-colors shadow-sm"
                >
                  Finalize Student Registration
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

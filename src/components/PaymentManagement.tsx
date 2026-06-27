/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  IndianRupee, DollarSign, Calendar, Clock, Plus, Search, 
  Download, CheckCircle, AlertTriangle, FileText, Send, Share2, Printer, X
} from 'lucide-react';
import { Student, Payment, Course, Batch } from '../types.js';

interface PaymentManagementProps {
  students: Student[];
  payments: Payment[];
  courses: Course[];
  onCollectPayment: (payment: { 
    studentId: string; 
    amount: number; 
    method: 'UPI' | 'Cash' | 'Card' | 'Bank Transfer' | 'Cheque'; 
    date: string; 
    remarks: string;
  }) => void;
  onSendNotification: (data: { studentId: string; type: 'Email' | 'SMS' | 'WhatsApp'; title: string; message: string }) => void;
}

export default function PaymentManagement({ 
  students, 
  payments, 
  courses,
  onCollectPayment,
  onSendNotification
}: PaymentManagementProps) {
  const [activeTab, setActiveTab] = useState<'collect' | 'dues' | 'history'>('collect');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect Form States
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<'UPI' | 'Cash' | 'Card' | 'Bank Transfer' | 'Cheque'>('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');

  // Selected receipt for printing/viewing modal
  const [viewReceipt, setViewReceipt] = useState<Payment | null>(null);

  // Filter students with pending balance
  const activeUnpaidStudents = students.filter(s => s.status === 'Active' && s.pendingAmount > 0);

  // Financial Summary Cards
  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = students.reduce((sum, s) => sum + s.pendingAmount, 0);
  const totalGstCollected = payments.reduce((sum, p) => sum + (p.gst || 0), 0);

  // Overdue: Outstanding balance for students registered more than 30 days ago who still owe money
  const todayMs = new Date().getTime();
  const overdueAmount = students
    .filter(s => {
      const admissionMs = new Date(s.admissionDate).getTime();
      const daysElapsed = (todayMs - admissionMs) / (1000 * 60 * 60 * 24);
      return s.status === 'Active' && s.pendingAmount > 0 && daysElapsed > 30;
    })
    .reduce((sum, s) => sum + s.pendingAmount, 0);

  // Find student detail for selected id in form
  const currentFormStudent = students.find(s => s.id === selectedStudentId);
  const currentCourse = currentFormStudent ? courses.find(c => c.id === currentFormStudent.courseId) : null;

  const handleCollectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || amount <= 0) {
      alert("Please select a student and fill in a valid payment amount.");
      return;
    }

    if (currentFormStudent && amount > currentFormStudent.pendingAmount) {
      alert(`Amount exceeds outstanding student due of ₹${currentFormStudent.pendingAmount}.`);
      return;
    }

    onCollectPayment({
      studentId: selectedStudentId,
      amount,
      method,
      date,
      remarks: remarks || `Installment payment for ${currentCourse?.name || 'Course'}`
    });

    // Reset Form
    setSelectedStudentId('');
    setAmount(0);
    setRemarks('');
    alert("Payment collected successfully. Invoice receipt generated.");
  };

  // Trigger simulated messaging alerts
  const triggerReminder = (student: Student, channel: 'Email' | 'SMS' | 'WhatsApp') => {
    const title = `${channel} Fee Outstanding Alert`;
    const message = `Dear ${student.name}, this is a gentle reminder from MR Technologies that your outstanding training fee balance is INR ${student.pendingAmount.toLocaleString()}. Please clear your balance as soon as possible.`;
    
    onSendNotification({
      studentId: student.id,
      type: channel,
      title,
      message
    });

    alert(`Dispatched payment alert notice via ${channel} queue to student.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Financial Billing & Receipts</h2>
        <p className="text-slate-400 text-xs font-sans">Collect enrollment fees, issue GST compliant receipts, track outstanding balances.</p>
      </div>

      {/* Financial Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
        
        {/* Revenue collected */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Collected</span>
            <span className="text-lg font-bold text-slate-800">₹{totalCollected.toLocaleString()}</span>
          </div>
        </div>

        {/* Pending Receivables */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Outstanding Dues</span>
            <span className="text-lg font-bold text-slate-800">₹{totalPending.toLocaleString()}</span>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Overdue Balance</span>
            <span className="text-lg font-bold text-slate-800">₹{overdueAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* GST Invoiced */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">GST Collected (18%)</span>
            <span className="text-lg font-bold text-slate-800">₹{totalGstCollected.toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('collect')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${activeTab === 'collect' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Collect Fee
        </button>
        <button 
          onClick={() => setActiveTab('dues')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${activeTab === 'dues' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Outstanding Dues List
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${activeTab === 'history' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Payment Ledger History
        </button>
      </div>

      {/* Sub Panels */}
      {activeTab === 'collect' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Collection form */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              Collect Admission Installment
            </h3>

            <form onSubmit={handleCollectSubmit} className="space-y-4 text-xs text-slate-600 font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-slate-500 font-semibold mb-1">SELECT ACTIVE STUDENT *</label>
                  <select 
                    value={selectedStudentId}
                    onChange={e => {
                      setSelectedStudentId(e.target.value);
                      const stud = students.find(s => s.id === e.target.value);
                      if (stud) setAmount(stud.pendingAmount);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 outline-hidden focus:bg-white focus:border-blue-500"
                  >
                    <option value="">-- Choose Student with Outstanding Balance --</option>
                    {activeUnpaidStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.id}) - Due: ₹{s.pendingAmount.toLocaleString()}</option>
                    ))}
                  </select>
                </div>

                {currentFormStudent && (
                  <div className="col-span-2 p-3 bg-blue-50/50 border border-blue-100/30 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800 text-xs block">{currentFormStudent.name} is enrolled in:</span>
                      <span className="text-[11px] text-blue-600 font-medium block mt-0.5">{currentCourse?.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">PENDING BALANCE</span>
                      <span className="font-bold text-slate-800 text-sm">₹{currentFormStudent.pendingAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">COLLECTION AMOUNT (₹) *</label>
                  <input 
                    type="number"
                    required
                    value={amount || ''}
                    onChange={e => setAmount(Number(e.target.value))}
                    max={currentFormStudent?.pendingAmount || 99999}
                    placeholder="Enter collected amount"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">PAYMENT GATEWAY METHOD</label>
                  <select 
                    value={method}
                    onChange={e => setMethod(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden font-medium focus:bg-white focus:border-blue-500"
                  >
                    <option value="UPI">UPI (GooglePay/PhonePe)</option>
                    <option value="Cash">Physical Cash</option>
                    <option value="Card">Credit/Debit Card Terminal</option>
                    <option value="Bank Transfer">NEFT/IMPS Bank Transfer</option>
                    <option value="Cheque">Physical Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">PAYMENT TRANSACTION DATE</label>
                  <input 
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">REMARKS / MEMO</label>
                  <input 
                    type="text"
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    placeholder="e.g. Second installment payment"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs cursor-pointer transition-colors shadow-sm"
              >
                Log Receipt & Collect Fee
              </button>
            </form>
          </div>

          {/* Quick GST Calculator Side Panel */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Receipt GST Estimator</h4>
              <p className="text-slate-400 text-[10px] font-sans mt-1">18% GST calculation built for local audits.</p>
              
              <div className="space-y-3 mt-4 text-xs font-sans text-slate-600">
                <div className="flex justify-between">
                  <span>Gross Remittance:</span>
                  <span className="font-semibold text-slate-800">₹{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Taxable Value (84.75%):</span>
                  <span>₹{Math.round(amount * 0.8475).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST (9%):</span>
                  <span>₹{Math.round(amount * 0.0762).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST (9%):</span>
                  <span>₹{Math.round(amount * 0.0762).toLocaleString()}</span>
                </div>
                <div className="border-t border-dashed border-slate-100 pt-2 flex justify-between font-bold text-slate-800">
                  <span>GST Total Tax Included (18%):</span>
                  <span className="text-emerald-600">₹{Math.round(amount * 0.1525).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 mt-4">
              <FileText className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-normal font-sans">
                Logging a fee payment automatically reconciles outstanding student balance, posts an entry into the digital ledger, and updates the student lifecycle timeline.
              </p>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'dues' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Students with Outstanding Balances</h3>
              <p className="text-slate-400 text-xs">Aged outstanding dues needing follow up</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-500">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-medium">
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3 text-right">Fee Settle Ratio</th>
                  <th className="px-5 py-3 text-right">Pending Balance</th>
                  <th className="px-5 py-3 text-center">Dispatch Alerts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeUnpaidStudents.length > 0 ? (
                  activeUnpaidStudents.map(s => {
                    const course = courses.find(c => c.id === s.courseId);
                    const paidPct = Math.round((s.paidAmount / s.courseFee) * 100);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/30">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-800 text-sm">{s.name}</div>
                          <span className="text-[10px] text-slate-400">{s.id}</span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 font-sans">
                          <div>{s.mobile}</div>
                          <div className="text-[10px] text-slate-400">{s.email}</div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 font-medium">{course?.name || "N/A"}</td>
                        <td className="px-5 py-3.5 text-right font-sans">
                          <div className="font-semibold text-slate-700">{paidPct}% Paid</div>
                          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1 ml-auto">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${paidPct}%` }}></div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-rose-600 font-sans">
                          ₹{s.pendingAmount.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex justify-center gap-1.5">
                            <button 
                              onClick={() => triggerReminder(s, 'WhatsApp')}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 font-semibold text-[10px] rounded-lg cursor-pointer transition-colors"
                            >
                              WhatsApp
                            </button>
                            <button 
                              onClick={() => triggerReminder(s, 'Email')}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 font-semibold text-[10px] rounded-lg cursor-pointer transition-colors"
                            >
                              Email
                            </button>
                            <button 
                              onClick={() => triggerReminder(s, 'SMS')}
                              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-[10px] rounded-lg cursor-pointer transition-colors"
                            >
                              SMS
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400">Perfect scorecard! Zero outstanding dues detected.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Payment Ledger Logs</h3>
              <p className="text-slate-400 text-xs font-sans">Comprehensive ledger of all receipt events</p>
            </div>
            {/* Search */}
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Receipt / Student..."
                className="w-full text-[10px] pl-8 pr-3 py-1 bg-slate-50 border border-transparent rounded-lg outline-hidden focus:bg-white focus:border-slate-100 font-sans"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-500">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-medium">
                  <th className="px-5 py-3">Receipt No</th>
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-5 py-3">Method</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">GST Included</th>
                  <th className="px-5 py-3 text-right">Total Amount</th>
                  <th className="px-5 py-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments
                  .filter(p => p.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) || p.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(p => {
                    const studName = students.find(s => s.id === p.studentId)?.name || p.studentId;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/30">
                        <td className="px-5 py-3.5 font-bold text-slate-800">{p.receiptNo}</td>
                        <td className="px-5 py-3.5 text-slate-600 font-medium">{studName}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-sans text-[10px]">{p.method}</span>
                        </td>
                        <td className="px-5 py-3.5 font-sans text-slate-500">{p.date}</td>
                        <td className="px-5 py-3.5 text-right font-sans text-slate-400">₹{(p.gst || 0).toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-right font-bold text-slate-800 font-sans">₹{p.amount.toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-right">
                          <button 
                            onClick={() => setViewReceipt(p)}
                            className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                          >
                            View Invoice
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMPLIANT GST INVOICE RECEIPT MODAL */}
      {viewReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 relative animate-fade-in font-sans">
            <button 
              onClick={() => setViewReceipt(null)}
              className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Print Header */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">MR Technologies</h3>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Smart Institute Management Powered by AI</span>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">PAID RECEIPT</span>
                  <span className="text-[10px] text-slate-400 block mt-1">GSTIN: 36AAAAA1111A1Z1</span>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-slate-100 py-3 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">INVOICE TO</span>
                  <span className="font-semibold text-slate-800">{students.find(s => s.id === viewReceipt.studentId)?.name || 'Student'}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{viewReceipt.studentId}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">BILL DETAILS</span>
                  <span className="font-semibold text-slate-800 block">{viewReceipt.receiptNo}</span>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Date: {viewReceipt.date}</span>
                </div>
              </div>

              {/* Bill Details List */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="font-medium">Description</span>
                  <span className="font-semibold text-slate-800 text-right">Amount</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Professional IT Course Fee - Installment</span>
                  <span className="font-semibold text-slate-700">₹{Math.round(viewReceipt.amount * 0.8475).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>CGST (9%)</span>
                  <span>₹{Math.round(viewReceipt.amount * 0.0762).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px] border-b border-dashed border-slate-100 pb-2">
                  <span>SGST (9%)</span>
                  <span>₹{Math.round(viewReceipt.amount * 0.0762).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 text-sm pt-1">
                  <span>Gross Remittance Remitted:</span>
                  <span className="text-emerald-600">₹{viewReceipt.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>GATEWAY: {viewReceipt.method}</span>
                <span>System generated digital invoice.</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-2 border border-slate-100 hover:border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer bg-white"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Invoice
                </button>
                <button 
                  onClick={() => setViewReceipt(null)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Dismiss Receipt
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

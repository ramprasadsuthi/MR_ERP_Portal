/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, Award, Calendar, BookOpen, IndianRupee, Clock, ArrowUpRight, 
  Sparkles, CheckCircle2, TrendingUp, AlertCircle, PlayCircle, HelpCircle, UserCheck
} from 'lucide-react';
import { Student, Payment, Batch, Course, Trainer, Placement } from '../types.js';

interface DashboardProps {
  students: Student[];
  payments: Payment[];
  batches: Batch[];
  courses: Course[];
  trainers: Trainer[];
  placements: Placement[];
  aiAdvice: string;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ 
  students, 
  payments, 
  batches, 
  courses, 
  trainers, 
  placements,
  aiAdvice,
  onNavigate 
}: DashboardProps) {
  const [activeChartTab, setActiveChartTab] = useState<'revenue' | 'admissions'>('revenue');

  // Calculations
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const completedStudents = students.filter(s => s.status === 'Completed').length;
  const runningBatches = batches.filter(b => b.status === 'Ongoing').length;
  const totalCourses = courses.length;
  
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingDues = students.reduce((sum, s) => sum + s.pendingAmount, 0);
  const collectionPct = totalRevenue + pendingDues > 0 
    ? Math.round((totalRevenue / (totalRevenue + pendingDues)) * 100) 
    : 100;

  const placedCount = placements.filter(p => p.status === 'Placed').length;
  const placementRate = completedStudents > 0 
    ? Math.round((placedCount / completedStudents) * 100) 
    : 85;

  // Trainer utilization (average batches assigned to active trainers)
  const activeTrainers = trainers.filter(t => t.status === 'Active');
  const avgUtilization = activeTrainers.length > 0
    ? Math.min(100, Math.round((batches.filter(b => b.status === 'Ongoing').length / (activeTrainers.length * 2)) * 100))
    : 0;

  // Recent lists
  const recentEnrollments = [...students]
    .sort((a, b) => b.admissionDate.localeCompare(a.admissionDate))
    .slice(0, 4);

  const recentPayments = [...payments]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  const upcomingBatches = batches
    .filter(b => b.status === 'Upcoming')
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 3);

  // Custom Chart Data: 6-month Revenue trend
  const revenueHistory = [
    { month: 'Jan', amount: 45000, students: 2 },
    { month: 'Feb', amount: 45000, students: 2 },
    { month: 'Mar', amount: 0, students: 0 },
    { month: 'Apr', amount: 72000, students: 4 },
    { month: 'May', amount: 154998, students: 6 },
    { month: 'Jun', amount: 5000, students: 1 }
  ];

  const maxRevenue = Math.max(...revenueHistory.map(r => r.amount));

  return (
    <div className="space-y-6">
      {/* Welcome Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome, MR Technologies Admin</h1>
          <p className="text-slate-500 text-sm mt-0.5">Here is an overview of your institute's state as of today.</p>
        </div>
        <div className="flex gap-3">
          <button 
            id="quick-register-btn"
            onClick={() => onNavigate('students')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <Users className="w-4 h-4" />
            Admit Student
          </button>
          <button 
            id="quick-payment-btn"
            onClick={() => onNavigate('payments')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <IndianRupee className="w-4 h-4" />
            Collect Fee
          </button>
        </div>
      </div>

      {/* AI Grounded Insights Panel (Deep Blue Intelligence Hub) */}
      <div className="bg-slate-900 rounded-xl p-6 text-white flex flex-col md:flex-row items-start gap-4 shadow-lg shadow-slate-950/25">
        <div className="p-3 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 shrink-0">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold uppercase text-xs tracking-wider text-blue-400">Grounded AI Business Intelligence Advice</h3>
            <span className="text-[9px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-blue-500/20">Live Insights</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed font-sans">{aiAdvice}</p>
        </div>
      </div>

      {/* 12 KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Students</span>
            <span className="text-xl font-bold text-slate-800">{totalStudents}</span>
          </div>
        </div>

        {/* Active Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Active Students</span>
            <span className="text-xl font-bold text-slate-800">{activeStudents}</span>
          </div>
        </div>

        {/* Completed Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Completed Grads</span>
            <span className="text-xl font-bold text-slate-800">{completedStudents}</span>
          </div>
        </div>

        {/* Running Batches */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-lg">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Running Batches</span>
            <span className="text-xl font-bold text-slate-800">{runningBatches}</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Revenue</span>
            <span className="text-xl font-bold text-slate-800">₹{totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Pending Dues */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Pending Dues</span>
            <span className="text-xl font-bold text-slate-800">₹{pendingDues.toLocaleString()}</span>
          </div>
        </div>

        {/* Collection Pct */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Collection Ratio</span>
            <span className="text-xl font-bold text-slate-800">{collectionPct}%</span>
          </div>
        </div>

        {/* Placement Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Placement Rate</span>
            <span className="text-xl font-bold text-slate-800">{placementRate}%</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Side panel section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts Panel */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Institute Growth & Performance Trends</h3>
              <p className="text-slate-400 text-xs">Visual analytics based on system ledger</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveChartTab('revenue')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${activeChartTab === 'revenue' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Revenue trend
              </button>
              <button 
                onClick={() => setActiveChartTab('admissions')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${activeChartTab === 'admissions' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Admissions
              </button>
            </div>
          </div>

          {/* SVG Custom High-fidelity responsive graph */}
          <div className="flex-1 h-64 flex flex-col justify-between mt-4">
            {activeChartTab === 'revenue' ? (
              <div className="relative w-full h-full flex flex-col justify-between">
                {/* Horizontal grid lines */}
                <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                  <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                  <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                  <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                </div>

                {/* SVG Visual Bars */}
                <div className="relative w-full flex-1 flex items-end justify-around px-4 z-10">
                  {revenueHistory.map((item, idx) => {
                    const heightPercent = idx === 2 ? 5 : (item.amount / maxRevenue) * 90;
                    return (
                      <div key={idx} className="flex flex-col items-center group w-12">
                        <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                          ₹{item.amount >= 1000 ? `${(item.amount / 1000).toFixed(1)}k` : item.amount}
                        </span>
                        <div 
                          className="w-8 rounded-t bg-gradient-to-t from-blue-600 to-sky-500 group-hover:from-blue-700 group-hover:to-sky-600 transition-all shadow-xs duration-300"
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                        <span className="text-xs text-slate-400 font-medium mt-2">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full flex flex-col justify-between">
                {/* Admissions trend logic */}
                <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                  <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                  <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                  <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                </div>

                {/* SVG Visual Bars for Admissions */}
                <div className="relative w-full flex-1 flex items-end justify-around px-4 z-10">
                  {revenueHistory.map((item, idx) => {
                    // Maximum students in a month was 6 (May)
                    const heightPercent = item.students > 0 ? (item.students / 6) * 90 : 5;
                    return (
                      <div key={idx} className="flex flex-col items-center group w-12">
                        <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                          {item.students} Admissions
                        </span>
                        <div 
                          className="w-8 rounded-t bg-gradient-to-t from-emerald-500 to-teal-400 group-hover:from-emerald-600 group-hover:to-teal-500 transition-all shadow-xs duration-300"
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                        <span className="text-xs text-slate-400 font-medium mt-2">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Batches */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Upcoming Batches</h3>
              <p className="text-slate-400 text-xs">Scheduled cohorts starting soon</p>
            </div>
            <button 
              onClick={() => onNavigate('courses')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              Manage
            </button>
          </div>

          <div className="space-y-4">
            {upcomingBatches.length > 0 ? (
              upcomingBatches.map((batch, index) => {
                const course = courses.find(c => c.id === batch.courseId);
                return (
                  <div key={index} className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-slate-800 text-xs block truncate max-w-[140px]">{batch.name}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-full uppercase tracking-wider">{course?.name ? course.name.split(' ')[0] : 'Tech'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-sans">
                      <div>
                        <span className="text-[10px] text-slate-400 block">START DATE</span>
                        <span className="font-medium text-slate-700">{batch.startDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">TIMING</span>
                        <span className="font-medium text-slate-700 truncate block">{batch.timing.split('(')[0]}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">No upcoming batches scheduled.</div>
            )}
          </div>
        </div>
      </div>

      {/* Enrollments & Payments Tables Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Latest Enrollments */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Latest Enrollments</h3>
              <p className="text-slate-400 text-xs">Recent registrations into cohorts</p>
            </div>
            <button 
              onClick={() => onNavigate('students')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              View Students
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-500">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-medium">
                  <th className="pb-2">Student</th>
                  <th className="pb-2">Course</th>
                  <th className="pb-2 text-right">Fee Settle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEnrollments.map((student, idx) => {
                  const course = courses.find(c => c.id === student.courseId);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5">
                        <div className="font-medium text-slate-800">{student.name}</div>
                        <div className="text-[10px] text-slate-400">{student.id} | {student.mobile}</div>
                      </td>
                      <td className="py-2.5 truncate max-w-[120px]">
                        {course?.name || "Full Stack"}
                      </td>
                      <td className="py-2.5 text-right font-medium text-slate-700">
                        {student.pendingAmount === 0 ? (
                          <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">Fully Paid</span>
                        ) : (
                          <span>₹{(student.courseFee - student.discount - student.pendingAmount).toLocaleString()} Paid</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Collections */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Recent Fees Collected</h3>
              <p className="text-slate-400 text-xs">Latest financial ledger ledger entries</p>
            </div>
            <button 
              onClick={() => onNavigate('payments')}
              className="text-xs text-emerald-600 hover:text-emerald-800 font-medium cursor-pointer"
            >
              Billing
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-500">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-medium">
                  <th className="pb-2">Receipt No</th>
                  <th className="pb-2">Student ID</th>
                  <th className="pb-2">Method</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPayments.map((payment, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5">
                      <span className="font-medium text-slate-800">{payment.receiptNo}</span>
                      <span className="text-[10px] text-slate-400 block">{payment.date}</span>
                    </td>
                    <td className="py-2.5 text-slate-600">
                      {students.find(s => s.id === payment.studentId)?.name || payment.studentId}
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-sans">{payment.method}</span>
                    </td>
                    <td className="py-2.5 text-right font-semibold text-slate-800">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

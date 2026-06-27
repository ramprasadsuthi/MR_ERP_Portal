/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, Calendar, Users, Award, PlayCircle, Star, ArrowUpRight, 
  BookMarked, Clock, CheckCircle, Briefcase, Plus, UserCheck, LayoutGrid, List
} from 'lucide-react';
import { Course, Batch, Trainer } from '../types.js';

interface CourseBatchTrainerProps {
  courses: Course[];
  batches: Batch[];
  trainers: Trainer[];
}

export default function CourseBatchTrainer({ courses, batches, trainers }: CourseBatchTrainerProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'batches' | 'trainers'>('courses');
  const [batchFilter, setBatchFilter] = useState<'All' | 'Active' | 'Completed' | 'Upcoming'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const calculateDateProgress = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    if (isNaN(start) || isNaN(end)) return 0;
    if (now <= start) return 0;
    if (now >= end) return 100;

    const total = end - start;
    const elapsed = now - start;
    if (total <= 0) return 100;

    return Math.round((elapsed / total) * 100);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredBatches = batches.filter(batch => {
    if (batchFilter === 'All') return true;
    if (batchFilter === 'Active') return batch.status === 'Ongoing';
    return batch.status === batchFilter;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Academic Asset Management</h2>
        <p className="text-slate-400 text-xs">Configure training catalogs, schedule cohort batches, and monitor instructor ratings.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${activeTab === 'courses' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Courses Catalog ({courses.length})
        </button>
        <button 
          onClick={() => setActiveTab('batches')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${activeTab === 'batches' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Cohort Batches ({batches.length})
        </button>
        <button 
          onClick={() => setActiveTab('trainers')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${activeTab === 'trainers' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Instructors / Trainers ({trainers.length})
        </button>
      </div>

      {/* Courses Catalog Tab */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
              
              {/* Header Visual */}
              <div className="relative h-40 bg-slate-100 overflow-hidden shrink-0">
                <img 
                  src={course.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=60"} 
                  alt={course.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase">
                  {course.level}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-base leading-snug">{course.name}</h3>
                  <span className="text-[10px] text-blue-500 font-bold tracking-wider uppercase block mt-1">{course.id} | {course.duration}</span>
                  <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">{course.description}</p>
                </div>

                {/* Modules accordion mockup */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Course Syllabus</span>
                  {course.modules.slice(0, 3).map((mod, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-500 truncate">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{mod}</span>
                    </div>
                  ))}
                  {course.modules.length > 3 && (
                    <span className="text-[10px] text-slate-400 block mt-1 font-medium">+ {course.modules.length - 3} additional advanced modules</span>
                  )}
                </div>

                {/* Price, actions row */}
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold">TUITION FEES</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">₹{course.offerPrice.toLocaleString()}</span>
                      <span className="text-slate-400 text-[11px] line-through font-sans">₹{course.price.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <span className="text-[10px] bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1 rounded-xl font-medium">
                    {course.certification.split('(')[0]}
                  </span>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Cohort Batches Tab */}
      {activeTab === 'batches' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Cohort Batches Ledger</h3>
              <p className="text-slate-400 text-xs">Monitor ongoing classes, attendance parameters, and seat capacities.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 shrink-0">Filter Status:</span>
                <select
                  id="batch-status-filter"
                  value={batchFilter}
                  onChange={e => setBatchFilter(e.target.value as any)}
                  className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-blue-500 focus:bg-white cursor-pointer transition-colors"
                >
                  <option value="All">All Batches</option>
                  <option value="Active">Active (Ongoing)</option>
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>

              {/* View mode toggle */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md cursor-pointer transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Grid View (Cards)"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md cursor-pointer transition-all ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Table View (Ledger)"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/20">
              {filteredBatches.length > 0 ? (
                filteredBatches.map(batch => {
                  const course = courses.find(c => c.id === batch.courseId);
                  const trainer = trainers.find(t => t.id === batch.trainerId);
                  const dateProgress = calculateDateProgress(batch.startDate, batch.endDate);
                  
                  return (
                    <div key={batch.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
                      {/* Top Row: Name and Status */}
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-2 leading-snug">{batch.name}</h4>
                          <span className={`px-2 py-0.5 text-[9px] font-bold tracking-wider rounded-full uppercase shrink-0 ${
                            batch.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            batch.status === 'Completed' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 
                            'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {batch.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-blue-500 font-bold block">{batch.id} | {course?.name || "No Course"}</span>
                      </div>

                      {/* Instructor & Location info */}
                      <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Instructor</span>
                          <span className="font-semibold text-slate-700 truncate block">{trainer?.name || "Unassigned"}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Classroom</span>
                          <span className="font-semibold text-slate-700 truncate block">{batch.classroom}</span>
                        </div>
                      </div>

                      {/* Timings */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-sans">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium truncate">{batch.timing.split('(')[0]}</span>
                      </div>

                      {/* Metrics: Attendance & Seats */}
                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                            <span>Seats Filled</span>
                            <span className="text-slate-700">{batch.enrolledCount}/{batch.capacity}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-slate-600 h-full rounded-full" style={{ width: `${(batch.enrolledCount / batch.capacity) * 100}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                            <span>Attendance Avg</span>
                            <span className="text-slate-700">{batch.attendancePct > 0 ? `${batch.attendancePct}%` : 'N/A'}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${batch.attendancePct || 0}%` }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bars (Syllabus vs Dates) */}
                      <div className="space-y-3 pt-3 border-t border-slate-150">
                        {/* Syllabus Progress */}
                        <div>
                          <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                            <span className="flex items-center gap-1"><BookMarked className="w-3 h-3 text-blue-500" /> Syllabus Coverage</span>
                            <span className="font-bold text-slate-700">{batch.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${batch.progress}%` }}></div>
                          </div>
                        </div>

                        {/* Calendar Completion Progress Bar (Based on dates) */}
                        <div>
                          <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-indigo-500" /> Calendar Progress</span>
                            <span className="font-bold text-slate-700">{dateProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${dateProgress}%` }}></div>
                          </div>
                          <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                            <span>{formatDate(batch.startDate)}</span>
                            <span>{formatDate(batch.endDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12 text-slate-400 font-medium font-sans">
                  No cohort batches found matching the selected status.
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-500">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-medium">
                    <th className="px-5 py-3">Cohort Batch ID</th>
                    <th className="px-5 py-3">Classroom / Location</th>
                    <th className="px-5 py-3">Instructor</th>
                    <th className="px-5 py-3">Timings</th>
                    <th className="px-5 py-3 text-center">Syllabus Progress</th>
                    <th className="px-5 py-3 text-center">Calendar Progress</th>
                    <th className="px-5 py-3 text-center">Attendance Avg</th>
                    <th className="px-5 py-3 text-center">Seats Filled</th>
                    <th className="px-5 py-3 text-right">Cohort Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBatches.length > 0 ? (
                    filteredBatches.map(batch => {
                      const course = courses.find(c => c.id === batch.courseId);
                      const trainer = trainers.find(t => t.id === batch.trainerId);
                      const dateProgress = calculateDateProgress(batch.startDate, batch.endDate);
                      return (
                        <tr key={batch.id} className="hover:bg-slate-50/30">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-800 text-xs">{batch.name}</div>
                          <span className="text-[10px] text-blue-500 font-bold block">{batch.id} | {course?.name.split(' ')[0]}</span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 font-medium">{batch.classroom}</td>
                        <td className="px-5 py-3.5 text-slate-600 font-semibold">{trainer?.name || "Unassigned"}</td>
                        <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">{batch.timing.split('(')[0]}</td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden shrink-0">
                              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${batch.progress}%` }}></div>
                            </div>
                            <span className="font-bold text-slate-700 text-[10px] shrink-0">{batch.progress}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2 justify-center">
                              <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden shrink-0">
                                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${dateProgress}%` }}></div>
                              </div>
                              <span className="font-bold text-slate-700 text-[10px] shrink-0">{dateProgress}%</span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono block whitespace-nowrap">
                              {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center font-bold text-slate-700">
                          {batch.attendancePct > 0 ? `${batch.attendancePct}%` : 'N/A'}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="font-semibold text-slate-800">{batch.enrolledCount}</span>
                          <span className="text-slate-400"> / {batch.capacity}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className={`px-2.5 py-1 text-[10px] font-semibold tracking-wider rounded-full uppercase ${
                            batch.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-700' :
                            batch.status === 'Completed' ? 'bg-slate-100 text-slate-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {batch.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-slate-400 font-medium font-sans">
                      No cohort batches found matching the selected status.
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'trainers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainers.map(trainer => (
            <div key={trainer.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              
              {/* Profile Card */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg uppercase shadow-3xs shrink-0">
                  {trainer.name.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight">{trainer.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1">{trainer.id} | {trainer.qualification}</span>
                  
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{trainer.rating} / 5.0 Rating</span>
                  </div>
                </div>
              </div>

              {/* Skills tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Trainer Specializations</span>
                <div className="flex flex-wrap gap-1.5">
                  {trainer.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded text-[10px] border border-slate-100 font-medium">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Workload and Assigned Batches list */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs font-sans">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Workload</span>
                  <span className="font-semibold text-slate-700 block mt-0.5">{trainer.availability} Contract</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Trainer Salary</span>
                  <span className="font-bold text-slate-800 block mt-0.5">₹{trainer.salary.toLocaleString()} / mo</span>
                </div>
              </div>

              {/* Feedback reviews */}
              {trainer.feedback.length > 0 && (
                <div className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Latest Student Review</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed italic">"{trainer.feedback[0].comment}"</p>
                  <span className="text-[10px] text-blue-500 font-semibold block mt-1">— {trainer.feedback[0].studentName}</span>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

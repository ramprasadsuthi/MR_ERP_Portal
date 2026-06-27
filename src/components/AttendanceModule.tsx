/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, Check, UserX, Clock, Users, ArrowUpRight, 
  Search, CheckCircle2, ChevronRight, AlertCircle, Sparkles
} from 'lucide-react';
import { Student, Batch, AttendanceRecord, Course } from '../types.js';

interface AttendanceModuleProps {
  students: Student[];
  batches: Batch[];
  courses: Course[];
  attendanceLogs: AttendanceRecord[];
  onMarkAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
}

export default function AttendanceModule({ 
  students, 
  batches, 
  courses,
  attendanceLogs,
  onMarkAttendance 
}: AttendanceModuleProps) {
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Marking state dictionary (studentId -> status)
  const [studentStatusDict, setStudentStatusDict] = useState<Record<string, { status: 'Present' | 'Absent' | 'Late'; remarks: string }>>({});

  const selectedBatch = batches.find(b => b.id === selectedBatchId);
  const selectedCourse = selectedBatch ? courses.find(c => c.id === selectedBatch.courseId) : null;
  
  // Filter students enrolled in selected batch
  const batchStudents = students.filter(s => s.batchId === selectedBatchId && s.status === 'Active');

  // Trigger when batch is changed to initialize status dictionary
  const handleBatchSelect = (batchId: string) => {
    setSelectedBatchId(batchId);
    const initialDict: Record<string, { status: 'Present' | 'Absent' | 'Late'; remarks: string }> = {};
    students.filter(s => s.batchId === batchId && s.status === 'Active').forEach(s => {
      initialDict[s.id] = { status: 'Present', remarks: '' };
    });
    setStudentStatusDict(initialDict);
  };

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setStudentStatusDict(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setStudentStatusDict(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }));
  };

  // Mark all enrolled as Present/Absent
  const handleMarkAll = (status: 'Present' | 'Absent') => {
    const updatedDict = { ...studentStatusDict };
    batchStudents.forEach(s => {
      updatedDict[s.id] = { ...updatedDict[s.id], status };
    });
    setStudentStatusDict(updatedDict);
  };

  const handleSubmitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId || batchStudents.length === 0) {
      alert("No students enrolled or select a batch first.");
      return;
    }

    const recordsPayload = batchStudents.map(s => ({
      studentId: s.id,
      status: studentStatusDict[s.id]?.status || 'Present',
      remarks: studentStatusDict[s.id]?.remarks || ''
    }));

    onMarkAttendance({
      date: attendanceDate,
      batchId: selectedBatchId,
      studentRecords: recordsPayload,
      trainerRecord: { trainerId: selectedBatch!.trainerId, status: 'Present' }
    });

    alert(`Daily attendance successfully registered for ${selectedBatch?.name}.`);
    setSelectedBatchId('');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Attendance Tracking System</h2>
        <p className="text-slate-400 text-xs">Track instructor presence, log student daily markings, and calculate syllabus ratios.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mark Attendance Main Panel */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              Mark Daily Session Presence
            </h3>
            <div className="flex gap-2 text-xs">
              <button 
                type="button" 
                onClick={() => handleMarkAll('Present')}
                className="text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
              >
                Mark all Present
              </button>
              <span className="text-slate-300">|</span>
              <button 
                type="button" 
                onClick={() => handleMarkAll('Absent')}
                className="text-rose-700 hover:text-rose-800 font-semibold cursor-pointer"
              >
                Mark all Absent
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmitAttendance} className="space-y-4 text-xs text-slate-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">SELECT TARGET BATCH *</label>
                <select 
                  value={selectedBatchId}
                  onChange={e => handleBatchSelect(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 outline-hidden focus:bg-white focus:border-blue-500"
                >
                  <option value="">-- Choose Cohort Batch --</option>
                  {batches.filter(b => b.status === 'Ongoing').map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">SESSION CALENDAR DATE</label>
                <input 
                  type="date"
                  value={attendanceDate}
                  onChange={e => setAttendanceDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium outline-hidden focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            {/* List Enrolled */}
            {selectedBatchId ? (
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Cohort Enrolled Students ({batchStudents.length})</span>
                
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {batchStudents.map(student => {
                    const status = studentStatusDict[student.id]?.status || 'Present';
                    return (
                      <div key={student.id} className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="truncate max-w-[150px]">
                          <span className="font-semibold text-slate-800 text-xs block truncate">{student.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{student.id}</span>
                        </div>

                        {/* Status Select Toggles */}
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'Present')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer border transition-colors ${
                              status === 'Present' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'Absent')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer border transition-colors ${
                              status === 'Absent' 
                                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'Late')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer border transition-colors ${
                              status === 'Late' 
                                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            Late
                          </button>
                        </div>

                        {/* Note / Remarks */}
                        <div className="flex-1 max-w-[200px]">
                          <input 
                            type="text"
                            placeholder="Add memo (e.g. medical leave)"
                            value={studentStatusDict[student.id]?.remarks || ''}
                            onChange={e => handleRemarksChange(student.id, e.target.value)}
                            className="w-full text-[10px] p-1.5 bg-white border border-slate-200 rounded-lg outline-hidden focus:border-blue-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs cursor-pointer transition-colors shadow-sm"
                >
                  Commit Cohort Session Attendance Ledger
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 font-sans">Please choose an active running batch above to mark attendance.</div>
            )}
          </form>
        </div>

        {/* History / Attendance logs panel */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-800 text-sm border-b border-slate-50 pb-2">Session Logging History</h4>
            <div className="space-y-4 mt-4 max-h-96 overflow-y-auto pr-1">
              {attendanceLogs.map((log, index) => {
                const batch = batches.find(b => b.id === log.batchId);
                const presents = log.studentRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
                return (
                  <div key={index} className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span className="truncate max-w-[120px]">{batch?.name || log.batchId}</span>
                      <span className="font-mono text-[10px] text-slate-400">{log.date}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px] font-sans">
                      <span>Presents: {presents} / {log.studentRecords.length} Students</span>
                      <span className="text-emerald-600 font-semibold">Marked Ledgered</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2.5 mt-6 shrink-0">
            <AlertCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400 leading-normal font-sans">
              Daily attendance is mapped against the Student Timeline record automatically to feed the Business Intelligence dropout prediction algorithm.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

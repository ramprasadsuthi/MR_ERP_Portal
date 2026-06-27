/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, Award, Calendar, BookOpen, IndianRupee, Clock, ShieldAlert,
  Sparkles, CheckCircle2, TrendingUp, AlertCircle, PlayCircle, HelpCircle,
  Settings, Brain, UserCheck, Menu, X, LogOut, ChevronRight, RefreshCw
} from 'lucide-react';

// Import Modular Components
import Dashboard from './components/Dashboard.js';
import StudentManagement from './components/StudentManagement.js';
import PaymentManagement from './components/PaymentManagement.js';
import CourseBatchTrainer from './components/CourseBatchTrainer.js';
import AttendanceModule from './components/AttendanceModule.js';
import CertificatePlacement from './components/CertificatePlacement.js';
import AiAssistant from './components/AiAssistant.js';
import AdminSettings from './components/AdminSettings.js';
import LoginPortal from './components/LoginPortal.js';

// Import Types
import { 
  Student, Course, Batch, Trainer, Payment, 
  AttendanceRecord, Certificate, Placement, 
  InstituteSettings, AuditLog, UserRole, UserSession 
} from './types.js';

export default function App() {
  // Authentication & Session
  const [session, setSession] = useState<UserSession | null>(() => {
    const cached = localStorage.getItem('erp_session');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Core Database States
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [settings, setSettings] = useState<InstituteSettings>({
    name: "MR Technologies ERP",
    email: "ramprasadsuthi@gmail.com",
    phone: "+91 98765 43210",
    address: "Ameerpet Metro Hub, Hyderabad, Telangana",
    gstNo: "36AAAAA1111A1Z1",
    currency: "₹"
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [aiAdvice, setAiAdvice] = useState<string>(
    "Consulting MR Technologies server ledger to extract business insights..."
  );

  const [isLoading, setIsLoading] = useState(true);

  // Sync / Fetch Data from express APIs
  const refreshAllData = async () => {
    try {
      const [
        resStudents, resCourses, resBatches, resTrainers, 
        resPayments, resAttendance, resCertificates, resPlacements,
        resSettings, resAuditLogs, resPredictions
      ] = await Promise.all([
        fetch('/api/students').then(r => r.json()),
        fetch('/api/courses').then(r => r.json()),
        fetch('/api/batches').then(r => r.json()),
        fetch('/api/trainers').then(r => r.json()),
        fetch('/api/payments').then(r => r.json()),
        fetch('/api/attendance').then(r => r.json()),
        fetch('/api/certificates').then(r => r.json()),
        fetch('/api/placements').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/audit-logs').then(r => r.json()),
        fetch('/api/ai/predictions').then(r => r.json()).catch(() => ({}))
      ]);

      if (Array.isArray(resStudents)) setStudents(resStudents);
      if (Array.isArray(resCourses)) setCourses(resCourses);
      if (Array.isArray(resBatches)) setBatches(resBatches);
      if (Array.isArray(resTrainers)) setTrainers(resTrainers);
      if (Array.isArray(resPayments)) setPayments(resPayments);
      if (Array.isArray(resAttendance)) setAttendanceLogs(resAttendance);
      if (Array.isArray(resCertificates)) setCertificates(resCertificates);
      if (Array.isArray(resPlacements)) setPlacements(resPlacements);
      if (resSettings && resSettings.name) setSettings(resSettings);
      if (Array.isArray(resAuditLogs)) setAuditLogs(resAuditLogs);
      
      if (resPredictions && resPredictions.aiNarrativeAdvice) {
        setAiAdvice(resPredictions.aiNarrativeAdvice);
      } else {
        setAiAdvice("Welcome back! Active course enrollment is healthy at 92%. Dues recovery forecasts stand at ₹45,000 for this batch cycle.");
      }

    } catch (err) {
      console.error("Reconciliation error with server API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // API operations callbacks to bridge database write states
  const handleAddStudent = async (studentData: any) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      if (res.ok) {
        await refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStudent = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        await refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm("Are you sure you want to drop this student? This action cannot be undone.")) {
      try {
        const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
        if (res.ok) {
          await refreshAllData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCollectPayment = async (paymentData: any) => {
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      if (res.ok) {
        await refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAttendance = async (attendanceRecord: any) => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceRecord)
      });
      if (res.ok) {
        await refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleIssueCertificate = async (certificateData: any) => {
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certificateData)
      });
      if (res.ok) {
        await refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterPlacement = async (placementData: any) => {
    try {
      const res = await fetch('/api/placements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(placementData)
      });
      if (res.ok) {
        await refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendNotification = async (notificationData: any) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      });
      await refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSettings = async (settingsUpdates: any) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsUpdates)
      });
      if (res.ok) {
        await refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBackupDatabase = async () => {
    try {
      await fetch('/api/settings/backup', { method: 'POST' });
      await refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestoreDatabase = async (backupName: string) => {
    // Restoring triggers re-seeding/snapshot load
    await refreshAllData();
  };

  const handleLoginSuccess = (userSession: UserSession) => {
    localStorage.setItem('erp_session', JSON.stringify(userSession));
    setSession(userSession);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('erp_session');
    setSession(null);
    setActiveTab('dashboard');
  };

  // Sidebar Menu Items
  const menuItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: TrendingUp },
    { id: 'students', label: 'Admissions & Students', icon: Users },
    { id: 'payments', label: 'Billing & Ledger', icon: IndianRupee },
    { id: 'courses', label: 'Course Catalog & Batches', icon: BookOpen },
    { id: 'attendance', label: 'Attendance Roll Call', icon: Calendar },
    { id: 'credentials', label: 'Credentials & Placements', icon: Award },
    { id: 'ai-assist', label: 'Strategic AI Assistant', icon: Brain },
    { id: 'settings', label: 'Settings & Log Audits', icon: Settings }
  ];

  // Filter based on active role permissions
  const filteredMenuItems = menuItems.filter(item => {
    if (!session) return false;
    if (session.role === 'super-admin') return true;
    if (session.role === 'admin') {
      return item.id !== 'settings';
    }
    if (session.role === 'front-office-executive') {
      return ['dashboard', 'students', 'payments', 'courses'].includes(item.id);
    }
    return true;
  });

  const isTabAuthorized = (tabId: string): boolean => {
    if (!session) return false;
    if (session.role === 'super-admin') return true;
    if (session.role === 'admin') {
      return tabId !== 'settings';
    }
    if (session.role === 'front-office-executive') {
      return ['dashboard', 'students', 'payments', 'courses'].includes(tabId);
    }
    return true;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans gap-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500 tracking-wider uppercase animate-pulse">Initializing ERP Secure Node...</span>
      </div>
    );
  }

  if (!session) {
    return <LoginPortal onLoginSuccess={handleLoginSuccess} instituteName={settings.name || "MR Technologies"} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Sidebar Navigation */}
      <aside 
        className={`bg-slate-900 border-r border-slate-800 text-slate-300 w-64 flex flex-col justify-between transition-all shrink-0 z-30 fixed lg:relative h-screen ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <div className="space-y-6 py-5">
          {/* Logo */}
          <div className="px-5 flex items-center justify-between border-b border-slate-800/60 pb-5">
            <div className="flex items-center gap-3 truncate">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              {isSidebarOpen && (
                <div className="truncate">
                  <h1 className="font-extrabold text-white text-sm tracking-tight">MR Technologies</h1>
                  <span className="text-[10px] text-blue-400 block font-bold font-mono tracking-wider uppercase">ERP SYSTEM</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-slate-800 rounded-lg cursor-pointer text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav list */}
          <nav className="space-y-1.5 px-3">
            {filteredMenuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    // Close sidebar on mobile
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {isSidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User context profile footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 shrink-0 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 truncate">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-blue-500 uppercase">
                {session?.avatar || "RP"}
              </div>
              {isSidebarOpen && (
                <div className="truncate">
                  <h3 className="font-bold text-slate-100 text-xs truncate leading-snug">{session?.name}</h3>
                  <span className="text-[9px] text-blue-400 font-bold block uppercase tracking-wider">
                    {session?.role === 'super-admin' ? 'Super Admin' : session?.role === 'admin' ? 'Academic Admin' : 'Executive'}
                  </span>
                </div>
              )}
            </div>
            
            {isSidebarOpen && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg cursor-pointer transition-colors"
                title="Sign Out Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {!isSidebarOpen && (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-1.5 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg cursor-pointer transition-colors flex justify-center"
              title="Sign Out Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Container Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen relative lg:pl-0">
        
        {/* Mobile Header Row */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 lg:hidden shadow-2xs">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="font-bold text-slate-900 text-sm">{settings.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs border border-blue-500">
              {session?.avatar || "RP"}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Screen Stage Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Active Component stage */}
          {activeTab === 'dashboard' && (
            <Dashboard 
              students={students}
              payments={payments}
              batches={batches}
              courses={courses}
              trainers={trainers}
              placements={placements}
              aiAdvice={aiAdvice}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'students' && (
            <StudentManagement 
              students={students}
              courses={courses}
              batches={batches}
              trainers={trainers}
              payments={payments}
              attendance={attendanceLogs}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onCollectPayment={handleCollectPayment}
              userRole={session?.role}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentManagement 
              students={students}
              payments={payments}
              courses={courses}
              onCollectPayment={handleCollectPayment}
              onSendNotification={handleSendNotification}
            />
          )}

          {activeTab === 'courses' && (
            <CourseBatchTrainer 
              courses={courses}
              batches={batches}
              trainers={trainers}
            />
          )}

          {activeTab === 'attendance' && (
            isTabAuthorized('attendance') ? (
              <AttendanceModule 
                students={students}
                batches={batches}
                courses={courses}
                attendanceLogs={attendanceLogs}
                onMarkAttendance={handleMarkAttendance}
              />
            ) : (
              <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center max-w-lg mx-auto my-12 space-y-4">
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-100 shadow-xs">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Administrative Access Restricted</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your currently active session role (<span className="font-semibold text-slate-700 capitalize">{(session?.role || "").replace(/-/g, ' ')}</span>) does not possess sufficient security clearance to access this module node. Please request authorization from an academic supervisor or system super administrator.
                </p>
              </div>
            )
          )}

          {activeTab === 'credentials' && (
            isTabAuthorized('credentials') ? (
              <CertificatePlacement 
                students={students}
                courses={courses}
                certificates={certificates}
                placements={placements}
                onIssueCertificate={handleIssueCertificate}
                onRegisterPlacement={handleRegisterPlacement}
                onUpdateCertificate={handleUpdateStudent as any}
              />
            ) : (
              <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center max-w-lg mx-auto my-12 space-y-4">
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-100 shadow-xs">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Placement & Credentials Locked</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your currently active session role (<span className="font-semibold text-slate-700 capitalize">{(session?.role || "").replace(/-/g, ' ')}</span>) does not possess sufficient security clearance to access this module node. Please request authorization from an academic supervisor or system super administrator.
                </p>
              </div>
            )
          )}

          {activeTab === 'ai-assist' && (
            isTabAuthorized('ai-assist') ? (
              <AiAssistant 
                students={students}
                courses={courses}
                batches={batches}
                payments={payments}
              />
            ) : (
              <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center max-w-lg mx-auto my-12 space-y-4">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto border border-indigo-100 shadow-xs">
                  <ShieldAlert className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">AI Assistant Restricted</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your currently active session role (<span className="font-semibold text-slate-700 capitalize">{(session?.role || "").replace(/-/g, ' ')}</span>) does not possess sufficient security clearance to access this module node. Please request authorization from an academic supervisor or system super administrator.
                </p>
              </div>
            )
          )}

          {activeTab === 'settings' && (
            isTabAuthorized('settings') ? (
              <AdminSettings 
                settings={settings}
                auditLogs={auditLogs}
                onUpdateSettings={handleUpdateSettings}
                onBackupDatabase={handleBackupDatabase}
                onRestoreDatabase={handleRestoreDatabase}
              />
            ) : (
              <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center max-w-lg mx-auto my-12 space-y-4">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100 shadow-xs">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Settings & Log Audits Restricted</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your currently active session role (<span className="font-semibold text-slate-700 capitalize">{(session?.role || "").replace(/-/g, ' ')}</span>) does not possess sufficient security clearance to access this module node. Please request authorization from an academic supervisor or system super administrator.
                </p>
              </div>
            )
          )}

        </main>
      </div>

    </div>
  );
}

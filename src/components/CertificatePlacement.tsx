/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, Briefcase, Calendar, CheckCircle2, ShieldCheck, 
  Sparkles, Plus, Search, ExternalLink, QrCode, TrendingUp, Download, Eye, X
} from 'lucide-react';
import { Student, Certificate, Placement, Course } from '../types.js';
import { jsPDF } from 'jspdf';

interface CertificatePlacementProps {
  students: Student[];
  courses: Course[];
  certificates: Certificate[];
  placements: Placement[];
  onIssueCertificate: (cert: Omit<Certificate, 'id' | 'qrCodeUrl'>) => void;
  onRegisterPlacement: (place: Omit<Placement, 'id'>) => void;
  onUpdateCertificate: (id: string, updates: Partial<Certificate>) => void;
}

export default function CertificatePlacement({ 
  students, 
  courses, 
  certificates, 
  placements,
  onIssueCertificate,
  onRegisterPlacement,
  onUpdateCertificate
}: CertificatePlacementProps) {
  const [activeTab, setActiveTab] = useState<'certificates' | 'placements'>('certificates');
  
  // Issuance State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [certTitle, setCertTitle] = useState('Professional IT Completion Certificate');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [grade, setGrade] = useState<'A+' | 'A' | 'B' | 'C'>('A+');

  // Placement Registry State
  const [placeStudentId, setPlaceStudentId] = useState('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [packageLpa, setPackageLpa] = useState<number>(4.5);
  const [interviewDate, setInterviewDate] = useState(new Date().toISOString().split('T')[0]);
  const [placeStatus, setPlaceStatus] = useState<'Placed' | 'Offered' | 'In Process'>('Placed');

  // Verify Simulator
  const [verifyId, setVerifyId] = useState('');
  const [verifyResult, setVerifyResult] = useState<Certificate | null | 'not_found'>(null);

  // View certificate modal
  const [viewCert, setViewCert] = useState<Certificate | null>(null);

  // Filter students who are marked completed
  const completedStudents = students.filter(s => s.status === 'Completed');
  // Filter students for placements
  const eligibleStudents = students.filter(s => s.status === 'Completed' || s.status === 'Active');

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      alert("Please choose a student first.");
      return;
    }

    onIssueCertificate({
      studentId: selectedStudentId,
      issueDate,
      certTitle,
      grade,
      status: 'Active'
    });

    setSelectedStudentId('');
    alert("IT training completion certificate compiled in digital safe.");
  };

  const handlePlacementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeStudentId || !company || !designation) {
      alert("Please fill in Student, Company, and Designation.");
      return;
    }

    onRegisterPlacement({
      studentId: placeStudentId,
      company,
      designation,
      packageLpa,
      interviewDate,
      status: placeStatus
    });

    // Reset
    setPlaceStudentId('');
    setCompany('');
    setDesignation('');
    setPackageLpa(4.5);
    alert("Student corporate hiring record compiled on the placements ledger.");
  };

  const handleVerifyCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyId) return;

    const cert = certificates.find(c => c.id === verifyId.trim() || c.studentId === verifyId.trim());
    if (cert) {
      setVerifyResult(cert);
    } else {
      setVerifyResult('not_found');
    }
  };

  const handleDownloadPDF = (cert: Certificate) => {
    const student = students.find(s => s.id === cert.studentId);
    const studentName = student ? student.name : 'Rahul Sharma';
    
    // Create new Landscape PDF
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 297;
    const pageHeight = 210;

    // Premium Color Palette
    const goldColor = { r: 197, g: 160, b: 89 }; // Elegant gold accent
    const slateColor = { r: 30, g: 41, b: 59 };  // Strong slate text
    const grayColor = { r: 100, g: 116, b: 139 }; // Muted grey details

    // Draw solid back border
    doc.setDrawColor(goldColor.r, goldColor.g, goldColor.b);
    doc.setLineWidth(1.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // Outer gold boundary
    
    doc.setLineWidth(0.5);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24); // Inner parallel thin line

    // Draw premium corner ornaments
    const drawCorner = (x: number, y: number) => {
      doc.setFillColor(goldColor.r, goldColor.g, goldColor.b);
      doc.rect(x - 2, y - 2, 4, 4, 'F');
    };
    drawCorner(12, 12);
    drawCorner(pageWidth - 12, 12);
    drawCorner(12, pageHeight - 12);
    drawCorner(pageWidth - 12, pageHeight - 12);

    // 1. Institution Name Header
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(goldColor.r, goldColor.g, goldColor.b);
    doc.text('MR TECHNOLOGIES TRAINING INSTITUTE', pageWidth / 2, 28, { align: 'center' });

    // Decorative divider line under header
    doc.setDrawColor(goldColor.r, goldColor.g, goldColor.b);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 25, 33, pageWidth / 2 + 25, 33);

    // 2. Main Title
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(slateColor.r, slateColor.g, slateColor.b);
    doc.text('Certificate of Completion', pageWidth / 2, 48, { align: 'center' });

    // 3. Conferred upon text
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(grayColor.r, grayColor.g, grayColor.b);
    doc.text('This digital certificate of academic achievement is proudly conferred upon', pageWidth / 2, 62, { align: 'center' });

    // 4. Student Name
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(slateColor.r, slateColor.g, slateColor.b);
    doc.text(studentName, pageWidth / 2, 78, { align: 'center' });
    
    // Triple elegant line accent under name
    doc.setDrawColor(goldColor.r, goldColor.g, goldColor.b);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 60, 83, pageWidth / 2 + 60, 83);
    doc.line(pageWidth / 2 - 50, 84.5, pageWidth / 2 + 50, 84.5);

    // 5. Training / Cohort Details
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(grayColor.r, grayColor.g, grayColor.b);
    doc.text(
      'for successfully satisfying all course prerequisites, laboratory curriculum projects,\nand exams in respect to the professional training cohort:', 
      pageWidth / 2, 96, 
      { align: 'center', lineHeightFactor: 1.4 }
    );

    // 6. Course Title
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(slateColor.r, slateColor.g, slateColor.b);
    doc.text(cert.certTitle, pageWidth / 2, 118, { align: 'center' });

    // 7. Golden Seal Graphics
    const sealX = pageWidth / 2;
    const sealY = 148;
    
    doc.setDrawColor(goldColor.r, goldColor.g, goldColor.b);
    doc.setLineWidth(0.5);
    for (let i = 0; i < 24; i++) {
      const angle = (i * Math.PI) / 12;
      const x1 = sealX + Math.cos(angle) * 11;
      const y1 = sealY + Math.sin(angle) * 11;
      const x2 = sealX + Math.cos(angle) * 15;
      const y2 = sealY + Math.sin(angle) * 15;
      doc.line(x1, y1, x2, y2);
    }
    
    doc.setFillColor(goldColor.r, goldColor.g, goldColor.b);
    doc.circle(sealX, sealY, 11, 'F');
    
    doc.setFillColor(255, 255, 255);
    doc.circle(sealX, sealY, 9, 'F');
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(goldColor.r, goldColor.g, goldColor.b);
    doc.text('★', sealX, sealY + 2.5, { align: 'center' });

    // 8. Bottom details (Grade / Secure ID)
    const baselineY = 180;

    // Grade
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(grayColor.r, grayColor.g, grayColor.b);
    doc.text('GRADE STATUS', 35, baselineY);
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(slateColor.r, slateColor.g, slateColor.b);
    doc.text(`Grade ${cert.grade} (Distinction)`, 35, baselineY + 6);

    // Reference ID & QR check
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(grayColor.r, grayColor.g, grayColor.b);
    doc.text('SECURE REFERENCE', pageWidth - 90, baselineY);
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(slateColor.r, slateColor.g, slateColor.b);
    doc.text(`REF ID: ${cert.id}`, pageWidth - 90, baselineY + 6);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(grayColor.r, grayColor.g, grayColor.b);
    doc.text(`Issued On: ${cert.issueDate}`, pageWidth - 90, baselineY + 11);

    // Save as local PDF file
    doc.save(`Certificate_${studentName.replace(/\s+/g, '_')}_${cert.id}.pdf`);
  };

  // Stats
  const placedCount = placements.filter(p => p.status === 'Placed').length;
  const activeOffersCount = placements.filter(p => p.status === 'Offered').length;
  
  const validPackages = placements
    .map(p => {
      const val = p.packageLpa !== undefined ? p.packageLpa : p.package;
      if (val === undefined || val === null) return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    })
    .filter(val => val > 0);

  const avgPackage = validPackages.length > 0 
    ? (validPackages.reduce((sum, val) => sum + val, 0) / validPackages.length).toFixed(1)
    : "5.5";
  const maxPackage = validPackages.length > 0 
    ? Math.max(...validPackages).toFixed(1)
    : "12.0";

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Credentials & Placement Cell</h2>
        <p className="text-slate-400 text-xs">Verify academic certificates, issue transcripts, and schedule corporate recruitment drives.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${activeTab === 'certificates' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Certification Safe ({certificates.length})
        </button>
        <button 
          onClick={() => setActiveTab('placements')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${activeTab === 'placements' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Corporate Placements Cell ({placements.length})
        </button>
      </div>

      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Certificate safe registry */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              Issue Course Completed Certificate
            </h3>

            <form onSubmit={handleIssueSubmit} className="space-y-4 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-slate-500 font-semibold mb-1">SELECT COMPLETED GRAD STUDENT *</label>
                  <select 
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 outline-hidden focus:bg-white focus:border-blue-500"
                  >
                    <option value="">-- Choose Completed Student --</option>
                    {completedStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">CERTIFICATE DECORATIVE TITLE</label>
                  <input 
                    type="text"
                    value={certTitle}
                    onChange={e => setCertTitle(e.target.value)}
                    placeholder="e.g. Master in Web Technology"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">GRADE EARNED</label>
                  <select 
                    value={grade}
                    onChange={e => setGrade(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold outline-hidden focus:bg-white focus:border-blue-500"
                  >
                    <option value="A+">Grade A+ (Distinction)</option>
                    <option value="A">Grade A (Excellent)</option>
                    <option value="B">Grade B (Good)</option>
                    <option value="C">Grade C (Satisfactory)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">CREDENTIAL ISSUE DATE</label>
                  <input 
                    type="date"
                    value={issueDate}
                    onChange={e => setIssueDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs cursor-pointer transition-colors shadow-sm"
              >
                Sign & Transmit Digital Certificate
              </button>
            </form>

            {/* Issued table */}
            <div className="pt-4 border-t border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-2">Issued Credentials Vault</span>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-500">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-medium">
                      <th className="pb-2">Certificate ID</th>
                      <th className="pb-2">Student</th>
                      <th className="pb-2">Title</th>
                      <th className="pb-2 text-center">Grade</th>
                      <th className="pb-2 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {certificates.map(cert => {
                      const stud = students.find(s => s.id === cert.studentId);
                      return (
                        <tr key={cert.id} className="hover:bg-slate-50/40">
                          <td className="py-2.5 font-mono text-[10px] font-bold text-slate-700">{cert.id}</td>
                          <td className="py-2.5 font-medium text-slate-800">{stud?.name || cert.studentId}</td>
                          <td className="py-2.5 text-slate-600">{cert.certTitle}</td>
                          <td className="py-2.5 text-center">
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 font-bold rounded text-[10px]">{cert.grade}</span>
                          </td>
                          <td className="py-2.5 text-right">
                            <button 
                              onClick={() => setViewCert(cert)}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                              Open
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Certificate Verification Portal Simulator */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-fit space-y-6">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm border-b border-slate-50 pb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                Certificate Verification Portal
              </h4>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Enter any Certificate Reference ID to simulate corporate backgrounds check validation.
              </p>

              <form onSubmit={handleVerifyCheck} className="space-y-2">
                <div className="relative">
                  <input 
                    type="text"
                    value={verifyId}
                    onChange={e => setVerifyId(e.target.value)}
                    placeholder="Enter Reference Cert ID..."
                    className="w-full text-xs text-slate-700 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-blue-500"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Verify Authenticity
                </button>
              </form>

              {/* Verify Results */}
              {verifyResult && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans">
                  {verifyResult === 'not_found' ? (
                    <div className="text-rose-600 font-semibold flex items-center gap-1">
                      Invalid Certificate Hash Code
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-emerald-600 font-bold flex items-center gap-1 uppercase tracking-wide text-[10px]">
                        ✓ Verified Authentic Credential
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">STUDENT REGISTERED</span>
                        <span className="font-semibold text-slate-800 block">{students.find(s => s.id === verifyResult.studentId)?.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">DECORATIVE TITLE</span>
                        <span className="font-semibold text-slate-700 block">{verifyResult.certTitle}</span>
                      </div>
                      <div className="flex justify-between text-[11px] pt-1.5 border-t border-slate-200">
                        <span>GRADE: {verifyResult.grade}</span>
                        <span>ISSUED: {verifyResult.issueDate}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2 pt-3 shrink-0">
              <QrCode className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-normal">
                Every generated certificate features an embedded QR code checksum to assure physical/digital authenticity checks.
              </p>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'placements' && (
        <div className="space-y-6">
          
          {/* Metrics header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Hires Registered</span>
                <span className="text-lg font-bold text-slate-800">{placedCount}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Average Package</span>
                <span className="text-lg font-bold text-slate-800">{avgPackage} LPA</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Highest Package</span>
                <span className="text-lg font-bold text-slate-800">{maxPackage} LPA</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-violet-50 text-violet-600 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Active Placement Offers</span>
                <span className="text-lg font-bold text-slate-800">{activeOffersCount}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Placements Ledger Table */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-800 text-sm">Corporate Recruitment Ledger</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-500">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-medium bg-slate-50/50">
                      <th className="px-3 py-2">Student</th>
                      <th className="px-3 py-2">Corporate Partner</th>
                      <th className="px-3 py-2">Designation</th>
                      <th className="px-3 py-2 text-right">Compensation</th>
                      <th className="px-3 py-2 text-center">Date</th>
                      <th className="px-3 py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {placements.map(place => {
                      const stud = students.find(s => s.id === place.studentId);
                      const displayCompany = place.company || place.companyName || "N/A";
                      const displayDesignation = place.designation || place.jobRole || "N/A";
                      const displayPackage = place.packageLpa !== undefined ? place.packageLpa : place.package;
                      const displayDate = place.interviewDate || place.joiningDate || "N/A";
                      return (
                        <tr key={place.id} className="hover:bg-slate-50/40">
                          <td className="px-3 py-3 font-semibold text-slate-800">{stud?.name || place.studentName || place.studentId}</td>
                          <td className="px-3 py-3 text-slate-700 font-medium">{displayCompany}</td>
                          <td className="px-3 py-3 text-slate-500">{displayDesignation}</td>
                          <td className="px-3 py-3 text-right font-bold text-emerald-600">{displayPackage !== undefined ? `${displayPackage} LPA` : "N/A"}</td>
                          <td className="px-3 py-3 text-center font-mono text-slate-400 text-[10px]">{displayDate}</td>
                          <td className="px-3 py-3 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              place.status === 'Placed' ? 'bg-emerald-50 text-emerald-700' :
                              place.status === 'Offered' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {place.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Register placement form */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                Register Placement Event
              </h3>

              <form onSubmit={handlePlacementSubmit} className="space-y-4 text-xs text-slate-600">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">SELECT PLACED STUDENT *</label>
                  <select 
                    value={placeStudentId}
                    onChange={e => setPlaceStudentId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium outline-hidden text-slate-700 focus:bg-white focus:border-blue-500"
                  >
                    <option value="">-- Choose Student --</option>
                    {eligibleStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">HIRING COMPANY *</label>
                  <input 
                    type="text"
                    required
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Amazon, TCS, Deloitte"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">DESIGNATION OFFERED *</label>
                  <input 
                    type="text"
                    required
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    placeholder="e.g. Associate Software Engineer"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">SALARY (LPA) *</label>
                    <input 
                      type="number"
                      required
                      step="0.1"
                      value={packageLpa || ''}
                      onChange={e => setPackageLpa(Number(e.target.value))}
                      placeholder="e.g. 6.5"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">HIRING STATUS</label>
                    <select 
                      value={placeStatus}
                      onChange={e => setPlaceStatus(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden font-medium focus:bg-white focus:border-blue-500"
                    >
                      <option value="Placed">Placed (Joined)</option>
                      <option value="Offered">Offer Released</option>
                      <option value="In Process">In Discussion</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">OFFER RELEASE DATE</label>
                  <input 
                    type="date"
                    value={interviewDate}
                    onChange={e => setInterviewDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-blue-500"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg text-xs cursor-pointer transition-colors shadow-sm"
                >
                  Register Placement Contract
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* DETAILED PRINTABLE CERTIFICATE LIGHTBOX MODAL */}
      {viewCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 border border-amber-100 relative animate-fade-in text-center font-serif">
            
            <button 
              onClick={() => setViewCert(null)}
              className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5 font-sans" />
            </button>

            {/* Certificate border frame decoration */}
            <div className="border-8 border-double border-amber-600/30 p-8 space-y-6">
              
              <div className="space-y-1">
                <span className="text-amber-700 tracking-widest text-xs font-semibold font-sans block uppercase">MR Technologies Training Institute</span>
                <h1 className="text-2xl font-bold text-slate-900">Certificate of Completion</h1>
              </div>

              <div className="space-y-4 font-sans text-xs text-slate-500">
                <p className="italic text-sm">This digital certificate of academic achievement is proudly conferred upon</p>
                <h2 className="text-xl font-bold text-slate-800 font-serif my-3 underline decoration-amber-500 decoration-wavy">
                  {students.find(s => s.id === viewCert.studentId)?.name || 'Rahul Sharma'}
                </h2>
                <p className="leading-relaxed">
                  for successfully satisfying all course prerequisites, laboratory curriculum projects, and exams in respect to the professional training cohort:
                </p>
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide font-sans">{viewCert.certTitle}</h3>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8 text-xs font-sans text-slate-500 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">GRADE STATUS</span>
                  <span className="font-semibold text-slate-800 block mt-1">Grade {viewCert.grade} (Pass)</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-slate-800" />
                  </div>
                  <span className="text-[8px] text-slate-400 block mt-1">Verification QR Code</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">SECURE REFERENCE</span>
                  <span className="font-mono text-slate-800 block mt-1 truncate">{viewCert.id}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Signed: {viewCert.issueDate}</span>
                </div>
              </div>

            </div>

            <div className="flex gap-2 pt-6 font-sans">
              <button 
                onClick={() => handleDownloadPDF(viewCert)}
                className="flex-1 py-2 border border-slate-100 hover:border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer bg-white"
              >
                <Download className="w-3.5 h-3.5" />
                Download Certificate PDF
              </button>
              <button 
                onClick={() => setViewCert(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Dismiss Modal
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

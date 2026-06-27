/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, Database, ShieldAlert, FileCode, CheckCircle, 
  HelpCircle, RefreshCw, Save, Clock, Trash2, Key, Globe, Mail, Phone, MapPin
} from 'lucide-react';
import { InstituteSettings, AuditLog } from '../types.js';

interface AdminSettingsProps {
  settings: InstituteSettings;
  auditLogs: AuditLog[];
  onUpdateSettings: (updates: Partial<InstituteSettings>) => void;
  onBackupDatabase: () => void;
  onRestoreDatabase: (backupName: string) => void;
}

export default function AdminSettings({ 
  settings, 
  auditLogs, 
  onUpdateSettings,
  onBackupDatabase,
  onRestoreDatabase 
}: AdminSettingsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'backups'>('profile');

  // Form States
  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [gstNo, setGstNo] = useState(settings.gstNo);
  const [currency, setCurrency] = useState(settings.currency);

  const [backups, setBackups] = useState([
    { name: 'MR_Tech_ERP_Seeded_Backup_20260627.json', date: '2026-06-27 01:10', size: '24 KB', students: 5, status: 'Stored' },
    { name: 'MR_Tech_ERP_Daily_Snapshot_20260626.json', date: '2026-06-26 18:30', size: '23 KB', students: 5, status: 'Stored' }
  ]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      name,
      email,
      phone,
      address,
      gstNo,
      currency
    });
    alert("Institute parameters updated successfully.");
  };

  const handleTriggerBackup = () => {
    onBackupDatabase();
    // Simulate updating backup ledger locally too
    const newBackup = {
      name: `MR_Tech_ERP_Instant_Backup_${new Date().toISOString().replace(/[-:T]/g, '').split('.')[0]}.json`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      size: '25 KB',
      students: 5,
      status: 'Active'
    };
    setBackups(prev => [newBackup, ...prev]);
    alert("Local database backup catalog compiled successfully.");
  };

  const handleTriggerRestore = (backupName: string) => {
    if (confirm(`Are you sure you want to restore database state from ${backupName}? This will reset live tables.`)) {
      onRestoreDatabase(backupName);
      alert("Database snapshot restored and live state reconciled.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      
      {/* Sidebar Controls */}
      <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-fit space-y-1">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-3 px-2">Settings Group</span>
        
        <button 
          onClick={() => setActiveTab('profile')}
          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'profile' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          Institute Profile
        </button>

        <button 
          onClick={() => setActiveTab('security')}
          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'security' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Key className="w-4 h-4 shrink-0" />
          System & Audit Logs
        </button>

        <button 
          onClick={() => setActiveTab('backups')}
          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'backups' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Database className="w-4 h-4 shrink-0" />
          Backups & Recovery
        </button>
      </div>

      {/* Main Content Pane */}
      <div className="lg:col-span-9 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Institute Profile & Parameters</h3>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs text-slate-600 font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">INSTITUTE BUSINESS NAME *</label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">COMPLIANT GST NO *</label>
                  <input 
                    type="text"
                    required
                    value={gstNo}
                    onChange={e => setGstNo(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">PRIMARY SUPPORT EMAIL *</label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">PRIMARY SUPPORT PHONE *</label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input 
                      type="text"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-500 font-semibold mb-1">HEADQUARTERS ADDRESS</label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input 
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">CURRENCY SYMBOL</label>
                  <input 
                    type="text"
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                Save Profile Parameters
              </button>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">System Audit Logs</h3>
            <p className="text-slate-400 text-[10px] font-sans">
              Reconcile dynamic ledger audit activities logged by admin security.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-500 border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-medium">
                    <th className="px-3 py-2">Timestamp</th>
                    <th className="px-3 py-2">Operator</th>
                    <th className="px-3 py-2">Module</th>
                    <th className="px-3 py-2">Action Executed</th>
                    <th className="px-3 py-2 text-right">Node Host IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30">
                      <td className="px-3 py-2.5 font-mono text-[10px] text-slate-400">{log.timestamp}</td>
                      <td className="px-3 py-2.5 font-semibold text-slate-800">{log.user}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] uppercase font-bold tracking-wider">{log.module}</span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{log.action}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-slate-400 text-[10px]">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'backups' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Database Backups & Disaster Recovery</h3>
              <button 
                onClick={handleTriggerBackup}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 transition-colors shadow-xs"
              >
                <RefreshCw className="w-3 h-3" />
                Snapshot Database
              </button>
            </div>

            <p className="text-slate-400 text-[10px] font-sans">
              Snapshot or restore database files instantly to prevent corporate asset data losses.
            </p>

            <div className="space-y-3 pt-2 font-sans">
              {backups.map((backup, index) => (
                <div key={index} className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg flex items-center justify-between text-xs shadow-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block truncate max-w-[280px]">{backup.name}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{backup.date} | {backup.size} | {backup.students} students</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleTriggerRestore(backup.name)}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-semibold text-[10px] cursor-pointer transition-colors"
                    >
                      Restore Snapshot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

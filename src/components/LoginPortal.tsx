import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, UserCheck, KeyRound, ArrowRight, AlertCircle, Info, ShieldAlert, Eye, EyeOff
} from 'lucide-react';
import { UserRole, UserSession } from '../types.js';

interface LoginPortalProps {
  onLoginSuccess: (session: UserSession) => void;
  instituteName: string;
}

export default function LoginPortal({ onLoginSuccess, instituteName }: LoginPortalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('super-admin');
  const [pin, setPin] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Default credentials for testing
  const roleConfig = {
    'super-admin': {
      title: 'Super Admin',
      subtitle: 'Full System Control',
      pin: '8888',
      description: 'Complete read-write privileges across all nodes, full access to database backups, system configurations, audit trails, and financial settings.',
      color: 'blue',
      badgeClass: 'bg-blue-50 text-blue-700 border border-blue-100',
      icon: ShieldCheck,
      details: [
        'Read & Write access to all modules',
        'Database backup & restore capabilities',
        'Audit logs visibility',
        'Update institutional credentials'
      ]
    },
    'admin': {
      title: 'Academic Admin',
      subtitle: 'General Operations',
      pin: '5555',
      description: 'Operational control of students, batches, attendance logs, payments ledger, and placement dashboards. Restricts access to low-level settings backups.',
      color: 'indigo',
      badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
      icon: UserCheck,
      details: [
        'Admissions & Payment collections',
        'Issue certificates & register placements',
        'Query the Strategic AI Assistant',
        'Locked: Administrative system settings'
      ]
    },
    'front-office-executive': {
      title: 'Front Office Executive',
      subtitle: 'Admissions & Inquiries',
      pin: '1111',
      description: 'Frontline administrative tasks: register prospective students, process tuition invoices, browse courses, and manage inquiries. Strictly read-only on core logs.',
      color: 'amber',
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-100',
      icon: KeyRound,
      details: [
        'Register students & take payments',
        'Check course catalog & batch listings',
        'Locked: Deleting records is forbidden',
        'Locked: No AI access, certificates, or backups'
      ]
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const config = roleConfig[selectedRole];
    
    if (pin === config.pin) {
      // Create session
      const session: UserSession = {
        role: selectedRole,
        name: selectedRole === 'super-admin' ? 'Ram Prasad (Super)' : selectedRole === 'admin' ? 'Anjali Rao (Admin)' : 'Suresh Kumar (Executive)',
        email: selectedRole === 'super-admin' ? 'ramprasadsuthi@gmail.com' : selectedRole === 'admin' ? 'anjali.rao@mrtechnologies.com' : 'suresh.k@mrtechnologies.com',
        avatar: selectedRole === 'super-admin' ? 'RP' : selectedRole === 'admin' ? 'AR' : 'SK'
      };
      
      setError(null);
      onLoginSuccess(session);
    } else {
      setError(`Invalid security PIN for ${config.title}. Try using "${config.pin}" for evaluation.`);
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    const config = roleConfig[role];
    const session: UserSession = {
      role,
      name: role === 'super-admin' ? 'Ram Prasad (Super)' : role === 'admin' ? 'Anjali Rao (Admin)' : 'Suresh Kumar (Executive)',
      email: role === 'super-admin' ? 'ramprasadsuthi@gmail.com' : role === 'admin' ? 'anjali.rao@mrtechnologies.com' : 'suresh.k@mrtechnologies.com',
      avatar: role === 'super-admin' ? 'RP' : role === 'admin' ? 'AR' : 'SK'
    };
    
    setError(null);
    onLoginSuccess(session);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      
      {/* Background ambient accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-4xl z-10 flex flex-col gap-6">
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 mb-1">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{instituteName || "MR Technologies"}</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Secure multi-role portal for institutional enterprise resource planning and student life cycle analytics.
          </p>
        </div>

        {/* Roles grid and credential entry split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
          
          {/* LEFT: Role selection cards (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Auth Role</span>
              <span className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 font-mono">3 Roles Defined</span>
            </div>

            <div className="space-y-3.5">
              {(Object.keys(roleConfig) as UserRole[]).map((roleKey) => {
                const conf = roleConfig[roleKey];
                const Icon = conf.icon;
                const isSelected = selectedRole === roleKey;
                
                return (
                  <div
                    key={roleKey}
                    onClick={() => {
                      setSelectedRole(roleKey);
                      setPin('');
                      setError(null);
                    }}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex gap-4 ${
                      isSelected 
                        ? 'bg-slate-900/90 border-blue-500 shadow-md shadow-blue-500/5' 
                        : 'bg-transparent border-slate-800 hover:border-slate-700 hover:bg-slate-900/30'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg self-start ${
                      isSelected 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-900 text-slate-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-slate-200">{conf.title}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${conf.badgeClass}`}>
                          PIN: {conf.pin}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{conf.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Login Form (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 pt-6 lg:pt-0 lg:pl-6 space-y-6">
            
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Authentication Node</span>
              </div>

              {/* Security info card */}
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-blue-400">
                  <Info className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">{roleConfig[selectedRole].title} Keys</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Privilege levels will adapt directly to matching roles once successfully resolved.
                </p>
                <div className="pt-1.5 space-y-1">
                  {roleConfig[selectedRole].details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-300">
                      <div className={`w-1 h-1 rounded-full ${detail.startsWith('Locked:') ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <span className="truncate">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pin verification form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3 pt-1">
                <div>
                  <label htmlFor="pin-input" className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                    Enter Role Security PIN (Demo: {roleConfig[selectedRole].pin})
                  </label>
                  <div className="relative">
                    <input
                      id="pin-input"
                      type={showPin ? "text" : "password"}
                      value={pin}
                      maxLength={6}
                      onChange={(e) => {
                        setPin(e.target.value.replace(/\D/g, ''));
                        setError(null);
                      }}
                      placeholder={`🔑 Try ${roleConfig[selectedRole].pin}`}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono tracking-widest focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-2.5 bg-red-950/40 border border-red-900 text-red-400 rounded-lg flex items-start gap-2 text-[10px]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="leading-normal">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>Authenticate Secure PIN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Quick Demo Bypass */}
            <div className="pt-4 border-t border-slate-900 flex flex-col gap-2">
              <span className="text-[10px] text-slate-500 text-center block">Evaluation Quick Sandbox Login:</span>
              <button
                type="button"
                onClick={() => handleQuickLogin(selectedRole)}
                className="w-full py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Bypass PIN & Enter as {roleConfig[selectedRole].title}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Security watermark */}
        <div className="text-center">
          <span className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">
            MR Technologies ERP Secure Access Node v3.12 • RFC 4122 Standard
          </span>
        </div>

      </div>

    </div>
  );
}

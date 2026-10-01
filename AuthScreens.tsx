/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { School, UserCheck, Shield, ChevronRight, AlertTriangle, Key } from 'lucide-react';

interface AuthScreensProps {
  initialScreen: 'login' | 'register';
  onAuthSuccess: (user: any) => void;
  onToggleScreen: (screen: 'login' | 'register') => void;
  onGoBack: () => void;
}

export default function AuthScreens({
  initialScreen,
  onAuthSuccess,
  onToggleScreen,
  onGoBack
}: AuthScreensProps) {
  const [screen, setScreen] = useState<'login' | 'register'>(initialScreen);
  
  // Login input states
  const [identityEmail, setIdentityEmail] = useState('');
  const [identityPass, setIdentityPass] = useState('');
  
  // Registration States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regRole, setRegRole] = useState<'student' | 'lecturer'>('student');
  const [regDept, setRegDept] = useState('Computer Science');
  const [regCourse, setRegCourse] = useState('Introduction to AI');

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identityEmail, password: identityPass })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication Failed');
      }

      onAuthSuccess(data.user);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPass,
          role: regRole,
          department: regDept,
          course: regRole === 'lecturer' ? regCourse : 'Introduction to AI' // Default or selected
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration Failed');
      }

      alert('Account configured successfully! Redirecting to dashboard...');
      onAuthSuccess(data.user);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Demo Assist Tooltip logs
  const quickFills = [
    { label: 'Admin (Dean)', email: 'admin@regent.edu', pass: 'password123' },
    { label: 'Lecturer (Staff)', email: 'dr.smith@regent.edu', pass: 'password123' },
    { label: 'Student John Doe', email: 'john.doe@regent.edu', pass: 'password123' },
    { label: 'At-Risk Student Clara', email: 'clara.oswald@regent.edu', pass: 'password123' }
  ];

  const applyQuickFill = (email: string, pass: string) => {
    setIdentityEmail(email);
    setIdentityPass(pass);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative">
      {/* Absolute Header with back option */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onGoBack}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          ← Gateways Page
        </button>
      </div>

      <div className="w-full max-w-4xl bg-slate-950/20 border border-slate-800 rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl">
        
        {/* Visual Brand Section left */}
        <div className="p-8 md:p-12 bg-linear-to-b from-slate-950 to-slate-900 border-r border-slate-800 flex flex-col justify-between text-white">
          <div className="space-y-4">
            <div className="bg-[#1e3a8a] w-11 h-11 rounded flex items-center justify-center text-white mb-6 shadow-md shadow-blue-600/10">
              <School className="w-6 h-6" />
            </div>
            <span className="text-[10px] tracking-widest text-[#1e3a8a] font-extrabold uppercase font-mono">
              PREDICTOR MODEL SECURITY
            </span>
            <h2 className="text-xl md:text-2xl font-black leading-snug tracking-tight">
              Regent State University Admin Portal.
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Log into your personalized dashboard as Student, Staff Lecturer or Admin to update student assessment scores, run machine forecasts or download performance audits.
            </p>
          </div>

          {/* Quick Demo Assist triggers */}
          {screen === 'login' && (
            <div className="mt-8 border-t border-slate-800 pt-6 space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-400" /> Quick Authenticator Assisted Fills
              </span>
              <div className="grid grid-cols-2 gap-2">
                {quickFills.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyQuickFill(q.email, q.pass)}
                    className="p-2 border border-slate-800 rounded text-left text-[10px] hover:bg-slate-800 hover:border-slate-750 transition space-y-0.5 group cursor-pointer"
                  >
                    <span className="block font-bold text-slate-300 group-hover:text-blue-400">{q.label}</span>
                    <span className="block text-[8px] text-slate-500 font-mono truncate">{q.email}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Form right */}
        <div className="p-8 md:p-12 bg-slate-950 flex flex-col justify-center">
          
          {/* Header toggles */}
          <div className="flex space-x-4 mb-6 pb-4 border-b border-slate-900 text-slate-400 text-xs font-bold">
            <button
              onClick={() => { setScreen('login'); setErrorMessage(''); }}
              className={`pb-2 outline-hidden cursor-pointer ${screen === 'login' ? 'text-blue-400 border-b-2 border-blue-400' : ''}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setScreen('register'); setErrorMessage(''); }}
              className={`pb-2 outline-hidden cursor-pointer ${screen === 'register' ? 'text-blue-400 border-b-2 border-blue-400' : ''}`}
            >
              Self-Register
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded mb-5 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4.5 h-4.5" /> {errorMessage}
            </div>
          )}

          {screen === 'login' ? (
            /* Login forms */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Institutional Email Address</label>
                <input
                  type="email"
                  placeholder="e.g., john.doe@regent.edu"
                  value={identityEmail}
                  onChange={e => setIdentityEmail(e.target.value)}
                  required
                  className="w-full text-xs text-white px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Security Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={identityPass}
                  onChange={e => setIdentityPass(e.target.value)}
                  required
                  className="w-full text-xs text-white px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1e3a8a] hover:bg-blue-900 font-extrabold text-white text-xs py-3 rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading ? 'Validating credentials...' : 'Authenticate Account'} <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Register form fields */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Your Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Mary Rose"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    required
                    className="w-full text-xs text-white px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-md focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Authority Role</label>
                  <select
                    value={regRole}
                    onChange={e => setRegRole(e.target.value as any)}
                    className="w-full text-xs text-white px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-md focus:outline-hidden"
                  >
                    <option value="student">Student Intake</option>
                    <option value="lecturer">Staff Lecturer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">University Email</label>
                <input
                  type="email"
                  placeholder="name@regent.edu"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  required
                  className="w-full text-xs text-white px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-md focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Choose Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={regPass}
                  onChange={e => setRegPass(e.target.value)}
                  required
                  className="w-full text-xs text-white px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-md focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Faculty Dept</label>
                  <select
                    value={regDept}
                    onChange={e => setRegDept(e.target.value)}
                    className="w-full text-xs text-white px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-md focus:outline-hidden"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Lecturer Subject Course</label>
                  <select
                    value={regCourse}
                    onChange={e => setRegCourse(e.target.value)}
                    className="w-full text-xs text-white px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-md focus:outline-hidden"
                    disabled={regRole === 'student'}
                  >
                    <option value="Introduction to AI">Introduction to AI</option>
                    <option value="Predictive Analytics">Predictive Analytics</option>
                    <option value="Engineering Statistics">Engineering Statistics</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1e3a8a] text-white hover:bg-blue-900 font-extrabold text-xs py-3 rounded-md transition flex items-center justify-center gap-1.5 mt-2 cursor-pointer animate-none"
              >
                {loading ? 'Creating record...' : 'Confirm Self-Registration'} <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-[10px] text-slate-500 font-bold text-center mt-6 uppercase tracking-wider">
            Regent State University Admin System security protocol.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  BrainCircuit, 
  TrendingUp, 
  ChevronRight, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  Users, 
  Activity,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onStartLogin: () => void;
  onStartRegister: () => void;
}

export default function LandingPage({ onStartLogin, onStartRegister }: LandingPageProps) {
  // Sandbox state
  const [attendance, setAttendance] = useState(85);
  const [assignment, setAssignment] = useState(78);
  const [test, setTest] = useState(72);
  const [hours, setHours] = useState(12);
  const [subRate, setSubRate] = useState(90);

  // Live sandbox mathematical formula calculations matching server.ts standard
  const sandboxAps = (0.25 * attendance) + (0.25 * assignment) + (0.30 * test) + (0.10 * subRate) + (0.10 * Math.min(hours * 5, 100));
  
  let sandboxStatus: 'Excellent' | 'Average' | 'At Risk' | 'Fail' = 'Average';
  let bannerBgColor = 'bg-[#1e3a8a] border border-blue-900';
  let statusBadgeColor = 'bg-blue-100 text-[#1e3a8a]';
  
  if (sandboxAps >= 85) {
    sandboxStatus = 'Excellent';
    bannerBgColor = 'bg-emerald-805 bg-emerald-800 border-emerald-900';
    statusBadgeColor = 'bg-emerald-50 text-emerald-800';
  } else if (sandboxAps >= 65) {
    sandboxStatus = 'Average';
    bannerBgColor = 'bg-[#1e3a8a] border-blue-900';
    statusBadgeColor = 'bg-blue-50 text-[#1e3a8a]';
  } else if (sandboxAps >= 45) {
    sandboxStatus = 'At Risk';
    bannerBgColor = 'bg-amber-705 bg-amber-750 border-amber-800';
    statusBadgeColor = 'bg-amber-50 text-amber-900';
  } else {
    sandboxStatus = 'Fail';
    bannerBgColor = 'bg-rose-750 border-rose-800';
    statusBadgeColor = 'bg-rose-50 text-rose-900';
  }

  let sandboxGpa = Math.round(((sandboxAps / 100) * 4.0) * 10) / 10;
  if (sandboxGpa > 4.0) sandboxGpa = 4.0;
  if (sandboxGpa < 0.0) sandboxGpa = 0.0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Banner header */}
      <nav className="bg-slate-900 border-b border-slate-800 py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[#1e3a8a] p-2 rounded text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-white hover:opacity-90 leading-none">REGENT STATE UNIVERSITY</span>
              <p className="text-[9px] text-slate-400 font-bold tracking-widest leading-none mt-0.5">ACADEMIC FORECAST SYSTEM</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={onStartLogin}
              className="px-4 py-2 border border-slate-700 font-bold text-slate-300 rounded-md hover:bg-slate-800 hover:text-white transition duration-150 cursor-pointer"
            >
              Staff & Student Sign-In
            </button>
            <button
              onClick={onStartRegister}
              className="px-4 py-2 bg-[#1e3a8a] hover:bg-[#1a365d] font-extrabold text-white rounded-md transition duration-150 cursor-pointer"
            >
              Self-Register Portal
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Intro section */}
      <section className="bg-slate-900 text-white pt-20 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">
              <BrainCircuit className="w-3.5 h-3.5" /> Next-Gen Retention Predictive Models
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              Predict Student Success. <br />
              <span className="text-blue-400">Empower Academic Journeys.</span>
            </h1>
            <p className="text-slate-300 text-base leading-relaxed">
              Regent Varsity's performance analytics suite employs predictive regression metrics to estimate student retention limits and GPA developments based on current homework rates, test indexes, attendance records, and study habits.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onStartLogin}
                className="bg-[#1e3a8a] hover:bg-blue-900 font-black px-6 py-3.5 text-xs tracking-wide rounded-md inline-flex items-center gap-2 shadow-lg shadow-blue-600/10 transition cursor-pointer"
              >
                Access Dashboard <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={onStartRegister}
                className="border border-slate-700 text-slate-200 font-bold px-6 py-3.5 text-xs rounded-md hover:bg-slate-800/55 transition cursor-pointer"
              >
                Enroll as Student
              </button>
            </div>
          </div>

          {/* Feature Badge Grid */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white/5 border border-white/10 p-5 rounded-lg space-y-3">
              <div className="w-10 h-10 rounded bg-[#1e3a8a]/20 text-blue-400 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Supervised Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Runs dynamic regression indices against attendance, study intervals, and assignments scores to target retention risks.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 rounded-lg space-y-3">
              <div className="w-10 h-10 rounded bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Staff Control Panel</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Allows professors to maintain gradebooks, identify border-line learners, and fine-tune tutoring programs.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 rounded-lg space-y-3">
              <div className="w-10 h-10 rounded bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Coaching Hub</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Delivers adaptive tips and study hour metrics informing students of required targets to hit target score bands.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 rounded-lg space-y-3">
              <div className="w-10 h-10 rounded bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Department Auditing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Configures comprehensive analytics reports filterable by faculty, allowing coordinators to audit student retention curves.</p>
            </div>
          </div>
        </div>

        {/* Diagonal background slant decoration */}
        <div className="absolute inset-0 bg-linear-to-tr from-blue-950/20 to-transparent pointer-events-none" />
      </section>

      {/* Interactive Live Sandbox Simulator SECTION */}
      <section className="max-w-4xl mx-auto -mt-12 mb-16 px-6 relative z-20 w-full">
        <div className="bg-white rounded-lg shadow-md border border-[#e2e8f0] p-6 md:p-8">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[10px] font-extrabold text-blue-600 tracking-wider uppercase">VISITOR DEMO PLATFORM</span>
            <h2 className="text-xl font-extrabold text-slate-900">Try the Live Predictive Sandbox</h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              Instantly simulate any student's metrics below. Adjust attendance, test stats, or hours to see the live classification update dynamically!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Range Controls */}
            <div className="space-y-4">
              {/* Attendance */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-500" /> Attendance:</span>
                  <span className="font-mono text-[#1e3a8a] font-black">{attendance}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={attendance}
                  onChange={e => setAttendance(Number(e.target.value))}
                  className="w-full h-1 bg-slate-105 rounded appearance-none cursor-pointer accent-[#1e3a8a]"
                />
              </div>

              {/* Assignment Averages */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-blue-500" /> Homework & Tasks:</span>
                  <span className="font-mono text-[#1e3a8a] font-black">{assignment} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={assignment}
                  onChange={e => setAssignment(Number(e.target.value))}
                  className="w-full h-1 bg-slate-105 rounded appearance-none cursor-pointer accent-[#1e3a8a]"
                />
              </div>

              {/* Test Averages */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-blue-500" /> Test & Exam Scores:</span>
                  <span className="font-mono text-[#1e3a8a] font-black">{test} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={test}
                  onChange={e => setTest(Number(e.target.value))}
                  className="w-full h-1 bg-slate-105 rounded appearance-none cursor-pointer accent-[#1e3a8a]"
                />
              </div>

              {/* Study Hours */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> Study Hours / Week:</span>
                  <span className="font-mono text-[#1e3a8a] font-black">{hours} hours</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={hours}
                  onChange={e => setHours(Number(e.target.value))}
                  className="w-full h-1 bg-slate-105 rounded appearance-none cursor-pointer accent-[#1e3a8a]"
                />
              </div>

              {/* Submission Rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-blue-500" /> Task Submissions:</span>
                  <span className="font-mono text-[#1e3a8a] font-black">{subRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={subRate}
                  onChange={e => setSubRate(Number(e.target.value))}
                  className="w-full h-1 bg-slate-105 rounded appearance-none cursor-pointer accent-[#1e3a8a]"
                />
              </div>
            </div>

            {/* Output Panel visual */}
            <div className={`p-6 rounded-lg ${bannerBgColor} text-white space-y-5 shadow-inner transition-all duration-300`}>
              <div className="flex justify-between items-center pb-3 border-b border-white/20">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/85">Prediction Status</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${statusBadgeColor}`}>
                  {sandboxStatus}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-white/70 text-[10px] uppercase font-bold tracking-wider block">Estimated GPA</span>
                  <span className="text-4xl font-black block mt-0.5 font-mono tracking-tight">{sandboxGpa} <span className="text-base text-white/80">/ 4.0</span></span>
                </div>

                <div>
                  <span className="text-white/70 text-[10px] uppercase font-bold tracking-wider block">Academic Performance Index</span>
                  <span className="text-xl font-extrabold block mt-0.5">{Math.round(sandboxAps)}% <span className="text-xs text-white/80 font-semibold">(Weighted Mean)</span></span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 text-[11px] leading-relaxed text-white/80 flex items-start gap-1.5">
                <BrainCircuit className="w-4.5 h-4.5 flex-shrink-0 text-white" />
                <span>
                  Weighted Weights: 25% attendance, 25% homework assignments, 30% midterm test grades, 10% submission quantities, 10% study hour frequency profiles.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Mini footer */}
      <footer className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-400 py-10 px-6 text-xs text-center">
        <div className="max-w-7xl mx-auto space-y-3">
          <p>© 2026 Regent State University • Academic Performance Predictor Console Portals</p>
          <div className="flex justify-center space-x-4 font-semibold text-slate-300">
            <button onClick={onStartLogin} className="hover:text-blue-400 text-xs">Standard Entrance</button>
            <span>•</span>
            <button onClick={onStartRegister} className="hover:text-blue-400 text-xs">Registrations Office</button>
            <span>•</span>
            <span className="text-[10px] text-slate-500 font-normal">Supervised Modeling Frameworks v2.1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

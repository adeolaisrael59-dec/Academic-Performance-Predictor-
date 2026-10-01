/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Layers, 
  HelpCircle, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Calculator,
  AlertTriangle
} from 'lucide-react';

export default function PredictiveExplanation() {
  // Sandbox state inside simulator page
  const [att, setAtt] = useState(80);
  const [asg, setAsg] = useState(70);
  const [tst, setTst] = useState(65);
  const [hrs, setHrs] = useState(8);
  const [sub, setSub] = useState(80);

  // Math calculated index
  const aps = (0.25 * att) + (0.25 * asg) + (0.30 * tst) + (0.10 * sub) + (0.10 * Math.min(hrs * 5, 100));
  
  let status: 'Excellent' | 'Average' | 'At Risk' | 'Fail' = 'Average';
  let badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
  let descText = 'Good overall parameters, showing solid performance.';

  if (aps >= 85) {
    status = 'Excellent';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-250';
    descText = 'Excellent performance with high indicators of course completion.';
  } else if (aps >= 65) {
    status = 'Average';
    badgeColor = 'bg-blue-100 text-blue-800 border-blue-250';
    descText = 'Average indices, in stable standing.';
  } else if (aps >= 45) {
    status = 'At Risk';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-250';
    descText = 'At academic risk! Raising attendance and study hours is highly recommended.';
  } else {
    status = 'Fail';
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-250 animate-pulse';
    descText = 'Critical failure forecast! Low classroom engagement represents immediate risk.';
  }

  const expectedGpa = Math.max(0, Math.min(4.0, Math.round(((aps / 100) * 4.0) * 10) / 10));

  // Weights documentation objects
  const modelWeights = [
    { title: 'Supervised Attendance Rate (25%)', coeff: '0.25', purpose: 'Measures class engagement frequency.', benchmark: '75% is required' },
    { title: 'Homework Assignments average (25%)', coeff: '0.25', purpose: 'Measures baseline home task capabilities.', benchmark: 'Minimum 50 marks' },
    { title: 'Test & Exam scores (30%)', coeff: '0.30', purpose: 'Calculates structural exam results average.', benchmark: 'Minimum 50 marks' },
    { title: 'Weekly Study Intervals (10%)', coeff: '0.10', purpose: 'Estimates extracurricular study efforts.', benchmark: 'Ideal: 15+ hours/week' },
    { title: 'Homework Submission Rate (10%)', coeff: '0.10', purpose: 'Reflects structural deadline compliance.', benchmark: 'Goal: 90% submissions' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-800 tracking-tight">Supervised Machine-Learning Forecast Models</h1>
        <p className="text-xs text-slate-500">Examine model coefficient weights, risk classifications, and run predictive scenarios.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Under the hood metrics */}
        <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-xs space-y-5">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">Model Mathematics</span>
            <h2 className="text-base font-bold text-slate-800 mt-1">Supervised Prediction Formula Coefficients</h2>
            <p className="text-xs text-slate-500 mt-1">Performance estimates are calculated out of a 100% Academic Performance Scale (APS), mapped into corresponding GPA benchmarks.</p>
          </div>

          <div className="space-y-4">
            {modelWeights.map((w, idx) => (
              <div key={idx} className="flex justify-between items-start gap-4 p-3 bg-slate-50 hover:bg-slate-100 rounded-md transition text-xs">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-850">{w.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{w.purpose}</p>
                  <span className="inline-block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Benchmark: {w.benchmark}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block">Beta Coeff</span>
                  <span className="font-mono text-xs font-black text-slate-800">{w.coeff}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed font-semibold">
            <span className="font-bold block uppercase tracking-wider text-[10px] text-amber-900 mb-0.5">Note on Retention forecasting:</span>
            Our model strictly penalizes attendance levels under 40% or general test scores under 45% because indicators historical patterns show high rates of academic failures under these marks.
          </div>
        </div>

        {/* Interactive Simulation Console */}
        <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" /> Simulation Sandbox Console
            </span>
            <h2 className="text-base font-bold text-slate-800">Forecast Simulation Tool</h2>
            <p className="text-xs text-slate-500">Input student data fields manually to evaluate estimated outputs immediately.</p>
          </div>

          {/* Controls */}
          <div className="space-y-3.5">
            {/* Attendance slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Class Attendance ({att}%)</span>
                <span>Weight: 25%</span>
              </div>
              <input
                type="range" min="0" max="100" value={att}
                onChange={e => setAtt(Number(e.target.value))}
                className="w-full h-1 bg-slate-105 rounded appearance-none cursor-pointer accent-[#1e3a8a]"
              />
            </div>

            {/* Homework Assignment average */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Homework Assignments Average ({asg}/100)</span>
                <span>Weight: 25%</span>
              </div>
              <input
                type="range" min="0" max="100" value={asg}
                onChange={e => setAsg(Number(e.target.value))}
                className="w-full h-1 bg-slate-105 rounded appearance-none cursor-pointer accent-[#1e3a8a]"
              />
            </div>

            {/* Test Average */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Academic Exams Average ({tst}/100)</span>
                <span>Weight: 30%</span>
              </div>
              <input
                type="range" min="0" max="100" value={tst}
                onChange={e => setTst(Number(e.target.value))}
                className="w-full h-1 bg-slate-105 rounded appearance-none cursor-pointer accent-[#1e3a8a]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Study Hours */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">Study Hours ({hrs} hrs/wk)</label>
                <input
                  type="range" min="0" max="40" value={hrs}
                  onChange={e => setHrs(Number(e.target.value))}
                  className="w-full h-1 bg-slate-105 rounded appearance-none cursor-pointer accent-[#1e3a8a]"
                />
              </div>

              {/* Submission Rate */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">Submissions ({sub}%)</label>
                <input
                  type="range" min="0" max="100" value={sub}
                  onChange={e => setSub(Number(e.target.value))}
                  className="w-full h-1 bg-slate-105 rounded appearance-none cursor-pointer accent-[#1e3a8a]"
                />
              </div>
            </div>
          </div>

          {/* Yield Predictions */}
          <div className="p-4 rounded-lg bg-[#1e3a8a] text-white space-y-4 shadow-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] uppercase font-bold text-blue-200">Simulation Output</span>
              <span className={`px-2.5 py-0.5 border rounded text-[9px] font-black uppercase tracking-wider ${badgeColor}`}>
                {status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-blue-900 pt-3">
              <div>
                <span className="text-[9px] uppercase font-bold text-blue-200 block font-sans">Expected GPA</span>
                <span className="text-2xl font-black block mt-0.5 font-mono text-emerald-400">{expectedGpa}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-blue-200 block font-sans">Performance Score</span>
                <span className="text-2xl font-black block mt-0.5 font-mono text-white">{Math.round(aps)}%</span>
              </div>
            </div>

            <p className="text-[10px] text-blue-100 font-medium italic border-t border-blue-900 pt-2 leading-relaxed">
              * {descText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

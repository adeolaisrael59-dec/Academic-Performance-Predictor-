/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  School, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';
import { StudentStats, Department, User } from '../types';

interface ReportsPanelProps {
  students: StudentStats[];
  departments: Department[];
  currentUser?: User;
}

export default function ReportsPanel({ students, departments, currentUser }: ReportsPanelProps) {
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const isStudent = currentUser?.role === 'student';

  // Filter students
  const filteredStudents = students.filter(s => {
    if (isStudent) {
      // If student, ONLY return their own record!
      return s.email.toLowerCase() === currentUser?.email.toLowerCase() || s.id === currentUser?.id;
    }
    const dMatch = filterDept === 'ALL' || s.department.toLowerCase() === filterDept.toLowerCase();
    const sMatch = filterStatus === 'ALL' || s.predictedStatus.toUpperCase() === filterStatus;
    return dMatch && sMatch;
  });

  // Analytics of the current filtered list
  const count = filteredStudents.length;
  const avgGpa = count > 0 
    ? (filteredStudents.reduce((sum, s) => sum + s.predictedGpa, 0) / count).toFixed(2)
    : '0.00';
  const avgAttendance = count > 0
    ? Math.round(filteredStudents.reduce((sum, s) => sum + s.attendancePct, 0) / count)
    : 0;

  // Render Risk Ratio
  const criticalCount = filteredStudents.filter(s => s.predictedStatus === 'Fail' || s.predictedStatus === 'At Risk').length;
  const healthRate = count > 0 ? Math.round(((count - criticalCount) / count) * 105) : 100;
  const healthRateBounded = Math.min(100, healthRate);

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            {isStudent ? "My Academic Transcript & Forecast" : "Academic Analytics & Transcript Reports"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isStudent 
              ? "View and download your official academic forecast and coefficient diagnostic statement."
              : "Filter results, generate aggregate course transcripts, and export/print high-quality university documents."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {!isStudent ? (
            <>
              {/* Department Filter */}
              <select
                value={filterDept}
                onChange={e => setFilterDept(e.target.value)}
                className="px-3 py-2 text-xs border border-[#e2e8f0] rounded-md focus:outline-hidden"
              >
                <option value="ALL">All Departments/Faculties</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>

              {/* Forecast status */}
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-xs border border-[#e2e8f0] rounded-md focus:outline-hidden"
              >
                <option value="ALL">All Prediction Statuses</option>
                <option value="EXCELLENT">Excellent Only</option>
                <option value="AVERAGE">Average Only</option>
                <option value="AT RISK">At Risk Only</option>
                <option value="FAIL">Critical Fail Only</option>
              </select>
            </>
          ) : (
            <div className="px-3 py-2 text-xs bg-blue-50 text-[#1e3a8a] border border-blue-200 rounded-md font-bold flex items-center gap-1.5">
              <span>🔒 Personal Transcript View Locked</span>
            </div>
          )}

          {/* Export PDF Button */}
          <button
            onClick={triggerPrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1e3a8a] text-white hover:bg-blue-900 font-bold text-xs rounded-md shadow-xs font-sans transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Export Report or Print PDF
          </button>
        </div>
      </div>

      {/* Actual Printable Report Sheet container */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-8 shadow-md max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Academic Header section */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
          <div className="flex items-center space-x-4">
            <div className="bg-[#1e3a8a] text-white p-3 rounded-md">
              <School className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1e3a8a] uppercase tracking-tight">REGENT STATE UNIVERSITY</h2>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest font-mono">OFFICE OF ACADEMIC AFFAIRS & ANALYTICS</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Est. 1952 • Accredited Supervised Analytics Program</p>
            </div>
          </div>

          <div className="text-right text-xs">
            <h3 className="font-extrabold text-slate-900 uppercase">
              {isStudent ? "Individual Academic Transcript" : "Academic Performance Audit"}
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Date: {new Date().toLocaleDateString()}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Ref ID: RSU-REP-2026</p>
          </div>
        </div>

        {/* Aggregate statistics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-lg border border-[#e2e8f0]">
          {isStudent ? (
            <>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Name</span>
                <span className="text-xs font-black text-slate-800 block mt-1 truncate">{currentUser?.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Class Category</span>
                <span className="text-xs font-black text-slate-800 block mt-1">{filteredStudents[0]?.predictedStatus || 'Average'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Predicted GPA Standard</span>
                <span className="text-xs font-black text-slate-800 block mt-1">{filteredStudents[0]?.predictedGpa || '0.0'} / 4.0</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance Standing</span>
                <span className="text-xs font-black text-slate-800 block mt-1">{filteredStudents[0]?.attendancePct || 0}%</span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Department Filter</span>
                <span className="text-xs font-black text-slate-800 block mt-1 truncate">{filterDept === 'ALL' ? 'All Faculties' : filterDept}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Model Prediction Focus</span>
                <span className="text-xs font-black text-slate-800 block mt-1">{filterStatus === 'ALL' ? 'Entire Cohort' : filterStatus}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Class GPA Cumulative Standard</span>
                <span className="text-xs font-black text-slate-800 block mt-1">{avgGpa} / 4.0</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Retention Safety Pct</span>
                <span className={`text-xs font-black block mt-1 ${healthRateBounded < 70 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {healthRateBounded}% Safe
                </span>
              </div>
            </>
          )}
        </div>

        {/* Narrative Description */}
        <div className="text-xs leading-relaxed text-slate-600 space-y-2">
          <p className="font-semibold text-slate-800 uppercase tracking-wider text-[10px]">I. Context & Predictive Metrics Definition:</p>
          <p>
            This transcript reflects the statistical evaluations calculated for registered students. Individual GPA levels are expected outcomes modeled from <b>Attendance Rates</b> (25%), <b>Homework Assessments</b> (25%), <b>Supervised Midterm/Exam scores</b> (30%), <b>Weekly Study hours average</b> (10%), and <b>Homework Submission compliance</b> (10%).
          </p>
        </div>

        {/* Audit Rosters Table */}
        <div className="space-y-2">
          <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] block">
            {isStudent ? "II. Personal Academic Evaluation Profile" : "II. Evaluated Student Registry"}
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-350 bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider">
                  <th className="p-2.5">Student</th>
                  <th className="p-2.5">Student ID</th>
                  <th className="p-2.5">Department</th>
                  <th className="p-2.5 text-center">Attendance</th>
                  <th className="p-2.5 text-center">Assignments</th>
                  <th className="p-2.5 text-center">Tests</th>
                  <th className="p-2.5 text-center">Predicted GPA</th>
                  <th className="p-2.5 text-right">Forecast Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{s.name}</td>
                    <td className="p-2.5 font-mono font-semibold text-slate-500">{s.studentId}</td>
                    <td className="p-2.5 text-slate-600 font-medium">{s.department}</td>
                    <td className="p-2.5 text-center font-mono font-medium">{s.attendancePct}%</td>
                    <td className="p-2.5 text-center font-mono font-medium">{s.assignmentScore}</td>
                    <td className="p-2.5 text-center font-mono font-medium">{s.testScore}</td>
                    <td className="p-2.5 text-center font-mono font-extrabold text-slate-800">{s.predictedGpa}</td>
                    <td className="p-2.5 text-right font-black">
                      <span className={`text-[9px] uppercase tracking-wide px-1.5 py-0.2 rounded font-semibold ${
                        s.predictedStatus === 'Excellent' ? 'text-emerald-700 font-black' :
                        s.predictedStatus === 'Average' ? 'text-blue-700' :
                        s.predictedStatus === 'At Risk' ? 'text-amber-700 font-bold' : 'text-rose-700 font-black'
                      }`}>
                        {s.predictedStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">No system records matched selected department or status bounds.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stamp & Signatures */}
        <div className="grid grid-cols-2 gap-12 pt-12 border-t border-slate-150">
          <div className="space-y-6">
            <div className="border-b border-slate-300 w-48 h-8" />
            <div className="text-[10px] text-slate-500 font-medium">
              <p className="font-extrabold uppercase text-slate-700">Dean of Student Affairs Office</p>
              <p>Certified Auditor Stamp Block</p>
            </div>
          </div>
          
          <div className="space-y-6 text-right flex flex-col items-end">
            <div className="border-b border-slate-300 w-48 h-8" />
            <div className="text-[10px] text-slate-500 font-medium">
              <p className="font-extrabold uppercase text-slate-700">Dr. Julian Smith</p>
              <p>Computational Model Registrar Representative</p>
            </div>
          </div>
        </div>

        {/* System watermark text */}
        <div className="text-[9px] text-slate-400 font-mono text-center pt-4 italic border-t border-dashed border-slate-100">
          RSU Academic Performance Prediction System • ISO Validated Analytics Security Enforced Code 3991-A
        </div>
      </div>
    </div>
  );
}

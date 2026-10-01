/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  Activity, 
  Plus, 
  Trash2, 
  Send, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';
import { StudentStats, Lecturer, SystemRecord, Department, SystemNotification } from '../types';
import { DonutChart, BarChart } from './Charts';

interface AdminDashboardProps {
  students: StudentStats[];
  lecturers: Lecturer[];
  records: SystemRecord[];
  departments: Department[];
  notifications: SystemNotification[];
  onAddDepartment: (name: string, code: string, courses: string[]) => void;
  onPublishNotification: (title: string, message: string, type: 'info' | 'warning' | 'success' | 'danger') => void;
}

export default function AdminDashboard({
  students,
  lecturers,
  records,
  departments,
  notifications,
  onAddDepartment,
  onPublishNotification
}: AdminDashboardProps) {
  // Notification States
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifType, setNotifType] = useState<'info' | 'warning' | 'success' | 'danger'>('info');

  // Department States
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptCourses, setDeptCourses] = useState('');

  // Analytics derivation
  const totalStudents = students.length;
  const totalLecturers = lecturers.length;
  const avgGpa = totalStudents > 0 
    ? Number((students.reduce((sum, s) => sum + s.predictedGpa, 0) / totalStudents).toFixed(2))
    : 0.0;
  
  const atRiskCount = students.filter(s => s.predictedStatus === 'At Risk' || s.predictedStatus === 'Fail').length;
  const retentionRate = totalStudents > 0 
    ? Math.round(((totalStudents - atRiskCount) / totalStudents) * 100)
    : 100;

  // Grade breakdowns for Pie Chart
  const excellentCount = students.filter(s => s.predictedStatus === 'Excellent').length;
  const averageCount = students.filter(s => s.predictedStatus === 'Average').length;
  const riskCount = students.filter(s => s.predictedStatus === 'At Risk').length;
  const failCount = students.filter(s => s.predictedStatus === 'Fail').length;

  const statusData = [
    { label: 'Excellent (A)', value: excellentCount, color: '#10b981' }, // emerald
    { label: 'Average (B/C)', value: averageCount, color: '#3b82f6' }, // blue
    { label: 'At Risk (D)', value: riskCount, color: '#f59e0b' }, // amber
    { label: 'Fail (F)', value: failCount, color: '#ef4444' } // red
  ];

  // Department Breakdown for Bar Chart
  const deptCodes = departments.map(d => d.code);
  const deptGpas = departments.map(d => {
    const deptStudents = students.filter(s => s.department.toLowerCase() === d.name.toLowerCase());
    if (deptStudents.length === 0) return 0;
    const avg = deptStudents.reduce((sum, s) => sum + s.attendancePct, 0) / deptStudents.length;
    return Math.round(avg);
  });

  const handlePublishNotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMsg) return;
    onPublishNotification(notifTitle, notifMsg, notifType);
    setNotifTitle('');
    setNotifMsg('');
    alert('Global alert published successfully!');
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName || !deptCode) return;
    const coursesArr = deptCourses.split(',').map(c => c.trim()).filter(Boolean);
    onAddDepartment(deptName, deptCode, coursesArr);
    setDeptName('');
    setDeptCode('');
    setDeptCourses('');
    alert('Department registered successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">University Academic Console</h1>
        <p className="text-slate-500 text-sm">Comprehensive metrics, user structures, systems audits, and notification broadcasting.</p>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col justify-between h-36 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</span>
            <div className="text-blue-600 bg-blue-50 p-2 rounded-md">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{totalStudents}</div>
          <div className="text-xs text-green-600 flex items-center gap-1 font-semibold">
            Registered Academic Profiles
          </div>
        </div>

        {/* Staff Lecturers */}
        <div className="bg-white p-5 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col justify-between h-36 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Lecturers</span>
            <div className="text-indigo-600 bg-indigo-50 p-2 rounded-md">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{totalLecturers}</div>
          <div className="text-xs text-indigo-600 flex items-center gap-1 font-semibold">
            Active Faculty Roster
          </div>
        </div>

        {/* Avg GPA */}
        <div className="bg-white p-5 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col justify-between h-36 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">School-Wide GPA</span>
            <div className="text-amber-600 bg-amber-50 p-2 rounded-md">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{avgGpa}</div>
          <div className="text-xs text-green-600 font-semibold flex items-center gap-1">
            Weighted Cumulative Mean
          </div>
        </div>

        {/* At Risk Students */}
        <div className="bg-[#ef4444] text-white p-5 rounded-lg border-none shadow-xs flex flex-col justify-between h-36 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-red-100 uppercase tracking-wider">At Risk Students</span>
            <div className="text-white bg-red-400/30 p-2 rounded-md">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold">{atRiskCount}</div>
          <div className="text-xs text-red-100 font-semibold">
            Requires immediate action
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            Predicted Risk Cohort Breakdown
          </h2>
          <DonutChart data={statusData} />
        </div>

        <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Department Average Attendance Rate (%)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Comparison of student interaction frequencies across respective university faculties.
            </p>
          </div>
          {deptCodes.length > 0 ? (
            <BarChart categories={departments.map(d => d.name)} values={deptGpas} color="#3b82f6" />
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">No department statistics loaded.</p>
          )}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs text-amber-600 gap-1 font-semibold">
            <AlertTriangle className="w-4 h-4" /> Keep attendance above 75% for positive retention forecasts.
          </div>
        </div>
      </div>

      {/* Dynamic Notification Dispatch & Department setup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Broadcast */}
        <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Send className="w-4 h-4 text-[#3b82f6]" /> Broadcast Administrative Alert
          </h2>
          <form onSubmit={handlePublishNotif} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Subject Header</label>
              <input
                type="text"
                placeholder="e.g., Mid-semester Grading Deadline"
                value={notifTitle}
                onChange={e => setNotifTitle(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Alert Content</label>
              <textarea
                rows={3}
                placeholder="Details of the announcement for staff and student feeds..."
                value={notifMsg}
                onChange={e => setNotifMsg(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Severity Flag</label>
                <select
                  value={notifType}
                  onChange={e => setNotifType(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="info">Information (Blue)</option>
                  <option value="success">Normal (Green)</option>
                  <option value="warning">Warning (Amber)</option>
                  <option value="danger">Critical (Red)</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-[#1e3a8a] text-white font-bold py-2 text-xs rounded-md hover:bg-blue-900 transition cursor-pointer"
                >
                  Publish Announcement
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Create Department */}
        <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" /> Create Faculty Department
          </h2>
          <form onSubmit={handleAddDept} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Department Name</label>
                <input
                  type="text"
                  placeholder="e.g., Artificial Intelligence"
                  value={deptName}
                  onChange={e => setDeptName(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Faculty Code</label>
                <input
                  type="text"
                  placeholder="e.g., AI"
                  value={deptCode}
                  onChange={e => setDeptCode(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 text-upper"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Affiliated Course Subjects</label>
              <input
                type="text"
                placeholder="Separate with commas (e.g. Deep Learning, Ethics in AI)"
                value={deptCourses}
                onChange={e => setDeptCourses(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 text-xs rounded-md transition cursor-pointer"
            >
              Configure Department
            </button>
          </form>
        </div>
      </div>

      {/* Systems Audit Trail Logger */}
      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>Security & System Activity Log</span>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider">SEC-ISO-27001 AUDITING</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="py-2">System ID</th>
                <th className="py-2">Operational Action</th>
                <th className="py-2">Agent Context</th>
                <th className="py-2">User Role</th>
                <th className="py-2 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.slice(0, 5).map(rec => (
                <tr key={rec.id} className="hover:bg-slate-50/50">
                  <td className="py-3 font-mono text-slate-400 font-medium">{rec.id}</td>
                  <td className="py-3 text-slate-800 font-semibold">{rec.action}</td>
                  <td className="py-3 text-slate-600 font-medium">{rec.performedBy}</td>
                  <td className="py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wide uppercase bg-slate-100 text-slate-600">
                      {rec.role}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 font-mono text-right">{new Date(rec.timestamp).toLocaleTimeString() || rec.timestamp}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-400 font-medium">No system actions registered.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  GraduationCap, 
  AlertOctagon, 
  TrendingUp, 
  Settings, 
  Sparkles, 
  Edit3, 
  Briefcase 
} from 'lucide-react';
import { StudentStats, User } from '../types';

interface LecturerDashboardProps {
  user: User;
  students: StudentStats[];
  onUpdateScores: (id: string, attrs: Partial<StudentStats> & { modifiedBy?: string }) => void;
}

export default function LecturerDashboard({ user, students, onUpdateScores }: LecturerDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Selected student for score editing
  const [editingStudent, setEditingStudent] = useState<StudentStats | null>(null);
  
  // Score Input states for editing
  const [attendance, setAttendance] = useState(80);
  const [assignment, setAssignment] = useState(70);
  const [test, setTest] = useState(70);
  const [hours, setHours] = useState(10);
  const [submission, setSubmission] = useState(85);

  const lecturerDept = user.department || '';
  const lecturerCourse = user.course || '';

  // Filter students specific to the Lecturer's department/course
  const myStudents = students.filter(s => 
    s.course.toLowerCase() === lecturerCourse.toLowerCase() ||
    s.department.toLowerCase() === lecturerDept.toLowerCase()
  );

  const filtered = myStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'ALL' || s.predictedStatus.toUpperCase() === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const totalMyStudents = myStudents.length;
  const atRiskStudents = myStudents.filter(s => s.predictedStatus === 'At Risk' || s.predictedStatus === 'Fail');
  const classAvgGpa = totalMyStudents > 0 
    ? Number((myStudents.reduce((sum, s) => sum + s.predictedGpa, 0) / totalMyStudents).toFixed(2))
    : 0.0;
  
  const classAvgAttendance = totalMyStudents > 0
    ? Math.round(myStudents.reduce((sum, s) => sum + s.attendancePct, 0) / totalMyStudents)
    : 0;

  const handleOpenEdit = (student: StudentStats) => {
    setEditingStudent(student);
    setAttendance(student.attendancePct);
    setAssignment(student.assignmentScore);
    setTest(student.testScore);
    setHours(student.studyHours);
    setSubmission(student.submissionRate);
  };

  const handleSaveScores = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    onUpdateScores(editingStudent.id, {
      attendancePct: Number(attendance),
      assignmentScore: Number(assignment),
      testScore: Number(test),
      studyHours: Number(hours),
      submissionRate: Number(submission),
      modifiedBy: user.name
    });

    setEditingStudent(null);
    alert(`Academic parameters of ${editingStudent.name} successfully updated!`);
  };

  // Live client-side prediction preview inside modal
  const liveAps = (0.25 * attendance) + (0.25 * assignment) + (0.30 * test) + (0.10 * submission) + (0.10 * Math.min(hours * 5, 100));
  let liveStatus = 'Fail';
  if (liveAps >= 85) liveStatus = 'Excellent';
  else if (liveAps >= 65) liveStatus = 'Average';
  else if (liveAps >= 45) liveStatus = 'At Risk';

  let liveGpa = Math.round(((liveAps / 100) * 4.0) * 10) / 10;
  if (liveGpa > 4.0) liveGpa = 4.0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-[#1e3a8a] text-white p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center border border-blue-900 shadow-sm">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-blue-300">LECTURER ACADEMIC BOARD</span>
          <h1 className="text-2xl font-black mt-1">Hello, {user.name}</h1>
          <p className="text-xs text-blue-100 mt-1">Course Assignment: <span className="font-bold text-white">{lecturerCourse || 'N/A'}</span> ({lecturerDept})</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-white/10 rounded text-xs flex items-center gap-2 border border-white/10">
          <Briefcase className="w-4 h-4 text-white" />
          <span className="font-semibold text-blue-50">System Model: Regression Forecast V2.1</span>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Assigned List</span>
            <div className="text-blue-600 bg-blue-50 p-2 rounded-md">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-800">{totalMyStudents}</span>
          <p className="text-[10px] text-slate-400 font-semibold">Direct Course Entrants</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Class Avg GPA</span>
            <div className="text-[#3b82f6] bg-blue-50 p-2 rounded-md">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-800">{classAvgGpa} / 4.0</span>
          <p className="text-[10px] text-green-600 font-semibold">Strong cumulative target</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Avg Attendance</span>
            <div className="text-[#3b82f6] bg-blue-50 p-2 rounded-md">
              <Settings className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-800">{classAvgAttendance}%</span>
          <p className="text-[10px] text-amber-600 font-semibold">Target is above 75% mark</p>
        </div>

        <div className="bg-[#ef4444] text-white p-5 rounded-lg border-none shadow-xs flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-red-100 text-xs font-bold uppercase tracking-wider block">At Risk Focus List</span>
            <div className="text-white bg-red-400/30 p-2 rounded-md">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black">{atRiskStudents.length}</span>
          <p className="text-[10px] text-red-100 font-bold">Requires immediate action</p>
        </div>
      </div>

      {/* Primary students list & score modification section */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Class Gradebook & Prediction Table</h2>
            <p className="text-xs text-slate-500">Edit assessments, scores and let the classifier evaluate high-risk students.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search registered names..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-56 text-xs border border-[#e2e8f0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-[#e2e8f0] rounded-md focus:outline-hidden"
            >
              <option value="ALL">All Cohort Categories</option>
              <option value="EXCELLENT">Excellent Only</option>
              <option value="AVERAGE">Average Only</option>
              <option value="AT RISK">At Risk Only</option>
              <option value="FAIL">Critical Fail Forecast</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-[#e2e8f0] text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="p-4">Student Name</th>
                <th className="p-4">Student ID</th>
                <th className="p-4">Attendance</th>
                <th className="p-4">Assignments</th>
                <th className="p-4">Tests</th>
                <th className="p-4">Study Hours</th>
                <th className="p-4">Submission Rate</th>
                <th className="p-4">Predicted GPA</th>
                <th className="p-4">Status Recommendation</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900">{s.name}</td>
                  <td className="p-4 font-mono text-slate-500">{s.studentId}</td>
                  <td className="p-4 font-medium">{s.attendancePct}%</td>
                  <td className="p-4 font-medium">{s.assignmentScore}/100</td>
                  <td className="p-4 font-medium">{s.testScore}/100</td>
                  <td className="p-4 font-medium">{s.studyHours} hrs/wk</td>
                  <td className="p-4 font-medium">{s.submissionRate}%</td>
                  <td className="p-4 font-black text-slate-800">{s.predictedGpa}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        s.predictedStatus === 'Excellent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.predictedStatus === 'Average'
                          ? 'bg-blue-100 text-blue-800'
                          : s.predictedStatus === 'At Risk'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800 animate-pulse'
                      }`}
                    >
                      {s.predictedStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded hover:bg-blue-100 transition whitespace-nowrap cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Grade Scores
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400 font-medium">
                    No academic profiles matched criteria or department enrollment mapping.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer Dialog Modal for Editing Student academic metrics */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-xl border border-[#e2e8f0] overflow-hidden transform animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-[#1e3a8a] text-white flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-blue-300">INSTITUTIONAL GRADEBOOK</span>
                <h3 className="text-base font-extrabold mt-0.5">{editingStudent.name}</h3>
                <p className="text-[10px] text-blue-200 font-mono mt-0.5">{editingStudent.studentId} • {editingStudent.course}</p>
              </div>
              <button 
                onClick={() => setEditingStudent(null)}
                className="text-white/80 hover:text-white font-extrabold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveScores} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {/* Attendance */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Attendance ({attendance}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={attendance}
                    onChange={e => setAttendance(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Submission Rate */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Homework Submissions ({submission}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={submission}
                    onChange={e => setSubmission(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Assignment Average */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Assignments</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={assignment}
                    onChange={e => setAssignment(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-2 border border-slate-250 rounded-lg focus:outline-hidden"
                  />
                </div>

                {/* Test Scores */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Test Scores</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={test}
                    onChange={e => setTest(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-2 border border-slate-250 rounded-lg focus:outline-hidden"
                  />
                </div>

                {/* Weekly Study Hours */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Study Hours/Wk</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={hours}
                    onChange={e => setHours(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-2 border border-slate-250 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Real-time Dynamic Model Calculation Preview */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-700 font-semibold mb-1">
                  <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-blue-600" /> Linear Model Live Forecast:</span>
                  <span className="font-mono text-[10px] text-slate-400">APS Formula v2</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-slate-500 block">Forecast Status</span>
                    <span className={`text-sm font-bold block ${
                      liveStatus === 'Excellent' ? 'text-emerald-700' : liveStatus === 'Average' ? 'text-blue-700' : 'text-amber-700'
                    }`}>{liveStatus}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Predicted GPA</span>
                    <span className="text-sm font-black text-slate-800 block">{liveGpa} / 4.0</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border border-slate-250 bg-white font-semibold text-slate-700 text-xs rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 font-extrabold text-white text-xs rounded-lg shadow-md"
                >
                  Apply Grade Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

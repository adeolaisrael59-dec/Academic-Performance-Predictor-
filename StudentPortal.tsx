/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Search, Edit3, Heart, Filter, UserCheck, Mail, Briefcase } from 'lucide-react';
import { StudentStats, User, Department } from '../types';

interface StudentPortalProps {
  currentUser: User;
  students: StudentStats[];
  departments: Department[];
  onAddStudent: (student: {
    name: string;
    email: string;
    department: string;
    course: string;
    attendancePct: number;
    assignmentScore: number;
    testScore: number;
    studyHours: number;
    submissionRate: number;
  }) => void;
  onDeleteStudent: (id: string) => void;
  onEditStudent: (student: StudentStats) => void;
}

export default function StudentPortal({
  currentUser,
  students,
  departments,
  onAddStudent,
  onDeleteStudent,
  onEditStudent
}: StudentPortalProps) {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  if (currentUser.role === 'student') {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-8 bg-white border border-[#e2e8f0] rounded-lg shadow-xs text-center space-y-4">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          ⚠️
        </div>
        <h2 className="text-base font-black text-slate-800 uppercase tracking-tight">Access Denied & Security Lockdown</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The Regent Varsity Predictive AI platform strictly locks down peer evaluation views. Student grades, attendance ratios, and predicted retention statuses can only be queried by authorized lecturers and the Dean of Student Affairs.
        </p>
      </div>
    );
  }

  // Add student Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newCourse, setNewCourse] = useState('Introduction to AI');
  const [newAttendance, setNewAttendance] = useState(85);
  const [newAssignments, setNewAssignments] = useState(75);
  const [newTest, setNewTest] = useState(70);
  const [newHours, setNewHours] = useState(12);
  const [newSubRate, setNewSubRate] = useState(90);

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.studentId.toLowerCase().includes(search.toLowerCase()) ||
                          s.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || s.department.toLowerCase() === selectedDept.toLowerCase();
    const matchesStatus = selectedStatus === 'ALL' || s.predictedStatus.toUpperCase() === selectedStatus;
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    onAddStudent({
      name: newName,
      email: newEmail,
      department: newDept,
      course: newCourse,
      attendancePct: Number(newAttendance || 80),
      assignmentScore: Number(newAssignments || 70),
      testScore: Number(newTest || 70),
      studyHours: Number(newHours || 10),
      submissionRate: Number(newSubRate || 85)
    });

    // Reset
    setNewName('');
    setNewEmail('');
    setShowAddForm(false);
    alert('Student academic dossier registered successfully!');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete student profile for ${name}?`)) {
      onDeleteStudent(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">University Student Portal</h1>
          <p className="text-xs text-slate-500">Manage pupil identifiers, registry courses, core metrics, and operational flags.</p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1e3a8a] hover:bg-blue-900 text-white font-extrabold text-xs rounded-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Academic Dossier
          </button>
        )}
      </div>

      {/* Show Add Student Form if toggled */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
            Configure New Pupil Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g., Emily Carter"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email address</label>
              <input
                type="email"
                placeholder="emily@regent.edu"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Major Faculty</label>
              <select
                value={newDept}
                onChange={e => setNewDept(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-hidden"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Enrolled Course Subject</label>
              <select
                value={newCourse}
                onChange={e => setNewCourse(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-hidden"
              >
                <option value="Introduction to AI">Introduction to AI</option>
                <option value="Predictive Analytics">Predictive Analytics</option>
                <option value="Engineering Statistics">Engineering Statistics</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Attendance %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newAttendance}
                onChange={e => setNewAttendance(Number(e.target.value))}
                className="w-full text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded-md focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Assign Score</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newAssignments}
                onChange={e => setNewAssignments(Number(e.target.value))}
                className="w-full text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded-md focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Test Score</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newTest}
                onChange={e => setNewTest(Number(e.target.value))}
                className="w-full text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded-md focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Study Hours/Wk</label>
              <input
                type="number"
                min="0"
                max="40"
                value={newHours}
                onChange={e => setNewHours(Number(e.target.value))}
                className="w-full text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded-md focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Submission %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newSubRate}
                onChange={e => setNewSubRate(Number(e.target.value))}
                className="w-full text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded-md focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs border border-[#e2e8f0] bg-white font-semibold text-slate-705 rounded-md hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs bg-[#1e3a8a] text-white font-bold rounded-md hover:bg-blue-900 cursor-pointer"
            >
              Configure Student Records
            </button>
          </div>
        </form>
      )}

      {/* Roster list filter/search header */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-xs p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Filter names, emails, student IDs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs border border-[#e2e8f0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Department */}
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="px-3 py-2 text-xs border border-[#e2e8f0] rounded-md focus:outline-hidden"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs border border-[#e2e8f0] rounded-md focus:outline-hidden"
            >
              <option value="ALL">All Forecast Statuses</option>
              <option value="EXCELLENT">Excellent Only</option>
              <option value="AVERAGE">Average Only</option>
              <option value="AT RISK">At Risk Only</option>
              <option value="FAIL">Critical Fail Forecast</option>
            </select>
          </div>
        </div>

        {/* Database Roster list grid/table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                <th className="p-4">Academic Student</th>
                <th className="p-4">Student ID</th>
                <th className="p-4">Department & Subject</th>
                <th className="p-4">Attendance Rate</th>
                <th className="p-4">Study Habits</th>
                <th className="p-4 text-center">GPA Prediction</th>
                <th className="p-4">Category Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/40">
                  <td className="p-4">
                    <div>
                      <span className="block text-slate-800 font-bold text-xs">{s.name}</span>
                      <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{s.email}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-500">{s.studentId}</td>
                  <td className="p-4">
                    <div>
                      <span className="block font-semibold text-slate-700">{s.course}</span>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase">{s.department}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-semibold">{s.attendancePct}%</span>
                      <span className={`w-2 h-2 rounded-full ${s.attendancePct < 75 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    </div>
                  </td>
                  <td className="p-4 text-slate-500">
                    <span className="block font-semibold text-slate-700">{s.studyHours} hrs/week</span>
                    <span className="block text-[9px] font-mono whitespace-nowrap">{s.submissionRate}% submission</span>
                  </td>
                  <td className="p-4 text-center font-black text-slate-800">{s.predictedGpa}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      s.predictedStatus === 'Excellent' ? 'bg-emerald-100 text-emerald-800' :
                      s.predictedStatus === 'Average' ? 'bg-blue-100 text-blue-800' :
                      s.predictedStatus === 'At Risk' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-rose-100 text-rose-800 animate-pulse'
                    }`}>
                      {s.predictedStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => onEditStudent(s)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Grade
                      </button>
                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="inline-flex items-center p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-semibold text-sm">No student dossiers loaded matching criteria filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Mail, Briefcase, GraduationCap, Search, ShieldAlert } from 'lucide-react';
import { Lecturer, User, Department } from '../types';

interface StaffPortalProps {
  currentUser: User;
  lecturers: Lecturer[];
  departments: Department[];
  onAddLecturer: (lecturer: { name: string; email: string; department: string; course: string }) => void;
  onDeleteLecturer: (id: string) => void;
}

export default function StaffPortal({
  currentUser,
  lecturers,
  departments,
  onAddLecturer,
  onDeleteLecturer
}: StaffPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dept, setDept] = useState('Computer Science');
  const [course, setCourse] = useState('Introduction to AI');

  const filtered = lecturers.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onAddLecturer({ name, email, department: dept, course });
    setName('');
    setEmail('');
    setShowAddForm(false);
    alert('Staff lecturer credentials registered successfully!');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to release lecturer ${name} from Active Roster?`)) {
      onDeleteLecturer(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">University Academic Staff Portal</h1>
          <p className="text-xs text-slate-500">Configure core subjects, audit teaching hours and monitor department lecturers.</p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1e3a8a] hover:bg-blue-900 text-white font-extrabold text-xs rounded-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Register Lecturing Staff
          </button>
        )}
      </div>

      {/* Register Staff Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
            Register Faculty Lecturer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lecturer Full Name</label>
              <input
                type="text"
                placeholder="e.g., Dr. Mary Jane"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Institutional Email</label>
              <input
                type="email"
                placeholder="jane@regent.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Faculty Department Mapping</label>
              <select
                value={dept}
                onChange={e => setDept(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-hidden"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subject Designation Assignment</label>
              <select
                value={course}
                onChange={e => setCourse(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-hidden"
              >
                <option value="Introduction to AI">Introduction to AI</option>
                <option value="Predictive Analytics">Predictive Analytics</option>
                <option value="Engineering Statistics">Engineering Statistics</option>
              </select>
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
              Save Lecturer Profile
            </button>
          </div>
        </form>
      )}

      {/* Roster lists cards section */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-xs p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search academic lecturers by name, email, courses assigned..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs border border-[#e2e8f0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map(lec => (
            <div key={lec.id} className="p-5 border border-[#e2e8f0] hover:border-blue-300 rounded-lg bg-slate-50/50 space-y-4 transition flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(lec.name)}`}
                    alt={lec.name}
                    className="w-11 h-11 rounded-full border border-slate-200 object-cover bg-white"
                  />
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-800">{lec.name}</h3>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase mt-0.5">{lec.department}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] font-semibold text-slate-600 pt-1">
                  <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-500" /> {lec.email}</div>
                  <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-blue-500" /> Course: {lec.course}</div>
                  <div className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-blue-500" /> Students: {lec.studentCount} active</div>
                </div>
              </div>

              {currentUser.role === 'admin' && (
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleDelete(lec.id, lec.name)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[10px] uppercase tracking-wider rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Terminate Roster
                  </button>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-slate-400 py-6 text-center font-semibold col-span-3 text-sm">No lecture personnel registered under the active filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}

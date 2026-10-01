/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  School,
  LayoutDashboard,
  Users,
  BrainCircuit,
  FileText,
  UserCheck,
  LogOut,
  Bell,
  Sparkles
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  user: User | null;
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  notificationsCount: number;
}

export default function Sidebar({ user, activePath, onNavigate, onLogout, notificationsCount }: SidebarProps) {
  if (!user) return null;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Academic Dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'lecturer', 'student'],
    },
    {
      id: 'students',
      label: 'Student Portal',
      icon: Users,
      roles: ['admin', 'lecturer'],
    },
    {
      id: 'lecturers',
      label: 'Staff Portal',
      icon: UserCheck,
      roles: ['admin', 'student'], // Students can see lecturers, admin can manage them
    },
    {
      id: 'prediction',
      label: 'Simulation System',
      icon: BrainCircuit,
      roles: ['admin', 'lecturer', 'student'],
    },
    {
      id: 'reports',
      label: 'Performance Reports',
      icon: FileText,
      roles: ['admin', 'lecturer', 'student'],
    },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-[#1e3a8a] text-white flex flex-col h-screen sticky top-0 border-r border-blue-900 flex-shrink-0 transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-6 border-b border-blue-900 flex items-center space-x-3">
        <div className="bg-white p-2 rounded flex items-center justify-center text-[#1e3a8a] shadow-xs">
          <School className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-sm font-black leading-tight tracking-tight text-white uppercase">Regent Varsity</h1>
          <p className="text-[10px] text-blue-300 font-bold tracking-wider font-mono">PREDICTOR AI</p>
        </div>
      </div>

      {/* User Badge Profile info */}
      <div className="p-5 border-b border-blue-900 bg-blue-950/20 flex items-center space-x-3">
        <img
          src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
          alt={user.name}
          className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
        />
        <div className="truncate">
          <h2 className="text-xs font-bold text-white truncate">{user.name}</h2>
          <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/20 text-white">
            {user.role}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-0.5 select-none">
        <span className="px-6 text-[10px] font-black uppercase tracking-widest text-blue-300 block mb-2">
          Administration
        </span>
        {filteredItems.map(item => {
          const IconComponent = item.icon;
          const isActive = activePath === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-xs font-semibold border-l-4 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white/15 text-white border-white'
                  : 'text-blue-100/80 border-transparent hover:bg-white/10 hover:border-white hover:text-white'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{item.label}</span>
              {item.id === 'prediction' && (
                <span className="ml-auto bg-amber-500/30 text-amber-200 border border-amber-500/20 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 fill-amber-300/20" /> AI
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Meta Footer */}
      <div className="p-4 border-t border-blue-900 space-y-2 bg-blue-950/15">
        <button
          onClick={() => onNavigate('landing')}
          className="w-full flex items-center justify-center space-x-2 text-xs font-bold text-blue-300 hover:text-white py-1.5 rounded hover:bg-white/5 transition-all"
        >
          <span>University Portal Gateway</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold rounded-lg text-rose-300 hover:bg-rose-500/20 hover:text-rose-100 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

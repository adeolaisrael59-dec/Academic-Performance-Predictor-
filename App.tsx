/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  LogOut, 
  Users, 
  LayoutDashboard 
} from 'lucide-react';

import { User, StudentStats, Lecturer, SystemRecord, Department, SystemNotification } from './types';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import AuthScreens from './components/AuthScreens';
import AdminDashboard from './components/AdminDashboard';
import LecturerDashboard from './components/LecturerDashboard';
import StudentDashboard from './components/StudentDashboard';
import StudentPortal from './components/StudentPortal';
import StaffPortal from './components/StaffPortal';
import PredictiveExplanation from './components/PredictiveExplanation';
import ReportsPanel from './components/ReportsPanel';

export default function App() {
  // Session authentication states
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('predictor_session_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authScreen, setAuthScreen] = useState<'login' | 'register' | null>(null);
  const [activePath, setActivePath] = useState<string>('dashboard');

  // Master lists fetched from Express API
  const [students, setStudents] = useState<StudentStats[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [records, setRecords] = useState<SystemRecord[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // Mobile drawer utility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load backend arrays on session mounting
  const fetchAllData = async () => {
    try {
      const [stRes, leRes, reRes, deRes, noRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/lecturers'),
        fetch('/api/records'),
        fetch('/api/departments'),
        fetch('/api/notifications')
      ]);

      const [stVal, leVal, reVal, deVal, noVal] = await Promise.all([
        stRes.json(),
        leRes.json(),
        reRes.json(),
        deRes.json(),
        noRes.json()
      ]);

      setStudents(stVal);
      setLecturers(leVal);
      setRecords(reVal);
      setDepartments(deVal);
      setNotifications(noVal);
    } catch (err) {
      console.error('Error fetching university datasets:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Set a refresh interval every 30 seconds for live data sync
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    localStorage.setItem('predictor_session_user', JSON.stringify(authenticatedUser));
    setAuthScreen(null);
    setActivePath('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('predictor_session_user');
    setAuthScreen(null);
    setActivePath('dashboard');
  };

  // ---------------- REST API ACTIONS ----------------

  // Update Score Metric (Lecturer/Admin)
  const handleUpdateStudentScores = async (studentId: string, edits: Partial<StudentStats> & { modifiedBy?: string }) => {
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...edits, modifiedBy: user?.name || 'Academic Assessor' })
      });

      if (!res.ok) throw new Error('Failed to update scoring metric');
      
      const updated = await res.json();
      setStudents(prev => prev.map(s => s.id === studentId ? updated : s));
      fetchAllData(); // refresh audit logs
    } catch (err) {
      console.error(err);
      alert('Error updating score indices.');
    }
  };

  // Add Student Academic Dossier (Admin Only)
  const handleAddStudent = async (newStudent: {
    name: string;
    email: string;
    department: string;
    course: string;
    attendancePct: number;
    assignmentScore: number;
    testScore: number;
    studyHours: number;
    submissionRate: number;
  }) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });

      if (!res.ok) throw new Error('Failed to add student');
      
      const savedStudent = await res.json();
      setStudents(prev => [...prev, savedStudent]);
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert('Error adding student profile.');
    }
  };

  // Delete Student File (Admin Only)
  const handleDeleteStudent = async (studentId: string) => {
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed deleting student file');

      setStudents(prev => prev.filter(s => s.id !== studentId));
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Save new Faculty Lecturer (Admin Only)
  const handleAddLecturer = async (newLec: { name: string; email: string; department: string; course: string }) => {
    try {
      const res = await fetch('/api/lecturers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLec)
      });

      if (!res.ok) throw new Error('Failed to add lecturer');
      
      const savedLec = await res.json();
      setLecturers(prev => [...prev, savedLec]);
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Terminate Lecturer Roster (Admin only)
  const handleDeleteLecturer = async (lecId: string) => {
    try {
      const res = await fetch(`/api/lecturers/${lecId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed releasing lecturer');
      setLecturers(prev => prev.filter(l => l.id !== lecId));
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Add Faculty Department (Admin Only)
  const handleAddDepartment = async (name: string, code: string, courses: string[]) => {
    try {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code, courses })
      });

      if (!res.ok) throw new Error('Failed configuring department');
      const savedDept = await res.json();
      setDepartments(prev => [...prev, savedDept]);
    } catch (err) {
      console.error(err);
    }
  };

  // Publish Global Broadcast notification (Admin Only)
  const handlePublishNotification = async (title: string, message: string, type: 'info' | 'warning' | 'success' | 'danger') => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, type, userId: 'all' })
      });

      if (!res.ok) throw new Error('Failed publishing broadcast');
      const savedNotif = await res.json();
      setNotifications(prev => [savedNotif, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- RENDERING DECISIONS ----------------

  // Render Login and Registration Card components
  if (authScreen) {
    return (
      <AuthScreens
        initialScreen={authScreen}
        onAuthSuccess={handleAuthSuccess}
        onToggleScreen={setAuthScreen}
        onGoBack={() => setAuthScreen(null)}
      />
    );
  }

  // Render Portal landing page if unauthenticated
  if (!user) {
    return (
      <LandingPage
        onStartLogin={() => setAuthScreen('login')}
        onStartRegister={() => setAuthScreen('register')}
      />
    );
  }

  // Draw active page corresponding to navigation activePath
  const renderActiveView = () => {
    switch (activePath) {
      case 'dashboard':
        if (user.role === 'admin') {
          return (
            <AdminDashboard
              students={students}
              lecturers={lecturers}
              records={records}
              departments={departments}
              notifications={notifications}
              onAddDepartment={handleAddDepartment}
              onPublishNotification={handlePublishNotification}
            />
          );
        } else if (user.role === 'lecturer') {
          return (
            <LecturerDashboard
              user={user}
              students={students}
              onUpdateScores={handleUpdateStudentScores}
            />
          );
        } else {
          return (
            <StudentDashboard
              user={user}
              students={students}
              notifications={notifications}
              onUpdateScores={handleUpdateStudentScores}
            />
          );
        }

      case 'students':
        return (
          <StudentPortal
            currentUser={user}
            students={students}
            departments={departments}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            onEditStudent={(s) => {
              // Direct access to grades drawer helper trigger inside Students view
              const attInput = prompt(`Update Attendance Pct for ${s.name}:`, String(s.attendancePct));
              const asgInput = prompt(`Update Assignments average for ${s.name}:`, String(s.assignmentScore));
              const tstInput = prompt(`Update Test/Exams score for ${s.name}:`, String(s.testScore));
              
              if (attInput !== null || asgInput !== null || tstInput !== null) {
                handleUpdateStudentScores(s.id, {
                  attendancePct: Number(attInput ?? s.attendancePct),
                  assignmentScore: Number(asgInput ?? s.assignmentScore),
                  testScore: Number(tstInput ?? s.testScore)
                });
                alert('Academic parameters updated successfully!');
              }
            }}
          />
        );

      case 'lecturers':
        return (
          <StaffPortal
            currentUser={user}
            lecturers={lecturers}
            departments={departments}
            onAddLecturer={handleAddLecturer}
            onDeleteLecturer={handleDeleteLecturer}
          />
        );

      case 'prediction':
        return <PredictiveExplanation />;

      case 'reports':
        return (
          <ReportsPanel
            students={students}
            departments={departments}
            currentUser={user}
          />
        );

      case 'landing':
        // Fallback or escape link to view home gateway
        return (
          <div className="space-y-6">
            <h1 className="text-xl font-bold text-slate-800">Exit Administrative Session?</h1>
            <p className="text-xs text-slate-500">You are currently logged into a live administrator/faculty session. Navigate below to sign out or continue operations.</p>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="bg-rose-600 font-bold text-white text-xs px-4 py-2 rounded-lg hover:bg-rose-700 hover:text-rose-100 cursor-pointer"
              >
                Log Out
              </button>
              <button
                onClick={() => setActivePath('dashboard')}
                className="border border-slate-300 font-semibold text-slate-700 text-xs px-4 py-2 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                Continue Operations
              </button>
            </div>
          </div>
        );

      default:
        return <div>Resource target index error.</div>;
    }
  };

  const notificationCounts = notifications.filter(n => n.userId === 'all' || n.userId === user.id).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      
      {/* Navigation Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          user={user}
          activePath={activePath}
          onNavigate={setActivePath}
          onLogout={handleLogout}
          notificationsCount={notificationCounts}
        />
      </div>

      {/* Main Workspace Frame container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Mini Header on Desktop or Full header on Mobile devices */}
        <header className="bg-white border-b border-slate-200 py-3.5 px-6 flex items-center justify-between sticky top-0 z-30 print:hidden">
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 border border-slate-250 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-black text-slate-900">REGENT VARSITY</span>
          </div>

          <div className="hidden md:flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span>Institutional Portals</span>
            <span>/</span>
            <span className="text-slate-900 capitalize font-bold">{activePath} Panel</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick stats active labels */}
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono hidden sm:inline-block">
              SERVER API OK
            </span>
            <div className="relative">
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 relative">
                <Bell className="w-4 h-4" />
                {notificationCounts > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile menu side menu drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-64 bg-slate-900 text-white h-full p-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="font-bold text-blue-400">RSU PORTAL</span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {['dashboard', 'students', 'lecturers', 'prediction', 'reports'].map(path => (
                    <button
                      key={path}
                      onClick={() => { setActivePath(path); setMobileMenuOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded text-xs font-bold font-sans tracking-wide block capitalize ${
                        activePath === path ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {path} Panel
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded text-xs font-bold text-rose-400 hover:bg-rose-950/20 block"
                  >
                    Logout System
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Core content drawer view */}
        <main className="p-6 md:p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
}

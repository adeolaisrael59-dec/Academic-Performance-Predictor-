/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Clock, 
  Calendar, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Bell, 
  ChevronRight,
  BookOpen,
  Upload,
  Trash2,
  Plus,
  Minus,
  FileText,
  CheckSquare,
  Users
} from 'lucide-react';
import { StudentStats, SystemNotification, User } from '../types';
import { AcademicGauge, BarChart } from './Charts';

interface StudentDashboardProps {
  user: User;
  students: StudentStats[];
  notifications: SystemNotification[];
  onUpdateScores: (studentId: string, edits: Partial<StudentStats> & { modifiedBy?: string }) => Promise<void>;
}

export default function StudentDashboard({ user, students, notifications, onUpdateScores }: StudentDashboardProps) {
  // Find relative stats record in master list
  const myRecord = students.find(s => s.id === user.id) || {
    id: user.id,
    studentId: 'REG-2026-X01',
    name: user.name,
    email: user.email,
    department: user.department || 'Science and Technology',
    course: user.course || 'Advanced Analytics',
    attendancePct: 90,
    assignmentScore: 82,
    testScore: 80,
    studyHours: 12,
    submissionRate: 95,
    predictedGpa: 3.2,
    predictedStatus: 'Average' as const,
    updatedAt: new Date().toISOString()
  };

  // State for dragging files and upload simulator
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isSubmittingFile, setIsSubmittingFile] = useState(false);

  // Local student study hour slider to keep sliders highly responsive
  const [localHours, setLocalHours] = useState(myRecord.studyHours);

  // Update slider if raw record updates from background or staff changes
  useEffect(() => {
    setLocalHours(myRecord.studyHours);
  }, [myRecord.studyHours]);

  // Load submissions from localStorage
  const [submissions, setSubmissions] = useState<any[]>(() => {
    const saved = localStorage.getItem(`rsu_uploaded_assignments_${user.id}`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'sub-preset-1',
        title: 'Weekly Predictive Logic Lab 1',
        fileName: 'predictive_lab_logic.ipynb',
        size: '1.2 MB',
        timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
        status: 'Graded (94/100)',
        course: myRecord.course
      },
      {
        id: 'sub-preset-2',
        title: 'Coursework Literature Dossier',
        fileName: 'academic_literacy_rsu.pdf',
        size: '3.5 MB',
        timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
        status: 'Sent to Faculty Assessor',
        course: myRecord.course
      }
    ];
  });

  const saveSubmissionsToLocal = (updatedList: any[]) => {
    setSubmissions(updatedList);
    localStorage.setItem(`rsu_uploaded_assignments_${user.id}`, JSON.stringify(updatedList));
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (file.size > 15 * 1024 * 1024) { // 15MB limit
      setUploadError('File exceeds maximum RSU attachment file limit of 15MB.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setUploadError('');
    if (!assignmentTitle) {
      // populate title with file name minus extension
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      // replace underscores and dashes for cleaner defaults
      setAssignmentTitle(baseName.replace(/[_-]/g, ' '));
    }
  };

  const handleAddSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please drop or select an assignment file first.');
      return;
    }
    if (!assignmentTitle.trim()) {
      setUploadError('Please provide a readable assignment title.');
      return;
    }

    setIsSubmittingFile(true);
    setUploadError('');

    try {
      const newSub = {
        id: `sub-${Math.floor(10000 + Math.random() * 90000)}`,
        title: assignmentTitle.trim(),
        fileName: selectedFile.name,
        size: (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
        timestamp: new Date().toISOString(),
        status: 'Sent to Faculty Assessor',
        course: myRecord.course
      };

      const updatedList = [newSub, ...submissions];
      saveSubmissionsToLocal(updatedList);

      // System impact: increase student submissionRate (+5%) and assignmentScore (+3%)
      const nextSubmissionRate = Math.min(100, myRecord.submissionRate + 5);
      const nextAssignmentScore = Math.min(100, myRecord.assignmentScore + 3);

      await onUpdateScores(myRecord.id, {
        submissionRate: nextSubmissionRate,
        assignmentScore: nextAssignmentScore
      });

      setSelectedFile(null);
      setAssignmentTitle('');
    } catch (err) {
      console.error(err);
      setUploadError('Failed to synchronize submission with server models.');
    } finally {
      setIsSubmittingFile(false);
    }
  };

  const handleDeleteSubmission = async (subId: string, subFileName: string) => {
    const doubleCheck = confirm(`Are you sure you want to retract the submission of "${subFileName}"? This will systematically decrease your homework logs and submission frequency variables on the machine learning predictor.`);
    if (!doubleCheck) return;

    try {
      const updatedList = submissions.filter(s => s.id !== subId);
      saveSubmissionsToLocal(updatedList);

      // System inverse impact: decrease variables slightly to demonstrate model responsiveness
      const nextSubmissionRate = Math.max(0, myRecord.submissionRate - 5);
      const nextAssignmentScore = Math.max(0, myRecord.assignmentScore - 3);

      await onUpdateScores(myRecord.id, {
        submissionRate: nextSubmissionRate,
        assignmentScore: nextAssignmentScore
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Handle direct slide adjustment of study habits
  const handleSaveStudyHours = async () => {
    try {
      await onUpdateScores(myRecord.id, { studyHours: localHours });
      alert(`Weekly study schedule logged successfully at ${localHours} hours! Raw prediction formulas adjusted.`);
    } catch (err) {
      console.error(err);
      alert('Error updating study schedule parameters.');
    }
  };

  // Handle classroom session participation check in
  const handleLectureCheckIn = async () => {
    try {
      const currentVal = myRecord.attendancePct;
      if (currentVal >= 100) {
        alert("You already possess maximum 100% attendance rate for this academic block!");
        return;
      }
      const nextAttendance = Math.min(100, currentVal + 2);
      await onUpdateScores(myRecord.id, { attendancePct: nextAttendance });
      alert(`Lecture participation signed! Attendance index increased from ${currentVal}% to ${nextAttendance}%!`);
    } catch (err) {
      console.error(err);
      alert('Failed to register active classroom session.');
    }
  };

  // Helper code to calculate local fast response expected GPA before saving
  const getHypotheticalGpa = (hrs: number) => {
    const tempAps = (0.25 * myRecord.attendancePct) + (0.25 * myRecord.assignmentScore) + (0.30 * myRecord.testScore) + (0.10 * myRecord.submissionRate) + (0.10 * Math.min(hrs * 5, 100));
    let tempGpa = (tempAps / 100) * 4.0;
    tempGpa = Math.round(tempGpa * 10) / 10;
    return Math.max(0, Math.min(4, tempGpa)).toFixed(1);
  };

  const getHypotheticalStatus = (hrs: number) => {
    const tempAps = (0.25 * myRecord.attendancePct) + (0.25 * myRecord.assignmentScore) + (0.30 * myRecord.testScore) + (0.10 * myRecord.submissionRate) + (0.10 * Math.min(hrs * 5, 100));
    if (tempAps >= 85) return 'Excellent';
    if (tempAps >= 65) return 'Average';
    if (tempAps >= 45) return 'At Risk';
    return 'Fail';
  };

  // Coaching tips based on their current academic profile parameters
  const generateCoachingTips = () => {
    const tips = [];
    if (myRecord.attendancePct < 75) {
      tips.push({
        priority: 'High',
        message: 'Your attendance is currently below the 75% critical threshold! Attending 2 more lectures will shift your prediction status upwards.',
        color: 'text-rose-700 bg-rose-50 border-rose-200'
      });
    }
    if (myRecord.studyHours < 12) {
      tips.push({
        priority: 'Medium',
        message: 'The predictive model shows a strong correlation with study habits. Raising weekly study hours from ' + myRecord.studyHours + ' hours to 15 hours could improve your GPA prediction by +0.3.',
        color: 'text-amber-700 bg-amber-50 border-amber-200'
      });
    }
    if (myRecord.submissionRate < 90) {
      tips.push({
        priority: 'Medium',
        message: 'Ensure all home assignments are loaded before structural deadlines. Elevating submissions to 95% avoids point penalty predictions.',
        color: 'text-blue-700 bg-blue-50 border-blue-200'
      });
    }

    if (tips.length === 0) {
      tips.push({
        priority: 'Good Standing',
        message: 'Magnificent records! Your attendance and score parameters are highly aligned with tier excellence. Maintain this baseline.',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
      });
    }
    return tips;
  };

  const tips = generateCoachingTips();

  return (
    <div className="space-y-6">
      {/* Student Welcome Header */}
      <div className="relative overflow-hidden bg-[#1e3a8a] text-white p-6 rounded-lg border border-blue-900 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
              alt={user.name}
              className="w-16 h-16 rounded-full border-2 border-white object-cover"
            />
            <div>
              <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-sm bg-white/20 font-extrabold tracking-widest text-slate-100">
                STUDENT PROFILE
              </span>
              <h1 className="text-2xl font-black mt-1 tracking-tight">{user.name}</h1>
              <div className="flex flex-wrap items-center gap-x-4 mt-1 text-xs text-blue-100 font-medium">
                <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4 text-blue-300" /> ID: {myRecord.studentId}</span>
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-blue-300" /> Major: {myRecord.course}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-blue-300" /> Faculty of {myRecord.department}</span>
              </div>
            </div>
          </div>

          <div className="px-5 py-3.5 bg-white/10 backdrop-blur-md rounded border border-white/15 text-center min-w-[160px]">
            <span className="text-[10px] text-blue-200 uppercase tracking-widest font-black block">Forecast Standard</span>
            <span className={`text-xl font-black block mt-0.5 ${
              myRecord.predictedStatus === 'Excellent' ? 'text-emerald-400' :
              myRecord.predictedStatus === 'Average' ? 'text-blue-300' :
              myRecord.predictedStatus === 'At Risk' ? 'text-amber-400' : 'text-rose-400 animate-pulse'
            }`}>
              {myRecord.predictedStatus}
            </span>
            <span className="text-[9px] text-blue-200 font-medium tracking-wide">Expected GPA: <span className="text-white font-bold">{myRecord.predictedGpa}</span></span>
          </div>
        </div>

        {/* Decorative background grid effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
      </div>

      {/* Main Stats Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Semiciple Gauge */}
        <div className="bg-white p-5 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col items-center justify-center">
          <AcademicGauge value={myRecord.attendancePct} title="Attendance Rate" />
        </div>

        {/* GPA Forecast Semicircle Gauge */}
        <div className="bg-white p-5 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col items-center justify-center">
          <AcademicGauge value={(myRecord.predictedGpa / 4.0) * 100} title="Predicted GPA Dial" />
        </div>

        {/* Metrics Grid Comparison list */}
        <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 pb-1 border-b border-slate-100 flex items-center justify-between">
            <span>Critical Index Values</span>
            <span className="text-[8px] px-1.5 py-0.2 rounded font-mono bg-blue-50 text-blue-600">Actual Values</span>
          </h3>

          <div className="space-y-3.5 py-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Homework Assignments:</span>
              <span className="text-slate-900 font-black font-mono">{myRecord.assignmentScore}%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Test & Exams Average:</span>
              <span className="text-slate-900 font-black font-mono">{myRecord.testScore}%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Weekly Study Interval:</span>
              <span className="text-slate-900 font-black font-mono">{myRecord.studyHours} hours</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Task Submission Frequency:</span>
              <span className="text-slate-900 font-black font-mono">{myRecord.submissionRate}%</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-500" /> Re-calibrating live on student actions.
          </div>
        </div>
      </div>

      {/* STUDENT INTERACTIVE PORTAL ACTIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Habit Study log & Attendance Check-In card */}
        <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#1e3a8a]" /> Student Lecture Check-In
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Boost your attendance rate register. Check-in during active class lectures to log daily participation and protect your profile from falling below critical retention levels.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-100">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Current Attendance</span>
                <span className="text-lg font-black text-slate-800 font-mono">{myRecord.attendancePct}%</span>
              </div>
              <button
                onClick={handleLectureCheckIn}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1e3a8a] text-white hover:bg-blue-900 text-xs font-bold rounded-md transition cursor-pointer shadow-xs"
              >
                <CheckCircle className="w-4 h-4" /> Log Classroom Attendance
              </button>
            </div>

            <div className="border-b border-slate-100 pt-2 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#1e3a8a]" /> Manage Weekday Study Habits
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Adjust the hours slider to log your active study habits. See how the predictive system shifts your Expected GPA dynamically.
              </p>
            </div>

            <div className="space-y-4 p-4 bg-blue-50/50 rounded border border-blue-100/30">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Weekly Study Schedule:</span>
                <span className="font-mono text-[#1e3a8a] text-sm bg-blue-100/80 px-2 py-0.5 rounded">
                  {localHours} hours / week
                </span>
              </div>

              <input
                id="student-study-habits-slider"
                type="range"
                min="0"
                max="40"
                value={localHours}
                onChange={e => setLocalHours(Number(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-[#1e3a8a]"
              />

              {/* Real-time slider metrics helper */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Provisional Forecast GPA</span>
                  <span className="text-lg font-black block font-mono text-emerald-600">
                    {getHypotheticalGpa(localHours)} / 4.0
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Provisional Status</span>
                  <span className={`text-sm font-extrabold block uppercase ${
                    getHypotheticalStatus(localHours) === 'Excellent' ? 'text-emerald-500' :
                    getHypotheticalStatus(localHours) === 'Average' ? 'text-blue-500' :
                    getHypotheticalStatus(localHours) === 'At Risk' ? 'text-amber-500' : 'text-rose-500'
                  }`}>
                    {getHypotheticalStatus(localHours)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSaveStudyHours}
                  className="px-4 py-2 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-white font-bold text-xs rounded-md transition cursor-pointer"
                >
                  Confirm Study Habits Log
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Homework Task Upload Portal workspace */}
        <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#1e3a8a]" /> Academic Deliverables & Tasks Uploader
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Submit raw notebook files, research papers, or exercises to our academic checker. Every upload raises task ratings and validates consistency.
              </p>
            </div>

            {/* Drag and Drop area */}
            <form onSubmit={handleAddSubmission} className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-6 border-2 border-dashed rounded-lg text-center transition flex flex-col items-center justify-center min-h-[140px] cursor-pointer ${
                  isDragging 
                    ? 'border-[#1e3a8a] bg-blue-50/50' 
                    : selectedFile 
                      ? 'border-emerald-500 bg-emerald-50/10' 
                      : 'border-slate-300 hover:border-slate-400'
                }`}
                onClick={() => document.getElementById('student-file-input')?.click()}
              >
                <input
                  id="student-file-input"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ipynb,.zip,.txt,.csv"
                />

                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[280px]">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        Drag & Drop document here, or <span className="text-[#1e3a8a] underline">browse files</span>
                      </p>
                      <p className="text-[9px] text-slate-400 font-medium">
                        Supports PDF, IPYNB, ZIP, or DOCX (Max 15MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {selectedFile && (
                <div className="space-y-3 p-3 bg-slate-50 rounded border border-slate-100">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Deliverable Title Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Weekly predictive notebook log"
                      value={assignmentTitle}
                      onChange={e => setAssignmentTitle(e.target.value)}
                      required
                      onClick={e => e.stopPropagation()}
                      className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded bg-white focus:outline-hidden"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setAssignmentTitle('');
                      }}
                      className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
                    >
                      Clear File
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingFile}
                      onClick={e => e.stopPropagation()}
                      className="flex-1 px-3 py-2 text-xs bg-[#1e3a8a] text-white font-extrabold rounded hover:bg-blue-900 cursor-pointer text-center"
                    >
                      {isSubmittingFile ? 'Registering...' : 'Confirm Upload Sync'}
                    </button>
                  </div>
                </div>
              )}

              {uploadError && (
                <p className="text-[11px] text-rose-500 font-semibold">{uploadError}</p>
              )}
            </form>

            {/* List of uploaded items */}
            <div className="pt-2">
              <h3 className="text-[10px] uppercase font-bold text-slate-450 tracking-wider mb-2">My Recents Deliverables Roster</h3>
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {submissions.map((sub: any) => (
                  <div key={sub.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-150 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4.5 h-4.5 text-blue-500" />
                      <div className="truncate">
                        <h4 className="font-bold text-slate-800 truncate max-w-[200px]">{sub.title}</h4>
                        <span className="text-[9px] text-slate-500 block truncate">{sub.fileName} • {sub.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wide">
                        {sub.status}
                      </span>
                      <button
                        onClick={() => handleDeleteSubmission(sub.id, sub.fileName)}
                        className="text-slate-400 hover:text-rose-600 rounded p-1 transition cursor-pointer"
                        title="Retract submission"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Recommendations & Coaching Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Coaching Tips */}
        <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" /> Academic Forecast & Coaching Tips
          </h2>
          <div className="space-y-3 flex-1">
            {tips.map((tip, index) => (
              <div 
                key={index} 
                id={`coaching-tip-${index}`}
                className={`p-4 rounded border text-xs space-y-1.5 ${tip.color}`}
              >
                <div className="flex justify-between items-center font-bold uppercase tracking-wide">
                  <span>Recommendation Standard</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/50">{tip.priority}</span>
                </div>
                <p className="font-semibold leading-relaxed">{tip.message}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-slate-400 text-[10px] leading-relaxed">
            The prediction values are computed server-side via university models analyzing past graduate performances. Adding 1 hour of weekly study improves grades probabilities systematically.
          </div>
        </div>

        {/* Global Administrative Announcements Board */}
        <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-xs flex flex-col">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" /> Faculty Notice & Feed Alerts
          </h2>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2">
            {notifications
              .filter(notif => notif.userId === 'all' || notif.userId === user.id)
              .map(notif => (
                <div key={notif.id} className="flex gap-3 text-xs items-start p-3 bg-slate-50 rounded-lg">
                  <div className={`p-1.5 rounded-md mt-0.5 ${
                    notif.type === 'danger' ? 'bg-red-100 text-red-600' :
                    notif.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {notif.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{notif.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                    <span className="text-[9px] text-slate-405 block mt-1 font-mono">{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            {notifications.length === 0 && (
              <p className="text-slate-400 mt-10 text-center font-medium">No official notifications dispatched.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

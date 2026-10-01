/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'lecturer' | 'student';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  department?: string;
  course?: string;
  profilePic?: string;
}

export interface StudentStats {
  id: string;
  studentId: string; // academic ID like "STU-2026-001"
  name: string;
  email: string;
  department: string;
  course: string;
  attendancePct: number; // 0-100
  assignmentScore: number; // 0-100
  testScore: number; // 0-100
  studyHours: number; // hours per week
  submissionRate: number; // 0-100
  predictedGpa: number; // 0.0 - 4.0
  predictedStatus: 'Excellent' | 'Average' | 'At Risk' | 'Fail';
  updatedAt: string;
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  department: string;
  course: string;
  studentCount: number;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
}

export interface SystemNotification {
  id: string;
  userId: string; // Target user or 'all'
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  createdAt: string;
}

export interface SystemRecord {
  id: string;
  action: string;
  performedBy: string;
  role: string;
  timestamp: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  courses: string[];
}

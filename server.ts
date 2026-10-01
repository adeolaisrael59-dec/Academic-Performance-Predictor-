/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'database.json');

// Interface to match our database.json schema
interface DbSchema {
  users: any[];
  students: any[];
  notifications: any[];
  records: any[];
  departments: any[];
}

// Read database file
async function readDb(): Promise<DbSchema> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Database read error, using fallback:', err);
    return { users: [], students: [], notifications: [], records: [], departments: [] };
  }
}

// Write database file
async function writeDb(data: DbSchema): Promise<void> {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Database write error:', err);
  }
}

// Core Academic Prediction Logic
function calculatePrediction(attrs: {
  attendancePct: number;
  assignmentScore: number;
  testScore: number;
  studyHours: number;
  submissionRate: number;
}) {
  const A = Math.max(0, Math.min(100, Number(attrs.attendancePct || 0)));
  const Asg = Math.max(0, Math.min(100, Number(attrs.assignmentScore || 0)));
  const Tst = Math.max(0, Math.min(100, Number(attrs.testScore || 0)));
  const Sub = Math.max(0, Math.min(100, Number(attrs.submissionRate || 0)));
  const Hrs = Math.max(0, Math.min(40, Number(attrs.studyHours || 0)));

  // APS formula weighting
  const aps = (0.25 * A) + (0.25 * Asg) + (0.30 * Tst) + (0.10 * Sub) + (0.10 * Math.min(Hrs * 5, 100));

  let predictedStatus: 'Excellent' | 'Average' | 'At Risk' | 'Fail';
  if (aps >= 85) {
    predictedStatus = 'Excellent';
  } else if (aps >= 65) {
    predictedStatus = 'Average';
  } else if (aps >= 45) {
    predictedStatus = 'At Risk';
  } else {
    predictedStatus = 'Fail';
  }

  // Calculate predicted GPA (realistic curve on a 4.0 scale)
  let predictedGpa = (aps / 100) * 4.0;
  // Apply visual rounding
  predictedGpa = Math.round(predictedGpa * 10) / 10;
  if (predictedGpa > 4.0) predictedGpa = 4.0;
  if (predictedGpa < 0.0) predictedGpa = 0.0;

  return { aps, predictedStatus, predictedGpa };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // ---------------- AUTHENTICATION APIS ----------------

  // Register Endpoint
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password, role, department, course } = req.body;
      if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Name, email, password, and role are required' });
      }

      const db = await readDb();
      const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered' });
      }

      const generatedId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
      const newUser = {
        id: generatedId,
        role,
        name,
        email,
        password, // Client side validation + simple matching
        department: department || '',
        course: course || '',
        profilePic: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
      };

      db.users.push(newUser);

      // If registered as student, add dynamic initial record
      if (role === 'student') {
        const studentId = `REG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
        // Fallback placeholder scores
        const prediction = calculatePrediction({
          attendancePct: 80,
          assignmentScore: 70,
          testScore: 70,
          studyHours: 10,
          submissionRate: 85
        });

        db.students.push({
          id: generatedId,
          studentId,
          name,
          email,
          department: department || 'General Science',
          course: course || 'Foundation Studies',
          attendancePct: 80,
          assignmentScore: 70,
          testScore: 70,
          studyHours: 10,
          submissionRate: 85,
          predictedGpa: prediction.predictedGpa,
          predictedStatus: prediction.predictedStatus,
          updatedAt: new Date().toISOString()
        });
      }

      // Add system log
      db.records.push({
        id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
        action: `Registered self as ${role}`,
        performedBy: name,
        role: role.toUpperCase(),
        timestamp: new Date().toISOString()
      });

      await writeDb(db);
      res.status(201).json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, department: newUser.department, course: newUser.course, profilePic: newUser.profilePic } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Login Endpoint
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const db = await readDb();
      const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Track log
      db.records.push({
        id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
        action: `Logged into administrative dashboard`,
        performedBy: user.name,
        role: user.role.toUpperCase(),
        timestamp: new Date().toISOString()
      });
      await writeDb(db);

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          course: user.course,
          profilePic: user.profilePic
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ---------------- STUDENT APIS ----------------

  // Get Students List
  app.get('/api/students', async (req, res) => {
    const db = await readDb();
    res.json(db.students);
  });

  // Create Student (Admin Only)
  app.post('/api/students', async (req, res) => {
    try {
      const { name, email, department, course, attendancePct, assignmentScore, testScore, studyHours, submissionRate } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const db = await readDb();
      // Generate ID
      const userId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
      const studentId = `REG-2026-${Math.floor(100 + Math.random() * 900)}`;

      const prediction = calculatePrediction({
        attendancePct: Number(attendancePct || 80),
        assignmentScore: Number(assignmentScore || 70),
        testScore: Number(testScore || 70),
        studyHours: Number(studyHours || 10),
        submissionRate: Number(submissionRate || 80)
      });

      // Add to users and students
      db.users.push({
        id: userId,
        role: 'student',
        name,
        email,
        password: 'password123', // default
        profilePic: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        department,
        course
      });

      const newStudent = {
        id: userId,
        studentId,
        name,
        email,
        department: department || 'General Science',
        course: course || 'Foundation Studies',
        attendancePct: Number(attendancePct || 80),
        assignmentScore: Number(assignmentScore || 70),
        testScore: Number(testScore || 70),
        studyHours: Number(studyHours || 10),
        submissionRate: Number(submissionRate || 80),
        predictedGpa: prediction.predictedGpa,
        predictedStatus: prediction.predictedStatus,
        updatedAt: new Date().toISOString()
      };

      db.students.push(newStudent);

      db.records.push({
        id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
        action: `Added student record: ${name}`,
        performedBy: 'System Administrative Action',
        role: 'ADMIN',
        timestamp: new Date().toISOString()
      });

      await writeDb(db);
      res.status(201).json(newStudent);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Edit Student Score (Lecturer/Admin)
  app.put('/api/students/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const edits = req.body;
      const db = await readDb();

      const idx = db.students.findIndex(s => s.id === id);
      if (idx === -1) {
        return res.status(404).json({ error: 'Student record not found' });
      }

      const updatedStudent = {
        ...db.students[idx],
        ...edits,
        attendancePct: edits.attendancePct !== undefined ? Number(edits.attendancePct) : db.students[idx].attendancePct,
        assignmentScore: edits.assignmentScore !== undefined ? Number(edits.assignmentScore) : db.students[idx].assignmentScore,
        testScore: edits.testScore !== undefined ? Number(edits.testScore) : db.students[idx].testScore,
        studyHours: edits.studyHours !== undefined ? Number(edits.studyHours) : db.students[idx].studyHours,
        submissionRate: edits.submissionRate !== undefined ? Number(edits.submissionRate) : db.students[idx].submissionRate,
        updatedAt: new Date().toISOString()
      };

      // Perform re-prediction with edited fields
      const p = calculatePrediction({
        attendancePct: updatedStudent.attendancePct,
        assignmentScore: updatedStudent.assignmentScore,
        testScore: updatedStudent.testScore,
        studyHours: updatedStudent.studyHours,
        submissionRate: updatedStudent.submissionRate
      });

      updatedStudent.predictedGpa = p.predictedGpa;
      updatedStudent.predictedStatus = p.predictedStatus;

      db.students[idx] = updatedStudent;

      // Update name or metadata in the base users record if edited
      const userIdx = db.users.findIndex(u => u.id === id);
      if (userIdx !== -1) {
        db.users[userIdx].name = updatedStudent.name;
        db.users[userIdx].email = updatedStudent.email;
        if (updatedStudent.department) db.users[userIdx].department = updatedStudent.department;
        if (updatedStudent.course) db.users[userIdx].course = updatedStudent.course;
      }

      // Add record log
      db.records.push({
        id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
        action: `Edited academic performance parameters of ${updatedStudent.name}`,
        performedBy: edits.modifiedBy || 'Lecturer/Admin',
        role: 'SYSTEM',
        timestamp: new Date().toISOString()
      });

      await writeDb(db);
      res.json(updatedStudent);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete Student (Admin Only)
  app.delete('/api/students/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const db = await readDb();

      const studentExists = db.students.some(s => s.id === id);
      if (!studentExists) {
        return res.status(404).json({ error: 'Student not found' });
      }

      db.students = db.students.filter(s => s.id !== id);
      db.users = db.users.filter(u => u.id !== id);

      db.records.push({
        id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
        action: `Deleted student index: ${id}`,
        performedBy: 'System Administrative Action',
        role: 'ADMIN',
        timestamp: new Date().toISOString()
      });

      await writeDb(db);
      res.json({ success: true, message: 'Student successfully removed' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ---------------- LECTURER APIS ----------------

  // Get Lecturers
  app.get('/api/lecturers', async (req, res) => {
    const db = await readDb();
    const lecturersOnly = db.users.filter(u => u.role === 'lecturer');
    
    // Map in mock student count totals for administrative UI
    const mapped = lecturersOnly.map(l => {
      const studs = db.students.filter(s => s.course.toLowerCase() === l.course.toLowerCase());
      return {
        id: l.id,
        name: l.name,
        email: l.email,
        department: l.department || 'General Science',
        course: l.course || 'Core Studies',
        studentCount: studs.length
      };
    });

    res.json(mapped);
  });

  // Create Lecturer (Admin Only)
  app.post('/api/lecturers', async (req, res) => {
    try {
      const { name, email, department, course } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: 'Lecturer name and email are required' });
      }

      const db = await readDb();
      const generatedId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
      const newLecturer = {
        id: generatedId,
        role: 'lecturer',
        name,
        email,
        password: 'password123', // default
        department: department || 'Faculty of STEM',
        course: course || 'General Lecture',
        profilePic: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
      };

      db.users.push(newLecturer);

      db.records.push({
        id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
        action: `Registered staff lecturer: ${name}`,
        performedBy: 'Dean Admin Office',
        role: 'ADMIN',
        timestamp: new Date().toISOString()
      });

      await writeDb(db);
      res.status(201).json(newLecturer);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete Lecturer (Admin only)
  app.delete('/api/lecturers/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const db = await readDb();

      db.users = db.users.filter(u => u.id !== id);

      db.records.push({
        id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
        action: `Released staff lecturer index: ${id}`,
        performedBy: 'Dean Admin Office',
        role: 'ADMIN',
        timestamp: new Date().toISOString()
      });

      await writeDb(db);
      res.json({ success: true, message: 'Lecturer successfully removed' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ---------------- DEPARTMENTS APIS ----------------

  app.get('/api/departments', async (req, res) => {
    const db = await readDb();
    res.json(db.departments);
  });

  app.post('/api/departments', async (req, res) => {
    try {
      const { name, code, courses } = req.body;
      if (!name || !code) {
        return res.status(400).json({ error: 'Department name and code is required' });
      }

      const db = await readDb();
      const newDept = {
        id: `DEP-${Math.floor(100 + Math.random() * 900)}`,
        name,
        code: code.toUpperCase(),
        courses: courses || []
      };

      db.departments.push(newDept);
      await writeDb(db);
      res.status(201).json(newDept);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ---------------- RECORDS APIS ----------------

  app.get('/api/records', async (req, res) => {
    const db = await readDb();
    res.json(db.records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  });

  // ---------------- NOTIFICATIONS APIS ----------------

  app.get('/api/notifications', async (req, res) => {
    const db = await readDb();
    res.json(db.notifications);
  });

  app.post('/api/notifications', async (req, res) => {
    try {
      const { title, message, type, userId } = req.body;
      if (!title || !message) {
        return res.status(400).json({ error: 'Title and message are required' });
      }

      const db = await readDb();
      const newNotif = {
        id: `NT-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: userId || 'all',
        title,
        message,
        type: type || 'info',
        createdAt: new Date().toISOString()
      };

      db.notifications.unshift(newNotif);
      await writeDb(db);
      res.status(201).json(newNotif);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ---------------- SANDBOX PREDICTION (STATLESS/PUBLIC) ----------------

  app.post('/api/predict-sandbox', (req, res) => {
    const { attendancePct, assignmentScore, testScore, studyHours, submissionRate } = req.body;
    const results = calculatePrediction({
      attendancePct: Number(attendancePct),
      assignmentScore: Number(assignmentScore),
      testScore: Number(testScore),
      studyHours: Number(studyHours),
      submissionRate: Number(submissionRate)
    });
    res.json({ success: true, ...results });
  });

  // ---------------- VITE / FRONTEND SERVING ----------------

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      // Avoid intercepting API routes that passed through
      if (req.path.startsWith('/api/')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`University System API Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server failed to bootstrap:', err);
});

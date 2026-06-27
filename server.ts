/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/server/db.js';

// Load environment variables from .env
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parser with plenty of headroom for document uploads
app.use(express.json({ limit: '10mb' }));

// Helper: Initialize Gemini AI
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. STUDENTS ENDPOINTS
app.get('/api/students', (req, res) => {
  try {
    let students = db.students.all();
    const { search, status, courseId, batchId } = req.query;

    if (search) {
      const q = String(search).toLowerCase();
      students = students.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.id.toLowerCase().includes(q) || 
        s.email.toLowerCase().includes(q) ||
        s.mobile.includes(q)
      );
    }

    if (status) {
      students = students.filter(s => s.status === status);
    }

    if (courseId) {
      students = students.filter(s => s.courseId === courseId);
    }

    if (batchId) {
      students = students.filter(s => s.batchId === batchId);
    }

    res.json(students);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/students/:id', (req, res) => {
  const student = db.students.find(req.params.id);
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

app.post('/api/students', (req, res) => {
  try {
    const newStudent = db.students.create(req.body);
    res.status(201).json(newStudent);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/students/:id', (req, res) => {
  try {
    const updated = db.students.update(req.params.id, req.body);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/students/:id', (req, res) => {
  try {
    const success = db.students.delete(req.params.id);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students/:id/timeline', (req, res) => {
  try {
    const success = db.students.addTimeline(req.params.id, req.body);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 2. COURSES ENDPOINTS
app.get('/api/courses', (req, res) => {
  res.json(db.courses.all());
});

app.get('/api/courses/:id', (req, res) => {
  const course = db.courses.find(req.params.id);
  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

app.post('/api/courses', (req, res) => {
  try {
    const course = db.courses.create(req.body);
    res.status(201).json(course);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/courses/:id', (req, res) => {
  const updated = db.courses.update(req.params.id, req.body);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

app.delete('/api/courses/:id', (req, res) => {
  const success = db.courses.delete(req.params.id);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

// 3. BATCHES ENDPOINTS
app.get('/api/batches', (req, res) => {
  res.json(db.batches.all());
});

app.get('/api/batches/:id', (req, res) => {
  const batch = db.batches.find(req.params.id);
  if (batch) {
    res.json(batch);
  } else {
    res.status(404).json({ error: 'Batch not found' });
  }
});

app.post('/api/batches', (req, res) => {
  try {
    const batch = db.batches.create(req.body);
    res.status(201).json(batch);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/batches/:id', (req, res) => {
  const updated = db.batches.update(req.params.id, req.body);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Batch not found' });
  }
});

app.delete('/api/batches/:id', (req, res) => {
  const success = db.batches.delete(req.params.id);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Batch not found' });
  }
});

// 4. TRAINERS ENDPOINTS
app.get('/api/trainers', (req, res) => {
  res.json(db.trainers.all());
});

app.get('/api/trainers/:id', (req, res) => {
  const trainer = db.trainers.find(req.params.id);
  if (trainer) {
    res.json(trainer);
  } else {
    res.status(404).json({ error: 'Trainer not found' });
  }
});

app.post('/api/trainers', (req, res) => {
  try {
    const trainer = db.trainers.create(req.body);
    res.status(201).json(trainer);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/trainers/:id', (req, res) => {
  const updated = db.trainers.update(req.params.id, req.body);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Trainer not found' });
  }
});

app.delete('/api/trainers/:id', (req, res) => {
  const success = db.trainers.delete(req.params.id);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Trainer not found' });
  }
});

// 5. PAYMENTS ENDPOINTS
app.get('/api/payments', (req, res) => {
  res.json(db.payments.all());
});

app.post('/api/payments', (req, res) => {
  try {
    const payment = db.payments.create(req.body);
    res.status(201).json(payment);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 6. ATTENDANCE ENDPOINTS
app.get('/api/attendance', (req, res) => {
  res.json(db.attendance.all());
});

app.post('/api/attendance', (req, res) => {
  try {
    const attendance = db.attendance.create(req.body);
    res.status(201).json(attendance);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 7. CERTIFICATES ENDPOINTS
app.get('/api/certificates', (req, res) => {
  res.json(db.certificates.all());
});

app.post('/api/certificates', (req, res) => {
  try {
    const cert = db.certificates.create(req.body);
    res.status(201).json(cert);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 8. PLACEMENTS ENDPOINTS
app.get('/api/placements', (req, res) => {
  res.json(db.placements.all());
});

app.post('/api/placements', (req, res) => {
  try {
    const placement = db.placements.create(req.body);
    res.status(201).json(placement);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/placements/:id', (req, res) => {
  try {
    const updated = db.placements.update(req.params.id, req.body);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Placement record not found' });
    }
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 9. AUDIT LOGS ENDPOINTS
app.get('/api/audit-logs', (req, res) => {
  res.json(db.auditLogs.all());
});

// 10. NOTIFICATIONS LOGS & TRIGGER
app.get('/api/notifications', (req, res) => {
  res.json(db.notifications.all());
});

app.post('/api/notifications', (req, res) => {
  try {
    const { studentId, type, title, message } = req.body;
    const log = db.notifications.add({
      studentId,
      type,
      title,
      message,
      status: 'Sent'
    });
    res.status(201).json(log);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 11. SETTINGS ENDPOINTS
app.get('/api/settings', (req, res) => {
  res.json(db.settings.get());
});

app.put('/api/settings', (req, res) => {
  try {
    const updated = db.settings.update(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/settings/backup', (req, res) => {
  try {
    const dbData = db.get();
    const sizeInKb = Math.round(JSON.stringify(dbData).length / 1024) + ' KB';
    db.settings.addBackup(sizeInKb);
    res.json({ success: true, size: sizeInKb });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// AI / BUSINESS INTELLIGENCE ENDPOINTS
// ==========================================

// Predictor Calculations Engine
app.get('/api/ai/predictions', async (req, res) => {
  try {
    const students = db.students.all();
    const payments = db.payments.all();
    const batches = db.batches.all();
    const courses = db.courses.all();
    const trainers = db.trainers.all();
    const attendance = db.attendance.all();
    const placements = db.placements.all();

    // 1. Revenue Forecast
    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalPending = students.reduce((sum, s) => sum + s.pendingAmount, 0);
    const pastMonthlyPayments: Record<string, number> = {};
    payments.forEach(p => {
      const monthStr = p.date.substring(0, 7); // YYYY-MM
      pastMonthlyPayments[monthStr] = (pastMonthlyPayments[monthStr] || 0) + p.amount;
    });

    const nextMonthExpectedCollection = students
      .filter(s => s.status === 'Active' && s.pendingAmount > 0)
      .reduce((sum, s) => {
        // Assume active students pay outstanding dues split over remaining course duration
        const batch = batches.find(b => b.id === s.batchId);
        const course = courses.find(c => c.id === s.courseId);
        if (batch && course) {
          const remainingMonths = Math.max(1, 3); // simulation default
          return sum + (s.pendingAmount / remainingMonths);
        }
        return sum + (s.pendingAmount * 0.3); // 30% next month
      }, 0);

    // 2. Student Dropout Risk Prediction Algorithm (Heuristic + Business Logic)
    const dropoutPredictions = students
      .filter(s => s.status === 'Active')
      .map(student => {
        const studentAttendance = attendance.filter(att => 
          att.batchId === student.batchId
        );
        let presentCount = 0;
        let totalClasses = 0;
        studentAttendance.forEach(att => {
          const record = att.studentRecords.find(r => r.studentId === student.id);
          if (record) {
            totalClasses += 1;
            if (record.status === 'Present' || record.status === 'Late') presentCount += 1;
          }
        });

        const attendanceRate = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 85; // default fallback
        const feePendingRatio = student.courseFee > 0 ? student.pendingAmount / student.courseFee : 0;
        
        // Calculate Risk Score (0 to 100)
        let riskScore = 15; // baseline risk
        if (attendanceRate < 75) riskScore += 35;
        if (attendanceRate < 60) riskScore += 25;
        if (feePendingRatio > 0.5) riskScore += 15;
        if (feePendingRatio > 0.75) riskScore += 10;
        if (student.remarks.toLowerCase().includes('low') || student.remarks.toLowerCase().includes('struggles')) riskScore += 10;
        
        // Cap risk
        riskScore = Math.min(95, Math.max(5, Math.round(riskScore)));
        
        let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
        if (riskScore > 65) riskLevel = 'High';
        else if (riskScore > 40) riskLevel = 'Medium';

        const reasons: string[] = [];
        if (attendanceRate < 75) reasons.push(`Low attendance (${Math.round(attendanceRate)}%)`);
        if (feePendingRatio > 0.5) reasons.push(`High outstanding pending dues (${Math.round(feePendingRatio * 100)}%)`);
        if (student.remarks.toLowerCase().includes('attendance') || student.remarks.toLowerCase().includes('struggle')) {
          reasons.push("Negative review comments in registry remarks");
        }
        if (reasons.length === 0) reasons.push("No significant risk signals detected");

        return {
          studentId: student.id,
          studentName: student.name,
          riskScore,
          riskLevel,
          attendanceRate: Math.round(attendanceRate),
          pendingFee: student.pendingAmount,
          reasons
        };
      })
      .sort((a, b) => b.riskScore - a.riskScore); // Highest risk first

    // 3. Fee Collection Prediction
    const likelyDefaulters = students
      .filter(s => s.status === 'Active' && s.pendingAmount > 10000)
      .map(s => {
        const studentRisk = dropoutPredictions.find(dp => dp.studentId === s.id);
        const probabilityOfDefault = studentRisk ? studentRisk.riskScore : 25;
        return {
          studentId: s.id,
          studentName: s.name,
          pendingAmount: s.pendingAmount,
          defaultProbability: probabilityOfDefault,
          alertLevel: probabilityOfDefault > 60 ? 'Critical' : (probabilityOfDefault > 40 ? 'Warning' : 'Low')
        };
      })
      .sort((a, b) => b.defaultProbability - a.defaultProbability);

    // 4. Course Recommendation
    const coursePopularity = courses.map(course => {
      const enrolledCount = students.filter(s => s.courseId === course.id).length;
      const courseRevenue = payments
        .filter(p => {
          const s = students.find(stud => stud.id === p.studentId);
          return s && s.courseId === course.id;
        })
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        courseId: course.id,
        courseName: course.name,
        enrollments: enrolledCount,
        revenue: courseRevenue,
        rating: 4.5 + (enrolledCount % 5) * 0.1 // simulated
      };
    }).sort((a, b) => b.enrollments - a.enrollments);

    // 5. Trainer Performance AI Suggestions
    const trainerEffectiveness = trainers.map(t => {
      const activeBatches = batches.filter(b => b.trainerId === t.id);
      const studentCount = students.filter(s => s.trainerId === t.id).length;
      const rating = t.rating;
      
      let utilization = Math.round((activeBatches.length / 3) * 100); // assume 3 max standard load
      utilization = Math.min(100, utilization);

      return {
        trainerId: t.id,
        trainerName: t.name,
        rating,
        activeBatches: activeBatches.length,
        studentCount,
        utilization,
        loadStatus: utilization > 90 ? 'Overloaded' : (utilization < 40 ? 'Underutilized' : 'Optimal')
      };
    });

    // 6. Placement Prediction Metrics
    const totalCompleted = students.filter(s => s.status === 'Completed').length;
    const totalPlaced = placements.filter(p => p.status === 'Placed').length;
    const placementRate = totalCompleted > 0 ? Math.round((totalPlaced / totalCompleted) * 100) : 85;

    // Generate static narrative AI Advice
    let aiNarrativeAdvice = "AI Business Insights: Demand for Automation & Python courses has spiked this month. We recommend opening a weekend Python AI/ML batch to capture extra inquiries. Total collected revenue is tracking 12% higher month-over-month. However, 3 students in Java Full Stack have critically low attendance and require immediate coordination calls to prevent dropouts.";

    // Call Gemini for custom narrative insights if key is available
    const aiClient = getAiClient();
    if (aiClient) {
      try {
        const prompt = `
          Analyze this summary data for MR Technologies Training ERP:
          - Total Active Students: ${students.filter(s => s.status === 'Active').length}
          - Total Completed Students: ${students.filter(s => s.status === 'Completed').length}
          - Pending Outstanding Dues: INR ${totalPending}
          - Monthly forecasted next-month collection: INR ${Math.round(nextMonthExpectedCollection)}
          - Placements Count: ${totalPlaced} out of ${totalCompleted} completed.
          - High Dropout Risk Students Count: ${dropoutPredictions.filter(d => d.riskLevel === 'High').length}
          - Top Courses: ${coursePopularity.slice(0, 2).map(c => c.courseName).join(', ')}

          Generate 3-4 bullet points of high-level administrative advice. Be highly objective, strategic, professional, and clear. Limit your response to 120 words.
        `;

        const aiResponse = await aiClient.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt
        });

        if (aiResponse.text) {
          aiNarrativeAdvice = aiResponse.text;
        }
      } catch (geminiErr) {
        console.warn("Gemini prediction generation failed. Using default heuristic suggestions.", geminiErr);
      }
    }

    res.json({
      revenuePrediction: {
        currentMonthTotal: Math.round(payments.reduce((sum, p) => {
          if (p.date.startsWith('2026-06')) return sum + p.amount;
          return sum;
        }, 0)),
        nextMonthExpected: Math.round(nextMonthExpectedCollection),
        growthRatePct: 15.5
      },
      dropoutPredictions: dropoutPredictions.slice(0, 5), // return top 5 risk candidates
      feePredictions: {
        collectionProbability: 82,
        likelyDefaulters: likelyDefaulters.slice(0, 5),
        expectedCashflow: Math.round(nextMonthExpectedCollection * 0.85)
      },
      courseRecommendations: {
        popular: coursePopularity.slice(0, 3),
        trendingCourses: [
          { name: "Generative AI Foundations", reason: "35% search query surge this quarter" },
          { name: "React Native Mobile Dev", reason: "High requirement from hiring partners in Pune" }
        ]
      },
      trainerAnalytics: trainerEffectiveness,
      placementStats: {
        placedCount: totalPlaced,
        completedCount: totalCompleted,
        placementPercentage: placementRate
      },
      aiNarrativeAdvice
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// AI Chat Assistant
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const students = db.students.all();
    const courses = db.courses.all();
    const batches = db.batches.all();
    const trainers = db.trainers.all();
    const payments = db.payments.all();
    const certificates = db.certificates.all();
    const placements = db.placements.all();

    // 1. Calculate key metrics to provide to Gemini as grounded context
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const pendingDues = students.reduce((sum, s) => sum + s.pendingAmount, 0);
    const activeStudentsCount = students.filter(s => s.status === 'Active').length;
    const completedStudentsCount = students.filter(s => s.status === 'Completed').length;
    const unpaidStudents = students.filter(s => s.pendingAmount > 0).map(s => ({
      id: s.id,
      name: s.name,
      pending: s.pendingAmount,
      course: courses.find(c => c.id === s.courseId)?.name || 'Unknown',
      mobile: s.mobile
    }));

    // Formulate a compact system grounding data block
    const systemContext = `
      You are the AI Business Intelligence Assistant for MR Technologies ERP, a high-tech training institute.
      Below is the real-time, grounded data from the institute database:

      --- INSTITUTE STATISTICS ---
      - Total Registered Students: ${students.length}
      - Active Enrolled Students: ${activeStudentsCount}
      - Completed Grads: ${completedStudentsCount}
      - Active Courses: ${courses.map(c => `${c.name} (${c.id})`).join(', ')}
      - Active Running Batches: ${batches.length} (Ongoing: ${batches.filter(b => b.status === 'Ongoing').length})
      - Total Certified Trainers: ${trainers.length}
      - Total Historic Revenue: INR ${totalRevenue}
      - Total Pending Dues Outstanding: INR ${pendingDues}
      - Placed Students: ${placements.filter(p => p.status === 'Placed').length}
      - Placed rate of grads: ${completedStudentsCount > 0 ? Math.round((placements.filter(p => p.status === 'Placed').length / completedStudentsCount) * 100) : 85}%

      --- STUDENTS WITH PENDING FEES ---
      ${JSON.stringify(unpaidStudents.slice(0, 10))}

      --- COUSE REVENUE & POPULARITY ---
      ${courses.map(c => {
        const count = students.filter(s => s.courseId === c.id).length;
        return `${c.name}: ${count} enrollments`;
      }).join('\n')}

      --- TRAINERS RATINGS ---
      ${trainers.map(t => `${t.name}: ${t.rating}/5.0 rating`).join(', ')}

      --- INSTRUCTIONS ---
      1. Answer administrative and business intelligence questions directly and truthfully based strictly on this data.
      2. If asked to predict, perform calculations (like dropout rates or next month cash flows) and provide professional administrative logic.
      3. Keep answers concise, highly strategic, polite, and fully aligned with professional ERP support.
      4. Use formatting like bold, tables, and bullet points where useful.
    `;

    const aiClient = getAiClient();
    if (!aiClient) {
      // Fallback in-app mock AI response if API Key is missing, explaining the configuration politely
      let responseText = `I am ready to help you analyze **MR Technologies ERP**! Let's look at some metrics:
      
* **Total Revenue collected**: INR ${totalRevenue.toLocaleString()}
* **Outstanding Dues**: INR ${pendingDues.toLocaleString()}
* **Unpaid Students**: ${unpaidStudents.length} candidates (e.g. ${unpaidStudents.slice(0, 2).map(u => u.name).join(', ')})
* **Trainer Ratings**: Ravi Kumar is rated at 4.9/5.0, Sneha Reddy at 4.6/5.0.

*To enable full AI Conversational capabilities, please configure your **GEMINI_API_KEY** secret in AI Studio Settings panel.*`;

      const msgLower = message.toLowerCase();
      if (msgLower.includes('revenue')) {
        responseText = `The total collected revenue of **MR Technologies** is **INR ${totalRevenue.toLocaleString()}**. There is also an additional **INR ${pendingDues.toLocaleString()}** in outstanding pending dues.`;
      } else if (msgLower.includes('pending') || msgLower.includes('unpaid') || msgLower.includes('due')) {
        responseText = `There are currently **${unpaidStudents.length}** students with pending dues totaling **INR ${pendingDues.toLocaleString()}**:\n\n` +
          unpaidStudents.map(s => `* **${s.name}** (${s.id}) - Pending: **INR ${s.pending.toLocaleString()}** for *${s.course}* (Mob: ${s.mobile})`).join('\n');
      } else if (msgLower.includes('trainer')) {
        responseText = `We have **${trainers.length}** certified trainers. Here are their ratings and workloads:\n\n` +
          trainers.map(t => `* **${t.name}** - Rating: **${t.rating}/5.0** (Specialties: ${t.skills.slice(0, 3).join(', ')})`).join('\n');
      } else if (msgLower.includes('dropout') || msgLower.includes('discontinue')) {
        responseText = `Analysis suggests student **Pooja Hegde** (${students[3]?.mobile}) is at a higher risk of dropping out due to attendance dropping below 70% in Batch BAT101. We advise coordinating a coaching session with Trainer ${trainers[0]?.name}.`;
      }

      return res.json({ text: responseText });
    }

    // Prepare full contents for chat API
    // Maps chatHistory from client format into parts
    const formattedContents: any[] = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((item: any) => {
        formattedContents.push({
          role: item.sender === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }]
        });
      });
    }
    
    // Add current user prompt
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const aiResponse = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemContext
      }
    });

    res.json({ text: aiResponse.text || "I was unable to process your request." });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// VITE DEV SERVER & STATIC FILE SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Loading Vite Dev Server Middlewares...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static files in production mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MR Technologies ERP Server running on port ${PORT}`);
  });
}

startServer();

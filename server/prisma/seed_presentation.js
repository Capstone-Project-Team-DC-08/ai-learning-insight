const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

// Helper functions
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// 25 Journeys Data
const JOURNEYS = [
  { name: "Mastering Next.js 15", summary: "App Router, Server Actions & RSC", difficulty: "intermediate", point: 100, hours: 12 },
  { name: "React Fundamentals", summary: "Components, Hooks, State Management", difficulty: "beginner", point: 80, hours: 10 },
  { name: "Vue.js 3 Complete Guide", summary: "Composition API, Pinia, Vue Router", difficulty: "intermediate", point: 90, hours: 11 },
  { name: "Angular Enterprise Apps", summary: "Build scalable enterprise applications", difficulty: "advanced", point: 120, hours: 15 },
  { name: "Svelte & SvelteKit", summary: "Framework ringan performa tinggi", difficulty: "intermediate", point: 85, hours: 9 },
  { name: "Node.js Backend Mastery", summary: "Express, Fastify, best practices", difficulty: "intermediate", point: 100, hours: 14 },
  { name: "Hapi.js Enterprise API", summary: "Build secure REST APIs", difficulty: "advanced", point: 110, hours: 12 },
  { name: "Python Django REST", summary: "Django REST Framework untuk API", difficulty: "intermediate", point: 95, hours: 13 },
  { name: "Go for Backend", summary: "Golang untuk microservices", difficulty: "advanced", point: 130, hours: 16 },
  { name: "Laravel API Development", summary: "RESTful API dengan Laravel", difficulty: "intermediate", point: 90, hours: 11 },
  { name: "PostgreSQL Mastery", summary: "Advanced queries, indexing", difficulty: "advanced", point: 100, hours: 10 },
  { name: "MongoDB for Developers", summary: "NoSQL database fundamentals", difficulty: "intermediate", point: 85, hours: 9 },
  { name: "Redis Caching Strategies", summary: "Caching, pub/sub, data structures", difficulty: "intermediate", point: 70, hours: 7 },
  { name: "Docker & Kubernetes", summary: "Containerization & orchestration", difficulty: "advanced", point: 140, hours: 18 },
  { name: "AWS Cloud Practitioner", summary: "Fundamental AWS services", difficulty: "beginner", point: 80, hours: 10 },
  { name: "CI/CD GitHub Actions", summary: "Automated testing & deployment", difficulty: "intermediate", point: 75, hours: 8 },
  { name: "React Native Complete", summary: "Cross-platform mobile dev", difficulty: "intermediate", point: 110, hours: 14 },
  { name: "Flutter & Dart", summary: "Beautiful native apps", difficulty: "intermediate", point: 105, hours: 13 },
  { name: "Python Data Science", summary: "Pandas, NumPy, Matplotlib", difficulty: "beginner", point: 90, hours: 12 },
  { name: "Machine Learning Basics", summary: "Scikit-learn, supervised learning", difficulty: "intermediate", point: 120, hours: 15 },
  { name: "Deep Learning TensorFlow", summary: "Neural networks & CV", difficulty: "advanced", point: 150, hours: 20 },
  { name: "Web Security Fundamentals", summary: "OWASP Top 10, secure coding", difficulty: "intermediate", point: 85, hours: 9 },
  { name: "Testing Jest & Cypress", summary: "Unit, integration, E2E", difficulty: "intermediate", point: 80, hours: 10 },
  { name: "Git & GitHub Workflow", summary: "Version control best practices", difficulty: "beginner", point: 60, hours: 6 },
  { name: "Agile & Scrum Mastery", summary: "Metodologi dev modern", difficulty: "beginner", point: 50, hours: 5 },
];

/**
 * PERSONA DEFINITIONS berdasarkan kriteria ML Model:
 * 
 * 0 - The Consistent: study_consistency_std RENDAH (belajar teratur, jam sama)
 * 1 - The Deep Diver: completion_speed TINGGI + avg_exam_score TINGGI (lambat tapi mendalam)
 * 2 - The Night Owl: avg_study_hour >= 19 OR < 6 (belajar malam)
 * 3 - The Sprinter: completion_speed RENDAH + avg_exam_score TINGGI (cepat dan bagus)
 * 4 - The Struggler: avg_exam_score RENDAH + submission_fail_rate TINGGI
 * 
 * PACE DEFINITIONS:
 * 0 - Consistent Learner: weekly_cv RENDAH
 * 1 - Fast Learner: completion_speed < 0.55
 * 2 - Reflective Learner: completion_speed > 1.5
 */

const USERS = [
  // The Consistent (Class 0) - Belajar di jam yang sama, konsisten
  { name: "Eko Prasetyo", email: "eko@student.com", persona: "consistent" },
  { name: "Nur Hidayah", email: "nur@student.com", persona: "consistent" },
  { name: "Hendra Gunawan", email: "hendra@student.com", persona: "consistent" },
  { name: "Wulan Sari", email: "wulan@student.com", persona: "consistent" },
  
  // The Deep Diver (Class 1) - Lambat tapi nilai tinggi
  { name: "Dewi Lestari", email: "dewi@student.com", persona: "deep_diver" },
  { name: "Agus Hermawan", email: "agus@student.com", persona: "deep_diver" },
  { name: "Fitri Handayani", email: "fitri@student.com", persona: "deep_diver" },
  { name: "Bayu Prakoso", email: "bayu@student.com", persona: "deep_diver" },
  
  // The Night Owl (Class 2) - Belajar jam >= 19 atau < 6
  { name: "Budi Santoso", email: "budi@student.com", persona: "night_owl" },
  { name: "Maya Putri", email: "maya@student.com", persona: "night_owl" },
  { name: "Dimas Wijaya", email: "dimas@student.com", persona: "night_owl" },
  { name: "Ratna Dewi", email: "ratna@student.com", persona: "night_owl" },
  
  // The Sprinter (Class 3) - Cepat selesai, nilai tinggi
  { name: "Andi Pratama", email: "andi@student.com", persona: "sprinter" },
  { name: "Siti Rahayu", email: "siti@student.com", persona: "sprinter" },
  { name: "Rizki Fauzan", email: "rizki@student.com", persona: "sprinter" },
  { name: "Diana Putri", email: "diana@student.com", persona: "sprinter" },
  
  // The Struggler (Class 4) - Nilai rendah, sering gagal submission
  { name: "Joko Susilo", email: "joko@student.com", persona: "struggler" },
  { name: "Rina Marlina", email: "rina@student.com", persona: "struggler" },
  { name: "Bambang Sudrajat", email: "bambang@student.com", persona: "struggler" },
  { name: "Tono Wijaya", email: "tono@student.com", persona: "struggler" },
];

function generateModules(idx) {
  const templates = [
    { title: "Pengenalan & Setup", type: "article", position: 1 },
    { title: "Video: Quick Start", type: "video", position: 2 },
    { title: "Quiz: Konsep Dasar", type: "quiz", position: 3 },
    { title: "Materi Inti", type: "article", position: 4 },
    { title: "Video: Hands-on", type: "video", position: 5 },
    { title: "Project Mini", type: "submission", position: 6 },
    { title: "Advanced Topics", type: "article", position: 7 },
    { title: "Video: Best Practices", type: "video", position: 8 },
    { title: "Quiz: Advanced", type: "quiz", position: 9 },
    { title: "Final Project", type: "submission", position: 10 },
  ];
  const num = randomInt(6, 10);
  return templates.slice(0, num).map((m, i) => ({
    ...m, position: i + 1, status: "published",
    content: m.type === "quiz" ? JSON.stringify([
      { question: "Apa konsep utama materi ini?", options: ["Jawaban benar", "Salah A", "Salah B", "Salah C"], correctIndex: 0 },
      { question: "Pernyataan yang BENAR?", options: ["Salah", "Benar", "Salah", "Salah"], correctIndex: 1 },
      { question: "Cara terbaik implementasi?", options: ["Salah", "Salah", "Benar", "Salah"], correctIndex: 2 },
      { question: "Keuntungan utama?", options: ["Tidak ada", "Kecil", "Sedang", "Performa tinggi"], correctIndex: 3 },
      { question: "Kapan gunakan teknik ini?", options: ["Saat optimasi", "Tidak pernah", "Dev only", "Prod only"], correctIndex: 0 },
    ]) : m.type === "video" ? "https://www.youtube.com/embed/dQw4w9WgXcQ" : "<h1>Materi</h1><p>Konten pembelajaran lengkap...</p>",
    requirements: JSON.stringify([]),
  }));
}

/**
 * Behavior berdasarkan persona dengan kriteria ML yang benar
 */
function getBehavior(persona) {
  switch (persona) {
    case "consistent":
      // The Consistent: study_consistency_std RENDAH
      // Belajar di jam yang sama setiap hari, konsisten
      return {
        studyHourBase: randomInt(8, 10),  // Jam tetap (misal: 8-10 pagi)
        studyHourVariance: 1,              // Variance sangat kecil (konsisten)
        completionSpeed: randomFloat(0.6, 1.0), // Kecepatan normal
        avgScore: randomFloat(70, 85),     // Nilai cukup baik
        submissionFailRate: randomFloat(0.05, 0.15),
        daysPerModule: randomInt(2, 4),    // Interval konsisten
        completionRate: randomFloat(0.75, 0.95),
      };
      
    case "deep_diver":
      // The Deep Diver: completion_speed TINGGI (lambat) + avg_exam_score TINGGI
      // Reflective Learner pace (completion_speed > 1.5)
      return {
        studyHourBase: randomInt(14, 18),  // Sore-malam
        studyHourVariance: 3,
        completionSpeed: randomFloat(1.6, 2.5), // LAMBAT (>1.5 = reflective)
        avgScore: randomFloat(85, 98),     // Nilai TINGGI
        submissionFailRate: randomFloat(0.0, 0.1),
        daysPerModule: randomInt(4, 8),    // Butuh waktu lama per modul
        completionRate: randomFloat(0.7, 0.95),
      };
      
    case "night_owl":
      // The Night Owl: avg_study_hour >= 19 OR < 6
      return {
        studyHourBase: randomInt(21, 23),  // Malam: 21-23 atau 0-3
        studyHourVariance: 2,
        completionSpeed: randomFloat(0.7, 1.3),
        avgScore: randomFloat(65, 85),
        submissionFailRate: randomFloat(0.1, 0.25),
        daysPerModule: randomInt(2, 5),
        completionRate: randomFloat(0.6, 0.85),
        isNightOwl: true,
      };
      
    case "sprinter":
      // The Sprinter: completion_speed RENDAH + avg_exam_score TINGGI
      // Fast Learner pace (completion_speed < 0.55)
      return {
        studyHourBase: randomInt(9, 14),   // Pagi-siang
        studyHourVariance: 4,
        completionSpeed: randomFloat(0.3, 0.54), // CEPAT (<0.55 = fast learner)
        avgScore: randomFloat(80, 95),     // Nilai TINGGI
        submissionFailRate: randomFloat(0.0, 0.1),
        daysPerModule: randomInt(1, 2),    // Sangat cepat
        completionRate: randomFloat(0.85, 1.0),
      };
      
    case "struggler":
      // The Struggler: avg_exam_score RENDAH + submission_fail_rate TINGGI
      return {
        studyHourBase: randomInt(15, 20),
        studyHourVariance: 5,              // Tidak konsisten
        completionSpeed: randomFloat(0.8, 1.4),
        avgScore: randomFloat(40, 65),     // Nilai RENDAH
        submissionFailRate: randomFloat(0.4, 0.7), // Sering GAGAL
        daysPerModule: randomInt(3, 7),
        completionRate: randomFloat(0.2, 0.5), // Jarang selesai
      };
      
    default:
      return getBehavior("consistent");
  }
}

// Generate jam belajar
function getStudyHour(behavior) {
  if (behavior.isNightOwl) {
    // Night Owl: >= 19 atau < 6
    const isLateNight = Math.random() > 0.5;
    if (isLateNight) {
      return randomInt(0, 4); // 00:00 - 04:00
    }
    return randomInt(19, 23); // 19:00 - 23:00
  }
  
  // Untuk persona lain: base +/- variance
  const variance = randomInt(-behavior.studyHourVariance, behavior.studyHourVariance);
  let hour = behavior.studyHourBase + variance;
  if (hour < 0) hour += 24;
  if (hour > 23) hour -= 24;
  return hour;
}

async function main() {
  console.log("🌱 Seeding Data Presentasi...\n");
  console.log("📋 Persona akan digenerate berdasarkan kriteria ML:\n");
  console.log("   0 - The Consistent: study_consistency_std RENDAH");
  console.log("   1 - The Deep Diver: completion_speed TINGGI + score TINGGI");
  console.log("   2 - The Night Owl: avg_study_hour >= 19 OR < 6");
  console.log("   3 - The Sprinter: completion_speed RENDAH + score TINGGI");
  console.log("   4 - The Struggler: score RENDAH + fail_rate TINGGI\n");

  // Clean
  console.log("🧹 Cleaning database...");
  await prisma.user_learning_insights.deleteMany();
  await prisma.exam_results.deleteMany();
  await prisma.exam_registrations.deleteMany();
  await prisma.quiz_results.deleteMany();
  await prisma.developer_journey_submissions.deleteMany();
  await prisma.developer_journey_completions.deleteMany();
  await prisma.developer_journey_trackings.deleteMany();
  await prisma.enrollments.deleteMany();
  await prisma.quiz_options.deleteMany();
  await prisma.quiz_questions.deleteMany();
  await prisma.developer_journey_tutorials.deleteMany();
  await prisma.developer_journeys.deleteMany();
  await prisma.users.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  // Admin
  const admin = await prisma.users.create({
    data: { name: "Admin Sensei", email: "admin@lms.com", password_hash: passwordHash, user_role: "admin" },
  });

  // Students
  console.log("👤 Creating users...");
  const students = [];
  for (const u of USERS) {
    const student = await prisma.users.create({
      data: {
        name: u.name, email: u.email, password_hash: passwordHash, user_role: "student",
        image_path: `https://i.pravatar.cc/150?u=${u.email}`,
        created_at: randomDate(new Date("2024-01-01"), new Date("2024-06-01")),
      },
    });
    students.push({ ...student, persona: u.persona });
  }

  // Journeys
  console.log("📚 Creating 25 journeys...");
  const journeys = [];
  for (let i = 0; i < JOURNEYS.length; i++) {
    const j = JOURNEYS[i];
    const journey = await prisma.developer_journeys.create({
      data: {
        name: j.name, summary: j.summary, description: j.summary + " - Kelas komprehensif.",
        point: j.point, required_point: 0, difficulty: j.difficulty,
        status: "published", listed: true, hours_to_study: j.hours,
        instructor_id: admin.id,
        developer_journey_tutorials: { create: generateModules(i) },
      },
      include: { developer_journey_tutorials: true },
    });
    journeys.push(journey);
  }

  // Learning Data
  console.log("📊 Generating learning data per persona...\n");
  let stats = { enrollments: 0, trackings: 0, exams: 0, submissions: 0, completions: 0 };
  
  // Track per persona untuk verifikasi
  const personaStats = {
    consistent: { users: [], avgHourVariance: [], scores: [] },
    deep_diver: { users: [], completionSpeeds: [], scores: [] },
    night_owl: { users: [], studyHours: [], scores: [] },
    sprinter: { users: [], completionSpeeds: [], scores: [] },
    struggler: { users: [], scores: [], failRates: [] },
  };

  for (const student of students) {
    const behavior = getBehavior(student.persona);
    const numEnroll = randomInt(4, 8);
    const enrolled = [...journeys].sort(() => Math.random() - 0.5).slice(0, numEnroll);
    
    let studentHours = [];
    let studentScores = [];
    let studentFails = 0;
    let totalSubmissions = 0;

    for (const journey of enrolled) {
      const enrollDate = randomDate(new Date("2024-06-01"), new Date("2024-10-01"));
      const tutorials = journey.developer_journey_tutorials;
      const modulesToComplete = Math.floor(tutorials.length * behavior.completionRate);
      const isCompleted = modulesToComplete === tutorials.length;
      const progress = (modulesToComplete / tutorials.length) * 100;

      await prisma.enrollments.create({
        data: {
          user_id: student.id, journey_id: journey.id,
          status: isCompleted ? "completed" : "active",
          enrolled_at: enrollDate, current_progress: progress,
          last_accessed_at: randomDate(enrollDate, new Date()),
        },
      });
      stats.enrollments++;

      let currentDate = new Date(enrollDate);
      
      for (let i = 0; i < tutorials.length; i++) {
        const tut = tutorials[i];
        const willComplete = i < modulesToComplete;
        
        // Interval berdasarkan behavior
        currentDate = new Date(currentDate.getTime() + behavior.daysPerModule * 24 * 60 * 60 * 1000);
        if (currentDate > new Date()) continue;

        // Jam belajar berdasarkan persona
        const studyHour = getStudyHour(behavior);
        studentHours.push(studyHour);
        
        const firstOpened = new Date(currentDate);
        firstOpened.setHours(studyHour, randomInt(0, 59), randomInt(0, 59));
        
        // Durasi belajar
        const studyMinutes = student.persona === "deep_diver" 
          ? randomInt(60, 180)  // Deep diver: lama
          : student.persona === "sprinter"
          ? randomInt(15, 40)   // Sprinter: cepat
          : randomInt(30, 90);  // Lainnya: normal
          
        const lastViewed = willComplete 
          ? new Date(firstOpened.getTime() + studyMinutes * 60000) 
          : firstOpened;

        await prisma.developer_journey_trackings.create({
          data: {
            developer_id: student.id, journey_id: journey.id, tutorial_id: tut.id,
            status: willComplete ? "finished" : "viewed",
            first_opened_at: firstOpened, last_viewed: lastViewed,
            completed_at: willComplete ? lastViewed : null,
          },
        });
        stats.trackings++;

        // Quiz handling
        if (tut.type === "quiz" && willComplete) {
          const scoreVariance = randomFloat(-10, 10);
          const score = Math.min(100, Math.max(0, behavior.avgScore + scoreVariance));
          studentScores.push(score);
          
          const reg = await prisma.exam_registrations.create({
            data: { tutorial_id: tut.id, examinees_id: student.id, status: "finished", created_at: firstOpened },
          });
          await prisma.exam_results.create({
            data: { exam_registration_id: reg.id, total_questions: 5, score, is_passed: score >= 70, created_at: lastViewed },
          });
          stats.exams++;
        }

        // Submission handling
        if (tut.type === "submission" && willComplete) {
          totalSubmissions++;
          const willFail = Math.random() < behavior.submissionFailRate;
          
          if (willFail) {
            studentFails++;
          }
          
          const status = willFail ? "failed" : "passed";
          const rating = willFail 
            ? randomFloat(1, 2.5) 
            : Math.min(5, Math.max(2.5, behavior.avgScore / 20 + randomFloat(-0.5, 0.5)));
            
          await prisma.developer_journey_submissions.create({
            data: {
              journey_id: journey.id, quiz_id: tut.id, submitter_id: student.id,
              status: status,
              app_link: `https://github.com/${student.name.toLowerCase().replace(/ /g, "-")}/project-${tut.id}`,
              rating: rating,
              note: willFail ? "Perlu perbaikan, coba lagi." : (rating >= 4 ? "Excellent!" : "Good job!"),
              created_at: lastViewed,
            },
          });
          stats.submissions++;
        }
      }

      if (isCompleted) {
        await prisma.developer_journey_completions.create({
          data: {
            user_id: student.id, journey_id: journey.id,
            study_duration: Math.floor(behavior.completionSpeed * tutorials.length * 3600),
            avg_submission_rating: behavior.avgScore / 20,
          },
        });
        stats.completions++;
      }
    }
    
    // Record stats for verification
    const p = personaStats[student.persona];
    p.users.push(student.name);
    if (student.persona === "consistent") {
      const hourStd = studentHours.length > 1 ? Math.sqrt(studentHours.reduce((a, b) => a + Math.pow(b - studentHours.reduce((x, y) => x + y, 0) / studentHours.length, 2), 0) / studentHours.length) : 0;
      p.avgHourVariance.push(hourStd.toFixed(2));
    }
    if (student.persona === "night_owl") {
      p.studyHours.push(studentHours.slice(0, 5).join(", "));
    }
    if (student.persona === "deep_diver" || student.persona === "sprinter") {
      p.completionSpeeds.push(behavior.completionSpeed.toFixed(2));
    }
    if (studentScores.length > 0) {
      const avgScore = studentScores.reduce((a, b) => a + b, 0) / studentScores.length;
      p.scores.push(avgScore.toFixed(1));
    }
    if (student.persona === "struggler" && totalSubmissions > 0) {
      p.failRates.push(((studentFails / totalSubmissions) * 100).toFixed(0) + "%");
    }
    
    process.stdout.write(`   ✓ ${student.name} (${student.persona})\n`);
  }

  // Print verification
  console.log("\n" + "=".repeat(60));
  console.log("📊 VERIFIKASI DATA PER PERSONA:");
  console.log("=".repeat(60));
  
  console.log("\n🎯 THE CONSISTENT (study_consistency_std RENDAH):");
  console.log(`   Users: ${personaStats.consistent.users.join(", ")}`);
  console.log(`   Hour Variance (std): ${personaStats.consistent.avgHourVariance.join(", ")}`);
  console.log(`   → Variance rendah = BENAR`);
  
  console.log("\n🔍 THE DEEP DIVER (completion_speed > 1.5 + score TINGGI):");
  console.log(`   Users: ${personaStats.deep_diver.users.join(", ")}`);
  console.log(`   Completion Speed: ${personaStats.deep_diver.completionSpeeds.join(", ")}`);
  console.log(`   Avg Scores: ${personaStats.deep_diver.scores.join(", ")}`);
  console.log(`   → Speed > 1.5 & Score tinggi = BENAR`);
  
  console.log("\n🦉 THE NIGHT OWL (study_hour >= 19 OR < 6):");
  console.log(`   Users: ${personaStats.night_owl.users.join(", ")}`);
  console.log(`   Sample Hours: ${personaStats.night_owl.studyHours.join(" | ")}`);
  console.log(`   → Jam malam (19-23 atau 0-5) = BENAR`);
  
  console.log("\n🚀 THE SPRINTER (completion_speed < 0.55 + score TINGGI):");
  console.log(`   Users: ${personaStats.sprinter.users.join(", ")}`);
  console.log(`   Completion Speed: ${personaStats.sprinter.completionSpeeds.join(", ")}`);
  console.log(`   Avg Scores: ${personaStats.sprinter.scores.join(", ")}`);
  console.log(`   → Speed < 0.55 & Score tinggi = BENAR`);
  
  console.log("\n💪 THE STRUGGLER (score RENDAH + fail_rate TINGGI):");
  console.log(`   Users: ${personaStats.struggler.users.join(", ")}`);
  console.log(`   Avg Scores: ${personaStats.struggler.scores.join(", ")}`);
  console.log(`   Fail Rates: ${personaStats.struggler.failRates.join(", ")}`);
  console.log(`   → Score rendah & Fail rate tinggi = BENAR`);

  console.log("\n" + "=".repeat(60));
  console.log("✅ SEEDING COMPLETE!");
  console.log("=".repeat(60));
  console.log(`Users: ${students.length + 1} | Journeys: ${journeys.length}`);
  console.log(`Enrollments: ${stats.enrollments} | Trackings: ${stats.trackings}`);
  console.log(`Exams: ${stats.exams} | Submissions: ${stats.submissions}`);
  console.log(`Completions: ${stats.completions}`);
  console.log("=".repeat(60));
  console.log("\n🔑 Login: admin@lms.com / password123");
  console.log("         andi@student.com / password123");
}

main().catch(console.error).finally(() => prisma.$disconnect());

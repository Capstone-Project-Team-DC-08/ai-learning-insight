const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Boom = require("@hapi/boom");
const axios = require("axios");

class InsightService {
  // --- HELPER FUNCTIONS ---

  calculateMean(arr) {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  calculateStdDev(arr) {
    if (!arr || arr.length <= 1) return 0;
    const mean = this.calculateMean(arr);
    const variance =
      arr.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (arr.length - 1);
    return Math.sqrt(variance);
  }

  calculateCV(arr) {
    // Coefficient of Variation = (StdDev / Mean)
    const mean = this.calculateMean(arr);
    if (mean === 0) return 0;
    return this.calculateStdDev(arr) / mean;
  }

  // Circular mean untuk data jam (0-23) - handles wrap-around correctly
  calculateCircularMeanHour(hours) {
    if (!hours || hours.length === 0) return 0;
    const radians = hours.map((h) => (h / 24) * 2 * Math.PI);
    const sinSum = radians.reduce((sum, r) => sum + Math.sin(r), 0);
    const cosSum = radians.reduce((sum, r) => sum + Math.cos(r), 0);
    let meanAngle = Math.atan2(sinSum / hours.length, cosSum / hours.length);
    if (meanAngle < 0) meanAngle += 2 * Math.PI;
    return (meanAngle / (2 * Math.PI)) * 24;
  }

  // Circular standard deviation untuk data jam
  calculateCircularStdHour(hours) {
    if (!hours || hours.length <= 1) return 0;
    const radians = hours.map((h) => (h / 24) * 2 * Math.PI);
    const sinSum = radians.reduce((sum, r) => sum + Math.sin(r), 0);
    const cosSum = radians.reduce((sum, r) => sum + Math.cos(r), 0);
    const R = Math.sqrt(sinSum ** 2 + cosSum ** 2) / hours.length;
    // Circular variance: 1 - R, convert to std in hours
    const circularVariance = Math.max(0, Math.min(1 - R, 0.9999));
    return (
      Math.sqrt(-2 * Math.log(1 - circularVariance)) * (24 / (2 * Math.PI))
    );
  }

  // Get ISO week number from date
  getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return `${d.getFullYear()}-W${Math.ceil(
      ((d - yearStart) / 86400000 + 1) / 7
    )}`;
  }

  // =================================================================
  // 1. DATA PREPARATION (Hitung Statistik di Node)
  // =================================================================

  async prepareFeatures(userId) {
    // Ambil data mentah dari DB (Paralel)
    const [trackings, examResults, submissions, enrollments] =
      await Promise.all([
        prisma.developer_journey_trackings.findMany({
          where: { developer_id: userId },
          select: { last_viewed: true, first_opened_at: true },
        }),
        // Ambil score dari exam_results melalui exam_registrations
        prisma.exam_results.findMany({
          where: {
            exam_registration: {
              examinees_id: userId,
            },
          },
          select: { score: true },
        }),
        prisma.developer_journey_submissions.findMany({
          where: { submitter_id: userId },
          select: { status: true },
        }),
        prisma.enrollments.findMany({
          where: { user_id: userId, status: "completed" },
          select: {
            enrolled_at: true,
            last_accessed_at: true,
          },
        }),
      ]);

    // --- 1. Avg Study Hour & Consistency ---
    // Ambil jam (0-23) dari log tracking
    // Menggunakan circular statistics karena jam adalah data sirkular (23:00 dekat dengan 01:00)
    const studyHours = trackings
      .filter((t) => t.last_viewed)
      .map((t) => new Date(t.last_viewed).getHours());

    const avg_study_hour = this.calculateCircularMeanHour(studyHours);
    const study_consistency_std = this.calculateCircularStdHour(studyHours);

    // --- 2. Avg Exam Score ---
    const scores = examResults.map((e) => parseFloat(e.score));
    const avg_exam_score = this.calculateMean(scores);

    // --- 3. Submission Fail Rate ---
    const totalSubs = submissions.length;
    const failedSubs = submissions.filter((s) => s.status === "failed").length;
    const submission_fail_rate = totalSubs > 0 ? failedSubs / totalSubs : 0;

    // --- 4. Completion Speed (Jam) & Retry Count ---
    const durations = [];

    enrollments.forEach((en) => {
      if (en.last_accessed_at) {
        const diffMs = new Date(en.last_accessed_at) - new Date(en.enrolled_at);
        durations.push(diffMs / (1000 * 60 * 60)); // Jam
      }
    });

    // Retry Count: hitung submissions dengan status "rejected" atau "failed"
    // yang kemudian disubmit ulang (berdasarkan jumlah failed/rejected submissions)
    const retriedSubs = submissions.filter(
      (s) => s.status === "rejected" || s.status === "failed"
    ).length;
    const total_retries = retriedSubs;

    // Completion Speed: Rata-rata durasi (normalized, misal target 24 jam)
    // Di model Python Anda: completion_speed < 0.7 = Fast.
    // Jadi kita harus menormalisasi durasi real terhadap expected duration.
    // Asumsi: Rata-rata durasi ideal course = 20 Jam.
    const avgDuration = this.calculateMean(durations);
    const completion_speed_ratio = avgDuration > 0 ? avgDuration / 20.0 : 1.0;

    const materialsByDate = {};
    const materialsByWeek = {};
    trackings.forEach((t) => {
      if (t.first_opened_at) {
        const date = new Date(t.first_opened_at).toISOString().split("T")[0];
        materialsByDate[date] = (materialsByDate[date] || 0) + 1;

        // Group by week for weekly_cv
        const weekKey = this.getWeekNumber(t.first_opened_at);
        materialsByWeek[weekKey] = (materialsByWeek[weekKey] || 0) + 1;
      }
    });

    const dailyCounts = Object.values(materialsByDate);
    const materials_per_day = this.calculateMean(dailyCounts) || 0;

    // Weekly CV (Coefficient of Variation berdasarkan jumlah materi per minggu)
    const weeklyCounts = Object.values(materialsByWeek);
    const weekly_cv = this.calculateCV(weeklyCounts) || 0;

    // --- 6. Completed Modules & Total Modules Viewed ---
    const completed_modules = trackings.filter((t) => t.last_viewed).length;
    const total_modules_viewed = trackings.length;

    return {
      // Data untuk Persona
      persona_features: {
        avg_study_hour,
        study_consistency_std,
        completion_speed: completion_speed_ratio,
        avg_exam_score,
        submission_fail_rate,
        retry_count: total_retries,
      },
      // Data untuk Pace (5 features untuk ML Classification Model)
      pace_features: {
        completion_speed: completion_speed_ratio,
        study_consistency_std,
        avg_study_hour,
        completed_modules,
        total_modules_viewed,
      },
    };
  }

  async generateFullInsight(userId) {
    const mlUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";

    try {
      // 1. Ambil Profil User
      const user = await prisma.users.findUnique({ where: { id: userId } });
      if (!user) throw Boom.notFound("User tidak ditemukan");

      // 2. Hitung Fitur
      const { persona_features, pace_features } = await this.prepareFeatures(
        userId
      );

      console.log(persona_features, pace_features);

      // 3. Panggil ML (Paralel)
      // Kita panggil endpoint Persona dan Pace secara bersamaan
      let personaResult = null;
      let paceResult = null;

      try {
        const [resPersona, resPace] = await Promise.all([
          axios.post(`${mlUrl}/api/v1/persona/predict`, {
            user_id: userId,
            features: persona_features,
          }),
          axios.post(`${mlUrl}/api/v1/pace/analyze`, {
            user_id: userId,
            journey_id: 0, // General analysis
            features: pace_features,
          }),
        ]);

        personaResult = resPersona.data;
        paceResult = resPace.data;
      } catch (e) {
        console.error("ML Service Error:", e.response?.data || e.message);
        // Fallback Default
        personaResult = { persona_label: "The Learner", characteristics: [] };
        paceResult = { pace_label: "Consistent", insight: "Data belum cukup" };
      }

      // 4. Generate Advice (Panggil ML Advice)
      let adviceResult = null;
      try {
        const resAdvice = await axios.post(`${mlUrl}/api/v1/advice/generate`, {
          user_id: userId,
          name: user.name,
          persona_label: personaResult.persona_label, // Kirim hasil step 3
          pace_label: paceResult.pace_label, // Kirim hasil step 3
          avg_exam_score: persona_features.avg_exam_score, // Context tambahan
          course_name: "General Learning",
        });
        adviceResult = resAdvice.data;
      } catch (e) {
        console.error("ML Advice Error:", e.message);
        adviceResult = {
          advice_text: `Halo ${user.name}, terus tingkatkan belajarmu!`,
        };
      }

      // 5. Simpan ke Database
      const fullInsightData = {
        persona: personaResult,
        pace: paceResult,
        advice: adviceResult,
        generated_at: new Date(),
      };

      await prisma.user_learning_insights.create({
        data: {
          user_id: userId,
          insight_key: "latest_analysis",
          insight_val: fullInsightData,
        },
      });

      return fullInsightData;
    } catch (error) {
      console.error(error);
    }
  }

  async getLatestInsight(userId) {
    const insight = await prisma.user_learning_insights.findFirst({
      where: {
        user_id: userId,
        insight_key: "latest_analysis",
      },
      orderBy: { created_at: "desc" },
    });

    return insight ? insight.insight_val : null;
  }

  async getFocusTimeDistribution(userId) {
    // Ambil semua tracking dengan last_viewed
    const trackings = await prisma.developer_journey_trackings.findMany({
      where: {
        developer_id: userId,
        last_viewed: { not: null },
      },
      select: { last_viewed: true },
    });

    // Definisi periode waktu
    const periods = {
      Pagi: { start: 5, end: 11, count: 0 },
      Siang: { start: 11, end: 15, count: 0 },
      Sore: { start: 15, end: 19, count: 0 },
      Malam: { start: 19, end: 24, count: 0 },
      Dini: { start: 0, end: 5, count: 0 },
    };

    // Hitung distribusi
    trackings.forEach((t) => {
      const hour = new Date(t.last_viewed).getHours();

      if (hour >= 5 && hour < 11) periods.Pagi.count++;
      else if (hour >= 11 && hour < 15) periods.Siang.count++;
      else if (hour >= 15 && hour < 19) periods.Sore.count++;
      else if (hour >= 19 && hour < 24) periods.Malam.count++;
      else periods.Dini.count++;
    });

    const total = trackings.length || 1;

    // Format untuk chart
    const distribution = [
      {
        name: "Pagi",
        value: Math.round((periods.Pagi.count / total) * 100),
        count: periods.Pagi.count,
      },
      {
        name: "Siang",
        value: Math.round((periods.Siang.count / total) * 100),
        count: periods.Siang.count,
      },
      {
        name: "Sore",
        value: Math.round((periods.Sore.count / total) * 100),
        count: periods.Sore.count,
      },
      {
        name: "Malam",
        value: Math.round((periods.Malam.count / total) * 100),
        count: periods.Malam.count,
      },
    ];

    if (periods.Dini.count > 0) {
      distribution.push({
        name: "Dini Hari",
        value: Math.round((periods.Dini.count / total) * 100),
        count: periods.Dini.count,
      });
    }

    // Filter yang nilainya 0
    const filteredDistribution = distribution.filter((d) => d.value > 0);

    // Cari periode optimal (paling banyak)
    const optimal = filteredDistribution.reduce(
      (max, item) => (item.count > max.count ? item : max),
      { name: "Pagi", count: 0, value: 0 }
    );

    // Time range untuk periode optimal
    const timeRanges = {
      Pagi: "05:00 - 11:00",
      Siang: "11:00 - 15:00",
      Sore: "15:00 - 19:00",
      Malam: "19:00 - 24:00",
      "Dini Hari": "00:00 - 05:00",
    };

    return {
      distribution:
        filteredDistribution.length > 0
          ? filteredDistribution
          : [
              { name: "Pagi", value: 25, count: 0 },
              { name: "Siang", value: 25, count: 0 },
              { name: "Sore", value: 25, count: 0 },
              { name: "Malam", value: 25, count: 0 },
            ],
      optimal_period: optimal.name,
      optimal_time_range: timeRanges[optimal.name] || "07:00 - 11:00",
      total_activities: trackings.length,
    };
  }
}

module.exports = new InsightService();

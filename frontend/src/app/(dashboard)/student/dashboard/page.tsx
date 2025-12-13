"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlayCircle,
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Zap,
  RefreshCw,
  Target,
  Calendar,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

import api from "@/lib/axios";
import { Course, AIInsight } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type User = {
  name: string;
};

type DashboardData = {
  stats: {
    total_courses: number;
    completed_courses: number;
    in_progress_courses: number;
    total_study_hours: number;
    avg_quiz_score: number;
  };
  recent_courses: Course[];
  recent_activities: {
    id: number;
    type: string;
    title: string;
    course_name: string;
    timestamp: string;
  }[];
};

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightLoading, setInsightLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      try {
        const [coursesRes, insightRes] = await Promise.allSettled([
          api.get("/student/my-courses"),
          api.get("/student/insights"),
        ]);

        if (coursesRes.status === "fulfilled") {
          setCourses(coursesRes.value.data.data);
        }

        if (insightRes.status === "fulfilled" && insightRes.value.data.data) {
          setInsight(insightRes.value.data.data);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
        setInsightLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerateInsight = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/student/insights/generate");
      setInsight(res.data.data);
      toast.success("Analisis Selesai!", {
        description: "AI telah memperbarui profil belajar Anda.",
      });
    } catch (error: any) {
      toast.error("Gagal Menganalisis", {
        description: error.response?.data?.message || "Terjadi kesalahan.",
      });
      console.log(error.message);
    } finally {
      setGenerating(false);
    }
  };

  // Calculate stats from courses
  const stats = {
    total: courses.length,
    completed: courses.filter((c) => (c.progress || 0) === 100).length,
    inProgress: courses.filter(
      (c) => (c.progress || 0) > 0 && (c.progress || 0) < 100
    ).length,
  };

  const recentCourses = courses
    .filter((c) => (c.progress || 0) > 0 && (c.progress || 0) < 100)
    .slice(0, 3);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Selamat datang kembali, {user?.name || "Learner"}! 👋
          </h1>
          <p className="">
            Pantau progress belajarmu dan temukan insight personal dari AI.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/student/my-courses">
            <Button variant="outline" size="sm">
              <BookOpen className="mr-2 h-4 w-4" />
              Kelas Saya
            </Button>
          </Link>
          <Link href="/courses">
            <Button size="sm">
              Jelajah Kelas
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm ">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm  font-medium">Total Kelas</p>
                <p className="text-2xl font-semibold  mt-1">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-lg  flex items-center justify-center">
                <BookOpen className="h-5 w-5 " />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm  font-medium">Sedang Dipelajari</p>
                <p className="text-2xl font-semibold  mt-1">
                  {stats.inProgress}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 " />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm ">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm  font-medium">Kelas Selesai</p>
                <p className="text-2xl font-semibold  mt-1">
                  {stats.completed}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg  flex items-center justify-center">
                <Trophy className="h-5 w-5 " />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm ">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm  font-medium">Completion Rate</p>
                <p className="text-2xl font-semibold mt-1">
                  {stats.total > 0
                    ? Math.round((stats.completed / stats.total) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg  flex items-center justify-center">
                <BarChart3 className="h-5 w-5 " />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insight Card - Takes 2 columns */}
        <div className="lg:col-span-2">
          {insightLoading ? (
            <Skeleton className="h-[280px] rounded-xl" />
          ) : insight ? (
            <Card className="border border-slate-200 shadow-sm  h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-4 w-4 " />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold ">
                        Profil Belajar
                      </CardTitle>
                      <p className="text-xs ">Hasil analisis AI</p>
                    </div>
                  </div>
                  <Link href="/student/profile">
                    <Button
                      variant="ghost"
                      size="sm"
                      className=" hover:text-slate-900 dark:text-slate-100"
                    >
                      Detail
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Dual Display - Persona & Pace */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Persona */}
                  <div className="border border-slate-100 rounded-xl p-4">
                    <p className="text-xs  uppercase tracking-wider">
                      Karakteristik
                    </p>
                    <p className="text-base font-semibold  mt-1 capitalize">
                      {insight.persona?.persona_label || "The Consistent"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-white/75 mt-1 line-clamp-2">
                      {insight.persona?.characteristics?.[0] ||
                        "Pola belajar yang konsisten"}
                    </p>
                  </div>

                  {/* Pace */}
                  <div className="border border-slate-100 rounded-xl p-4">
                    <p className="text-xs  uppercase tracking-wider">
                      Kebiasaan
                    </p>
                    <p className="text-base font-semibold  mt-1 capitalize">
                      {insight.pace?.pace_label || "Consistent Learner"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-white/75 mt-1 line-clamp-2">
                      {insight.pace?.insight?.slice(0, 60) ||
                        "Belajar dengan ritme konsisten"}
                      ...
                    </p>
                  </div>
                </div>

                {/* Advice */}
                {insight.advice?.advice_text && (
                  <div className=" rounded-xl p-4 border border-slate-100">
                    <p className="text-xs uppercase tracking-wider mb-1">
                      Rekomendasi
                    </p>
                    <p className="text-xs text-slate-500 dark:text-white/75 mt-1 line-clamp-2">
                      Halo {user?.name}, ketuk tombol detail untuk melihat
                      rekomendasi personal dari Ai!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-dashed border-slate-200  h-full">
              <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="w-14 h-14 rounded-xl  flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 " />
                </div>
                <h3 className="text-lg font-semibold  mb-2">
                  Temukan Profil Belajarmu
                </h3>
                <p className=" text-sm mb-6 max-w-sm mx-auto">
                  AI akan menganalisis pola belajar dan memberikan insight
                  personal.
                </p>
                <Button
                  onClick={handleGenerateInsight}
                  disabled={generating}
                  className=" "
                >
                  {generating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Menganalisis...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Mulai Analisis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Continue Learning Card */}
        <div className="lg:col-span-1">
          <Card className="h-full border-2 border-dashed border-slate-200 ">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Lanjutkan Belajar
                </CardTitle>
                <Link href="/student/my-courses">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Lihat Semua
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-10 w-10  mx-auto mb-3" />
                  <p className="text-sm ">
                    Belum ada kelas yang sedang dipelajari
                  </p>
                  <Link href="/courses" className="mt-3 block">
                    <Button variant="outline" size="sm">
                      Mulai Belajar
                    </Button>
                  </Link>
                </div>
              ) : (
                recentCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="block"
                  >
                    <div className="flex gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                      <div className="relative h-14 w-14 rounded-lg bg-muted overflow-hidden shrink-0">
                        {course.image_path ? (
                          <Image
                            src={course.image_path}
                            alt={course.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="h-5 w-5 " />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {course.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Progress
                            value={course.progress || 0}
                            className="h-1.5 flex-1"
                          />
                          <span className="text-xs  font-medium">
                            {Math.round(course.progress || 0)}%
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5  group-hover:text-primary shrink-0 self-center" />
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/student/profile" className="block">
          <Card className=" transition-colors cursor-pointer border border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg  flex items-center justify-center">
                <Sparkles className="h-4 w-4 " />
              </div>
              <div>
                <p className="font-medium text-sm ">Profil Belajar</p>
                <p className="text-xs ">Lihat insight AI</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/student/my-courses" className="block">
          <Card className=" transition-colors cursor-pointer border border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg  flex items-center justify-center">
                <BookOpen className="h-4 w-4 " />
              </div>
              <div>
                <p className="font-medium text-sm ">Kelas Saya</p>
                <p className="text-xs ">Lihat semua kelas</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/courses" className="block">
          <Card className=" transition-colors cursor-pointer border border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 " />
              </div>
              <div>
                <p className="font-medium text-sm ">Katalog</p>
                <p className="text-xs ">Jelajah kelas baru</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/student/settings" className="block">
          <Card className=" transition-colors cursor-pointer border border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg  flex items-center justify-center">
                <Calendar className="h-4 w-4 " />
              </div>
              <div>
                <p className="font-medium text-sm ">Pengaturan</p>
                <p className="text-xs ">Kelola akun</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-[320px] rounded-2xl" />
        <Skeleton className="h-[320px] rounded-xl" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

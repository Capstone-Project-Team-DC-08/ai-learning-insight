"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlayCircle,
  CheckCircle2,
  BookOpen,
  Clock,
  ArrowRight,
  GraduationCap,
  Target,
  Sparkles,
} from "lucide-react";

import api from "@/lib/axios";
import { Course } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const difficultyConfig: Record<string, { label: string; color: string }> = {
  beginner: { label: "Pemula", color: "text-emerald-600 bg-emerald-50" },
  intermediate: { label: "Menengah", color: "text-amber-600 bg-amber-50" },
  advanced: { label: "Lanjutan", color: "text-rose-600 bg-rose-50" },
};

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/student/my-courses");
        setCourses(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data kelas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const inProgressCourses = courses.filter(
    (c) => (c.progress || 0) > 0 && (c.progress || 0) < 100
  );
  const completedCourses = courses.filter((c) => (c.progress || 0) === 100);
  const notStartedCourses = courses.filter((c) => (c.progress || 0) === 0);

  if (loading) {
    return <MyCoursesPageSkeleton />;
  }

  const renderCourseCard = (course: Course) => {
    const progress = Math.min(Math.max(course.progress || 0, 0), 100);
    const isCompleted = progress === 100;
    const isStarted = progress > 0;
    const difficulty = difficultyConfig[course.difficulty] || {
      label: "Umum",
      color: "text-slate-600 bg-slate-50",
    };

    return (
      <Link key={course.id} href={`/courses/${course.id}`} className="group">
        <Card className="h-full overflow-hidden border border-slate-200 transition-all duration-200 hover:shadow-lg hover:border-slate-300">
          {/* Image */}
          <div className="relative aspect-video w-full overflow-hidden">
            {course.image_path ? (
              <Image
                src={course.image_path}
                alt={course.name}
                fill
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105 w-full h-full"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <BookOpen className="h-10 w-10 " />
              </div>
            )}

            {/* Status Badge */}
            {isCompleted && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500  text-xs font-medium rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Selesai
                </div>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            {/* Difficulty Badge */}
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded ${difficulty.color}`}
              >
                {difficulty.label}
              </span>
              {isStarted && !isCompleted && (
                <span className="text-xs ">
                  {Math.round(progress)}% selesai
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold line-clamp-2 mb-3  transition-colors">
              {course.name}
            </h3>

            {/* Progress Bar (for in-progress) */}
            {isStarted && !isCompleted && (
              <div className="mb-4">
                <Progress value={progress} className="h-1.5" />
              </div>
            )}

            {/* Action Button */}
            <div
              className={`flex items-center justify-between pt-3 border-t  ${
                isStarted && !isCompleted ? "" : "mt-auto"
              }`}
            >
              <span className="text-sm font-medium   transition-colors">
                {isCompleted
                  ? "Lihat Kelas"
                  : isStarted
                  ? "Lanjut Belajar"
                  : "Mulai Belajar"}
              </span>
              <div className="h-8 w-8 rounded-full  flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                <ArrowRight className="h-4 w-4  group-hover:text-white transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  const renderEmptyState = (
    message: string,
    icon: React.ReactNode,
    showAction = true
  ) => (
    <div className="col-span-full">
      <div className="flex flex-col items-center justify-center py-16 px-4  rounded-2xl border-2 border-dashed border-slate-200">
        <div className="h-14 w-14 rounded-xl  flex items-center justify-center mb-4">
          {icon}
        </div>
        <p className=" font-medium mb-1">{message}</p>
        <p className=" text-sm mb-5">
          Temukan kelas yang sesuai dengan minatmu
        </p>
        {showAction && (
          <Link href="/courses">
            <Button size="sm" className=" ">
              <Sparkles className="h-4 w-4 mr-2" />
              Jelajah Kelas
            </Button>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold ">Kelas Saya</h1>
          <p className=" mt-1">
            Kelola dan pantau progress belajarmu
          </p>
        </div>
        <Link href="/courses">
          <Button className=" hover:bg-slate-800">
            Jelajah Kelas Baru
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200  p-5">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 " />
            </div>
            <div>
              <p className="text-2xl font-semibold ">
                {courses.length}
              </p>
              <p className="text-xs ">Total Kelas</p>
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200  p-5">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 " />
            </div>
            <div>
              <p className="text-2xl font-semibold ">
                {inProgressCourses.length}
              </p>
              <p className="text-xs ">Sedang Dipelajari</p>
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200  p-5">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg  flex items-center justify-center">
              <GraduationCap className="h-5 w-5 " />
            </div>
            <div>
              <p className="text-2xl font-semibold ">
                {completedCourses.length}
              </p>
              <p className="text-xs ">Selesai</p>
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200  p-5">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg  flex items-center justify-center">
              <Clock className="h-5 w-5 " />
            </div>
            <div>
              <p className="text-2xl font-semibold ">
                {notStartedCourses.length}
              </p>
              <p className="text-xs ">Belum Dimulai</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <div className="overflow-x-hidden">
          <TabsList className="inline-flex h-auto p-1  rounded-lg w-auto min-w-full sm:min-w-0">
            <TabsTrigger
              value="all"
              className="p-1 sm:px-3 sm:py-2 text-sm rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-600 whitespace-nowrap"
            >
              Semua
              <span className="ml-1 sm:ml-1.5 text-xs  data-[state=active]:bg-slate-100 px-1.5 py-0.5 rounded">
                {courses.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="p-1 sm:px-3 sm:py-2 text-sm rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-600 whitespace-nowrap"
            >
              Dipelajari
              <span className="ml-1 sm:ml-1.5 text-xs  data-[state=active]:bg-slate-100 px-1.5 py-0.5 rounded">
                {inProgressCourses.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="p-1 sm:px-3 sm:py-2 text-sm rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-600 whitespace-nowrap"
            >
              Selesai
              <span className="ml-1 sm:ml-1.5 text-xs  data-[state=active]:bg-slate-100 px-1.5 py-0.5 rounded">
                {completedCourses.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="not-started"
              className="p-1 sm:px-3 sm:py-2 text-sm rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-600 whitespace-nowrap"
            >
              Belum Mulai
              <span className="ml-1 sm:ml-1.5 text-xs  data-[state=active]:bg-slate-100 px-1.5 py-0.5 rounded">
                {notStartedCourses.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-6">
          {courses.length === 0 ? (
            renderEmptyState(
              "Belum ada kelas yang diikuti",
              <BookOpen className="h-6 w-6 " />
            )
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map(renderCourseCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          {inProgressCourses.length === 0 ? (
            renderEmptyState(
              "Tidak ada kelas yang sedang dipelajari",
              <Target className="h-6 w-6 " />
            )
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {inProgressCourses.map(renderCourseCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedCourses.length === 0 ? (
            renderEmptyState(
              "Belum ada kelas yang selesai",
              <GraduationCap className="h-6 w-6 " />
            )
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {completedCourses.map(renderCourseCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="not-started" className="mt-6">
          {notStartedCourses.length === 0 ? (
            renderEmptyState(
              "Semua kelas sudah dimulai!",
              <CheckCircle2 className="h-6 w-6 " />,
              false
            )
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {notStartedCourses.map(renderCourseCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MyCoursesPageSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-10 w-full max-w-xl" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden border border-slate-200">
            <Skeleton className="h-36 w-full rounded-none" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <div className="flex justify-between pt-3 border-t border-slate-100">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trophy } from "lucide-react";

import api from "@/lib/axios";
import { Course } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const difficultyConfig: Record<string, { label: string; className: string }> = {
  beginner: {
    label: "Pemula",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  intermediate: {
    label: "Menengah",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  advanced: {
    label: "Lanjutan",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses"); // Endpoint public
        setCourses(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <CourseCatalogSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Jelajah Kelas
          </h2>
          <p className="text-sm ">
            Temukan materi pembelajaran terbaik untuk mengembangkan karier
            developermu.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs ">
          <span className="rounded-full bg-muted px-3 py-1">
            ☕ Belajar fleksibel, kapan saja
          </span>
          <span className="hidden rounded-full bg-muted px-3 py-1 sm:inline">
            🎯 Dapatkan XP dari setiap kelas
          </span>
        </div>
      </div>

      {/* Kalau belum ada course */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/40 py-16 text-center">
          <div className="mb-3 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            Kelas belum tersedia
          </div>
          <h3 className="text-base font-semibold tracking-tight">
            Katalog kelas masih kosong
          </h3>
          <p className="mt-1 max-w-md text-sm ">
            Nantikan berbagai kelas seru yang akan segera hadir untuk menemani
            perjalanan belajarmu.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => {
            const diff =
              difficultyConfig[course.difficulty || ""] ??
              ({
                label: course.difficulty || "Semua level",
                className: "border-slate-200 bg-slate-50",
              } as const);

            return (
              <Card
                key={course.id}
                className="flex h-full flex-col overflow-hidden border border-border/70 bg-card/70 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Cover Image */}
                <div className="relative aspect-video w-full bg-muted">
                  {course.image_path ? (
                    <Image
                      src={course.image_path}
                      alt={course.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs ">
                      Tidak ada gambar
                    </div>
                  )}
                </div>

                <CardHeader className="space-y-2 p-4 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-base font-semibold leading-snug">
                      {course.name}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`whitespace-nowrap border text-[11px] font-medium ${diff.className}`}
                    >
                      {diff.label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-3 p-4 pt-1">
                  <p className="mb-2 line-clamp-3 text-xs ">
                    {course.summary ||
                      "Belum ada deskripsi singkat untuk kelas ini."}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-medium ">
                    <div className="flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5 text-amber-500" />
                      <span>{course.point ?? 0} XP</span>
                    </div>
                    {/* Kalau nanti ada durasi / level lain, bisa ditaruh di sini */}
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Link href={`/courses/${course.id}`} className="w-full">
                    <Button className="w-full text-sm" variant="outline">
                      Lihat Detail Kelas
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================= */
/* 🔷 Skeleton Loading Component */
/* ============================= */

function CourseCatalogSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="hidden h-7 w-36 rounded-full sm:block" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card
            key={i}
            className="flex h-full flex-col overflow-hidden border border-border/70"
          >
            <Skeleton className="aspect-video w-full" />
            <CardHeader className="space-y-2 p-4 pb-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex items-center justify-between pt-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Skeleton className="h-9 w-full rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

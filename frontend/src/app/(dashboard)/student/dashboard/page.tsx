"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle, CheckCircle } from "lucide-react";

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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/EmptyState";
import DashboardSkeleton from "@/components/DashboardSkeleton";

type User = {
  name: string;
};

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil User dari LocalStorage
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }

    // Ambil Data Kelas dari API
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

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Dashboard Siswa
          </h2>
          <p className="text-sm text-muted-foreground">
            Selamat datang kembali,{" "}
            <span className="font-medium text-foreground">
              {user?.name || "Siswa"}
            </span>
            . Lanjutkan pembelajaranmu hari ini.
          </p>
        </div>
        <Link href="/courses">
          <Button size="sm" className="rounded-full">
            Jelajah Kelas Baru
          </Button>
        </Link>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const progress = Math.min(Math.max(course.progress || 0, 0), 100);

            return (
              <Card
                key={course.id}
                className="flex h-full flex-col overflow-hidden border border-border/60 bg-card/60 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Gambar Kelas */}
                <div className="relative h-40 w-full bg-muted">
                  {course.image_path ? (
                    <Image
                      src={course.image_path}
                      alt={course.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      Tidak ada gambar
                    </div>
                  )}
                </div>

                <CardHeader className="space-y-2 pb-3">
                  <CardTitle className="line-clamp-1 text-base font-semibold">
                    {course.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge
                      variant="outline"
                      className="text-[11px] px-2 py-0.5"
                    >
                      {course.difficulty || "Umum"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-3 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span className="font-medium text-foreground">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </CardContent>

                <CardFooter className="pt-3">
                  <Link href={`/courses/${course.id}`} className="w-full">
                    <Button
                      className="w-full"
                      variant={progress === 100 ? "outline" : "default"}
                    >
                      {progress === 100 ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                          Selesai
                        </>
                      ) : (
                        <>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Lanjut Belajar
                        </>
                      )}
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

"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MapPin } from "lucide-react";
import api from "@/lib/axios";
import { Course } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

type User = {
  name: string;
  email?: string;
  city?: string;
  image_path?: string | null;
};

const ProfileUsersPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }

    const fetchCourses = async () => {
      try {
        const res = await api.get("/student/my-courses");
        setCourses(res.data.data);
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const stats = {
    total: courses.length,
    completed: courses.filter((c) => (c.progress || 0) === 100).length,
    inProgress: courses.filter(
      (c) => (c.progress || 0) > 0 && (c.progress || 0) < 100
    ).length,
  };

  if (loading) {
    return (
      <div className=" border border-slate-200 rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <Skeleton className="h-6 w-40 mx-auto sm:mx-0" />
            <Skeleton className="h-4 w-48 mx-auto sm:mx-0" />
          </div>
          <div className="flex gap-8">
            <Skeleton className="h-12 w-14" />
            <Skeleton className="h-12 w-14" />
            <Skeleton className="h-12 w-14" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-xl p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Avatar */}
        <Avatar className="h-20 w-20 border-2 border-slate-100">
          <AvatarImage
            src={user?.image_path || undefined}
            alt={user?.name}
            className="object-cover"
          />
          <AvatarFallback className="text-xl text-slate-600 dark:text-white font-medium">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-xl font-semibold ">{user?.name || "User"}</h1>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-4 mt-1">
            {user?.email && (
              <p className="text-sm  flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>
            )}
            {user?.city && (
              <p className="text-sm t flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {user.city}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 sm:gap-8 text-center mt-2 sm:mt-0">
          <div>
            <p className="text-2xl font-semibold t">{stats.total}</p>
            <p className="text-xs ">Kelas</p>
          </div>
          <div className="pl-6 sm:pl-8 border-l border-slate-200">
            <p className="text-2xl font-semibold ">{stats.completed}</p>
            <p className="text-xs ">Selesai</p>
          </div>
          <div className="pl-6 sm:pl-8 border-l border-slate-200">
            <p className="text-2xl font-semibold ">{stats.inProgress}</p>
            <p className="text-xs ">Aktif</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUsersPage;

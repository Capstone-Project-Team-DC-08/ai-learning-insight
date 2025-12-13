"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  LogOut,
  User,
  Settings,
  LogIn,
} from "lucide-react";
import { deleteCookie, getCookie } from "cookies-next";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/student/dashboard",
  },
  {
    label: "Kelas Saya",
    icon: BookOpen,
    href: "/student/my-courses",
  },
  {
    label: "Jelajah Kelas",
    icon: Compass,
    href: "/courses",
  },
  {
    label: "Profil Saya",
    icon: User,
    href: "/student/profile",
  },
  {
    label: "Pengaturan",
    icon: Settings,
    href: "/student/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
    const token = getCookie("token");
    setEnrolling(!!token);
  }, []);


  const onLogout = () => {
    deleteCookie("token");
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    router.push("/");
  };

  return (
    <aside className="flex h-screen w-full max-w-[260px] flex-col border-r bg-background/60 px-3 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/70">
      {/* Brand / Logo */}
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-none tracking-tight">
            LMS Code
          </span>
          <span className="text-xs text-muted-foreground">
            Ruang belajar kamu
          </span>
        </div>
      </div>

      {/* Menu */}
      <ScrollArea className="flex-1">
        <nav className="space-y-1 px-1">
          {routes.map((route) => {
            const isActive =
              pathname === route.href || pathname?.startsWith(route.href);

            return (
              <Button
                key={route.href}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "flex w-full justify-start gap-2 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-all",
                  "hover:bg-muted/70",
                  isActive && "bg-muted text-foreground shadow-sm"
                )}
              >
                <Link href={route.href}>
                  <div className="flex items-center">
                    <route.icon
                      className={cn(
                        "mr-2 h-4 w-4",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span>{route.label}</span>
                  </div>
                </Link>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className="mt-4 border-t pt-4">
        {enrolling ? (
          <>
            <Button
              variant="ghost"
              onClick={onLogout}
              className="flex w-full justify-center gap-2 px-2.5 py-2.5 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </Button>
          </>
        ) : (
          <>
            <Button
              className="flex w-full justify-center gap-2 px-2.5 py-2.5 text-sm "
            >
              <LogIn className="mr-2 h-4 w-4" />
               <Link href={"/login"} >Masuk</Link>
            </Button>
          </>
        )}
      </div>
    </aside>
  );
}

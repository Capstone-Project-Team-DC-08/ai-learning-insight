"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InsightRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/student/profile");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="">Redirecting to profile...</p>
    </div>
  );
}

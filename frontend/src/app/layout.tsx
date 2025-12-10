import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // <--- Import ini

export const metadata: Metadata = {
  title: "LMS Coding Platform",
  description: "Belajar coding dengan AI Learning Path",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster /> {/* <--- Pasang di sini */}
      </body>
    </html>
  );
}

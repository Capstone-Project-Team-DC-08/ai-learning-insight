import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Font default Next.js
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // <--- Import ini

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        {children}
        <Toaster /> {/* <--- Pasang di sini */}
      </body>
    </html>
  );
}

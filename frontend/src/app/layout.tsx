import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // <--- Import ini
import { ThemeProvider } from "@/components/ui/theme-provider";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster /> {/* <--- Pasang di sini */}
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { ReactNode } from "react";
import Sidebar from "@/components/shared/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/20">
  
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col z-40 border-r bg-background">
        <Sidebar />
      </div>

      <main className="flex-1 md:pl-64 flex flex-col">
        <header className="sticky top-0 z-30 border-b bg-background/80 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar />
              </SheetContent>
            </Sheet>

            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold leading-none tracking-tight">
                LMS Code
              </span>
              <span className="text-xs ">
                Dashboard siswa
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}

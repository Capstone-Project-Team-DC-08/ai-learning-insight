import Link from "next/link";
import { Button } from "./ui/button";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/40 py-16 text-center">
      <div className="mb-3 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
        Belum ada kelas yang diikuti
      </div>
      <h3 className="text-base font-semibold tracking-tight">
        Mulai perjalanan belajar pertamamu 🚀
      </h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Daftar ke kelas yang kamu minati dan pantau progres belajarmu langsung
        dari dashboard ini.
      </p>
      <Link href="/courses" className="mt-5">
        <Button variant="outline" size="sm" className="rounded-full">
          Cari Kelas
        </Button>
      </Link>
    </div>
  );
}

export default EmptyState;

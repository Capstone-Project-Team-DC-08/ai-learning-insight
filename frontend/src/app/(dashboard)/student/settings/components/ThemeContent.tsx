import { ModeToggle } from "@/components/ui/mode-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const ThemeContent = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <Card className="max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Tema Aplikasi</CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {currentTheme === "dark" ? "Mode Gelap" : "Mode Terang"}
          </p>
          <p className="text-xs text-muted-foreground">
            Sesuaikan tampilan aplikasi
          </p>
        </div>

        <ModeToggle />
      </CardContent>
    </Card>
  );
};

export default ThemeContent;

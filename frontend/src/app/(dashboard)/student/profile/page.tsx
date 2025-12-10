"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  Zap,
  Sparkles,
  Clock,
  BookOpen,
  Target,
  Moon,
  Flame,
  Brain,
  TrendingUp,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

import api from "@/lib/axios";
import { AIInsight } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import FocusTimeChart from "./fokusTime";

type FocusTimeData = {
  distribution: { name: string; value: number; count: number }[];
  optimal_period: string;
  optimal_time_range: string;
  total_activities: number;
};

// Persona Configuration
const personaConfig: Record<
  string,
  { icon: typeof Flame; description: string }
> = {
  "the sprinter": {
    icon: Flame,
    description: "Belajar intensif dalam waktu singkat dengan fokus tinggi",
  },
  "the night owl": {
    icon: Moon,
    description: "Paling produktif belajar di malam hari",
  },
  "the deep diver": {
    icon: Brain,
    description: "Mendalami materi secara komprehensif dan detail",
  },
  "the consistent": {
    icon: Target,
    description: "Memiliki pola belajar yang konsisten dan teratur setiap hari",
  },
  "the struggler": {
    icon: AlertCircle,
    description:
      "Masih mencari ritme belajar yang tepat, butuh dukungan lebih",
  },
};

// Pace Configuration
const paceConfig: Record<string, { icon: typeof Zap; description: string }> = {
  "fast learner": {
    icon: Zap,
    description: "Menyelesaikan materi dengan cepat dan efisien",
  },
  "consistent learner": {
    icon: TrendingUp,
    description: "Belajar dengan ritme stabil dan konsisten",
  },
  "reflective learner": {
    icon: BookOpen,
    description: "Meluangkan waktu untuk memahami secara mendalam",
  },
};

export default function StudentProfilePage() {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [focusTime, setFocusTime] = useState<FocusTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [insightRes, focusTimeRes] = await Promise.allSettled([
          api.get("/student/insights"),
          api.get("/student/focus-time"),
        ]);

        if (insightRes.status === "fulfilled" && insightRes.value.data.data) {
          setInsight(insightRes.value.data.data);
        }

        if (
          focusTimeRes.status === "fulfilled" &&
          focusTimeRes.value.data.data
        ) {
          setFocusTime(focusTimeRes.value.data.data);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerateInsight = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/student/insights/generate");
      setInsight(res.data.data);
      toast.success("Analisis Selesai!", {
        description: "AI telah memperbarui profil belajarmu.",
      });
    } catch (error: any) {
      toast.error("Gagal Menganalisis", {
        description: error.response?.data?.message || "Terjadi kesalahan.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const personaLabel =
    insight?.persona?.persona_label?.toLowerCase() || "the consistent";
  const paceLabel =
    insight?.pace?.pace_label?.toLowerCase() || "consistent learner";

  const PersonaIcon =
    personaConfig[personaLabel]?.icon || personaConfig["the consistent"].icon;
  const PaceIcon =
    paceConfig[paceLabel]?.icon || paceConfig["consistent learner"].icon;

  if (loading) {
    return <ProfileContentSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Learning Profile Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Profil Belajar
            </h2>
            <p className="text-sm text-slate-500">
              Hasil analisis AI berdasarkan aktivitas belajarmu
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateInsight}
            disabled={generating}
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            {generating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Perbarui
              </>
            )}
          </Button>
        </div>

        {insight ? (
          <>
            {/* Dual Cards - Persona & Pace */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Persona Card */}
              <Card className="border border-slate-200 bg-white">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <PersonaIcon className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Persona
                      </p>
                      <h3 className="text-base font-semibold text-slate-900 mt-1 capitalize">
                        {insight.persona?.persona_label || "Balanced Learner"}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1.5">
                        {personaConfig[personaLabel]?.description ||
                          "Memiliki gaya belajar yang unik"}
                      </p>
                    </div>
                  </div>

                  {insight.persona?.characteristics &&
                    insight.persona.characteristics.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex flex-wrap gap-1.5">
                          {insight.persona.characteristics
                            .slice(0, 3)
                            .map((char, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-slate-50 text-slate-600 text-xs rounded"
                              >
                                {char}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>

              {/* Pace Card */}
              <Card className="border border-slate-200 bg-white">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <PaceIcon className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Pace Belajar
                      </p>
                      <h3 className="text-base font-semibold text-slate-900 mt-1 capitalize">
                        {insight.pace?.pace_label || "Consistent Learner"}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1.5">
                        {paceConfig[paceLabel]?.description ||
                          "Belajar dengan ritme yang sesuai"}
                      </p>
                    </div>
                  </div>

                  {insight.pace?.insight && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-sm text-slate-600">
                        {insight.pace.insight}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* AI Advice */}
            {insight.advice?.advice_text && (
              <Card className="border border-slate-200 bg-slate-50">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <Lightbulb className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                        Rekomendasi AI
                      </p>
                      <div className="prose prose-sm prose-slate max-w-none prose-p:my-1.5 prose-p:text-slate-700 prose-p:leading-relaxed prose-strong:text-slate-800 prose-ul:my-2 prose-ul:text-slate-700 prose-li:my-0.5 prose-headings:text-slate-800 prose-headings:font-semibold prose-h3:text-sm prose-h4:text-sm">
                        <ReactMarkdown>{insight.advice.advice_text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50">
            <CardContent className="py-12 text-center">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">
                Temukan Profil Belajarmu
              </h3>
              <p className="text-slate-500 text-sm mb-5 max-w-xs mx-auto">
                AI akan menganalisis pola belajar dan memberikan insight
                personal.
              </p>
              <Button
                onClick={handleGenerateInsight}
                disabled={generating}
                size="sm"
                className="bg-slate-900 hover:bg-slate-800"
              >
                {generating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Mulai Analisis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Focus Time Section */}
      <Card className="border border-slate-200 bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-900">
            Distribusi Waktu Belajar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-64">
              <FocusTimeChart data={focusTime?.distribution || []} />
            </div>
            <div className="flex-1">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium text-slate-900 text-sm">
                      Waktu Optimal
                    </h4>
                    {focusTime && focusTime.total_activities > 0 ? (
                      <>
                        <p className="text-sm text-slate-600 mt-1">
                          Berdasarkan{" "}
                          <span className="font-medium">
                            {focusTime.total_activities} aktivitas
                          </span>{" "}
                          belajarmu, waktu paling efektif adalah{" "}
                          <span className="font-medium text-slate-900">
                            {focusTime.optimal_period} (
                            {focusTime.optimal_time_range})
                          </span>
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          Tip: Alokasikan materi yang lebih sulit di jam ini.
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-slate-500 mt-1">
                        Belum ada data aktivitas belajar. Mulai belajar untuk
                        melihat pola waktu optimalmu.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
        <p className="text-xs text-slate-400">
          <span className="font-medium text-slate-500">
            Bagaimana ini dihitung?
          </span>{" "}
          AI menganalisis waktu belajar, kecepatan menyelesaikan materi,
          konsistensi jadwal, dan performa quiz untuk mengidentifikasi profil
          belajarmu.
        </p>
      </div>
    </div>
  );
}

function ProfileContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="space-y-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

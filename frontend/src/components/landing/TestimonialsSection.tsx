"use client";

import { Star, Quote } from "lucide-react";

interface TestimonialProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

export function TestimonialCard({
  name,
  role,
  company,
  content,
  rating,
}: TestimonialProps) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 hover:bg-slate-800/80 transition-all">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      <Quote className="h-5 w-5 text-slate-600 mb-3" />

      <p className="text-slate-300 mb-4">{content}</p>

      <div className="border-t border-slate-700 pt-4">
        <p className="font-semibold text-white">{name}</p>
        <p className="text-sm text-slate-400">
          {role} at {company}
        </p>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const testimonials: TestimonialProps[] = [
    {
      name: "Budi Santoso",
      role: "Junior Developer",
      company: "Gojek",
      content:
        "Dengan CodeSmart, saya bisa belajar coding dengan pace yang sesuai dengan saya. AI-nya membantu identify weakness dan memberikan path yang tepat.",
      rating: 5,
    },
    {
      name: "Siti Nurhaliza",
      role: "Full Stack Developer",
      company: "Tokopedia",
      content:
        "Platform ini sangat interactive dan gamification-nya membuat saya tetap motivated. Dari zero sampai landing pertama job dalam 6 bulan!",
      rating: 5,
    },
    {
      name: "Ahmad Rizki",
      role: "Software Engineer",
      company: "Grab",
      content:
        "CodeSmart bukan hanya tempat belajar, tapi community yang supportive. Real feedback dari challenges membantu banget improvement coding skill.",
      rating: 5,
    },
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
      <div className="mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Apa Kata Mereka
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Ribuan developer telah mengubah karir mereka dengan CodeSmart
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard key={idx} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQItem[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const defaultFAQs: FAQItem[] = [
    {
      question: "Apa itu CodeSmart dan bagaimana cara kerjanya?",
      answer:
        "CodeSmart adalah platform pembelajaran coding dengan AI Learning Path yang dipersonalisasi. AI kami menganalisis learning style dan progress Anda untuk merekomendasikan path yang paling efektif. Anda dapat belajar dengan pace sendiri, mengikuti challenges, dan mendapatkan feedback real-time.",
    },
    {
      question: "Apakah CodeSmart gratis?",
      answer:
        "CodeSmart menawarkan free tier dengan akses ke course dasar dan challenges. Untuk akses unlimited ke semua courses, advanced features, dan mentoring, tersedia paid plans dengan harga yang terjangkau.",
    },
    {
      question: "Berapa lama waktu yang dibutuhkan untuk menguasai coding?",
      answer:
        "Tergantung pada background dan komitmen Anda. Dengan CodeSmart, rata-rata user dapat menyelesaikan junior developer path dalam 3-6 bulan dengan belajar 1-2 jam per hari. Tentu saja, ini dapat bervariasi.",
    },
    {
      question: "Apakah saya perlu experience programming sebelumnya?",
      answer:
        "Tidak! CodeSmart dirancang untuk complete beginners. Kami mulai dari fundamentals seperti logic dan algorithms, kemudian progress ke programming languages dan frameworks.",
    },
    {
      question: "Bahasa pemrograman apa saja yang bisa dipelajari?",
      answer:
        "Kami menawarkan courses untuk JavaScript, TypeScript, React, Python, Java, Node.js, dan lebih banyak lagi. Setiap quarter kami menambahkan technologies terbaru yang in-demand di industri.",
    },
    {
      question: "Bagaimana jika saya stuck di sebuah challenge?",
      answer:
        "CodeSmart menyediakan multiple resources untuk membantu Anda: hints yang dipersonalisasi, discussions dengan community, dan akses ke mentors (pada paid plans). Real-time feedback juga membantu Anda understand mistakes.",
    },
    {
      question: "Apakah saya akan mendapat certificate setelah menyelesaikan course?",
      answer:
        "Ya! Setelah menyelesaikan course dengan passing grade, Anda akan mendapat verified certificate yang bisa ditambahkan ke LinkedIn profile dan resume Anda.",
    },
    {
      question: "Bagaimana career support setelah graduating?",
      answer:
        "Kami memiliki dedicated job board, resume reviews, interview prep sessions, dan networking events dengan companies yang mencari developers. Banyak graduates kami yang berhasil mendapat job dalam 3 bulan setelah graduation.",
    },
  ];

  const faqItems = faqs || defaultFAQs;

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
      <div className="mx-auto max-w-4xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-400">
            Jawaban untuk pertanyaan umum tentang CodeSmart
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/50 hover:bg-slate-800/80 transition-all"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left"
              >
                <span className="font-semibold text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/30">
                  <p className="text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-white mb-2">
            Masih ada pertanyaan?
          </h3>
          <p className="text-slate-300 mb-6">
            Tim support kami siap membantu Anda 24/7
          </p>
          <a
            href="mailto:support@codesmart.dev"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Hubungi Support
          </a>
        </div>
      </div>
    </section>
  );
}

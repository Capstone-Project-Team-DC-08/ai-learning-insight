"use client";

import Link from "next/link";
import { Code2, Github, Mail, ExternalLink } from "lucide-react";

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  const links = {
    Product: [
      { label: "Courses", href: "/courses" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Security", href: "#security" },
    ],
    Company: [
      { label: "About Us", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
      { label: "Contact", href: "#contact" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" },
      { label: "GDPR", href: "#gdpr" },
    ],
    Social: [
      {
        label: "GitHub",
        href: "https://github.com/Capstone-Project-Team-DC-08/ai-learning-insight",
        icon: Github,
      },
      {
        label: "Email",
        href: "mailto:support@codesmart.dev",
        icon: Mail,
      },
    ],
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-white">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-2">
                <Code2 className="h-5 w-5" />
              </div>
              <span className="text-lg">CodeSmart</span>
            </Link>
            <p className="text-sm text-slate-400">
              Platform pembelajaran coding dengan AI Learning Path yang
              dipersonalisasi.
            </p>
          </div>

          {/* Links Sections */}
          {Object.entries(links).slice(0, 3).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex flex-col gap-3">
              {links.Social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {currentYear} CodeSmart. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#privacy"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#terms"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#cookies"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

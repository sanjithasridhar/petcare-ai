"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, Sparkles, Activity, Plus } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      color: "bg-[#5c1618] text-white shadow-rose-900/30",
      activeText: "text-[#5c1618] font-bold",
      indicator: "bg-[#5c1618]",
      accentBorder: "border-[#5c1618]/30",
    },
    {
      name: "My Pets",
      href: "/pets",
      color: "bg-[#0a2f24] text-white shadow-emerald-900/30",
      activeText: "text-[#0a2f24] font-bold",
      indicator: "bg-[#0a2f24]",
      accentBorder: "border-[#0a2f24]/30",
    },
    {
      name: "Experiments",
      href: "/experiments",
      color: "bg-[#581c87] text-white shadow-purple-900/30",
      activeText: "text-[#581c87] font-bold",
      indicator: "bg-[#581c87]",
      accentBorder: "border-[#581c87]/30",
    },
    {
      name: "Surveys",
      href: "/surveys",
      color: "bg-[#1d4ed8] text-white shadow-blue-900/30",
      activeText: "text-[#1d4ed8] font-bold",
      indicator: "bg-[#1d4ed8]",
      accentBorder: "border-[#1d4ed8]/30",
    },
    {
      name: "Interviews",
      href: "/interviews",
      color: "bg-[#b45309] text-white shadow-amber-900/30",
      activeText: "text-[#b45309] font-bold",
      indicator: "bg-[#b45309]",
      accentBorder: "border-[#b45309]/30",
    },
    {
      name: "Insights",
      href: "/insights",
      color: "bg-[#be123c] text-white shadow-rose-900/30",
      activeText: "text-[#be123c] font-bold",
      indicator: "bg-[#be123c]",
      accentBorder: "border-[#be123c]/30",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#5c1618]/95 backdrop-blur-md border-b border-[#781d22] text-[#f7f4ed] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#e6ddc5] to-[#c2b29f] p-2 flex items-center justify-center text-[#5c1618] shadow-md group-hover:scale-105 transition-transform">
            <Crown className="w-6 h-6 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#5c1618]"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#f7f4ed]">PetCare</span>
              <span className="text-[10px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded-full bg-[#f4efe6]/20 text-[#f4efe6] border border-[#f4efe6]/30">
                AI Studio
              </span>
            </div>
            <p className="text-[11px] text-[#e6ddc5]/70 hidden sm:block tracking-wide">Autonomous Companion Research & Care</p>
          </div>
        </Link>

        {/* Color-Coded Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#420d10]/70 p-1.5 rounded-2xl border border-[#781d22]/80 shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-[#f4efe6] text-[#5c1618] shadow-sm font-bold"
                    : "text-[#f4efe6]/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-transform ${
                    isActive ? `${link.indicator} scale-125` : "bg-[#f4efe6]/40"
                  }`}
                />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Status & Quick Action */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#420d10] border border-[#781d22] text-[11px] font-semibold text-[#e6ddc5]/90">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Gemini 3.8 Flash</span>
          </div>

          <Link
            href="/pets"
            className="flex items-center gap-2 bg-[#e6ddc5] hover:bg-white text-[#5c1618] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Add Pet</span>
          </Link>
        </div>

      </div>

      {/* Mobile Navigation Strip */}
      <div className="md:hidden flex overflow-x-auto py-2 px-4 gap-2 border-t border-[#781d22] bg-[#420d10]/95 scrollbar-none">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isActive ? "bg-[#f4efe6] text-[#5c1618]" : "text-[#f4efe6]/80"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${link.indicator}`} />
              {link.name}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
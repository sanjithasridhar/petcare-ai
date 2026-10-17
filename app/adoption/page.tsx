"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles, PawPrint, CheckCircle2, ChevronRight, ShieldCheck } from "lucide-react";

export default function AdoptionPage() {
  const companions = [
    {
      name: "Sunny & Oliver",
      type: "Bonded Canine & Feline Pair",
      image: "/images/friends.jpg",
      status: "Available for Foster",
      statusColor: "bg-amber-100 text-amber-800 border-amber-300",
      compatibility: "99% High Compatibility",
      desc: "Golden Retriever and long-haired Tabby who must stay together. Gentle, affectionate, and quiet.",
    },
    {
      name: "The Harmony Cohort",
      type: "Multi-Species Sanctuary Friends",
      image: "/images/community-group.jpg",
      status: "Sanctuary Ambassador",
      statusColor: "bg-blue-100 text-blue-800 border-blue-300",
      compatibility: "Universal Social Match",
      desc: "Dalmatian, Macaw, Cat, Tortoise, Bunny, Poodle, Ferret, and Fish demonstrating multi-species coexistence.",
    },
    {
      name: "Bella Rosa",
      type: "Toy Maltese",
      image: "/images/chia-profile.jpg",
      status: "Sponsored Companion",
      statusColor: "bg-rose-100 text-rose-800 border-rose-300",
      compatibility: "Hypoallergenic Comfort",
      desc: "White Maltese with a calm, royal demeanor. Thrives in peaceful indoor environments with plush bedding.",
    },
    {
      name: "Snowball",
      type: "Bichon Frise",
      image: "/images/couch-dog.jpg",
      status: "Senior Slumber Master",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      compatibility: "Low Energy / Senior Match",
      desc: "Loves vintage velvet couches, cozy firesides, and leisurely afternoon walks. Perfect lap companion.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ed] p-4 sm:p-10 pb-28 font-sans text-[#1c1c1c]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-[#b45309] text-white p-6 sm:p-10 rounded-[36px] shadow-xl border border-amber-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 text-amber-200 text-xs font-bold uppercase tracking-wider border border-amber-400/20">
              <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" /> Sanctuary & Foster Center
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Companion Adoption & Foster Hub
            </h1>
            <p className="text-amber-100 text-sm sm:text-base">
              Verified behavioral matching powered by Gemini 3.8 Flash. Find harmonious additions to your household.
            </p>
          </div>

          <Link
            href="/pets"
            className="bg-[#f4efe6] hover:bg-white text-[#b45309] px-7 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition shrink-0"
          >
            Register a Pet
          </Link>
        </div>

        {/* Adoption Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companions.map((c) => (
            <div
              key={c.name}
              className="bg-white rounded-[32px] p-6 border border-[#e6ddce] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-5 bg-[#f4efe6]">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-md ${c.statusColor}`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {c.compatibility}
                  </div>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#1c1c1c] group-hover:text-[#b45309] transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mb-2">{c.type}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{c.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/interviews"
                  className="text-xs font-bold text-[#b45309] hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Simulate Household Match
                </Link>

                <Link
                  href="/dashboard"
                  className="bg-[#b45309] hover:bg-[#92400e] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition"
                >
                  Inquire
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
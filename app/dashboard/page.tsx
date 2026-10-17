"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Crown,
  Heart,
  ShieldCheck,
  Activity,
  Sparkles,
  Users,
  FileSpreadsheet,
  LineChart,
  PawPrint,
  ChevronRight,
  ArrowUpRight,
  MessageCircle,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const companions = [
    {
      id: "barnaby",
      name: "Sir Barnaby",
      role: "Lead Aristocrat Hound",
      breed: "Red Vizsla Hound (Velvet Tuxedo)",
      species: "Canine",
      image: "/images/hero-dog.jpg",
      accent: "#5c1618",
      accentBg: "bg-[#5c1618]",
      badgeText: "Velvet Crimson",
      vitality: "99.4%",
      heartRate: "68 bpm",
      diet: "Premium Organic Venison",
      routine: "Aristocratic Stroll & Acoustic Session",
      quote: "Composed, regal posture with high attentiveness.",
    },
    {
      id: "friends",
      name: "Sunny & Oliver",
      role: "Inseparable Bonded Pair",
      breed: "Golden Retriever & Tabby Cat",
      species: "Bonded Duo",
      image: "/images/friends.jpg",
      accent: "#b45309",
      accentBg: "bg-[#b45309]",
      badgeText: "Golden Amber",
      vitality: "98.8%",
      heartRate: "72 bpm / 140 bpm",
      diet: "Synchronized Nutrition Formula",
      routine: "Afternoon Sunbathing & Dual Grooming",
      quote: "Remarkable cross-species empathy and synchronized rest.",
    },
    {
      id: "community",
      name: "The Harmony Family",
      role: "8-Species Community Cohort",
      breed: "Dalmatian, Macaw, Cat, Tortoise, Rabbit, Poodle, Ferret, Goldfish",
      species: "Multi-Species",
      image: "/images/community-group.jpg",
      accent: "#1e4d8c",
      accentBg: "bg-[#1e4d8c]",
      badgeText: "Sapphire Ocean",
      vitality: "100%",
      heartRate: "Normalized Across Cohort",
      diet: "Species-Specific Rotational Feeding",
      routine: "Morning Multi-Species Social Hour",
      quote: "Zero friction observed across all 8 distinct animal classes.",
    },
    {
      id: "bella",
      name: "Bella Rosa",
      role: "Royal Maltese Companion",
      breed: "Maltese (Glitter Clip)",
      species: "Canine (Toy)",
      image: "/images/chia-profile.jpg",
      accent: "#881337",
      accentBg: "bg-[#881337]",
      badgeText: "Wine Velvet",
      vitality: "99.1%",
      heartRate: "82 bpm",
      diet: "Hydrolyzed Protein Morsels",
      routine: "Plush Velvet Lounging & Coat Care",
      quote: "Exceptional relaxation on tufted velvet surfaces.",
    },
    {
      id: "snowball",
      name: "Snowball",
      role: "Library Chesterfield Sleeper",
      breed: "Bichon Frise",
      species: "Canine",
      image: "/images/couch-dog.jpg",
      accent: "#0a2f24",
      accentBg: "bg-[#0a2f24]",
      badgeText: "Hunter Emerald",
      vitality: "97.9%",
      heartRate: "64 bpm (Resting)",
      diet: "Low-Calorie Recovery Kibble",
      routine: "4-Hour Deep REM Library Slumber",
      quote: "Monitored deep sleep cycle on button-tufted leather sofa.",
    },
  ];

  const [activePetIndex, setActivePetIndex] = useState(0);
  const activePet = companions[activePetIndex];

  return (
    <div className="min-h-screen bg-[#c2b29f]/40 p-4 sm:p-8 pb-24 font-sans text-[#1c1c1c]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#e6ddc5] p-6 rounded-[32px] border border-[#d9ccb2] shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5c1618] text-[#f4efe6] text-xs font-bold uppercase tracking-wider mb-1">
              <Crown className="w-3.5 h-3.5" /> Central PetCare Hub
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#5c1618]">
              The Velvet Lounge
            </h1>
            <p className="text-[#5c1618]/70 text-sm mt-0.5">
              Live companion telemetry, behavioral simulations, and multi-species harmony.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/pets"
              className="bg-[#5c1618] text-white hover:bg-[#420d10] px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center gap-2"
            >
              <PawPrint className="w-4 h-4" />
              Manage All Pets
            </Link>
            <Link
              href="/interviews"
              className="bg-white/80 hover:bg-white text-[#5c1618] border border-[#5c1618]/20 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              AI Consult
            </Link>
          </div>
        </div>

        {/* Interactive Spotlight Hero Card */}
        <div className="bg-[#e6ddc5] p-6 sm:p-8 rounded-[40px] shadow-xl border border-[#d9ccb2]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Frame */}
            <div className="lg:col-span-7 relative h-[420px] rounded-[32px] overflow-hidden shadow-2xl bg-black">
              <Image
                src={activePet.image}
                alt={activePet.name}
                fill
                priority
                className="object-cover transition-all duration-700 hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Floating Pill on Image */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <span className="bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold border border-white/20 shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {activePet.badgeText}
                </span>

                <span className="bg-[#5c1618] text-[#f4efe6] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md">
                  {activePet.species}
                </span>
              </div>

              {/* Bottom Quote & Name overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-serif text-3xl font-bold drop-shadow-md">{activePet.name}</h3>
                <p className="text-xs text-amber-200 font-medium mb-1 drop-shadow-sm">{activePet.role}</p>
                <p className="text-xs text-slate-200 italic line-clamp-1 drop-shadow-sm">
                  &ldquo;{activePet.quote}&rdquo;
                </p>
              </div>
            </div>

            {/* Right Telemetry Details */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5c1618]/70">
                    Active Subject Spotlight
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Health: Optimal
                  </span>
                </div>
                <h2 className="font-serif text-3xl font-bold text-[#5c1618] mb-1">
                  {activePet.name}
                </h2>
                <p className="text-xs text-[#5c1618]/80 font-medium">{activePet.breed}</p>
              </div>

              {/* Vitality Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 bg-white/70 p-4 rounded-2xl border border-[#d9ccb2]">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Vitality Score</p>
                  <p className="text-2xl font-bold text-emerald-700">{activePet.vitality}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Heart Rhythm</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{activePet.heartRate}</p>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Active Nutrition</p>
                  <p className="text-xs font-semibold text-[#5c1618]">{activePet.diet}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Daily Protocol</p>
                  <p className="text-xs font-semibold text-slate-700">{activePet.routine}</p>
                </div>
              </div>

              {/* Companion Selector Strip (All 5 Uploaded Images) */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#5c1618] mb-3">
                  Select Companion to Inspect:
                </p>
                <div className="flex items-center gap-3">
                  {companions.map((comp, idx) => (
                    <button
                      key={comp.id}
                      onClick={() => setActivePetIndex(idx)}
                      className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all duration-200 group ${
                        activePetIndex === idx
                          ? "border-[#5c1618] scale-110 shadow-lg ring-2 ring-[#5c1618]/30"
                          : "border-white/60 opacity-70 hover:opacity-100 hover:scale-105"
                      }`}
                      title={comp.name}
                    >
                      <Image
                        src={comp.image}
                        alt={comp.name}
                        fill
                        className="object-cover"
                      />
                      {activePetIndex === idx && (
                        <span className="absolute bottom-0 inset-x-0 h-1.5 bg-[#5c1618]"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Color-Coded KPI Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-[#5c1618] text-[#f4efe6] p-6 rounded-[30px] shadow-md border border-[#7e1d23] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#e6ddc5]/80">Companions</span>
              <PawPrint className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="font-serif text-4xl font-bold">5</p>
              <p className="text-xs text-[#e6ddc5]/80 mt-1">Full Velvet Registry</p>
            </div>
          </div>

          <div className="bg-[#0a2f24] text-white p-6 rounded-[30px] shadow-md border border-emerald-900 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200/80">Health Status</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-serif text-4xl font-bold">0 Alerts</p>
              <p className="text-xs text-emerald-200/80 mt-1">100% Stability Index</p>
            </div>
          </div>

          <div className="bg-[#581c87] text-white p-6 rounded-[30px] shadow-md border border-purple-900 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-200/80">AI Personas</span>
              <Users className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <p className="font-serif text-4xl font-bold">Active</p>
              <p className="text-xs text-purple-200/80 mt-1">Gemini 3.8 Flash</p>
            </div>
          </div>

          <div className="bg-[#b45309] text-white p-6 rounded-[30px] shadow-md border border-amber-900 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200/80">Species</span>
              <Activity className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="font-serif text-4xl font-bold">8 Classes</p>
              <p className="text-xs text-amber-200/80 mt-1">Avian to Feline</p>
            </div>
          </div>

        </div>

        {/* 5-Companion Visual Showcase Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#5c1618]">
              Registered Companion Profiles
            </h2>
            <Link href="/pets" className="text-xs font-bold text-[#5c1618] hover:underline flex items-center gap-1">
              View all in registry <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companions.map((comp, idx) => (
              <div
                key={comp.id}
                className="bg-[#e6ddc5] rounded-[32px] p-5 border border-[#d9ccb2] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 bg-slate-200">
                    <Image
                      src={comp.image}
                      alt={comp.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {comp.species}
                    </div>
                  </div>

                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#5c1618]">{comp.name}</h3>
                      <p className="text-xs text-slate-700 font-medium">{comp.role}</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1" title="Healthy"></span>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 line-clamp-2 italic">
                    &ldquo;{comp.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#d9ccb2] flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#5c1618] bg-white/70 px-2.5 py-1 rounded-lg">
                    Vitality {comp.vitality}
                  </span>
                  
                  <Link
                    href="/interviews"
                    className="text-xs font-bold text-white bg-[#5c1618] hover:bg-[#420d10] px-3.5 py-1.5 rounded-xl transition flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Consult
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launchpad to Color-Coded Modules */}
        <div className="bg-[#5c1618] text-[#f4efe6] p-8 rounded-[40px] shadow-xl border border-[#7e1d23]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300">
                Action Launchpad
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#f7f4ed]">
                Simulate, Survey, & Extract Insights
              </h3>
              <p className="text-xs sm:text-sm text-[#e6ddc5]/80">
                Pair your registered companions with Gemini 3.8 Flash synthetic personas to predict product reactions, behavioral patterns, and dietary responses.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/experiments"
                className="bg-[#e6ddc5] text-[#5c1618] hover:bg-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-md"
              >
                New Experiment
              </Link>
              <Link
                href="/surveys"
                className="bg-[#1d4ed8] text-white hover:bg-[#1e40af] px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-md"
              >
                Launch Survey
              </Link>
              <Link
                href="/insights"
                className="bg-[#be123c] text-white hover:bg-[#9f1239] px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-md"
              >
                View Insights
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
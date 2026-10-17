"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Heart,
  Activity,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ArrowRight,
  PawPrint,
} from "lucide-react";

export default function HealthPage() {
  const healthRecords = [
    {
      name: "Sir Barnaby",
      breed: "Red Vizsla Hound (Velvet Tuxedo)",
      image: "/images/hero-dog.jpg",
      status: "Optimal",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      heartRate: "68 bpm",
      temperature: "38.4 °C",
      weight: "26.5 kg",
      vaccination: "Up to Date (DHPP, Rabies, Bordetella)",
      lastCheckup: "Oct 12, 2026",
      diet: "Hypoallergenic venison & cold-pressed flax oil",
      notes: "Exceptional cardiovascular conditioning. No signs of fatigue.",
    },
    {
      name: "Sunny & Oliver",
      breed: "Golden Retriever & Tabby Cat",
      image: "/images/friends.jpg",
      status: "Synchronized",
      statusColor: "bg-amber-100 text-amber-800 border-amber-300",
      heartRate: "72 bpm / 140 bpm",
      temperature: "38.6 °C / 38.8 °C",
      weight: "31.0 kg / 4.8 kg",
      vaccination: "Up to Date (FVRCP, Rabies, Leptospirosis)",
      lastCheckup: "Sep 28, 2026",
      diet: "High-protein salmon recipe with omega-3 fatty acids",
      notes: "Bonded pair displays synchronized resting patterns and mutual grooming.",
    },
    {
      name: "The Harmony Family",
      breed: "8-Species Community Cohort",
      image: "/images/community-group.jpg",
      status: "Stable Cohort",
      statusColor: "bg-blue-100 text-blue-800 border-blue-300",
      heartRate: "Normalized Across Species",
      temperature: "Calibrated Environment (24 °C)",
      weight: "Cohort Total 68 kg",
      vaccination: "Species-Specific Immunizations Verified",
      lastCheckup: "Oct 05, 2026",
      diet: "Botanical greens, custom avian seed, canine kibble, aquatic flakes",
      notes: "Remarkable social harmony. Zero inter-species aggression recorded.",
    },
    {
      name: "Bella Rosa",
      breed: "Royal Maltese (Glitter Clip)",
      image: "/images/chia-profile.jpg",
      status: "Optimal",
      statusColor: "bg-rose-100 text-rose-800 border-rose-300",
      heartRate: "82 bpm",
      temperature: "38.2 °C",
      weight: "3.2 kg",
      vaccination: "Up to Date (Core Boosters)",
      lastCheckup: "Oct 15, 2026",
      diet: "Gently cooked turkey with sweet potato & blueberry",
      notes: "Coat texture is lustrous. Stress index remains 0.0% during velvet rest.",
    },
    {
      name: "Snowball Chesterfield",
      breed: "Bichon Frise (Chesterfield Sleeper)",
      image: "/images/couch-dog.jpg",
      status: "Resting",
      statusColor: "bg-purple-100 text-purple-800 border-purple-300",
      heartRate: "64 bpm (Resting)",
      temperature: "38.3 °C",
      weight: "5.4 kg",
      vaccination: "Up to Date (Annual Physical)",
      lastCheckup: "Oct 01, 2026",
      diet: "Joint-support formula with glucosamine & green-lipped mussel",
      notes: "Deep sleep cycles uninterrupted. Excellent joint mobility upon waking.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ed] p-4 sm:p-10 pb-28 font-sans text-[#1c1c1c]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-[#e6ddce]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0a2f24] text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Veterinary Telemetry
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0a2f24] tracking-tight">
              Health & Vitality Dossiers
            </h1>
            <p className="text-slate-600 text-base mt-2 max-w-xl">
              Continuous biometric tracking, preventative medicine schedules, and veterinary diagnostics.
            </p>
          </div>

          <Link
            href="/interviews"
            className="bg-[#0a2f24] hover:bg-[#134033] text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Consult Virtual Vet
          </Link>
        </div>

        {/* Health Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#e6ddce] shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-400">Total Monitored</span>
            <p className="font-serif text-3xl font-bold text-[#0a2f24] mt-1">5 Cohorts</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e6ddce] shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-400">Vaccinations</span>
            <p className="font-serif text-3xl font-bold text-emerald-700 mt-1">100% Current</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e6ddce] shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-400">Rest Score</span>
            <p className="font-serif text-3xl font-bold text-[#b45309] mt-1">98.4% Peak</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e6ddce] shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-400">Next Audit</span>
            <p className="font-serif text-3xl font-bold text-[#5c1618] mt-1">In 14 Days</p>
          </div>
        </div>

        {/* Pet Health Records List */}
        <div className="space-y-6">
          {healthRecords.map((rec) => (
            <div
              key={rec.name}
              className="bg-white rounded-[36px] p-6 sm:p-8 border border-[#e6ddce] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row items-start lg:items-center gap-8 group"
            >
              {/* Image Frame */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-[28px] overflow-hidden relative shrink-0 border-2 border-[#e6ddce] bg-[#f4efe6]">
                <Image
                  src={rec.image}
                  alt={rec.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Central Information */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a2f24]">
                      {rec.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">{rec.breed}</p>
                  </div>

                  <span className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border ${rec.statusColor} self-start sm:self-auto`}>
                    {rec.status}
                  </span>
                </div>

                {/* Metrics Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-[#fbf9f4] p-2.5 rounded-xl border border-[#e6ddce]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Heart Rate</span>
                    <p className="text-xs font-bold text-slate-800">{rec.heartRate}</p>
                  </div>
                  <div className="bg-[#fbf9f4] p-2.5 rounded-xl border border-[#e6ddce]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Body Temp</span>
                    <p className="text-xs font-bold text-slate-800">{rec.temperature}</p>
                  </div>
                  <div className="bg-[#fbf9f4] p-2.5 rounded-xl border border-[#e6ddce]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Weight</span>
                    <p className="text-xs font-bold text-slate-800">{rec.weight}</p>
                  </div>
                  <div className="bg-[#fbf9f4] p-2.5 rounded-xl border border-[#e6ddce]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Last Exam</span>
                    <p className="text-xs font-bold text-slate-800">{rec.lastCheckup}</p>
                  </div>
                </div>

                {/* Clinical Notes & Diet */}
                <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <p><strong className="text-slate-800">Dietary Regimen:</strong> {rec.diet}</p>
                  <p><strong className="text-slate-800">Veterinary Note:</strong> {rec.notes}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex flex-col gap-2 w-full lg:w-auto">
                <Link
                  href="/interviews"
                  className="bg-[#5c1618] hover:bg-[#420d10] text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center shadow-md transition"
                >
                  AI Consultation
                </Link>
                <Link
                  href="/dashboard"
                  className="bg-[#f4efe6] hover:bg-[#e6ddc5] text-[#0a2f24] px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center border border-[#e6ddce] transition"
                >
                  View Telemetry
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
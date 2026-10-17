"use client";

import React, { useState } from "react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Sparkles,
  Users,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Activity,
  Layers,
} from "lucide-react";

type Assessment = {
  personaId: string;
  personaName: string;
  segment: string;
  score: number;
  reasons: string[];
  benefits: string[];
  barriers: string[];
  conditions: string[];
};

type Segment = {
  name: string;
  personaNames: string[];
  summary: string;
  averageScore: number | null;
};

type SentimentData = {
  perPersona: { personaName: string; sentiment: string; reason: string }[];
  counts: Record<string, number>;
  mainReasons: string[];
};

interface InsightChartsProps {
  assessments?: Assessment[];
  sentiment?: SentimentData;
  segments?: Segment[];
  overall?: { averageScore: number | null; assessed: number };
  evidenceCounts?: { responseCount: number; interviewMessageCount: number; surveyCount?: number; interviewCount?: number };
}

const defaultSampleAssessments: Assessment[] = [
  {
    personaId: "sample-1",
    personaName: "Sarah Lin-Bauer",
    segment: "Rural Pet Parent",
    score: 75,
    reasons: ["Critical need for immediate emergency guidance"],
    benefits: ["Direct hazard mitigation and telemedicine triage"],
    barriers: ["Needs clear dosage instructions"],
    conditions: ["Immediate emergency protocol"],
  },
  {
    personaId: "sample-2",
    personaName: "Dale Vaneck",
    segment: "Sporting Dog Handler",
    score: 65,
    reasons: ["Multi-dog kennel health tracking"],
    benefits: ["Seasonal field booster timing"],
    barriers: ["Field mobility and offline access"],
    conditions: ["Kennel batch profiles"],
  },
  {
    personaId: "sample-3",
    personaName: "Jim McCracken",
    segment: "Traditional Working Rancher",
    score: 42,
    reasons: ["Prioritizes cattle operations"],
    benefits: ["Practical stock dog protection"],
    barriers: ["Wary of domestic pet frills"],
    conditions: ["Essential hazard-focused guides"],
  },
];

const defaultSampleSegments: Segment[] = [
  {
    name: "Rural Companion Guardians",
    summary: "Navigating remote veterinary access and outdoor disease vectors with domestic companions.",
    averageScore: 75,
    personaNames: ["Sarah Lin-Bauer"],
  },
  {
    name: "Commercial Pack & Kennel Handlers",
    summary: "Rural operators who manage working packs essential for daily operations.",
    averageScore: 54,
    personaNames: ["Jim McCracken", "Dale Vaneck"],
  },
];

const defaultSampleSentiment: SentimentData = {
  counts: { positive: 1, neutral: 2, mixed: 0, negative: 0 },
  perPersona: [
    { personaName: "Sarah Lin-Bauer", sentiment: "positive", reason: "Enthusiastic about fast emergency triage" },
    { personaName: "Dale Vaneck", sentiment: "neutral", reason: "Pragmatic interest in kennel-wide scheduling" },
    { personaName: "Jim McCracken", sentiment: "neutral", reason: "Practical focus on working utility" },
  ],
  mainReasons: ["Operational utility and emergency preparedness driving adoption"],
};

export function InsightCharts({
  assessments = [],
  sentiment,
  segments = [],
  overall,
  evidenceCounts,
}: InsightChartsProps) {
  const [activeTab, setActiveTab] = useState<"all" | "adoption" | "sentiment" | "segments">("all");
  const [hoveredPersona, setHoveredPersona] = useState<string | null>(null);

  const isPreview = assessments.length === 0;
  const activeAssessments = isPreview ? defaultSampleAssessments : assessments;
  const activeSentiment = isPreview ? defaultSampleSentiment : (sentiment || defaultSampleSentiment);
  const activeSegments = isPreview ? defaultSampleSegments : segments;
  const activeOverallScore = overall?.averageScore ?? (isPreview ? 61 : null);

  // Sentiment Calculations for SVG Donut
  const posCount = activeSentiment?.counts?.positive || 0;
  const neuCount = activeSentiment?.counts?.neutral || 0;
  const mixCount = activeSentiment?.counts?.mixed || 0;
  const negCount = activeSentiment?.counts?.negative || 0;
  const totalSentiment = posCount + neuCount + mixCount + negCount || 1;

  const sentimentSlices = [
    { label: "Positive", count: posCount, color: "#10b981", percent: Math.round((posCount / totalSentiment) * 100) },
    { label: "Neutral", count: neuCount, color: "#3b82f6", percent: Math.round((neuCount / totalSentiment) * 100) },
    { label: "Mixed", count: mixCount, color: "#f59e0b", percent: Math.round((mixCount / totalSentiment) * 100) },
    { label: "Negative", count: negCount, color: "#e11d48", percent: Math.round((negCount / totalSentiment) * 100) },
  ];

  // SVG Donut math
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="space-y-6">
      
      {/* Chart Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#e6ddce] shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-[#5c1618]" /> Visual Analytics:
          </span>
          {[
            { id: "all", label: "All Graphs" },
            { id: "adoption", label: "Adoption Likelihood (0-100)" },
            { id: "sentiment", label: "Sentiment Donut" },
            { id: "segments", label: "Segment Benchmarks" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                activeTab === tab.id
                  ? "bg-[#5c1618] text-white shadow-sm"
                  : "bg-[#fbf9f4] text-slate-600 hover:bg-[#f4efe6] border border-[#e6ddce]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isPreview && (
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Interactive Preview
            </span>
          )}
          {activeOverallScore !== null && (
            <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-[#5c1618] rounded-xl border border-rose-200 text-xs font-bold">
              <span>Cohort Score:</span>
              <span className="font-serif text-sm font-extrabold">{activeOverallScore}/100</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GRAPH 1: Product Adoption Likelihood (Bar Chart) */}
        {(activeTab === "all" || activeTab === "adoption") && (
          <div className={`${activeTab === "adoption" ? "lg:col-span-12" : "lg:col-span-7"} bg-white p-6 sm:p-7 rounded-[32px] border border-[#e6ddce] shadow-sm space-y-6 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#5c1618] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#5c1618]">
                      Product Adoption Likelihood
                    </h3>
                    <p className="text-xs text-slate-500">
                      Simulated 0-100 propensity scores for each synthetic persona
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Target &gt; 50
                </span>
              </div>

              {/* Reference Threshold Indicator */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1 pt-4 pb-2 border-b border-slate-100">
                <span>0 (Will Not Use)</span>
                <span>25 (Hesitant)</span>
                <span className="text-amber-700">50 (Threshold)</span>
                <span>75 (Favorable)</span>
                <span className="text-emerald-700">100 (Certain)</span>
              </div>

              {/* Horizontal Bars for each persona */}
              <div className="space-y-4 pt-3">
                {activeAssessments.map((a) => {
                  let barColor = "from-emerald-500 to-emerald-700";
                  let badgeBg = "bg-emerald-50 text-emerald-800 border-emerald-200";
                  let ratingLabel = "Strong Adopter";

                  if (a.score < 50) {
                    barColor = "from-rose-500 to-[#5c1618]";
                    badgeBg = "bg-rose-50 text-[#5c1618] border-rose-200";
                    ratingLabel = "Skeptical / Needs Work";
                  } else if (a.score < 70) {
                    barColor = "from-amber-400 to-amber-600";
                    badgeBg = "bg-amber-50 text-amber-800 border-amber-200";
                    ratingLabel = "Conditional Adopter";
                  }

                  const isHovered = hoveredPersona === a.personaName;

                  return (
                    <div
                      key={a.personaId || a.personaName}
                      onMouseEnter={() => setHoveredPersona(a.personaName)}
                      onMouseLeave={() => setHoveredPersona(null)}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isHovered ? "bg-[#fbf9f4] border-[#5c1618] shadow-md" : "bg-white border-[#e6ddce]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-bold text-slate-900 text-sm">{a.personaName}</span>
                          <span className="text-xs text-slate-500 ml-2 font-medium">({a.segment})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeBg}`}>
                            {ratingLabel}
                          </span>
                          <span className="font-serif font-bold text-sm text-slate-900 w-10 text-right">
                            {a.score}%
                          </span>
                        </div>
                      </div>

                      {/* Bar Track */}
                      <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        {/* 50% Threshold Marker */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-300 z-10" />

                        {/* Progress Fill */}
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`}
                          style={{ width: `${Math.max(5, a.score)}%` }}
                        />
                      </div>

                      {/* Reasons & Barriers Preview */}
                      {isHovered && (
                        <div className="mt-3 pt-2 border-t border-slate-100 text-xs space-y-1 animate-in fade-in duration-200">
                          {a.benefits?.[0] && (
                            <p className="text-emerald-800 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Key Benefit: {a.benefits[0]}
                            </p>
                          )}
                          {a.barriers?.[0] && (
                            <p className="text-rose-800 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Main Barrier: {a.barriers[0]}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Insight Hint */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Hover over any persona bar above to view their identified benefits and adoption barriers.</span>
            </div>
          </div>
        )}

        {/* GRAPH 2: Sentiment Distribution Donut Chart */}
        {(activeTab === "all" || activeTab === "sentiment") && (
          <div className={`${activeTab === "sentiment" ? "lg:col-span-12" : "lg:col-span-5"} bg-white p-6 sm:p-7 rounded-[32px] border border-[#e6ddce] shadow-sm space-y-6 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#581c87] flex items-center justify-center">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#5c1618]">
                    Sentiment Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">Qualitative tone across personas</p>
                </div>
              </div>

              {/* Donut Container */}
              <div className="relative flex items-center justify-center py-4">
                <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 160 160">
                  {/* Background Track */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="20"
                  />

                  {/* Dynamic Donut Segments */}
                  {totalSentiment > 0 &&
                    sentimentSlices.map((slice, idx) => {
                      if (slice.count <= 0) return null;
                      const strokeDasharray = `${(slice.count / totalSentiment) * circumference} ${circumference}`;
                      const strokeDashoffset = -accumulatedOffset;
                      accumulatedOffset += (slice.count / totalSentiment) * circumference;

                      return (
                        <circle
                          key={slice.label}
                          cx="80"
                          cy="80"
                          r={radius}
                          fill="transparent"
                          stroke={slice.color}
                          strokeWidth="20"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-700 hover:opacity-80"
                        />
                      );
                    })}
                </svg>

                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-serif text-2xl font-bold text-slate-800">
                    {totalSentiment}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Personas
                  </span>
                </div>
              </div>

              {/* Sentiment Legend Matrix */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {sentimentSlices.map((s) => (
                  <div key={s.label} className="flex items-center justify-between p-2.5 rounded-xl bg-[#fbf9f4] border border-[#e6ddce]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                      <span className="text-xs font-bold text-slate-700">{s.label}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-900">{s.count} ({s.percent}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Persona Sentiment Snippets */}
            {sentiment?.perPersona && sentiment.perPersona.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block mb-1">Primary Sentiment Tone:</span>
                <p className="line-clamp-2 italic">&ldquo;{sentiment.perPersona[0].reason}&rdquo;</p>
              </div>
            )}
          </div>
        )}

        {/* GRAPH 3: Persona Segment Comparative Column Chart */}
        {(activeTab === "all" || activeTab === "segments") && (
          <div className="lg:col-span-12 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e6ddce] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1d4ed8] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#5c1618]">
                    Segment Propensity Comparison
                  </h3>
                  <p className="text-xs text-slate-500">
                    Average adoption likelihood benchmarked across distinct user segments
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1e4d8c]"></span> Average Score
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> High Potential (&gt;70)
                </span>
              </div>
            </div>

            {/* Column Chart Stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {activeSegments.map((seg, idx) => {
                const score = seg.averageScore ?? 50;
                let colColor = "from-blue-600 to-indigo-800";
                if (score >= 70) colColor = "from-emerald-500 to-teal-700";
                else if (score < 50) colColor = "from-rose-500 to-[#5c1618]";

                return (
                  <div
                    key={seg.name}
                    className="p-5 rounded-2xl bg-[#fbf9f4] border border-[#e6ddce] flex flex-col justify-between group hover:border-[#5c1618] hover:shadow-md transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h4 className="font-serif font-bold text-slate-900 text-base">
                          {seg.name}
                        </h4>
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-white text-slate-800 border border-[#e6ddce] shadow-sm">
                          {score}/100
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                        {seg.summary}
                      </p>

                      {/* Mini Vertical Visual Gauge */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                          <span>Adoption Potential</span>
                          <span>{score}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${colColor} transition-all duration-700`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Participants:</span>
                      <span className="font-bold text-[#5c1618]">{seg.personaNames.join(", ")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

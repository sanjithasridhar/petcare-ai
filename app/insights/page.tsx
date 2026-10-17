"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Sparkles,
  Download,
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  BarChart2,
  RefreshCw,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { api, useExperiments } from "../components/use-experiments";
import { InsightCharts } from "./insight-charts";

type Data = any; // InsightData
type Report = {
  id: string;
  createdAt: string;
  data: Data;
  surveyCount: number;
  responseCount: number;
  interviewCount: number;
};

const Sec = ({
  title,
  icon: Icon,
  badge,
  children,
}: {
  title: string;
  icon?: any;
  badge?: string;
  children: React.ReactNode;
}) => (
  <section className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e6ddce] shadow-sm space-y-4">
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#5c1618] flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#5c1618]">{title}</h3>
      </div>
      {badge && (
        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
          {badge}
        </span>
      )}
    </div>
    {children}
  </section>
);

const Ev = ({ ev }: { ev: string[] }) => (
  <span className="text-xs text-[#b45309] font-mono">
    {" "}
    {ev?.length ? `[${ev.join(", ")}]` : "[no linked evidence]"}
  </span>
);

export default function InsightsPage() {
  const { experiments, loaded, error: loadError } = useExperiments();
  const [expId, setExpId] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [available, setAvailable] = useState<{
    responseCount: number;
    interviewMessageCount: number;
    surveyCount?: number;
    interviewCount?: number;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);

  // Auto-select first experiment if available and none selected
  useEffect(() => {
    if (loaded && experiments.length > 0 && !expId) {
      choose(experiments[0].id);
    }
  }, [loaded, experiments]);

  async function choose(id: string) {
    setExpId(id);
    setReport(null);
    setAvailable(null);
    setError("");
    if (!id) return;
    const r = await api<{ report: Report | null; available: any }>(`/api/insights?experimentId=${id}`);
    if (r.ok) {
      setReport(r.data.report);
      setAvailable(r.data.available);
    } else {
      setError(r.data.error ?? "Could not load insights.");
    }
  }

  async function generate() {
    if (inFlight.current || !expId) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const r = await api<{ report: Report; available: any }>("/api/insights", {
        method: "POST",
        body: JSON.stringify({ experimentId: expId }),
      });
      if (r.ok) {
        setReport(r.data.report);
        setAvailable(r.data.available);
      } else {
        setError(r.data.error ?? "Insight generation failed.");
      }
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  const d: Data | undefined = report?.data;

  return (
    <div className="min-h-screen bg-[#f7f4ed] p-4 sm:p-10 pb-28 font-sans text-[#1c1c1c]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-[#e6ddce]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-[#be123c] text-xs font-bold uppercase tracking-wider mb-2 border border-rose-200">
              <TrendingUp className="w-3.5 h-3.5 text-rose-600" /> Behavioral Analytics & Visual Intelligence
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#5c1618] tracking-tight">
              Research Insights & Graphs
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Synthesize qualitative interview transcripts and survey consensus into quantitative adoption likelihood graphs, sentiment donuts, and executive PDF summaries.
            </p>
          </div>

          {report && (
            <a
              href={`/api/insights/pdf?experimentId=${expId}`}
              className="bg-[#0a2f24] hover:bg-[#134033] text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition flex items-center gap-2.5 shrink-0"
            >
              <Download className="w-4 h-4" />
              Download PDF Report
            </a>
          )}
        </div>

        {(loadError || error) && (
          <div role="alert" className="p-4 rounded-2xl font-bold bg-rose-50 text-rose-800 border border-rose-200 text-sm">
            {loadError || error}
          </div>
        )}

        {/* Experiment Selector Control Card */}
        <div className="bg-white p-6 sm:p-8 rounded-[36px] border border-[#e6ddce] shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            <div className="md:col-span-8">
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Select Active Research Experiment
              </label>
              <select
                className="w-full rounded-2xl border border-[#0a2f24]/20 bg-[#fbf9f4] p-3.5 text-[#0a2f24] font-semibold focus:border-[#5c1618] focus:outline-none transition shadow-sm text-sm"
                value={expId}
                onChange={(e) => choose(e.target.value)}
              >
                <option value="">{loaded ? "-- Select an experiment --" : "Loading experiments..."}</option>
                {experiments.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name || e.productName} ({e.personas?.length || 0} personas)
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4 flex items-end">
              <button
                disabled={!expId || busy}
                onClick={generate}
                className="w-full bg-[#5c1618] hover:bg-[#420d10] text-white py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {busy ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Synthesizing Insights…
                  </>
                ) : report ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Regenerate Insights & Graphs
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Generate Insights & Graphs
                  </>
                )}
              </button>
            </div>

          </div>

          {available && (
            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#5c1618]" />
                Evidence Base: <strong>{available.responseCount}</strong> survey answers •{" "}
                <strong>{available.interviewMessageCount}</strong> interview turns
              </span>
              {available.responseCount + available.interviewMessageCount === 0 && (
                <span className="text-rose-600 font-bold">
                  No survey or interview data yet. Run a survey or interview a persona first.
                </span>
              )}
            </div>
          )}
        </div>

        {/* VISUAL GRAPHS SECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
              <BarChart2 className="w-3.5 h-3.5 text-emerald-600" /> Interactive Visual Dashboards
            </div>
            <span className="text-xs text-slate-500">
              {d ? `Generated ${new Date(d.generatedAt || Date.now()).toLocaleDateString()}` : "Visual Telemetry Engine Active"}
            </span>
          </div>

          {/* Render Visual Graphs Component */}
          <InsightCharts
            assessments={d?.assessments}
            sentiment={d?.sentiment}
            segments={d?.segments}
            overall={d?.overall}
            evidenceCounts={available || undefined}
          />
        </div>

        {/* Detailed Qualitative Findings */}
        {d && (
          <div className="space-y-6 pt-4">
            
            {/* Disclaimer pill */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Research Note:</strong> {d.disclaimer}
              </div>
            </div>

            {/* Key Findings Card */}
            <Sec title="Key Findings" icon={Lightbulb} badge={`${d.keyFindings?.length || 0} Findings`}>
              <div className="grid gap-3 sm:grid-cols-2">
                {d.keyFindings.map((f: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#fbf9f4] border border-[#e6ddce] text-sm text-[#0a2f24] space-y-1">
                    <p className="font-semibold">{f.finding}</p>
                    <p className="text-xs text-slate-500 italic">
                      Source: {f.source} <Ev ev={f.evidence} />
                    </p>
                  </div>
                ))}
              </div>
            </Sec>

            {/* Recurring Themes */}
            <Sec title="Recurring Themes & Patterns" icon={Activity} badge={`${d.themes?.length || 0} Themes`}>
              <div className="space-y-3">
                {d.themes.map((t: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-[#e6ddce] text-sm text-slate-800 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#5c1618] text-base">{t.theme}</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {t.category}
                      </span>
                      <span className="text-xs text-slate-400">({t.source})</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>
                    <Ev ev={t.evidence} />
                  </div>
                ))}
              </div>
            </Sec>

            {/* Agreements & Disagreements */}
            <Sec title="Consensus & Divergence" icon={CheckCircle2}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                  <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Agreement Points
                  </h4>
                  {d.agreements.map((a: any, i: number) => (
                    <p key={i} className="text-xs text-emerald-900 leading-relaxed">
                      • <strong>{a.point}</strong> <span className="opacity-75">({a.personaNames.join(", ")})</span>
                    </p>
                  ))}
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                  <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Contested Topics
                  </h4>
                  {d.disagreements.map((x: any, i: number) => (
                    <p key={i} className="text-xs text-amber-900 leading-relaxed">
                      • <strong>{x.topic}:</strong> {x.positions.join(" | ")}
                    </p>
                  ))}
                </div>
              </div>
            </Sec>

            {/* Recommendations */}
            <Sec title="Strategic Recommendations" icon={Sparkles} badge="Actionable Advice">
              <div className="space-y-3">
                {d.recommendations.map((r: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#fbf9f4] border border-[#e6ddce] text-xs text-slate-800 space-y-1">
                    <p className="font-bold text-sm text-[#0a2f24]">{r.recommendation}</p>
                    <p className="text-slate-600 leading-relaxed">{r.rationale}</p>
                    <Ev ev={r.evidence} />
                  </div>
                ))}
              </div>
            </Sec>

            {/* Honest Limitations */}
            <Sec title="Research Caveats & Limitations">
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                {d.limitations.map((l: string, i: number) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </Sec>

          </div>
        )}

      </div>
    </div>
  );
}

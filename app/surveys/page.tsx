"use client";

import { useRef, useState } from "react";
import { api, useExperiments } from "../components/use-experiments";

type Survey = { id: string; title: string; status: string; createdAt: string };
type Detail = {
  survey: { id: string; title: string; status: string; personaIds: string[]; questions: { id: string; position: number; text: string }[]; responses: { questionId: string; personaId: string; text: string }[] };
  personas: { id: string; name: string; age: number; occupation: string; segment: string }[];
};
const box = "w-full rounded-xl border border-[#0a2f24]/20 bg-white p-3 text-[#0a2f24] focus:border-[#5c1618] focus:outline-none";
const btn = "bg-[#5c1618] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#4a1213] transition disabled:opacity-50";

export default function SurveysPage() {
  const { experiments, loaded, error: loadError } = useExperiments();
  const [expId, setExpId] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);
  const inFlight = useRef(false);
  const reqId = useRef<string | null>(null);
  const exp = experiments.find((e) => e.id === expId);

  async function chooseExperiment(id: string) {
    setExpId(id); setPicked([]); setDetail(null); setSurveys([]); reqId.current = null; setMsg(null);
    if (!id) return;
    const r = await api<{ surveys: Survey[] }>(`/api/surveys?experimentId=${id}`);
    if (r.ok) setSurveys(r.data.surveys);
    else setMsg({ kind: "error", text: r.data.error ?? "Could not load surveys." });
  }
  async function openSurvey(id: string) {
    const r = await api<Detail>(`/api/surveys/${id}`);
    if (r.ok) setDetail(r.data); else setMsg({ kind: "error", text: r.data.error ?? "Could not load the survey." });
  }
  async function runSurvey(id: string) {
    const r = await api<{ status: string; failures: { persona: string; error: string }[] }>(`/api/surveys/${id}/run`, { method: "POST" });
    await openSurvey(id);
    const list = await api<{ surveys: Survey[] }>(`/api/surveys?experimentId=${expId}`);
    if (list.ok) setSurveys(list.data.surveys);
    if (!r.ok) setMsg({ kind: "error", text: `${r.data.error ?? "Survey failed."} Click "Retry missing answers" to try again; saved answers are kept.` });
    else if (r.data.status === "completed") setMsg({ kind: "ok", text: "Survey complete. All selected personas answered." });
    else setMsg({ kind: "error", text: `Incomplete: ${r.data.failures.map((f) => `${f.persona} (${f.error})`).join("; ")}. Click "Retry missing answers".` });
  }
  async function launch() {
    if (inFlight.current) return;
    const qs = questions.map((q) => q.trim()).filter(Boolean);
    if (!expId) return setMsg({ kind: "error", text: "Select an experiment." });
    if (picked.length === 0) return setMsg({ kind: "error", text: "Select at least one persona." });
    if (!title.trim()) return setMsg({ kind: "error", text: "Give the survey a title." });
    if (qs.length === 0) return setMsg({ kind: "error", text: "Add at least one question." });
    inFlight.current = true; setBusy(true); setMsg(null);
    try {
      const created = await api<{ survey: { id: string } }>("/api/surveys", {
        method: "POST",
        body: JSON.stringify({ clientRequestId: (reqId.current ??= crypto.randomUUID()), experimentId: expId, title, personaIds: picked, questions: qs }),
      });
      if (!created.ok) return setMsg({ kind: "error", text: created.data.error ?? "Could not create the survey." });
      await runSurvey(created.data.survey.id);
      reqId.current = null; setTitle(""); setQuestions([""]);
    } finally { inFlight.current = false; setBusy(false); }
  }
  async function retry() {
    if (!detail || inFlight.current) return;
    inFlight.current = true; setBusy(true); setMsg(null);
    try { await runSurvey(detail.survey.id); } finally { inFlight.current = false; setBusy(false); }
  }

  return (
    <div className="min-h-screen bg-[#f4efe6] p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-serif text-[#0a2f24] font-bold">Survey Mode</h1>
        <p className="text-[#a85c53]">Ask the same questions to several synthetic personas and compare their answers side by side.</p>
        {(loadError || msg) && (
          <div role="alert" className={`p-4 rounded-xl font-bold ${loadError || msg?.kind === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-800"}`}>{loadError || msg?.text}</div>
        )}

        <section className="bg-white/60 p-6 rounded-2xl space-y-4">
          <select className={box} value={expId} onChange={(e) => chooseExperiment(e.target.value)}>
            <option value="">{loaded ? "-- Select an experiment --" : "Loading experiments..."}</option>
            {experiments.map((e) => <option key={e.id} value={e.id}>{e.name || e.productName}</option>)}
          </select>
          {loaded && experiments.length === 0 && !loadError && <p className="text-[#a85c53]">No experiments yet. Generate personas on the Experiments page first.</p>}
          {exp && (
            <>
              <div>
                <p className="font-bold text-[#0a2f24] mb-2">Personas to include</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {exp.personas.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 bg-white rounded-xl p-3 text-[#0a2f24]">
                      <input type="checkbox" checked={picked.includes(p.id)} onChange={(e) => setPicked((c) => (e.target.checked ? [...c, p.id] : c.filter((x) => x !== p.id)))} />
                      {p.name}, {p.age} - {p.segment}
                    </label>
                  ))}
                </div>
              </div>
              <input className={box} placeholder="Survey title" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} />
              <div className="space-y-2">
                <p className="font-bold text-[#0a2f24]">Questions</p>
                {questions.map((q, i) => (
                  <div key={i} className="flex gap-2">
                    <textarea className={box} rows={2} maxLength={500} placeholder={`Question ${i + 1}`} value={q} onChange={(e) => setQuestions((c) => c.map((x, k) => (k === i ? e.target.value : x)))} />
                    <button type="button" className="px-3 text-red-700 font-bold" aria-label="Remove question" disabled={questions.length === 1} onClick={() => setQuestions((c) => c.filter((_, k) => k !== i))}>x</button>
                  </div>
                ))}
                <button type="button" className="text-[#5c1618] font-bold" onClick={() => questions.length < 15 && setQuestions((c) => [...c, ""])}>+ Add question</button>
              </div>
              <button className={`${btn} w-full`} disabled={busy} onClick={launch}>
                {busy ? "Running survey - each persona is answering (up to a few minutes)..." : "Review complete - Launch survey"}
              </button>
            </>
          )}
        </section>

        {expId && surveys.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-[#0a2f24]">Saved surveys</h2>
            {surveys.map((s) => (
              <button key={s.id} onClick={() => openSurvey(s.id)} className="w-full text-left bg-white rounded-xl p-4 flex justify-between text-[#0a2f24]">
                <span className="font-bold">{s.title}</span><span className="text-sm uppercase text-[#a85c53]">{s.status}</span>
              </button>
            ))}
          </section>
        )}

        {detail && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-[#0a2f24]">{detail.survey.title} <span className="text-sm text-[#a85c53] uppercase">({detail.survey.status})</span></h2>
              {detail.survey.status !== "completed" && <button className={btn} disabled={busy} onClick={retry}>Retry missing answers</button>}
            </div>
            {detail.survey.questions.map((q) => (
              <div key={q.id} className="bg-white rounded-2xl p-5">
                <h3 className="font-bold text-[#5c1618] mb-3">Q{q.position}. {q.text}</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {detail.personas.map((p) => {
                    const a = detail.survey.responses.find((r) => r.questionId === q.id && r.personaId === p.id);
                    return (
                      <div key={p.id} className="bg-[#f4efe6] rounded-xl p-3 text-sm text-[#0a2f24]">
                        <p className="font-bold">{p.name} <span className="font-normal text-[#a85c53]">({p.age}, {p.occupation} - {p.segment})</span></p>
                        <p className="mt-1">{a ? a.text : <em className="text-red-700">No answer yet (incomplete)</em>}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

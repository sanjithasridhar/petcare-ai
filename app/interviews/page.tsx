"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sparkles, MessageCircle, PawPrint, Crown, Send, RefreshCw } from "lucide-react";
import { api, useExperiments } from "../components/use-experiments";

type Msg = { id: string; position: number; role: string; content: string };
type Persona = {
  id: string;
  name: string;
  age: number;
  occupation: string;
  segment: string;
  context: string;
  personalityTraits: string[];
  primaryConcern: string;
};
type Past = { id: string; createdAt: string; persona: { name: string; segment: string }; _count: { messages: number } };

const box =
  "w-full rounded-2xl border border-[#0a2f24]/20 bg-white p-3.5 text-[#0a2f24] focus:border-[#5c1618] focus:outline-none transition shadow-sm text-sm";

const companionSubjects = [
  { name: "Sir Barnaby", image: "/images/hero-dog.jpg", tag: "Vizsla Hound", prompt: "How would you evaluate Sir Barnaby's royal velvet comfort and diet?" },
  { name: "Sunny & Oliver", image: "/images/friends.jpg", tag: "Bonded Pair", prompt: "What enrichment routine is best for a bonded golden retriever and cat?" },
  { name: "The Harmony Family", image: "/images/community-group.jpg", tag: "8 Species", prompt: "How do you manage dietary schedules across a multi-species group?" },
  { name: "Bella Rosa", image: "/images/chia-profile.jpg", tag: "Maltese", prompt: "What are your best grooming and anxiety-reduction tips for toy Maltese dogs?" },
  { name: "Snowball", image: "/images/couch-dog.jpg", tag: "Bichon Frise", prompt: "How can we optimize sleep cycles and joint health for senior bichons?" },
];

export default function InterviewsPage() {
  const { experiments, loaded, error: loadError } = useExperiments();
  const [expId, setExpId] = useState("");
  const [personaId, setPersonaId] = useState("");
  const [past, setPast] = useState<Past[]>([]);
  const [interviewId, setInterviewId] = useState("");
  const [persona, setPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [selectedPet, setSelectedPet] = useState(companionSubjects[0]);
  const pending = useRef<{ clientId: string; content: string } | null>(null);
  const inFlight = useRef(false);
  const bottom = useRef<HTMLDivElement>(null);
  const exp = experiments.find((e) => e.id === expId);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function chooseExperiment(id: string) {
    setExpId(id);
    setPersonaId("");
    setInterviewId("");
    setPersona(null);
    setMessages([]);
    setError("");
    if (!id) return setPast([]);
    const r = await api<{ interviews: Past[] }>(`/api/interviews?experimentId=${id}`);
    if (r.ok) setPast(r.data.interviews);
  }

  async function openInterview(id: string) {
    const r = await api<{ interview: { id: string; persona: Persona; messages: Msg[] } }>(`/api/interviews/${id}`);
    if (!r.ok) return setError(r.data.error ?? "Could not open the interview.");
    setInterviewId(id);
    setPersona(r.data.interview.persona);
    setMessages(r.data.interview.messages);
    setError("");
    pending.current = null;
  }

  async function start() {
    if (!expId || !personaId) return setError("Select an experiment and a persona first.");
    const r = await api<{ interview: { id: string } }>("/api/interviews", {
      method: "POST",
      body: JSON.stringify({ experimentId: expId, personaId }),
    });
    if (!r.ok) return setError(r.data.error ?? "Could not start the interview.");
    await openInterview(r.data.interview.id);
    const l = await api<{ interviews: Past[] }>(`/api/interviews?experimentId=${expId}`);
    if (l.ok) setPast(l.data.interviews);
  }

  async function send(retry = false) {
    if (inFlight.current || !interviewId) return;
    const content = retry ? pending.current?.content ?? "" : input.trim();
    if (!content) return;
    inFlight.current = true;
    setSending(true);
    setError("");
    if (!retry) pending.current = { clientId: crypto.randomUUID(), content };
    try {
      const r = await api<{ messages: Msg[] }>(`/api/interviews/${interviewId}/messages`, {
        method: "POST",
        body: JSON.stringify(pending.current),
      });
      if (r.ok) {
        setMessages(r.data.messages);
        setInput("");
        pending.current = null;
      } else {
        setError(r.data.error ?? "The persona could not respond.");
        const fresh = await api<{ interview: { messages: Msg[] } }>(`/api/interviews/${interviewId}`);
        if (fresh.ok) setMessages(fresh.data.interview.messages);
      }
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f4ed] p-4 sm:p-10 pb-28 font-sans text-[#1c1c1c]">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-6 border-b border-[#e6ddce]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Qualitative Simulation Engine
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#b45309]">
              Behavioral Interview Mode
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Interview one synthetic persona at a time. The persona stays in character and remembers the full conversation.
            </p>
          </div>

          {/* Active Companion Badge */}
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-[#e6ddce] shadow-sm">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#e6ddce]">
              <Image src={selectedPet.image} alt={selectedPet.name} fill className="object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Subject in Context</p>
              <p className="text-xs font-bold text-[#5c1618]">{selectedPet.name}</p>
              <p className="text-[10px] text-slate-500">{selectedPet.tag}</p>
            </div>
          </div>
        </div>

        {/* Companion Quick Switcher Strip */}
        <div className="bg-white p-4 rounded-[28px] border border-[#e6ddce] shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Switch Companion Subject to Discuss:
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {companionSubjects.map((pet) => (
              <button
                key={pet.name}
                onClick={() => {
                  setSelectedPet(pet);
                  if (!input) setInput(pet.prompt);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition shrink-0 ${
                  selectedPet.name === pet.name
                    ? "bg-[#5c1618] text-white border-[#5c1618] shadow-md"
                    : "bg-[#fbf9f4] text-slate-700 border-[#e6ddce] hover:bg-[#f4efe6]"
                }`}
              >
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white">
                  <Image src={pet.image} alt={pet.name} fill className="object-cover" />
                </div>
                <span>{pet.name}</span>
              </button>
            ))}
          </div>
        </div>

        {(loadError || error) && (
          <div role="alert" className="p-4 rounded-2xl font-bold bg-rose-50 text-rose-800 border border-rose-200 text-sm">
            {loadError || error}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Experiment and Personas */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-[#e6ddce] space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  1. Select Experiment
                </label>
                <select className={box} value={expId} onChange={(e) => chooseExperiment(e.target.value)}>
                  <option value="">{loaded ? "-- Choose an experiment --" : "Loading experiments..."}</option>
                  {experiments.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name || e.productName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  2. Select Persona
                </label>
                <select
                  className={box}
                  value={personaId}
                  onChange={(e) => setPersonaId(e.target.value)}
                  disabled={!exp}
                >
                  <option value="">-- Choose a persona --</option>
                  {exp?.personas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.segment}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={start}
                disabled={!personaId}
                className="w-full bg-[#5c1618] hover:bg-[#420d10] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
              >
                Start New Interview
              </button>
            </div>

            {/* Past Sessions List */}
            <div className="bg-white p-6 rounded-[32px] border border-[#e6ddce] shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Saved Session Transcripts
              </h3>
              {past.length === 0 ? (
                <p className="text-xs text-slate-400">No previous sessions found for this experiment.</p>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {past.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => openInterview(p.id)}
                      className={`block w-full text-left text-xs p-3 rounded-xl transition ${
                        p.id === interviewId
                          ? "bg-[#5c1618] text-white font-bold shadow-sm"
                          : "bg-[#fbf9f4] hover:bg-[#f4efe6] text-slate-800"
                      }`}
                    >
                      <p className="font-bold">{p.persona.name}</p>
                      <p className="text-[10px] opacity-75">{p.persona.segment} • {p._count.messages} messages</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Active Dialogue Canvas */}
          <div className="lg:col-span-8 bg-white rounded-[36px] shadow-sm border border-[#e6ddce] flex flex-col min-h-[580px] overflow-hidden">
            {!persona ? (
              <div className="m-auto p-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-[#f4efe6] text-[#b45309] flex items-center justify-center mx-auto shadow-sm">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-800">No Active Interview Selected</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Select an experiment and persona on the left to launch an interactive session, or open a past transcript.
                </p>
              </div>
            ) : (
              <>
                {/* Persona Header Banner */}
                <div className="p-5 border-b border-[#e6ddce] bg-[#fbf9f4] flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#5c1618]">
                      {persona.name}, {persona.age}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {persona.occupation} • <em>{persona.segment}</em>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Traits: {persona.personalityTraits.join(", ")} | Main Concern: {persona.primaryConcern}
                    </p>
                  </div>

                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-300">
                    Live Session
                  </span>
                </div>

                {/* Chat Message Scrollable Feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[460px] bg-slate-50/50">
                  {messages.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      Send your initial question below to begin interviewing {persona.name}.
                    </div>
                  )}

                  {messages.map((m) => {
                    const isResearcher = m.role === "researcher";
                    return (
                      <div
                        key={m.id}
                        className={`max-w-[85%] p-4 rounded-3xl text-sm whitespace-pre-wrap shadow-sm ${
                          isResearcher
                            ? "ml-auto bg-[#5c1618] text-white rounded-br-none"
                            : "bg-white text-slate-800 border border-[#e6ddce] rounded-bl-none"
                        }`}
                      >
                        <p className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${isResearcher ? "text-rose-200" : "text-amber-700"}`}>
                          {isResearcher ? "Lead Researcher" : persona.name}
                        </p>
                        {m.content}
                      </div>
                    );
                  })}

                  {sending && (
                    <div className="bg-white border border-[#e6ddce] text-[#b45309] p-3 rounded-2xl text-xs font-semibold w-fit flex items-center gap-2 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                      {persona.name} is typing a response…
                    </div>
                  )}

                  <div ref={bottom} />
                </div>

                {/* Prompt Input Deck */}
                <div className="p-4 border-t border-[#e6ddce] bg-white flex gap-3">
                  <textarea
                    className={box}
                    rows={2}
                    maxLength={2000}
                    placeholder={`Ask ${persona.name} about companion care, products, or behavioral reactions...`}
                    value={input}
                    disabled={sending}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                  />
                  
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      className="bg-[#5c1618] hover:bg-[#420d10] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50 flex items-center gap-2"
                      disabled={sending || !input.trim()}
                      onClick={() => send()}
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send
                    </button>
                    {error && pending.current && (
                      <button
                        className="text-xs text-[#5c1618] font-bold hover:underline"
                        disabled={sending}
                        onClick={() => send(true)}
                      >
                        Retry Message
                      </button>
                    )}
                  </div>
                </div>

              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

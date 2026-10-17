"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Persona = {
  id: string;
  name: string;
  age: number;
  occupation: string;
  segment: string;
  context: string;
  coreNeeds: string;
  primaryConcern: string;
  personalityTraits: string[];
  goals: string[];
  preferences: string[];
  behaviorPatterns: string;
  painPoints: string[];
  psychologicalProfile: string;
  productOpinions: string;
};
type Experiment = {
  id: string;
  name: string;
  category: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  researchObjectives: string;
  createdAt: string;
  personas: Persona[];
};

const field =
  "w-full rounded-xl border border-[#0a2f24]/20 bg-white p-3 text-[#0a2f24] focus:border-[#5c1618] focus:outline-none";

function Chips({ label, items }: { label: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-[#a85c53]">{label}</p>
      <ul className="list-disc pl-5 text-sm text-[#0a2f24]">
        {items.map((i, n) => (
          <li key={n}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
function Block({ label, text }: { label: string; text: string }) {
  if (!text) return null;
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-[#a85c53]">{label}</p>
      <p className="text-sm text-[#0a2f24]">{text}</p>
    </div>
  );
}

export default function ExperimentsPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [researchObjectives, setResearchObjectives] = useState("");
  const [personaCount, setPersonaCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const inFlight = useRef(false);
  // Same id is reused when retrying after a failure, so the server never creates duplicates.
  // Created lazily (not during render): Next's cacheComponents rejects random values during prerender.
  const requestId = useRef<string | null>(null);

  async function loadExperiments() {
    try {
      const res = await fetch("/api/experiments", { credentials: "same-origin" });
      if (res.ok) setExperiments((await res.json()).experiments ?? []);
      else setError("Could not load saved experiments. Make sure the database is set up (prisma db push).");
    } catch {
      /* list is optional; generation errors are reported separately */
    }
  }
  useEffect(() => {
    loadExperiments();
  }, []);

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/experiments", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientRequestId: (requestId.current ??= crypto.randomUUID()),
          name,
          category,
          productName,
          productDescription,
          targetAudience,
          researchObjectives,
          personaCount,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? `Generation failed (HTTP ${res.status}).`);
        return;
      }
      setExperiments((prev) => [data.experiment, ...prev.filter((x) => x.id !== data.experiment.id)]);
      requestId.current = null; // next submission is a new experiment
    } catch {
      setError("Network failure. Check your connection and try again.");
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4efe6] p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-serif text-[#0a2f24] font-bold">Simulation Experiments</h1>
        <p className="text-[#a85c53]">
          Describe your product and research goals. AI will generate synthetic personas tailored to this experiment.
        </p>

        {error && (
          <div role="alert" className="p-4 rounded-xl font-bold bg-red-100 text-red-700">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-4 bg-white/60 p-6 rounded-2xl">
          <input className={field} maxLength={120} placeholder="Experiment name (optional, defaults to product name)" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={field} maxLength={120} placeholder="Product category / industry (e.g. pet care, banking, education)" value={category} onChange={(e) => setCategory(e.target.value)} />
          <input className={field} required minLength={2} maxLength={120} placeholder="Product name" value={productName} onChange={(e) => setProductName(e.target.value)} />
          <textarea className={field} required minLength={20} maxLength={3000} rows={3} placeholder="Product description (what it does, key features)" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
          <textarea className={field} required minLength={5} maxLength={1500} rows={2} placeholder="Target audience" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} />
          <textarea className={field} required minLength={10} maxLength={2000} rows={3} placeholder="Research objectives / experiment description" value={researchObjectives} onChange={(e) => setResearchObjectives(e.target.value)} />
          <label className="flex items-center gap-3 text-[#0a2f24]">
            Number of personas
            <input type="number" min={1} max={10} className="w-20 rounded-xl border border-[#0a2f24]/20 bg-white p-2" value={personaCount} onChange={(e) => setPersonaCount(Math.min(10, Math.max(1, Number(e.target.value) || 3)))} />
          </label>
          <button type="submit" disabled={loading} className="w-full bg-[#5c1618] text-white py-5 rounded-xl font-bold text-lg hover:bg-[#4a1213] transition shadow-md disabled:opacity-50">
            {loading ? "Generating personas with AI… (this can take up to a minute)" : "Generate Personas"}
          </button>
        </form>

        {experiments.length === 0 && !loading && (
          <p className="text-center text-[#a85c53]">No personas yet. Fill in the form above and click Generate Personas.</p>
        )}

        {experiments.map((exp) => (
          <section key={exp.id} className="space-y-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#0a2f24]">{exp.name || exp.productName}</h2>
              <button type="button" className="text-sm font-bold text-[#5c1618] underline" onClick={() => { setName(exp.name); setCategory(exp.category); setProductName(exp.productName); setProductDescription(exp.productDescription); setTargetAudience(exp.targetAudience); setResearchObjectives(exp.researchObjectives); requestId.current = null; window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                Reuse these inputs for a new experiment
              </button>
              <p className="text-sm text-[#a85c53]">{exp.personas.length} personas · {exp.targetAudience}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exp.personas.map((p) => (
                <article key={p.id} className="bg-white p-5 rounded-2xl shadow-sm space-y-3">
                  <header>
                    <h3 className="text-lg font-bold text-[#5c1618]">{p.name}, {p.age}</h3>
                    <p className="text-sm text-[#0a2f24]">{p.occupation} · <em>{p.segment}</em></p>
                  </header>
                  <Block label="Background" text={p.context} />
                  <Chips label="Personality traits" items={p.personalityTraits} />
                  <Chips label="Goals" items={p.goals} />
                  <Block label="Core needs" text={p.coreNeeds} />
                  <Chips label="Preferences & interests" items={p.preferences} />
                  <Block label="Behavior & decision-making" text={p.behaviorPatterns} />
                  <Chips label="Pain points" items={p.painPoints} />
                  <Block label="Primary concern" text={p.primaryConcern} />
                  <Block label="Psychological profile" text={p.psychologicalProfile} />
                  <Block label="Opinions on the product" text={p.productOpinions} />
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

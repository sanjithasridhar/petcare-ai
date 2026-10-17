"use client";
import { useEffect, useState } from "react";

export type PersonaLite = { id: string; name: string; age: number; occupation: string; segment: string };
export type ExperimentLite = { id: string; name: string; productName: string; personas: PersonaLite[] };

export function useExperiments() {
  const [experiments, setExperiments] = useState<ExperimentLite[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/experiments", { credentials: "same-origin" })
      .then(async (r) => {
        if (!r.ok) setError("Could not load experiments. Is the database set up (prisma db push)?");
        else setExperiments((await r.json()).experiments ?? []);
      })
      .catch(() => setError("Network failure while loading experiments."))
      .finally(() => setLoaded(true));
  }, []);
  return { experiments, loaded, error };
}

export async function api<T = any>(url: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: T & { error?: string } }> {
  try {
    const res = await fetch(url, { credentials: "same-origin", ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: "Network failure. Check your connection and try again." } as any };
  }
}

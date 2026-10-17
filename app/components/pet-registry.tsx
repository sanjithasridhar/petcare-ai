"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, Check, LoaderCircle, PawPrint, Plus, RefreshCw, Tag } from "lucide-react";

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  createdAt: string;
};

export function PetRegistry() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadPets() {
      setLoading(true);
      try {
        const response = await fetch("/api/pets", { credentials: "same-origin" });

        if (!response.ok) {
          if (active) setMessage("Your pets could not be loaded. Please try again.");
          return;
        }
        const data = (await response.json()) as { pets: Pet[] };
        if (active) {
          setPets(data.pets);
          setMessage("");
        }
      } catch {
        if (active) setMessage("Your pets could not be loaded. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadPets();
    return () => {
      active = false;
    };
  }, [router, refreshVersion]);

  const speciesCount = new Set(pets.map((pet) => pet.species.trim().toLowerCase())).size;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setPending(true);

    try {
      const response = await fetch("/api/pets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name,
          species,
          breed: breed.trim() || null,
          age: age.trim() ? Number(age) : null,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { pet?: Pet; error?: string }
        | null;


      if (!response.ok || !data?.pet) {
        setMessage(data?.error ?? "Unable to save this pet right now.");
        return;
      }

      setPets((currentPets) => [data.pet!, ...currentPets]);
      setName("");
      setSpecies("");
      setBreed("");
      setAge("");
      setMessage("Pet registered.");
    } catch {
      setMessage("Unable to reach the server. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f6f3] text-[#1c2822]">
      <div className="border-b border-[#e2e9e2] bg-white">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#e4f3e9] text-[#25804b]">
              <PawPrint aria-hidden="true" size={21} />
            </span>
            <div>
              <p className="text-sm font-bold tracking-wide text-[#1c2822]">PETCARE</p>
              <p className="text-xs text-[#75827a]">Companion records</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#f3f6f3] px-3 py-2 text-xs font-medium text-[#536259]">
            <span className="size-2 rounded-full bg-[#39a96b]" />
            Private account
          </div>
        </header>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <section className="mb-8 flex flex-col justify-between gap-6 border-b border-[#dfe7df] pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#688172]">My household</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#18251e] sm:text-4xl">Pet registry</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#647168]">
              A clear, current record of every companion in your care.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="min-w-28 rounded-xl border border-[#e0e8e0] bg-white px-4 py-3">
              <p className="text-2xl font-semibold tabular-nums text-[#1e3829]">{pets.length}</p>
              <p className="mt-0.5 text-xs text-[#748078]">Registered pets</p>
            </div>
            <div className="min-w-28 rounded-xl border border-[#e0e8e0] bg-white px-4 py-3">
              <p className="text-2xl font-semibold tabular-nums text-[#1e3829]">{speciesCount}</p>
              <p className="mt-0.5 text-xs text-[#748078]">Species</p>
            </div>
          </div>
        </section>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(290px,0.78fr)_minmax(0,1.55fr)]">
          <section className="rounded-2xl border border-[#e0e8e0] bg-white p-5 shadow-[0_8px_28px_rgba(32,68,43,0.045)] sm:p-6">
            <div className="flex items-start gap-3 border-b border-[#edf1ed] pb-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf6ef] text-[#27804c]">
                <Plus aria-hidden="true" size={20} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-[#1c2822]">Add a companion</h2>
                <p className="mt-1 text-sm text-[#758078]">Add their details to your registry.</p>
              </div>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-[#35433a]">
                Pet name
                <input
                  autoComplete="off"
                  className="mt-1.5 h-11 w-full rounded-lg border border-[#dbe4dc] bg-white px-3 text-sm text-[#1c2822] outline-none transition focus:border-[#52a773] focus:ring-4 focus:ring-[#52a773]/10"
                  maxLength={100}
                  placeholder="e.g. Miso"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-[#35433a]">
                Species
                <input
                  className="mt-1.5 h-11 w-full rounded-lg border border-[#dbe4dc] bg-white px-3 text-sm text-[#1c2822] outline-none transition focus:border-[#52a773] focus:ring-4 focus:ring-[#52a773]/10"
                  maxLength={60}
                  placeholder="Dog, cat, bird..."
                  required
                  value={species}
                  onChange={(event) => setSpecies(event.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-[#35433a]">
                Breed <span className="font-normal text-[#87928a]">(optional)</span>
                <input
                  className="mt-1.5 h-11 w-full rounded-lg border border-[#dbe4dc] bg-white px-3 text-sm text-[#1c2822] outline-none transition focus:border-[#52a773] focus:ring-4 focus:ring-[#52a773]/10"
                  maxLength={100}
                  placeholder="Add a breed"
                  value={breed}
                  onChange={(event) => setBreed(event.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-[#35433a]">
                Age <span className="font-normal text-[#87928a]">(years, optional)</span>
                <input
                  className="mt-1.5 h-11 w-full rounded-lg border border-[#dbe4dc] bg-white px-3 text-sm text-[#1c2822] outline-none transition focus:border-[#52a773] focus:ring-4 focus:ring-[#52a773]/10"
                  min={0}
                  max={100}
                  placeholder="0"
                  step={1}
                  type="number"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                />
              </label>

              <button
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#237a46] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b6639] focus:outline-none focus:ring-4 focus:ring-[#237a46]/20 disabled:cursor-wait disabled:opacity-60"
                disabled={pending}
                type="submit"
              >
                {pending ? <LoaderCircle className="animate-spin" size={17} /> : <Plus size={17} />}
                {pending ? "Saving pet…" : "Register pet"}
              </button>
              {message && (
                <p aria-live="polite" className="flex items-center gap-2 text-sm text-[#52645a]">
                  {message === "Pet registered." && <Check aria-hidden="true" className="text-[#27804c]" size={16} />}
                  {message}
                </p>
              )}
            </form>
          </section>

          <section aria-labelledby="pet-list-heading">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 id="pet-list-heading" className="text-xl font-semibold text-[#1c2822]">Your companions</h2>
                <p className="mt-1 text-sm text-[#748078]">{pets.length === 1 ? "1 pet in your registry" : `${pets.length} pets in your registry`}</p>
              </div>
              <button
                className="flex size-10 items-center justify-center rounded-lg border border-[#dfe7df] bg-white text-[#52645a] transition hover:bg-[#f5f8f5] focus:outline-none focus:ring-4 focus:ring-[#52a773]/15 disabled:opacity-50"
                disabled={loading}
                onClick={() => setRefreshVersion((version) => version + 1)}
                title="Refresh pet list"
                aria-label="Refresh pet list"
                type="button"
              >
                <RefreshCw aria-hidden="true" className={loading ? "animate-spin" : ""} size={17} />
              </button>
            </div>

            {message && message !== "Pet registered." && (
              <p aria-live="polite" className="mb-4 rounded-lg border border-[#efd8cd] bg-[#fff8f4] px-4 py-3 text-sm text-[#8a4e32]">
                {message}
              </p>
            )}

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2" aria-label="Loading pets">
                {[0, 1].map((item) => (
                  <div key={item} className="h-44 animate-pulse rounded-2xl border border-[#e0e8e0] bg-white" />
                ))}
              </div>
            ) : pets.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#cdd9cf] bg-white/70 px-6 py-14 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#eaf4ec] text-[#398356]">
                  <PawPrint aria-hidden="true" size={23} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-[#28372e]">Your registry is ready</h3>
                <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-[#758078]">
                  Add your first companion and their details will appear here.
                </p>
              </div>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {pets.map((pet, index) => (
                  <li
                    className="group relative overflow-hidden rounded-2xl border border-[#e0e8e0] bg-white p-5 shadow-[0_8px_28px_rgba(32,68,43,0.035)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(32,68,43,0.09)]"
                    key={pet.id}
                  >
                    <div className={`absolute inset-x-0 top-0 h-1 ${index % 3 === 0 ? "bg-[#75b98a]" : index % 3 === 1 ? "bg-[#e6a980]" : "bg-[#8daec4]"}`} />
                    <div className="flex items-start justify-between gap-3">
                      <span className={`flex size-12 items-center justify-center rounded-2xl ${index % 3 === 0 ? "bg-[#e8f4eb] text-[#347a4b]" : index % 3 === 1 ? "bg-[#fbefe7] text-[#a46742]" : "bg-[#eaf1f6] text-[#557c99]"}`}>
                        <PawPrint aria-hidden="true" size={22} />
                      </span>
                      <span className="rounded-full bg-[#f2f6f2] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#5d7163]">
                        {pet.species}
                      </span>
                    </div>
                    <h3 className="mt-4 truncate text-lg font-semibold text-[#1d2b22]">{pet.name}</h3>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#718077]">
                      {pet.breed && (
                        <span className="flex items-center gap-1.5">
                          <Tag aria-hidden="true" size={14} />
                          {pet.breed}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <CalendarDays aria-hidden="true" size={14} />
                        {pet.age === null ? "Age not set" : `${pet.age} ${pet.age === 1 ? "year" : "years"}`}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
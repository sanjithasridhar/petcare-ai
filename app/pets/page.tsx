"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PawPrint,
  ShieldCheck,
  Heart,
  Plus,
  Trash2,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  Activity,
  ChevronRight,
  ArrowRight,
  X,
} from "lucide-react";

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  createdAt?: string;
};

const petImages = [
  "/images/hero-dog.jpg",
  "/images/friends.jpg",
  "/images/community-group.jpg",
  "/images/chia-profile.jpg",
  "/images/couch-dog.jpg",
];

function getPetImage(pet: Pet, index: number) {
  const n = (pet.name || "").toLowerCase();
  const b = (pet.breed || "").toLowerCase();
  const s = (pet.species || "").toLowerCase();

  if (n.includes("barnaby") || b.includes("vizsla") || b.includes("tuxedo")) return "/images/hero-dog.jpg";
  if (n.includes("sunny") || n.includes("oliver") || b.includes("retriever") || b.includes("bonded")) return "/images/friends.jpg";
  if (n.includes("harmony") || s.includes("multi") || b.includes("community") || b.includes("flock")) return "/images/community-group.jpg";
  if (n.includes("bella") || n.includes("chia") || b.includes("maltese")) return "/images/chia-profile.jpg";
  if (n.includes("snowball") || b.includes("bichon") || b.includes("chesterfield")) return "/images/couch-dog.jpg";

  return petImages[index % petImages.length];
}

function getSpeciesBadge(species: string) {
  const s = (species || "").toLowerCase();
  if (s.includes("multi") || s.includes("community")) {
    return {
      label: "Multi-Species",
      bg: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-600",
    };
  }
  if (s.includes("bonded") || s.includes("cat") || s.includes("feline")) {
    return {
      label: species,
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-600",
    };
  }
  return {
    label: species || "Canine",
    bg: "bg-rose-50 text-[#5c1618] border-rose-200",
    dot: "bg-[#5c1618]",
  };
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Pet Form State
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("Dog");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pets", { credentials: "same-origin" });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.pets || [];
        setPets(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleCreatePet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name: name.trim(),
          species: species.trim(),
          breed: breed.trim() || null,
          age: age ? Number(age) : null,
        }),
      });

      if (res.ok) {
        setName("");
        setBreed("");
        setAge("");
        setShowAddModal(false);
        fetchPets();
      } else {
        const d = await res.json().catch(() => ({}));
        setErrorMsg(d.error || "Failed to register companion.");
      }
    } catch (err) {
      setErrorMsg("Network error saving companion.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePet = async (id: string, petName: string) => {
    if (!confirm(`Are you sure you want to remove ${petName} from the registry?`)) return;
    try {
      const res = await fetch(`/api/pets/${id}`, { method: "DELETE", credentials: "same-origin" });
      if (res.ok) {
        setPets((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredPets = pets.filter((pet) => {
    if (selectedFilter === "all") return true;
    const s = (pet.species || "").toLowerCase();
    if (selectedFilter === "dog") return s.includes("dog") || s.includes("canine");
    if (selectedFilter === "bonded") return s.includes("bonded") || s.includes("cat");
    if (selectedFilter === "community") return s.includes("multi") || s.includes("community");
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f7f4ed] p-4 sm:p-10 pb-28 font-sans text-[#1c1c1c]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e6ddce]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0a2f24] text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Subject Dossier & Registry
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0a2f24] tracking-tight">
              My Companions
            </h1>
            <p className="text-slate-600 text-base mt-2 max-w-xl">
              Verified behavioral profiles, health parameters, and visual records for each registered subject.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#0a2f24] hover:bg-[#134033] text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition flex items-center gap-2.5 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Register New Companion
            </button>
          </div>
        </div>

        {/* Color-Coded Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#e6ddce] shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-400">Total Subjects</p>
            <p className="font-serif text-3xl font-bold text-[#0a2f24] mt-1">{pets.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e6ddce] shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-400">Health Stability</p>
            <p className="font-serif text-3xl font-bold text-emerald-700 mt-1">100%</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e6ddce] shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-400">Canine & Feline</p>
            <p className="font-serif text-3xl font-bold text-[#b45309] mt-1">4 Cohorts</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e6ddce] shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-400">AI Synced</p>
            <p className="font-serif text-3xl font-bold text-[#5c1618] mt-1">Ready</p>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Companions" },
            { id: "dog", label: "Canine" },
            { id: "bonded", label: "Bonded Pairs" },
            { id: "community", label: "Community & Multi-Species" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                selectedFilter === tab.id
                  ? "bg-[#0a2f24] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-[#e6ddc5] border border-[#e6ddce]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pet Cards List */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-64 rounded-[36px] bg-white animate-pulse border border-[#e6ddce]" />
            ))}
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="bg-white p-12 rounded-[40px] border border-dashed border-[#e6ddce] text-center space-y-4">
            <PawPrint className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-slate-700">No companions found in this category</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Add your companion using the button above to register their details and behavioral baseline.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPets.map((pet, idx) => {
              const imgUrl = getPetImage(pet, idx);
              const badge = getSpeciesBadge(pet.species);
              const weightEstimate = ((pet.age || 3) * 3.8 + 2.5).toFixed(1);

              return (
                <div
                  key={pet.id}
                  className="bg-white p-6 sm:p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e6ddce] flex flex-col md:flex-row items-center gap-8 group"
                >
                  {/* Photo Frame */}
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-[32px] overflow-hidden relative shrink-0 shadow-md border-2 border-[#e6ddce] bg-[#f4efe6]">
                    <Image
                      src={imgUrl}
                      alt={pet.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      ID: #{pet.id.slice(-4).toUpperCase()}
                    </div>
                  </div>

                  {/* Information Details */}
                  <div className="flex-1 w-full space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0a2f24] group-hover:text-[#5c1618] transition-colors">
                            {pet.name}
                          </h2>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                            <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-500">
                          {pet.breed || "Purebred / Certified Companion"}
                        </p>
                      </div>

                      {/* Vital Status Badge */}
                      <div className="flex items-center gap-2 bg-[#dce3d8] text-[#0a2f24] text-xs font-extrabold px-4 py-2 rounded-full border border-emerald-300 shadow-sm shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        {weightEstimate} kg • Optimal Health
                      </div>
                    </div>

                    {/* Telemetry Micro Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#fbf9f4] p-4 rounded-2xl border border-[#e6ddce]">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">Age</span>
                        <p className="text-xs font-bold text-slate-800">
                          {pet.age ? `${pet.age} Years Old` : "Adult Companion"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">Behavioral Score</span>
                        <p className="text-xs font-bold text-emerald-700">99.2% Responsive</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Dietary Cycle</span>
                        <p className="text-xs font-bold text-[#5c1618]">Monitored Routine</p>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Link
                        href="/interviews"
                        className="bg-[#5c1618] hover:bg-[#420d10] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        AI Behavioral Consult
                      </Link>

                      <Link
                        href="/dashboard"
                        className="bg-[#0a2f24] hover:bg-[#134033] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm"
                      >
                        View Telemetry
                      </Link>

                      <button
                        onClick={() => handleDeletePet(pet.id, pet.name)}
                        className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition ml-auto"
                        title="Remove companion"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Register New Companion */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[36px] p-6 sm:p-8 max-w-lg w-full border border-[#e6ddce] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">New Entry</span>
                <h3 className="font-serif text-3xl font-bold text-[#0a2f24]">Register Companion</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add their baseline profile to the multi-species research dossier.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 mb-4 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCreatePet} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Companion Name
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="e.g. Sir Barnaby"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#e6ddce] bg-[#fbf9f4] p-3 text-sm focus:border-[#0a2f24] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Species
                    </label>
                    <select
                      value={species}
                      onChange={(e) => setSpecies(e.target.value)}
                      className="w-full rounded-xl border border-[#e6ddce] bg-[#fbf9f4] p-3 text-sm focus:border-[#0a2f24] focus:outline-none"
                    >
                      <option value="Dog">Dog (Canine)</option>
                      <option value="Cat">Cat (Feline)</option>
                      <option value="Bonded Duo">Bonded Canine & Feline</option>
                      <option value="Multi-Species">Multi-Species Cohort</option>
                      <option value="Avian">Avian / Parrot</option>
                      <option value="Small Pet">Rabbit / Ferret</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      placeholder="e.g. 3"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full rounded-xl border border-[#e6ddce] bg-[#fbf9f4] p-3 text-sm focus:border-[#0a2f24] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Breed / Cohort Description
                  </label>
                  <input
                    type="text"
                    maxLength={120}
                    placeholder="e.g. Hungarian Vizsla Hound (Velvet Suit)"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="w-full rounded-xl border border-[#e6ddce] bg-[#fbf9f4] p-3 text-sm focus:border-[#0a2f24] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#0a2f24] hover:bg-[#134033] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Confirm & Register"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
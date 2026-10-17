"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  PlusCircle,
  PawPrint,
  Heart,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Crown,
} from "lucide-react";

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
};

const petImages = [
  "/images/hero-dog.jpg",
  "/images/friends.jpg",
  "/images/community-group.jpg",
  "/images/chia-profile.jpg",
  "/images/couch-dog.jpg",
];

export default function PersonasPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("Dog");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    const res = await fetch("/api/pets", { credentials: "same-origin" });
    if (res.ok) {
      const data = await res.json();
      setPets(Array.isArray(data) ? data : data.pets || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ name, species, breed, age: Number(age) }),
    });
    if (res.ok) {
      setName("");
      setSpecies("Dog");
      setBreed("");
      setAge("");
      fetchPets();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] p-4 sm:p-10 pb-24 font-sans text-[#1c1c1c]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner with Persona Generator Callout */}
        <div className="bg-[#581c87] text-white p-6 sm:p-10 rounded-[36px] shadow-xl border border-purple-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 text-purple-200 text-xs font-bold uppercase tracking-wider border border-purple-400/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Synthetic Persona Engine
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              AI Persona & Subject Laboratory
            </h1>
            <p className="text-purple-200/90 text-sm sm:text-base">
              Pair your registered companions with Gemini 3.8 Flash synthetic personas. Generate nuanced veterinarians, dog walkers, and pet parents for simulation experiments.
            </p>
          </div>

          <Link
            href="/experiments"
            className="bg-[#e6ddc5] hover:bg-white text-[#581c87] px-7 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition flex items-center gap-2.5 shrink-0"
          >
            Launch Persona Generator
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quick Register Card */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-[36px] border border-[#e6ddce] shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="p-2 rounded-xl bg-purple-100 text-[#581c87]">
                <PlusCircle className="w-5 h-5" />
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#0a2f24]">
                Register Subject
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Add a new companion to participate in upcoming AI simulation experiments.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sir Barnaby"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#e6ddce] bg-[#fbf9f4] p-3 text-sm focus:border-[#581c87] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Species
                </label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="w-full rounded-xl border border-[#e6ddce] bg-[#fbf9f4] p-3 text-sm focus:border-[#581c87] focus:outline-none"
                >
                  <option value="Dog">Dog (Canine)</option>
                  <option value="Cat">Cat (Feline)</option>
                  <option value="Bonded Duo">Bonded Canine & Feline</option>
                  <option value="Multi-Species">Multi-Species Group</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Breed Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Red Vizsla Hound"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full rounded-xl border border-[#e6ddce] bg-[#fbf9f4] p-3 text-sm focus:border-[#581c87] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  placeholder="e.g. 4"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded-xl border border-[#e6ddce] bg-[#fbf9f4] p-3 text-sm focus:border-[#581c87] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#581c87] hover:bg-[#45146b] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
              >
                {loading ? "Registering..." : "Save Companion"}
              </button>
            </form>
          </div>

          {/* Registered Companions with Photo Cards */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-[#0a2f24] flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-purple-700" /> Active Research Subjects ({pets.length})
              </h2>
              <Link href="/pets" className="text-xs font-bold text-purple-800 hover:underline">
                Full Registry View
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.map((p, idx) => {
                const img = petImages[idx % petImages.length];
                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl p-5 border border-[#e6ddce] shadow-sm hover:shadow-md transition flex items-center gap-4 group"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden relative shrink-0 border border-[#e6ddce] bg-[#f4efe6]">
                      <Image
                        src={img}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-serif font-bold text-lg text-slate-900 truncate">
                          {p.name}
                        </h3>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 truncate mb-1">
                        {p.breed || p.species}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {p.age ? `${p.age} years old` : "Age not specified"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

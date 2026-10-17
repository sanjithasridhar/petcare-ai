import Image from "next/image";
import Link from "next/link";
import {
  Crown,
  Sparkles,
  PawPrint,
  Users,
  Activity,
  FileSpreadsheet,
  LineChart,
  Heart,
  ShieldCheck,
  ChevronRight,
  Database,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const showcasePets = [
    {
      id: "hero-dog",
      name: "Sir Barnaby",
      title: "The Executive Hound",
      breed: "Red Vizsla / Hound",
      species: "Canine",
      image: "/images/hero-dog.jpg",
      colorTag: "bg-[#5c1618] text-[#f4efe6] border-[#7e1d23]",
      accentBorder: "border-[#5c1618]/30",
      accentGlow: "shadow-rose-950/20",
      badge: "Crimson Velvet Suite",
      quote: "Composed, aristocratic demeanor with sharp responsiveness to high-frequency tones.",
      metric: "99.4% Vitality",
      metricColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      id: "community",
      name: "The Harmony Family",
      title: "Cross-Species Social Cohort",
      breed: "Dalmatian, Macaw, Cat, Tortoise, Rabbit, Poodle, Ferret, Goldfish",
      species: "8 Species Group",
      image: "/images/community-group.jpg",
      colorTag: "bg-[#1e4d8c] text-white border-blue-700",
      accentBorder: "border-[#1e4d8c]/30",
      accentGlow: "shadow-blue-950/20",
      badge: "Universal Compatibility",
      quote: "Zero inter-species friction across avian, reptilian, aquatic, and mammalian cohorts.",
      metric: "Social Index 10/10",
      metricColor: "text-sky-700 bg-sky-50 border-sky-200",
    },
    {
      id: "friends",
      name: "Sunny & Oliver",
      title: "Inseparable Bonded Pair",
      breed: "Golden Retriever & Tabby Cat",
      species: "Canine + Feline",
      image: "/images/friends.jpg",
      colorTag: "bg-[#b45309] text-white border-amber-700",
      accentBorder: "border-[#b45309]/30",
      accentGlow: "shadow-amber-950/20",
      badge: "Synchronized Rest",
      quote: "Displays deep mutual grooming, shared resting routines, and emotional co-regulation.",
      metric: "Stress Index 0.1%",
      metricColor: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      id: "chia",
      name: "Bella Rosa",
      title: "The Royal Maltese",
      breed: "Purebred Maltese (Glitter Clip)",
      species: "Canine (Toy)",
      image: "/images/chia-profile.jpg",
      colorTag: "bg-[#881337] text-white border-rose-800",
      accentBorder: "border-[#881337]/30",
      accentGlow: "shadow-rose-950/20",
      badge: "Velvet Rest Therapy",
      quote: "High receptivity to tactile comfort, ambient classical acoustics, and plush materials.",
      metric: "Grooming Optimal",
      metricColor: "text-rose-700 bg-rose-50 border-rose-200",
    },
    {
      id: "couch",
      name: "Snowball Chesterfield",
      title: "The Library Sleeper",
      breed: "Bichon Frise",
      species: "Canine",
      image: "/images/couch-dog.jpg",
      colorTag: "bg-[#0a2f24] text-white border-emerald-800",
      accentBorder: "border-[#0a2f24]/30",
      accentGlow: "shadow-emerald-950/20",
      badge: "Deep Sleep Analytics",
      quote: "Continuous 4.2-hour REM cycle monitored on button-tufted burgundy leather sofa.",
      metric: "Sleep Quality 98%",
      metricColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
  ];

  const modules = [
    {
      title: "The PetCare Hub",
      category: "Central Dashboard",
      desc: "Daily biometrics, active companion monitoring, feeding schedules, and rapid AI consultations.",
      href: "/dashboard",
      icon: Crown,
      bg: "bg-[#5c1618]",
      cardBg: "hover:border-[#5c1618]/50 bg-white",
      badgeBg: "bg-rose-50 text-[#5c1618] border-rose-200",
      iconColor: "text-white bg-[#5c1618]",
      btnColor: "bg-[#5c1618] text-white hover:bg-[#4a1213]",
      tag: "Live Command",
    },
    {
      title: "Subject Registry",
      category: "Dossier & Health",
      desc: "Manage companions, medical records, weight logs, species profiles, and behavioral baselines.",
      href: "/pets",
      icon: PawPrint,
      bg: "bg-[#0a2f24]",
      cardBg: "hover:border-[#0a2f24]/50 bg-white",
      badgeBg: "bg-emerald-50 text-[#0a2f24] border-emerald-200",
      iconColor: "text-white bg-[#0a2f24]",
      btnColor: "bg-[#0a2f24] text-white hover:bg-[#062018]",
      tag: "Database Synced",
    },
    {
      title: "Simulation Personas",
      category: "Generative AI",
      desc: "Synthesize hyper-specific pet parents, veterinarians, and canine trainers with Gemini 3.8 Flash.",
      href: "/experiments",
      icon: Users,
      bg: "bg-[#581c87]",
      cardBg: "hover:border-[#581c87]/50 bg-white",
      badgeBg: "bg-purple-50 text-[#581c87] border-purple-200",
      iconColor: "text-white bg-[#581c87]",
      btnColor: "bg-[#581c87] text-white hover:bg-[#45146b]",
      tag: "Persona Lab",
    },
    {
      title: "Multi-Persona Surveys",
      category: "Parallel Polling",
      desc: "Distribute research inquiries across synthetic panels to gather comparative companion care consensus.",
      href: "/surveys",
      icon: FileSpreadsheet,
      bg: "bg-[#1d4ed8]",
      cardBg: "hover:border-[#1d4ed8]/50 bg-white",
      badgeBg: "bg-blue-50 text-[#1d4ed8] border-blue-200",
      iconColor: "text-white bg-[#1d4ed8]",
      btnColor: "bg-[#1d4ed8] text-white hover:bg-[#1e40af]",
      tag: "Consensus Engine",
    },
    {
      title: "Behavioral Interviews",
      category: "Interactive Simulation",
      desc: "Engage in live 1-on-1 qualitative dialogue with AI personas that preserve full situational memory.",
      href: "/interviews",
      icon: Activity,
      bg: "bg-[#b45309]",
      cardBg: "hover:border-[#b45309]/50 bg-white",
      badgeBg: "bg-amber-50 text-[#b45309] border-amber-200",
      iconColor: "text-white bg-[#b45309]",
      btnColor: "bg-[#b45309] text-white hover:bg-[#92400e]",
      tag: "Live Interactive",
    },
    {
      title: "Insight Analytics",
      category: "Intelligence & PDF",
      desc: "Synthesize qualitative evidence into sentiment scores, behavioral trends, and downloadable executive reports.",
      href: "/insights",
      icon: LineChart,
      bg: "bg-[#be123c]",
      cardBg: "hover:border-[#be123c]/50 bg-white",
      badgeBg: "bg-rose-50 text-[#be123c] border-rose-200",
      iconColor: "text-white bg-[#be123c]",
      btnColor: "bg-[#be123c] text-white hover:bg-[#9f1239]",
      tag: "PDF Export",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#1c1c1c] pb-24">
      
      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#5c1618] via-[#6f1a1d] to-[#420d10] text-[#f7f4ed] pt-12 pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#7e1d23]">
        {/* Subtle patterned backdrop */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e6ddc5_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Top Bar Announcement */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#f4efe6]/15 border border-[#f4efe6]/25 text-xs font-semibold text-[#f4efe6] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Multi-Species Behavioral Intelligence</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-[#e6ddc5]">Gemini 3.8 Flash Online</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4efe6]/10 border border-[#f4efe6]/20 text-xs font-mono text-[#e6ddc5]">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>PostgreSQL Synced • 5 Active Cohorts</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-amber-300">
                  Luxury Companion Care & Synthetic Research
                </span>
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#f7f4ed] leading-[1.08]">
                  Elegance meets <br />
                  <span className="italic font-normal text-[#e6ddc5]">Companion AI.</span>
                </h1>
              </div>

              <p className="text-lg sm:text-xl text-[#e6ddc5]/90 max-w-2xl font-light leading-relaxed">
                Elevate companion care with color-coded multi-species analytics, tailored behavioral simulations, and synthetic veterinary personas tailored to your household.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/dashboard"
                  className="bg-[#e6ddc5] text-[#5c1618] hover:bg-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-3 active:scale-95"
                >
                  <Crown className="w-5 h-5 text-[#5c1618]" />
                  Enter Velvet Hub
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/pets"
                  className="bg-transparent border-2 border-[#e6ddc5]/80 text-[#f7f4ed] hover:bg-[#e6ddc5]/20 px-7 py-4 rounded-2xl font-bold text-base transition-all duration-200 flex items-center gap-2.5 backdrop-blur-sm"
                >
                  <PawPrint className="w-5 h-5 text-amber-300" />
                  View Subject Registry
                </Link>
              </div>

              {/* Mini Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#f4efe6]/15 max-w-xl">
                <div>
                  <p className="font-serif text-3xl font-bold text-[#f7f4ed]">5</p>
                  <p className="text-xs text-[#e6ddc5]/75 mt-0.5">Featured Companions</p>
                </div>
                <div>
                  <p className="font-serif text-3xl font-bold text-[#f7f4ed]">8</p>
                  <p className="text-xs text-[#e6ddc5]/75 mt-0.5">Animal Species</p>
                </div>
                <div>
                  <p className="font-serif text-3xl font-bold text-[#f7f4ed]">100%</p>
                  <p className="text-xs text-[#e6ddc5]/75 mt-0.5">Health Telemetry</p>
                </div>
              </div>
            </div>

            {/* Hero Main Card: Sir Barnaby in Velvet Jacket */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-[36px] p-3 bg-gradient-to-br from-[#e6ddc5]/30 to-[#c2b29f]/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                
                <div className="relative h-[480px] w-full rounded-[28px] overflow-hidden shadow-inner bg-[#420d10]">
                  <Image
                    src="/images/hero-dog.jpg"
                    alt="Sir Barnaby in Velvet Tuxedo"
                    fill
                    priority
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#420d10] via-transparent to-transparent opacity-80"></div>

                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <span className="bg-[#5c1618]/90 text-[#f4efe6] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#7e1d23] shadow-md flex items-center gap-1.5 backdrop-blur-md">
                      <Crown className="w-3.5 h-3.5 text-amber-300" />
                      Subject #01 • Sir Barnaby
                    </span>
                    <span className="bg-emerald-500/90 text-white px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase shadow-md flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                      Active Care
                    </span>
                  </div>

                  {/* Bottom Subject Summary Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 text-[#1c1c1c] shadow-xl border border-white/40">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-serif font-bold text-xl text-[#5c1618]">Sir Barnaby</h3>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-[#5c1618]">
                        Red Vizsla Hound
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      Adorned in custom crimson velvet. Exhibits calm temperament and peak health indicators.
                    </p>
                    <div className="flex items-center justify-between text-xs font-semibold pt-2 border-t border-slate-100">
                      <span className="text-emerald-700 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Vitality: 99.4%
                      </span>
                      <span className="text-amber-800 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Heart Rate: 68 bpm
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5-Pet Master Gallery Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
        <div className="bg-white rounded-[36px] p-6 sm:p-10 shadow-xl border border-[#e6ddce]">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-[#5c1618] text-xs font-bold uppercase tracking-wider mb-2 border border-rose-200">
                <Crown className="w-3.5 h-3.5" /> Color-Coded Companion Gallery
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#5c1618]">
                Registered Companions in Focus
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Visual profiling and behavioral baselines for each registered subject cohort.
              </p>
            </div>

            <Link
              href="/pets"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#5c1618] hover:text-[#7e1d23] group bg-[#f4efe6] px-5 py-2.5 rounded-xl border border-[#e6ddce] transition"
            >
              Manage all subjects
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showcasePets.map((pet, idx) => (
              <div
                key={pet.id}
                className={`rounded-[30px] overflow-hidden bg-[#fbf9f4] border border-[#e6ddce] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between ${
                  idx === 0 ? "lg:col-span-1" : ""
                }`}
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={pet.image}
                      alt={pet.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Top Overlay Badge */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-md border ${pet.colorTag}`}>
                        {pet.badge}
                      </span>
                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-md ${pet.metricColor}`}>
                        {pet.metric}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-md text-[10px] uppercase font-mono tracking-wider">
                      {pet.species}
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="font-serif text-2xl font-bold text-[#1c1c1c] group-hover:text-[#5c1618] transition-colors">
                        {pet.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 tracking-wide mt-0.5">{pet.title}</p>
                    </div>

                    <div className="text-xs font-medium text-slate-700 bg-white p-3 rounded-xl border border-[#e6ddce]/80 mb-3">
                      <span className="font-bold text-slate-900">Breed / Cohort:</span> {pet.breed}
                    </div>

                    <p className="text-xs text-slate-600 italic leading-relaxed">
                      &ldquo;{pet.quote}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/pets`}
                    className="text-xs font-bold text-[#5c1618] hover:underline flex items-center gap-1"
                  >
                    View Dossier <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/interviews`}
                    className="text-xs font-semibold bg-[#f4efe6] hover:bg-[#e6ddc5] text-[#5c1618] px-3.5 py-1.5 rounded-lg border border-[#e6ddce] transition"
                  >
                    Consult AI
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* Color-Coded Research & Care Suite */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#0a2f24] text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            <Activity className="w-4 h-4" /> Comprehensive Behavioral Modules
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#5c1618]">
            Color-Coded Research Suite
          </h2>
          <p className="text-slate-600 text-base mt-2">
            Each module is purpose-built and visually coded to deliver seamless companion workflows, from daily wellness logs to AI persona generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className={`p-8 rounded-[32px] border border-[#e6ddce] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${m.cardBg} group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform ${m.iconColor}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${m.badgeBg}`}>
                      {m.tag}
                    </span>
                  </div>

                  <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">
                    {m.category}
                  </p>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mb-3 group-hover:text-[#5c1618] transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {m.desc}
                  </p>
                </div>

                <Link
                  href={m.href}
                  className={`w-full py-3.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm ${m.btnColor}`}
                >
                  Open {m.title}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

      </section>

      {/* Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-[#420d10] text-[#f7f4ed] rounded-[36px] p-8 sm:p-12 relative overflow-hidden border border-[#781d22] shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#f7f4ed]">
                Ready to explore companion simulations?
              </h3>
              <p className="text-[#e6ddc5]/80 text-sm sm:text-base max-w-xl">
                Experience synthetic persona generation, live qualitative interviews, and cross-species telemetry in one unified studio.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className="bg-[#e6ddc5] text-[#5c1618] hover:bg-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg transition active:scale-95"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/experiments"
                className="bg-transparent border border-[#e6ddc5] text-[#f7f4ed] hover:bg-[#e6ddc5]/20 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition"
              >
                Generate Personas
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
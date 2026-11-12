"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function DeepDiveFeatures() {
  const [bandMode, setBandMode] = useState<"optical" | "swir">("swir");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll(".feature-card");
      if (!cards) return;

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="sensors" ref={containerRef} className="mx-auto max-w-7xl px-5 py-28 sm:px-8">
      {/* Section Header */}
      <div className="mb-20 text-center max-w-3xl mx-auto">
        <p className="text-xs font-mono font-medium tracking-[0.2em] text-[#ff7a45] uppercase">
          Autonomous Sensor Architecture
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
          Engineered for zero blind spots.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400">
          When smoke plumes reach 20,000 feet, optical cameras, drones, and human lookouts
          lose visibility. Fire-Slop cuts straight through the particulate veil.
        </p>
      </div>

      <div className="space-y-16">
        {/* Feature 1: Multispectral comparison */}
        <div className="feature-card grid grid-cols-1 items-center gap-10 rounded-3xl border border-white/10 bg-[#0c0d10] p-7 sm:p-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-[#ff7a45]">
              <span>PILLAR 01</span>
              <span>·</span>
              <span>SWIR SPECTROMETRY</span>
            </div>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              See through 50,000 feet of smoke canopy.
            </h3>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-400">
              Standard optical satellite photos show only billowing grey pyrocumulus.
              Fire-Slop utilizes the 3.9µm Shortwave Infrared band to detect the exact 900°C
              flame front beneath dense smoke, pinpointing the ignition origin to within 12 meters.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400">Spectrum Mode:</span>
              <button
                type="button"
                onClick={() => setBandMode("optical")}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  bandMode === "optical"
                    ? "bg-zinc-200 text-black font-semibold"
                    : "border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                Visible Optical (Blind)
              </button>
              <button
                type="button"
                onClick={() => setBandMode("swir")}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  bandMode === "swir"
                    ? "bg-[#ff552e] text-black font-semibold"
                    : "border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                3.9µm Infrared (Active)
              </button>
            </div>
          </div>

          {/* Interactive band preview */}
          <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
            {bandMode === "optical" ? (
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-zinc-900/60">
                <div className="h-44 w-64 rounded-full bg-zinc-700/40 blur-2xl opacity-60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                    Visible Optical Sensor Feed
                  </span>
                  <p className="mt-2 text-sm text-zinc-500 max-w-xs">
                    Optical sensor blinded by heavy particulate smoke cover. Zero ground front visibility.
                  </p>
                  <span className="mt-4 rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-[11px] font-mono text-red-400">
                    GROUND VISIBILITY: 0%
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative h-full w-full overflow-hidden bg-[#07090d]">
                {/* Simulated SWIR Flame Front */}
                <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px]" />
                <div className="absolute left-1/4 top-1/4 h-48 w-56 rounded-full bg-[#ff3d1c]/30 blur-xl" />
                <div className="absolute left-[35%] top-[35%] h-24 w-32 rounded-full bg-[#ff8a4c] blur-md shadow-[0_0_60px_#ff552e]" />
                <div className="absolute left-[42%] top-[42%] h-10 w-10 rounded-full bg-[#ffea9f] shadow-[0_0_30px_#ffffff]" />

                <div className="absolute top-4 left-4 rounded-lg bg-black/80 px-3 py-1.5 border border-white/10 backdrop-blur-sm">
                  <div className="text-[10px] font-mono text-[#ff7a45]">SWIR THERMAL LOCK</div>
                  <div className="text-xs font-semibold text-white">IGNITION CORE: 942°C</div>
                </div>

                <div className="absolute bottom-4 right-4 rounded-lg bg-black/80 px-3 py-1.5 border border-white/10 backdrop-blur-sm text-right">
                  <div className="text-[10px] font-mono text-emerald-400">PENETRATION CONFIRMED</div>
                  <div className="text-xs font-semibold text-zinc-300">Accuracy: ±12 Meters</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature 2: Microclimate wind physics */}
        <div className="feature-card grid grid-cols-1 items-center gap-10 rounded-3xl border border-white/10 bg-[#0c0d10] p-7 sm:p-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1 relative h-80 sm:h-96 w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>CANYON TOPOLOGY: FEATHER RIVER</span>
              <span className="text-[#ff7a45]">DIABLO WIND EVENT</span>
            </div>

            {/* Vector calculation model representation */}
            <div className="relative my-auto flex flex-col items-center justify-center">
              <div className="w-full flex items-center justify-between text-xs font-mono text-zinc-500 mb-2">
                <span>RIDGE TOP (+650m)</span>
                <span>WIND: 54 km/h GUSTS</span>
              </div>
              <div className="h-24 w-full rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-around">
                <div className="text-center">
                  <span className="text-[10px] font-mono text-zinc-500 block">CHUTE EFFECT</span>
                  <span className="text-lg font-bold text-white">2.8x</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                  <span className="text-[10px] font-mono text-zinc-500 block">SLOPE FLAME ADVANCE</span>
                  <span className="text-lg font-bold text-[#ff552e]">+22°</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                  <span className="text-[10px] font-mono text-zinc-500 block">TIME TO RIDGE</span>
                  <span className="text-lg font-bold text-emerald-400">18 min</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-white/5 pt-3">
              <span>PHYSICS ENGINE: FSLOP-ATMOS v4.1</span>
              <span>PARALLEL GPU MESH: 10,000 NODES</span>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-[#ff7a45]">
              <span>PILLAR 02</span>
              <span>·</span>
              <span>ATMOSPHERIC PHYSICS</span>
            </div>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Canyons create their own weather. We model it.
            </h3>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-400">
              Wildfires don&apos;t travel in straight lines. Ridge funnels, afternoon thermal updrafts,
              and Diablo wind events create catastrophic acceleration chutes. Our high-resolution
              boundary layer engine calculates real terrain wind vectors every 90 seconds.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="text-[#ff552e]">✦</span>
                <span>Terrain aspect solar radiation factoring</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#ff552e]">✦</span>
                <span>Dead fuel moisture 10-hour & 100-hour drying curves</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#ff552e]">✦</span>
                <span>Pyrocumulonimbus updraft collapse warnings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Direct Strike Dispatch */}
        <div className="feature-card grid grid-cols-1 items-center gap-10 rounded-3xl border border-white/10 bg-[#0c0d10] p-7 sm:p-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-[#ff7a45]">
              <span>PILLAR 03</span>
              <span>·</span>
              <span>RAPID TRIANGULATION</span>
            </div>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              From orbit to cockpit coordinates in 180 seconds.
            </h3>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-400">
              Seconds save structures. The moment satellite classification reaches 95%
              confidence, Fire-Slop auto-generates polygon perimeter GeoJSON and broadcasts
              directly into agency ATAK handhelds and air tanker moving maps.
            </p>

            {/* Tactical Timeline */}
            <div className="mt-8 space-y-4">
              {[
                { time: "00:00", event: "3.9µm orbital thermal anomaly flagged by GOES-18" },
                { time: "00:08", event: "Sentinel & VIIRS cross-pass confirms flame core ignition" },
                { time: "00:32", event: "Automated alert dispatches to regional ECC and Air Attack" },
                { time: "02:45", event: "Lead plane airborne with computed initial drop vectors" },
              ].map((step) => (
                <div key={step.time} className="flex items-start gap-4 text-xs font-mono">
                  <span className="rounded bg-white/5 px-2 py-0.5 text-[#ff7a45] shrink-0">
                    {step.time}
                  </span>
                  <span className="text-zinc-300">{step.event}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-6 flex flex-col justify-center items-center text-center">
            <div className="rounded-full border border-emerald-500/30 bg-emerald-950/40 p-4 mb-4">
              <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Agency Protocols Active
            </span>
            <h4 className="mt-2 text-xl font-semibold text-white">
              Instant Interoperability
            </h4>
            <p className="mt-2 text-xs text-zinc-400 max-w-sm">
              Integrated with CAL FIRE CAD, USFS ROSS/IROC, ATAK Team Connect, and FAA Special Use Airspace feeds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


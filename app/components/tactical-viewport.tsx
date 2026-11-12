"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ViewMode = "thermal" | "wind" | "perimeter";

const TIME_STEPS = [
  { label: "T+0m", minutes: 0, hectares: 48, rate: "2.1 km/h", containment: "94%" },
  { label: "T+30m", minutes: 30, hectares: 112, rate: "3.4 km/h", containment: "88%" },
  { label: "T+60m", minutes: 60, hectares: 260, rate: "4.2 km/h", containment: "82%" },
  { label: "T+120m", minutes: 120, hectares: 640, rate: "5.8 km/h", containment: "69%" },
  { label: "T+180m", minutes: 180, hectares: 1284, rate: "6.9 km/h", containment: "54%" },
];

export function TacticalViewport() {
  const [mode, setMode] = useState<ViewMode>("thermal");
  const [timeIndex, setTimeIndex] = useState(2); // default T+60m
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const currentStep = TIME_STEPS[timeIndex];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        viewportRef.current,
        { opacity: 0, y: 50, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: viewportRef.current,
            start: "top 85%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleExport = () => {
    if (exporting || exportComplete) return;
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 4000);
    }, 1500);
  };

  return (
    <section
      id="viewport"
      ref={containerRef}
      className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8"
    >
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-mono font-medium tracking-[0.2em] text-[#ff7a45] uppercase">
            Instrument Telemetry · Level 4 Diagnostic
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            The Tactical Viewport.
          </h2>
          <p className="mt-3 max-w-xl text-sm sm:text-base text-zinc-400">
            Fusing orbital radiometric thermal passes with live ground atmospheric
            sensors into an interactive high-resolution incident projection.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div
          role="tablist"
          aria-label="Viewport display mode"
          className="inline-flex rounded-full border border-white/10 bg-zinc-900/80 p-1 backdrop-blur-md"
        >
          <button
            role="tab"
            aria-selected={mode === "thermal"}
            onClick={() => setMode("thermal")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              mode === "thermal"
                ? "bg-[#ff552e] text-black font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Thermal SWIR
          </button>
          <button
            role="tab"
            aria-selected={mode === "wind"}
            onClick={() => setMode("wind")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              mode === "wind"
                ? "bg-[#ff552e] text-black font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Wind Shear
          </button>
          <button
            role="tab"
            aria-selected={mode === "perimeter"}
            onClick={() => setMode("perimeter")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              mode === "perimeter"
                ? "bg-[#ff552e] text-black font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Boundary Vector
          </button>
        </div>
      </div>

      {/* Main Console Container */}
      <div
        ref={viewportRef}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0d10] shadow-[0_25px_80px_rgba(0,0,0,0.85)]"
      >
        {/* Top telemetry bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] bg-zinc-950/90 px-5 py-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-zinc-300 font-semibold tracking-wider uppercase">
              ORBITAL PASS: GOES-18 / VIIRS FUSION
            </span>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="hidden sm:inline text-zinc-400">COORDS: 39°44&apos;N 121°37&apos;W</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span>RES: 375m Radiometer</span>
            <span className="text-emerald-400 font-semibold">FEED LIVE</span>
          </div>
        </div>

        {/* Tactical Screen Stage */}
        <div className="relative h-[420px] sm:h-[480px] w-full overflow-hidden bg-[#07080b]">
          {/* Topographic Elevation Contour lines (clean SVG) */}
          <svg
            className="absolute inset-0 h-full w-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Elevation topography contours */}
            <path
              d="M 50 150 Q 200 80, 400 120 T 750 180 T 1100 100"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            <path
              d="M 30 220 Q 250 160, 480 200 T 820 230 T 1200 160"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            <path
              d="M 20 300 Q 220 240, 520 280 T 890 310 T 1250 240"
              fill="none"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="1"
            />
            <path
              d="M 60 380 Q 300 320, 600 350 T 960 390 T 1300 330"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          </svg>

          {/* Dynamic Front Vector Layer */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Expansion scale tied to scrubbed time */}
            <div
              className="relative transition-all duration-700 ease-out"
              style={{
                width: `${140 + timeIndex * 60}px`,
                height: `${110 + timeIndex * 50}px`,
                transform: `rotate(${timeIndex * 3 - 6}deg)`,
              }}
            >
              {/* Outer perimeter boundary line */}
              <div
                className={`absolute inset-0 rounded-[48%_52%_64%_36%/45%_55%_45%_55%] border-2 transition-all duration-500 ${
                  mode === "perimeter"
                    ? "border-[#ff552e] bg-[#ff552e]/10 shadow-[0_0_30px_rgba(255,85,46,0.3)]"
                    : "border-[#ff7a45]/50 bg-[#ff3d1c]/5"
                }`}
              />

              {/* Secondary thermal ring */}
              <div className="absolute inset-[15%] rounded-[52%_48%_58%_42%/50%_46%_54%_50%] border border-[#ff9142]/60 bg-[#ff5c24]/15 backdrop-blur-[1px]" />

              {/* Core ignition hotspot */}
              <div className="absolute inset-[32%] rounded-full bg-[#ffcd75] shadow-[0_0_40px_rgba(255,100,30,0.8)] animate-pulse" />
            </div>
          </div>

          {/* Wind Streamline Indicators (visible in Wind mode or blended) */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
              mode === "wind" ? "opacity-100" : "opacity-30"
            }`}
          >
            {[
              { left: "15%", top: "25%", length: "w-24", deg: "-25deg" },
              { left: "45%", top: "18%", length: "w-32", deg: "-28deg" },
              { left: "70%", top: "32%", length: "w-28", deg: "-22deg" },
              { left: "28%", top: "65%", length: "w-36", deg: "-30deg" },
              { left: "60%", top: "72%", length: "w-24", deg: "-26deg" },
            ].map((stream, idx) => (
              <div
                key={idx}
                className="absolute flex items-center gap-1"
                style={{
                  left: stream.left,
                  top: stream.top,
                  transform: `rotate(${stream.deg})`,
                }}
              >
                <div className={`h-[1.5px] ${stream.length} bg-gradient-to-r from-transparent via-cyan-400 to-white opacity-70`} />
                <span className="text-[9px] font-mono text-cyan-300">24km/h</span>
              </div>
            ))}
          </div>

          {/* Incident Waypoints / Reticles */}
          <div className="absolute left-[38%] top-[34%] flex items-center gap-2 pointer-events-none">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff552e] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff552e]" />
            </span>
            <div className="rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-white border border-white/10 backdrop-blur-sm">
              SECTOR 04 FLAME FRONT
            </div>
          </div>

          <div className="absolute left-[62%] top-[58%] flex items-center gap-2 pointer-events-none">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <div className="rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-zinc-300 border border-white/10 backdrop-blur-sm">
              ENGINE TANKER 12 EN ROUTE
            </div>
          </div>

          {/* Corner telemetry HUD display */}
          <div className="absolute top-4 left-4 rounded-xl border border-white/10 bg-black/80 p-3.5 backdrop-blur-md">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              Spread Projection
            </div>
            <div className="mt-1 text-2xl font-semibold text-white tracking-tight">
              {currentStep.hectares.toLocaleString()}{" "}
              <span className="text-xs font-normal text-zinc-400">ha estimated</span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-[11px] font-mono text-zinc-400">
              <span>Velocity: <strong className="text-white">{currentStep.rate}</strong></span>
              <span>Containment: <strong className="text-[#ff7a45]">{currentStep.containment}</strong></span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/80 px-4 py-2.5 backdrop-blur-md text-[11px] font-mono text-zinc-400">
            <div className="flex items-center gap-4">
              <span>CANOPY MOISTURE: <strong className="text-amber-400">7.2% CRITICAL</strong></span>
              <span className="hidden sm:inline">SLOPE ASPECT: <strong className="text-white">+18° RIDGE</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>DISPATCH ETA:</span>
              <span className="rounded bg-[#ff552e]/20 px-2 py-0.5 text-[#ff7a45] font-semibold">
                08 MIN TO TARGET
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Scrubber & Action Controls */}
        <div className="border-t border-white/[0.08] bg-zinc-950 px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Timeline Scrubber */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Timeline Simulation Scrubber
                </span>
                <span className="text-xs font-mono font-semibold text-[#ff552e]">
                  Active Step: {currentStep.label}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {TIME_STEPS.map((step, idx) => (
                  <button
                    key={step.label}
                    onClick={() => setTimeIndex(idx)}
                    className={`group flex flex-col items-center justify-center rounded-lg border py-2 px-1 text-center transition ${
                      timeIndex === idx
                        ? "border-[#ff552e] bg-[#ff552e]/10 text-white"
                        : "border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-semibold">{step.label}</span>
                    <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400">
                      {step.hectares} ha
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tactical Action Button */}
            <div className="flex items-center gap-3 self-end lg:self-center">
              <button
                type="button"
                onClick={handleExport}
                disabled={exporting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-xs font-semibold text-white transition hover:bg-white/10 active:scale-95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff552e]"
              >
                {exporting ? (
                  <>
                    <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Compiling Telemetry...</span>
                  </>
                ) : exportComplete ? (
                  <>
                    <span className="text-emerald-400">✓</span>
                    <span>IAP Dossier Downloaded</span>
                  </>
                ) : (
                  <>
                    <span>Generate Incident IAP Brief</span>
                    <span className="text-zinc-400">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


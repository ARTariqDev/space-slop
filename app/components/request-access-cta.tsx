"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function RequestAccessCTA() {
  const [agency, setAgency] = useState("");
  const [email, setEmail] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agency || !email) return;

    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  return (
    <section
      id="request-access"
      ref={containerRef}
      className="relative overflow-hidden border-t border-white/[0.08] bg-[#070709] py-32 px-5 sm:px-8 text-center"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-96 w-[800px] -translate-x-1/2 rounded-full bg-[#ff552e]/10 blur-[140px]" />

      <div ref={contentRef} className="cta-content relative z-10 mx-auto max-w-3xl">
        <p className="text-xs font-mono font-medium tracking-[0.2em] text-[#ff7a45] uppercase">
          Mission Readiness
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
          Empower your command.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400">
          Request early orbital coverage allocation for your fire protection district
          ahead of the upcoming operational season.
        </p>

        {status === "success" ? (
          <div className="mt-10 mx-auto max-w-md rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-8 text-center backdrop-blur-md">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xl font-bold">
              ✓
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              Deployment Request Registered
            </h3>
            <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
              Our orbital telemetry operations team has received the briefing request for{" "}
              <strong className="text-white">{agency}</strong>. A technical liaison will reach out
              to <strong className="text-white">{email}</strong> within 4 business hours.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setAgency("");
                setEmail("");
                setJurisdiction("");
              }}
              className="mt-6 text-xs font-mono text-zinc-400 underline underline-offset-4 hover:text-white"
            >
              Submit another agency request
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 mx-auto max-w-md space-y-3.5 text-left"
          >
            <div>
              <label htmlFor="agency-input" className="block text-xs font-mono text-zinc-400 mb-1">
                Agency / Department Name
              </label>
              <input
                id="agency-input"
                type="text"
                required
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                placeholder="e.g. Sierra Fire Protection District"
                className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder-zinc-500 transition focus:border-[#ff552e] focus:outline-none focus:ring-1 focus:ring-[#ff552e]"
              />
            </div>

            <div>
              <label htmlFor="email-input" className="block text-xs font-mono text-zinc-400 mb-1">
                Official Agency Email
              </label>
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@agency.gov"
                className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder-zinc-500 transition focus:border-[#ff552e] focus:outline-none focus:ring-1 focus:ring-[#ff552e]"
              />
            </div>

            <div>
              <label htmlFor="jurisdiction-input" className="block text-xs font-mono text-zinc-400 mb-1">
                Primary Jurisdiction Area
              </label>
              <input
                id="jurisdiction-input"
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                placeholder="e.g. Northern Sierra Foothills (Sector 4)"
                className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder-zinc-500 transition focus:border-[#ff552e] focus:outline-none focus:ring-1 focus:ring-[#ff552e]"
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ff552e] text-sm font-semibold text-black transition hover:bg-[#ff6e4a] active:scale-95 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {status === "submitting" ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-black/40 border-t-black animate-spin" />
                  <span>Logging Agency Request...</span>
                </>
              ) : (
                <span>Request Telemetry Allocation</span>
              )}
            </button>

            <p className="text-center text-[11px] text-zinc-500 pt-2">
              Encrypted end-to-end. Available exclusively to certified wildland firefighting agencies.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

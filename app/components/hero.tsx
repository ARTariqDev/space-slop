"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const telemetryStripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.1 }
      )
        .fromTo(
          headlineRef.current?.querySelectorAll(".hero-line") || [],
          { opacity: 0, y: 35, rotateX: 10 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1.1, stagger: 0.14 },
          "-=0.5"
        )
        .fromTo(
          subheadRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.6"
        )
        .fromTo(
          ctaRef.current?.children || [],
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          "-=0.5"
        )
        .fromTo(
          telemetryStripRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="overview"
      ref={containerRef}
      className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden pt-28 pb-16 px-5 sm:px-8 text-center"
    >
      {/* Subtle orbital grid background inspired by Apple keynote visuals */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(255,85,46,0.2) 0%, transparent 65%), linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 80px 80px, 80px 80px",
        }}
      />

      {/* Decorative top lighting horizon */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[640px] -translate-x-1/2 rounded-full bg-[#ff552e]/10 blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Eyebrow badge */}
        <div
          ref={badgeRef}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] text-[#ff7a45] backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff552e]" />
          <span>Orbital Telemetry · Version 3.4</span>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="text-5xl font-semibold tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl lg:leading-[1.04]"
        >
          <span className="hero-line block">Wildfire intelligence.</span>
          <span className="hero-line block text-zinc-400">Ahead of the horizon.</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subheadRef}
          className="mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-400 font-normal"
        >
          Continuous multispectral satellite passes fuse 3.9µm shortwave infrared,
          atmospheric wind shear, and canyon fuel moisture. Spotting ignitions up to
          42 minutes before ground lookout alerts.
        </p>

        {/* Action group */}
        <div
          ref={ctaRef}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#viewport"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#ff552e] px-7 text-sm font-semibold text-black transition-all hover:bg-[#ff6e4a] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Explore Tactical Viewport</span>
            <span className="text-xs">↓</span>
          </a>

          <a
            href="#request-access"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/[0.03] px-7 text-sm font-medium text-zinc-200 transition-all hover:bg-white/[0.08] hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff552e]"
          >
            Request Command Briefing
          </a>
        </div>

        {/* Orbital metadata ticker */}
        <div
          ref={telemetryStripRef}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 border-t border-white/[0.08] pt-6 text-[12px] font-mono text-zinc-500 uppercase tracking-wider"
        >
          <div>
            <span className="text-zinc-600">Scan Cadence:</span>{" "}
            <span className="text-zinc-300">08m Orbital Re-pass</span>
          </div>
          <div>
            <span className="text-zinc-600">Thermal Band:</span>{" "}
            <span className="text-zinc-300">3.9 µm & 11.2 µm TIR</span>
          </div>
          <div>
            <span className="text-zinc-600">Target Area:</span>{" "}
            <span className="text-zinc-300">North District Basin</span>
          </div>
        </div>
      </div>
    </section>
  );
}


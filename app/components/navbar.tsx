"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Overview", href: "#overview" },
  { label: "Tactical Console", href: "#viewport" },
  { label: "Sensors & Fusion", href: "#sensors" },
  { label: "Performance", href: "#performance" },
  { label: "Specifications", href: "#specs" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#000000]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Brand */}
        <a
          href="#overview"
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff552e]"
          aria-label="Fire-Slop Homepage"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ff552e] text-[11px] font-black text-black">
            ▲
          </span>
          <span className="font-semibold tracking-wider text-[13px] uppercase text-zinc-100 group-hover:text-white transition">
            Fire-Slop <span className="text-zinc-500 font-normal">Intelligence</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff552e]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA & Telemetry status */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/40 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>9 Sats In Orbit</span>
          </div>

          <a
            href="#request-access"
            className="inline-flex h-8 items-center justify-center rounded-full bg-white px-4 text-[12px] font-medium text-black transition hover:bg-zinc-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff552e]"
          >
            Request Access
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 transition hover:text-white md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff552e]"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-white/[0.08] bg-black/95 px-5 py-6 backdrop-blur-2xl md:hidden">
          <nav className="flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base text-zinc-300 transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-white/[0.08]">
              <a
                href="#request-access"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 w-full items-center justify-center rounded-full bg-[#ff552e] text-sm font-semibold text-black"
              >
                Request Agency Access
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}


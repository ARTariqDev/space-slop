"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
          ? "bg-[#000000]/85 backdrop-blur-xl border-b border-white/[0.08]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff552e]"
          aria-label="Fire-Slop Home"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#ff552e] text-[10px] font-black text-black">
            ▲
          </span>
          <span className="font-semibold tracking-wider text-[13px] uppercase text-zinc-100">
            Fire-Slop
          </span>
        </Link>

        {/* Streamlined Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main Navigation">
          <Link
            href="/map"
            className="flex items-center gap-1.5 text-[13px] font-medium text-white transition hover:text-[#ff7a45] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff552e]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff552e] animate-pulse" />
            <span>Live 3D Map</span>
          </Link>
          <Link
            href="/#viewport"
            className="text-[13px] text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff552e]"
          >
            Tactical Console
          </Link>
          <Link
            href="/#sensors"
            className="text-[13px] text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff552e]"
          >
            MODIS & VIIRS Fusion
          </Link>
          <Link
            href="/#specs"
            className="text-[13px] text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff552e]"
          >
            Specifications
          </Link>
        </nav>

        {/* Primary CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/map"
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[#ff552e] px-4 text-[12px] font-semibold text-black transition hover:bg-[#ff6e4a] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Open 3D Map</span>
            <span className="text-[10px]">↗</span>
          </Link>
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
            <Link
              href="/map"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-base font-medium text-white"
            >
              <span className="h-2 w-2 rounded-full bg-[#ff552e]" />
              <span>Live 3D Map (MODIS & VIIRS)</span>
            </Link>
            <Link
              href="/#viewport"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-zinc-300 transition hover:text-white"
            >
              Tactical Console
            </Link>
            <Link
              href="/#sensors"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-zinc-300 transition hover:text-white"
            >
              Sensors & Orbit Data
            </Link>
            <Link
              href="/#specs"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-zinc-300 transition hover:text-white"
            >
              Specifications
            </Link>
            <div className="pt-3 border-t border-white/[0.08]">
              <Link
                href="/map"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 w-full items-center justify-center rounded-full bg-[#ff552e] text-sm font-semibold text-black"
              >
                Launch 3D Map Console
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SPECS = [
  {
    category: "Space Segment",
    items: [
      { label: "Primary Constellation", detail: "NOAA GOES-16 & GOES-18 (Advanced Baseline Imager)" },
      { label: "Cross-Validation Passes", detail: "Copernicus Sentinel-2A/B (MSI) & JPSS-1/2 (VIIRS)" },
      { label: "Downlink Latency", detail: "Sub-10 second telemetry arrival via direct broadcast antennas" },
      { label: "Spectral Coverage", detail: "3.9 µm (SWIR hot-channel) + 11.2 µm (Thermal IR)" },
    ],
  },
  {
    category: "Atmospheric & Terrain Mesh",
    items: [
      { label: "Elevation Surface Model", detail: "10-meter USGS 3D Elevation Program (3DEP) bare-earth DEM" },
      { label: "Wind Field Solver", detail: "Mass-consistent kinematic CFD model running at 90-second intervals" },
      { label: "Fuel Moisture Tracking", detail: "Automated 10-hour & 100-hour dead fuel equilibrium calculations" },
      { label: "Terrain Slope Acceleration", detail: "Byram & Rothermel dynamic fire spread equations factored for canyon aspect" },
    ],
  },
  {
    category: "Field Interoperability",
    items: [
      { label: "Tactical Protocols", detail: "ATAK CoT (Cursor-on-Target), GeoJSON polygons, ESRI ArcGIS REST" },
      { label: "Air Operations Feed", detail: "Direct broadcast of retardant drop lines to cockpit moving maps" },
      { label: "Compliance & Security", detail: "SOC2 Type II certified · FedRAMP High Ready · Air-gap capable" },
      { label: "Offline Resilience", detail: "Edge caching enables field operations during complete cellular blackouts" },
    ],
  },
];

export function ArchitectureSpecs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current?.querySelectorAll(".spec-row") || [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="specs" ref={containerRef} className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="mb-14">
        <p className="text-xs font-mono font-medium tracking-[0.2em] text-[#ff7a45] uppercase">
          Technical Specifications
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
          Engineered to mission-critical tolerances.
        </h2>
      </div>

      <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {SPECS.map((group) => (
          <div key={group.category} className="py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                {group.category}
              </h3>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {group.items.map((item) => (
                <div
                  key={item.label}
                  className="spec-row grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-white/[0.04] pb-4"
                >
                  <dt className="text-xs font-mono text-zinc-400">{item.label}</dt>
                  <dd className="sm:col-span-2 text-sm text-zinc-200">{item.detail}</dd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


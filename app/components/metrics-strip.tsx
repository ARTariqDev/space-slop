"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const METRICS = [
  {
    value: "08",
    suffix: "s",
    label: "Telemetry Ingestion Latency",
    description: "From satellite radiometer down-pass to operational frontline dispatch queue.",
  },
  {
    value: "1,280",
    suffix: "km²",
    label: "Continuous Sweep Footprint",
    description: "Multispectral instantaneous field of view captured every single orbital sweep.",
  },
  {
    value: "98.4",
    suffix: "%",
    label: "Ignition Confidence Index",
    description: "Dual-band SWIR verification filtering false positives from cloud reflection & dust.",
  },
  {
    value: "42",
    suffix: "m",
    label: "Average Incident Head Start",
    description: "Pre-smoke crown ignition detected before ground or lookout optical confirmation.",
  },
];

export function MetricsStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = itemsRef.current?.children;
      if (!items) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
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
    <section
      id="performance"
      ref={containerRef}
      className="relative border-y border-white/[0.08] bg-[#070709] py-24 px-5 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="text-xs font-mono font-medium tracking-[0.2em] text-[#ff7a45] uppercase">
            Quantified Readiness
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            Numbers that alter the timeline.
          </h2>
        </div>

        <dl
          ref={itemsRef}
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col border-l border-white/[0.08] pl-6 transition-all hover:border-[#ff552e]"
            >
              <dd className="flex items-baseline text-5xl font-semibold tracking-tight text-white lg:text-6xl">
                <span>{metric.value}</span>
                <span className="ml-1 text-2xl font-normal text-[#ff7a45]">
                  {metric.suffix}
                </span>
              </dd>

              <dt className="mt-4 text-sm font-semibold tracking-tight text-zinc-200">
                {metric.label}
              </dt>

              <p className="mt-2 text-xs leading-5 text-zinc-400">
                {metric.description}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

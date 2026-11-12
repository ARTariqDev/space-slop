export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#000000] px-5 py-16 text-zinc-400 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Footnotes */}
        <div className="border-b border-white/[0.08] pb-10 text-[11px] leading-relaxed text-zinc-500 space-y-2">
          <p>
            1. Ingestion latency benchmarks reflect median time from orbital detector integration to Fire-Slop cloud boundary ingest via direct NOAA / EUMETSAT broadcast downlinks. Local network conditions may vary.
          </p>
          <p>
            2. Real-time atmospheric CFD wind shear calculations depend on active Remote Automated Weather Stations (RAWS) and HRRR high-resolution rapid refresh atmospheric modeling.
          </p>
          <p>
            3. Tactical dispatch auto-forwarding requires agency authorization and integration into approved CAD or ATAK server environments.
          </p>
        </div>

        {/* Directory columns */}
        <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Orbital Platform
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <a href="#overview" className="hover:text-white transition">
                  Platform Overview
                </a>
              </li>
              <li>
                <a href="#viewport" className="hover:text-white transition">
                  Tactical Viewport
                </a>
              </li>
              <li>
                <a href="#sensors" className="hover:text-white transition">
                  SWIR Radiometry
                </a>
              </li>
              <li>
                <a href="#specs" className="hover:text-white transition">
                  Sensor Specifications
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  All 9 Sats Operational
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Agency Integration
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <a href="#scenarios" className="hover:text-white transition">
                  Incident Action Plans
                </a>
              </li>
              <li>
                <a href="#specs" className="hover:text-white transition">
                  ATAK CoT Protocol
                </a>
              </li>
              <li>
                <a href="#specs" className="hover:text-white transition">
                  Air Tanker Moving Maps
                </a>
              </li>
              <li>
                <a href="#specs" className="hover:text-white transition">
                  CAD / 911 Connectors
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Science & Research
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <a href="#sensors" className="hover:text-white transition">
                  Validation Whitepaper
                </a>
              </li>
              <li>
                <a href="#sensors" className="hover:text-white transition">
                  Canyon Physics Engine
                </a>
              </li>
              <li>
                <a href="#performance" className="hover:text-white transition">
                  14-Year Incident Benchmark
                </a>
              </li>
              <li>
                <a href="#sensors" className="hover:text-white transition">
                  Pyrocumulus Diagnostics
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Governance & Security
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <a href="#specs" className="hover:text-white transition">
                  FedRAMP High Ready
                </a>
              </li>
              <li>
                <a href="#specs" className="hover:text-white transition">
                  SOC2 Type II Certified
                </a>
              </li>
              <li>
                <a href="#specs" className="hover:text-white transition">
                  Air-Gap Deployments
                </a>
              </li>
              <li>
                <a href="#request-access" className="hover:text-white transition">
                  Security Liaison Desk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-xs text-zinc-500 sm:flex-row">
          <div>
            Copyright © 2026 Fire-Slop Systems Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#overview" className="hover:text-zinc-400 transition">
              Privacy Policy
            </a>
            <a href="#overview" className="hover:text-zinc-400 transition">
              Terms of Use
            </a>
            <a href="#overview" className="hover:text-zinc-400 transition">
              Agency Verification
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


import { Navbar } from "./components/navbar";
import { Hero } from "./components/hero";
import { TacticalViewport } from "./components/tactical-viewport";
import { MetricsStrip } from "./components/metrics-strip";
import { DeepDiveFeatures } from "./components/deep-dive-features";
import { ArchitectureSpecs } from "./components/architecture-specs";
import { RequestAccessCTA } from "./components/request-access-cta";
import { Footer } from "./components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f7] selection:bg-[#ff552e] selection:text-white">
      <Navbar />
      <main id="main-content">
        <Hero />
        <TacticalViewport />
        <MetricsStrip />
        <DeepDiveFeatures />
        <ArchitectureSpecs />
        <RequestAccessCTA />
      </main>
      <Footer />
    </div>
  );
}

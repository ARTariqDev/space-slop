"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { TacticalMap } from "@/app/components/map/tactical-map";
import { FireRecord, FirmsGeoJSON, fireRecordsToGeoJSON } from "@/lib/firms";

export default function MapPage() {
  const [loading, setLoading] = useState(true);
  const [allRecords, setAllRecords] = useState<FireRecord[]>([]);
  const [selectedFire, setSelectedFire] = useState<FireRecord | null>(null);
  const [instrumentFilter, setInstrumentFilter] = useState<"ALL" | "MODIS" | "VIIRS">("ALL");
  const [minConfidence, setMinConfidence] = useState(0);
  const [minFrp, setMinFrp] = useState(0);
  const [provinceFilter, setProvinceFilter] = useState("ALL");
  const [daynightFilter, setDaynightFilter] = useState<"ALL" | "Day" | "Night">("ALL");
  const [styleMode, setStyleMode] = useState<"dark" | "satellite">("dark");
  const [terrain3d, setTerrain3d] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveFeed, setIsLiveFeed] = useState(false);

  // Fetch fire records from API route
  const loadFires = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/fires");
      const data = await res.json();
      if (data.records) {
        setAllRecords(data.records);
        setIsLiveFeed(data.isLive);
        if (!selectedFire && data.records.length > 0) {
          // Pre-select first prominent fire
          const hottest = [...data.records].sort((a, b) => b.frp - a.frp)[0];
          setSelectedFire(hottest);
        }
      }
    } catch (err) {
      console.error("Failed to load fire records:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadFires();
  }, []);

  // Filter records
  const filteredRecords = useMemo(() => {
    return allRecords.filter((rec) => {
      if (instrumentFilter !== "ALL" && rec.instrument !== instrumentFilter) return false;
      if (rec.confidence < minConfidence) return false;
      if (rec.frp < minFrp) return false;
      if (provinceFilter !== "ALL" && rec.province !== provinceFilter) return false;
      if (daynightFilter !== "ALL" && rec.daynight !== daynightFilter) return false;
      return true;
    });
  }, [allRecords, instrumentFilter, minConfidence, minFrp, provinceFilter, daynightFilter]);

  // Generate GeoJSON for Mapbox
  const geojson: FirmsGeoJSON = useMemo(() => {
    return fireRecordsToGeoJSON(filteredRecords);
  }, [filteredRecords]);

  // Aggregate stats
  const stats = useMemo(() => {
    const total = filteredRecords.length;
    const totalFrp = Math.round(filteredRecords.reduce((acc, r) => acc + r.frp, 0) * 10) / 10;
    const maxFrp = filteredRecords.reduce((max, r) => Math.max(max, r.frp), 0);
    const avgTempC =
      total > 0
        ? Math.round(
            (filteredRecords.reduce((acc, r) => acc + r.brightnessC, 0) / total) * 10
          ) / 10
        : 0;
    const highConf = filteredRecords.filter((r) => r.confidenceLevel === "high").length;

    return { total, totalFrp, maxFrp: Math.round(maxFrp * 10) / 10, avgTempC, highConf };
  }, [filteredRecords]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#07090c] text-white">
      {/* 3D Mapbox Canvas */}
      <TacticalMap
        geojson={geojson}
        selectedFire={selectedFire}
        onSelectFire={setSelectedFire}
        styleMode={styleMode}
        terrain3d={terrain3d}
      />

      {/* Floating Top Navigation Header */}
      <header className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <Link
            href="/"
            className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-black/80 px-4 text-xs font-semibold text-zinc-300 backdrop-blur-xl transition hover:bg-zinc-900 hover:text-white shadow-xl"
          >
            <span>←</span>
            <span>Fire-Slop</span>
          </Link>

          <div className="hidden sm:flex h-10 items-center gap-2 rounded-full border border-white/10 bg-black/80 px-4 text-xs font-mono text-zinc-300 backdrop-blur-xl shadow-xl">
            <span className="h-2 w-2 rounded-full bg-[#ff552e] animate-pulse" />
            <span className="font-semibold text-white">Pakistan Basin Telemetry</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">
              {isLiveFeed ? "NASA FIRMS Live" : "Calibrated Oct 2025 Data"}
            </span>
          </div>
        </div>

        {/* Instrument Filter Bar */}
        <div className="pointer-events-auto flex items-center rounded-full border border-white/10 bg-black/80 p-1 backdrop-blur-xl shadow-xl">
          <button
            type="button"
            onClick={() => setInstrumentFilter("ALL")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              instrumentFilter === "ALL"
                ? "bg-[#ff552e] text-black font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            All Sensors ({allRecords.length})
          </button>
          <button
            type="button"
            onClick={() => setInstrumentFilter("VIIRS")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              instrumentFilter === "VIIRS"
                ? "bg-[#ff552e] text-black font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            VIIRS 375m
          </button>
          <button
            type="button"
            onClick={() => setInstrumentFilter("MODIS")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              instrumentFilter === "MODIS"
                ? "bg-[#ff552e] text-black font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            MODIS 1km
          </button>
        </div>

        {/* Map View Mode Toggles */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Basemap Style Toggle */}
          <button
            type="button"
            onClick={() => setStyleMode(styleMode === "dark" ? "satellite" : "dark")}
            className="flex h-10 items-center gap-1.5 rounded-full border border-white/10 bg-black/80 px-3.5 text-xs font-medium text-zinc-300 backdrop-blur-xl hover:bg-zinc-900 hover:text-white shadow-xl"
            title="Toggle Basemap Style"
          >
            <span className="text-zinc-500">Map:</span>
            <span className="text-white font-semibold capitalize">{styleMode}</span>
          </button>

          {/* 3D Terrain Toggle */}
          <button
            type="button"
            onClick={() => setTerrain3d(!terrain3d)}
            className={`flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium backdrop-blur-xl transition shadow-xl ${
              terrain3d
                ? "border-[#ff552e]/50 bg-[#ff552e]/20 text-[#ff7a45]"
                : "border-white/10 bg-black/80 text-zinc-400 hover:text-white"
            }`}
          >
            <span>3D Mesh:</span>
            <span className="font-semibold">{terrain3d ? "ON" : "OFF"}</span>
          </button>

          {/* Refresh / Sync Button */}
          <button
            type="button"
            onClick={loadFires}
            disabled={isRefreshing}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/80 text-zinc-300 backdrop-blur-xl hover:bg-zinc-900 hover:text-white shadow-xl disabled:opacity-50"
            title="Refresh satellite telemetry"
          >
            <svg
              className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#ff552e]" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </header>

      {/* Left Telemetry HUD & Filter Drawer */}
      <aside
        className={`absolute top-20 left-4 bottom-6 z-20 w-80 flex flex-col transition-all duration-300 pointer-events-none ${
          sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-black/85 p-5 backdrop-blur-2xl shadow-2xl pointer-events-auto space-y-5 custom-scroll">
          {/* Header Title */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#ff7a45]">
                Active Telemetry HUD
              </p>
              <h2 className="text-base font-semibold text-white">Fire Hotspots</h2>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
              SYNCHRONIZED
            </span>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Active Detections</span>
              <span className="text-xl font-bold text-white mt-1 block">
                {stats.total.toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-400">{stats.highConf} High Confidence</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Total Radiative Power</span>
              <span className="text-xl font-bold text-[#ff552e] mt-1 block">
                {stats.totalFrp.toLocaleString()} <span className="text-xs font-normal">MW</span>
              </span>
              <span className="text-[10px] text-zinc-400">Peak: {stats.maxFrp} MW</span>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="space-y-4 pt-1 border-t border-white/[0.08]">
            <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Filter Parameters
            </p>

            {/* Province Selector */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Territory / Province
              </label>
              <select
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-2 text-xs text-white focus:border-[#ff552e] focus:outline-none"
              >
                <option value="ALL">All Pakistan Regions</option>
                <option value="Punjab">Punjab Agriculture Basin</option>
                <option value="Islamabad / Margalla">Islamabad / Margalla Hills</option>
                <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                <option value="Balochistan">Balochistan</option>
                <option value="Sindh">Sindh</option>
              </select>
            </div>

            {/* Confidence Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[11px] font-mono text-zinc-400">Min Confidence</span>
                <span className="font-mono text-white font-semibold">{minConfidence}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={minConfidence}
                onChange={(e) => setMinConfidence(parseInt(e.target.value, 10))}
                className="w-full accent-[#ff552e] cursor-pointer"
              />
            </div>

            {/* FRP Power Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[11px] font-mono text-zinc-400">Min Fire Power (FRP)</span>
                <span className="font-mono text-white font-semibold">{minFrp} MW</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="2"
                value={minFrp}
                onChange={(e) => setMinFrp(parseInt(e.target.value, 10))}
                className="w-full accent-[#ff552e] cursor-pointer"
              />
            </div>

            {/* Day / Night Filter */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Orbital Pass Time
              </label>
              <div className="grid grid-cols-3 gap-1 rounded-lg border border-white/10 bg-zinc-900 p-1">
                {(["ALL", "Day", "Night"] as const).map((dn) => (
                  <button
                    key={dn}
                    type="button"
                    onClick={() => setDaynightFilter(dn)}
                    className={`rounded py-1 text-[11px] font-medium transition ${
                      daynightFilter === dn
                        ? "bg-[#ff552e] text-black font-semibold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {dn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset Filters */}
          {(minConfidence > 0 || minFrp > 0 || provinceFilter !== "ALL" || daynightFilter !== "ALL" || instrumentFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setMinConfidence(0);
                setMinFrp(0);
                setProvinceFilter("ALL");
                setDaynightFilter("ALL");
                setInstrumentFilter("ALL");
              }}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-mono text-zinc-300 hover:bg-white/10 hover:text-white transition"
            >
              Reset All Filters
            </button>
          )}

          {/* Legend */}
          <div className="border-t border-white/[0.08] pt-4 text-[11px] space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
              Cartographic Legend
            </span>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ffb15e] border border-white" />
              <span className="text-zinc-300">VIIRS 375m High-Res Thermal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff552e] border border-white" />
              <span className="text-zinc-300">MODIS 1km Broad-Spectrum Pass</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-gradient-to-r from-[#ff3d1c] to-[#ffea9f]" />
              <span className="text-zinc-400">Radiative Heatmap Density Gradient</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Selected Hotspot Inspection Drawer (Bottom Right) */}
      {selectedFire && (
        <div className="absolute bottom-6 right-6 z-30 w-96 rounded-2xl border border-white/10 bg-black/90 p-5 backdrop-blur-2xl shadow-2xl space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/[0.08] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#ff552e] animate-ping" />
                <span className="text-xs font-mono font-semibold text-[#ff7a45] uppercase">
                  {selectedFire.instrument} Thermal Detection
                </span>
              </div>
              <h3 className="mt-1 text-base font-semibold text-white">
                {selectedFire.province || "Pakistan Sector"}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFire(null)}
              className="text-zinc-400 hover:text-white p-1"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>

          {/* Main Telemetry Specs */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
              <span className="text-[10px] font-mono text-zinc-500 block">Coordinates</span>
              <span className="font-mono text-white text-[12px] font-semibold mt-0.5 block">
                {selectedFire.latitude.toFixed(4)}°N, {selectedFire.longitude.toFixed(4)}°E
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
              <span className="text-[10px] font-mono text-zinc-500 block">Satellite Platform</span>
              <span className="font-semibold text-white text-[12px] mt-0.5 block">
                {selectedFire.satellite} ({selectedFire.instrument})
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
              <span className="text-[10px] font-mono text-zinc-500 block">Brightness Temp</span>
              <span className="font-semibold text-white text-[12px] mt-0.5 block">
                {selectedFire.brightness.toFixed(1)} K ({selectedFire.brightnessC}°C)
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
              <span className="text-[10px] font-mono text-zinc-500 block">Fire Radiative Power</span>
              <span className="font-semibold text-[#ff552e] text-[12px] mt-0.5 block">
                {selectedFire.frp.toFixed(1)} MW
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
              <span className="text-[10px] font-mono text-zinc-500 block">Acquisition Time</span>
              <span className="font-mono text-zinc-300 text-[11px] mt-0.5 block">
                {selectedFire.acqDate} · {selectedFire.acqTime}
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
              <span className="text-[10px] font-mono text-zinc-500 block">Confidence Level</span>
              <span className="font-semibold text-emerald-400 text-[12px] mt-0.5 block capitalize">
                {selectedFire.confidenceLevel} ({selectedFire.confidence}%)
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <span className="text-[10px] font-mono text-zinc-500">
              Footprint: {selectedFire.scan}km × {selectedFire.track}km
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${selectedFire.latitude}, ${selectedFire.longitude}`
                );
                alert("Coordinates copied to clipboard!");
              }}
              className="text-xs font-mono text-[#ff7a45] underline underline-offset-4 hover:text-white"
            >
              Copy Coordinates
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="h-10 w-10 rounded-full border-2 border-white/20 border-t-[#ff552e] animate-spin" />
          <p className="mt-4 text-xs font-mono tracking-widest uppercase text-zinc-400">
            Ingesting NASA FIRMS MODIS & VIIRS Telemetry...
          </p>
        </div>
      )}
    </div>
  );
}


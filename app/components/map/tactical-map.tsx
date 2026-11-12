"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FireRecord, FirmsGeoJSON } from "@/lib/firms";

interface TacticalMapProps {
  geojson: FirmsGeoJSON;
  selectedFire: FireRecord | null;
  onSelectFire: (fire: FireRecord | null) => void;
  styleMode: "dark" | "satellite";
  terrain3d: boolean;
  onStatsUpdate?: (stats: any) => void;
}

const REGION_PRESETS = [
  { name: "All Pakistan", center: [69.5, 30.2] as [number, number], zoom: 5.6, pitch: 45, bearing: 0 },
  { name: "Margalla Hills (Islamabad)", center: [73.09, 33.74] as [number, number], zoom: 11.5, pitch: 65, bearing: 30 },
  { name: "Punjab Agriculture Belt", center: [72.8, 31.4] as [number, number], zoom: 8.2, pitch: 50, bearing: -10 },
  { name: "Balochistan Ridgelines", center: [67.0, 29.8] as [number, number], zoom: 8.5, pitch: 60, bearing: -25 },
  { name: "Sindh Basin", center: [68.6, 26.5] as [number, number], zoom: 8.0, pitch: 48, bearing: 15 },
];

const DEFAULT_MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export function TacticalMap({
  geojson,
  selectedFire,
  onSelectFire,
  styleMode,
  terrain3d,
}: TacticalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activePreset, setActivePreset] = useState("All Pakistan");

  // Initialize Map
  useEffect(() => {
    mapboxgl.accessToken = DEFAULT_MAPBOX_TOKEN;

    if (!mapContainerRef.current) return;

    const styleUrl =
      styleMode === "satellite"
        ? "mapbox://styles/mapbox/satellite-streets-v12"
        : "mapbox://styles/mapbox/dark-v11";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [69.5, 30.2], // Pakistan center
      zoom: 5.6,
      pitch: 52,
      bearing: -10,
      antialias: true,
    });

    mapRef.current = map;

    map.on("load", () => {
      setMapLoaded(true);

      // Add 3D Terrain DEM if available
      try {
        if (!map.getSource("mapbox-dem")) {
          map.addSource("mapbox-dem", {
            type: "raster-dem",
            url: "mapbox://mapbox.mapbox-terrain-dem-v1",
            tileSize: 512,
            maxzoom: 14,
          });
        }

        if (terrain3d) {
          map.setTerrain({ source: "mapbox-dem", exaggeration: 1.4 });
        }

        // Add 3D Atmospheric Sky & Fog
        map.setFog({
          range: [0.8, 8],
          color: "#0a0c10",
          "horizon-blend": 0.15,
          "high-color": "#181d26",
          "space-color": "#05070a",
          "star-intensity": 0.4,
        });
      } catch (err) {
        console.warn("3D Terrain initialization note:", err);
      }

      // Add Hotspots GeoJSON Source
      if (!map.getSource("fire-hotspots")) {
        map.addSource("fire-hotspots", {
          type: "geojson",
          data: geojson,
        });

        // 1. Heatmap density layer
        map.addLayer({
          id: "fire-heatmap",
          type: "heatmap",
          source: "fire-hotspots",
          maxzoom: 12,
          paint: {
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["get", "frp"],
              0, 0.2,
              50, 1,
              150, 2
            ],
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0, 1,
              9, 3
            ],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0, "rgba(255, 60, 0, 0)",
              0.2, "rgba(255, 85, 46, 0.4)",
              0.4, "rgba(255, 122, 69, 0.7)",
              0.7, "rgba(255, 177, 94, 0.85)",
              1.0, "rgba(255, 240, 180, 0.95)"
            ],
            "heatmap-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0, 3,
              5, 12,
              10, 28
            ],
            "heatmap-opacity": 0.85,
          },
        });

        // 2. Individual Hotspot circles with radiance scaling
        map.addLayer({
          id: "fire-points",
          type: "circle",
          source: "fire-hotspots",
          minzoom: 5,
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["get", "frp"],
              1, 4,
              20, 8,
              100, 16,
              200, 22
            ],
            "circle-color": [
              "match",
              ["get", "instrument"],
              "MODIS", "#ff552e",
              "VIIRS", "#ffb15e",
              "#ff3d1c"
            ],
            "circle-opacity": 0.9,
            "circle-stroke-width": 1.5,
            "circle-stroke-color": "#ffffff",
            "circle-stroke-opacity": 0.8,
          },
        });

        // 3. Highlight halo for selected fire
        map.addLayer({
          id: "fire-highlight",
          type: "circle",
          source: "fire-hotspots",
          paint: {
            "circle-radius": 24,
            "circle-color": "rgba(255, 85, 46, 0.2)",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ff552e",
            "circle-opacity": [
              "case",
              ["==", ["get", "id"], selectedFire?.id || ""], 1,
              0
            ],
          },
        });

        // Click handler to inspect hotspot
        map.on("click", "fire-points", (e) => {
          if (e.features && e.features[0]) {
            const props = e.features[0].properties as any;
            onSelectFire(props);
          }
        });

        map.on("mouseenter", "fire-points", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "fire-points", () => {
          map.getCanvas().style.cursor = "";
        });
      }
    });

    map.on("error", (e) => {
      console.warn("Mapbox event:", e.error?.message || e);
    });

    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, [styleMode]); // re-run only when style changes

  // Update GeoJSON data dynamically
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const source = mapRef.current.getSource("fire-hotspots") as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(geojson);
    }
  }, [geojson, mapLoaded]);

  // Update 3D Terrain on toggle
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    try {
      if (terrain3d) {
        mapRef.current.setTerrain({ source: "mapbox-dem", exaggeration: 1.4 });
      } else {
        mapRef.current.setTerrain(null);
      }
    } catch (err) {
      console.warn("Terrain toggle note:", err);
    }
  }, [terrain3d, mapLoaded]);

  // Update selected fire highlight and fly camera
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !selectedFire) return;

    // Fly camera smoothly to selected fire
    mapRef.current.flyTo({
      center: [selectedFire.longitude, selectedFire.latitude],
      zoom: Math.max(mapRef.current.getZoom(), 9.5),
      pitch: 60,
      duration: 1600,
      essential: true,
    });

    // Update highlight filter
    if (mapRef.current.getLayer("fire-highlight")) {
      mapRef.current.setPaintProperty("fire-highlight", "circle-opacity", [
        "case",
        ["==", ["get", "id"], selectedFire.id], 1,
        0
      ]);
    }
  }, [selectedFire, mapLoaded]);

  // Fly to preset region
  const handleFlyToPreset = (preset: typeof REGION_PRESETS[0]) => {
    setActivePreset(preset.name);
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: preset.center,
      zoom: preset.zoom,
      pitch: preset.pitch,
      bearing: preset.bearing,
      duration: 2000,
      essential: true,
    });
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#090b0e]">
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Preset Region Selector Pill Bar */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/10 bg-black/80 p-1.5 backdrop-blur-xl shadow-2xl max-w-[94vw] overflow-x-auto">
        <span className="hidden sm:inline-block px-2 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
          Fly To:
        </span>
        {REGION_PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => handleFlyToPreset(preset)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              activePreset === preset.name
                ? "bg-[#ff552e] text-black font-semibold shadow-sm"
                : "text-zinc-300 hover:text-white hover:bg-white/5"
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Map Compass & Quick Reset Reticle */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.easeTo({ pitch: 0, bearing: 0, duration: 800 });
            }
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/80 text-xs font-mono text-zinc-300 backdrop-blur-md hover:bg-zinc-900 hover:text-white shadow-lg"
          title="Reset 2D North View"
        >
          N
        </button>
        <button
          type="button"
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.easeTo({ pitch: 58, bearing: -15, duration: 800 });
            }
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/80 text-xs font-mono text-zinc-300 backdrop-blur-md hover:bg-zinc-900 hover:text-white shadow-lg"
          title="Reset 3D Perspective Tilt"
        >
          3D
        </button>
      </div>
    </div>
  );
}
